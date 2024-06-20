import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore} from 'next/cache';

import {
  BugDB, Counts,
  DebtPlayerRaw, FeatureFlagDB, LogDB,
  MVPPlayerRaw, PlayerDB, PrizeDB, RSVPDB,
  TournamentDB, User, WinnerDB
} from './definitions';

const ITEMS_PER_PAGE = 30;
const TOP_COUNT = 8;
export async function fetchMVPPlayers() {
  noStore();
  try {
    const data = await sql<MVPPlayerRaw>`
      SELECT *
      FROM players
      ORDER BY balance DESC
      LIMIT ${TOP_COUNT}`;

    const todayDate = (new Date()).toISOString().slice(0,10);
    const todayHistoryResults = await sql`SELECT phone_number, type FROM history WHERE change < 0 AND updated_at > now() - interval '12 hour'`;
    const todayHistory =  todayHistoryResults.rows.filter(({ type }) => type != 'prize');
    const rsvp = await getAllRsvps();
    const players = data.rows;
    players.forEach((player) => {
      player.arrived = !!todayHistory.find(({ phone_number}) => phone_number === player.phone_number);
      player.rsvpForToday = !!rsvp.find(({ phone_number, date }) => phone_number === player.phone_number && date === todayDate);
      player.rsvps = rsvp.filter(({ phone_number }) => phone_number === player.phone_number).map(({ date }) => date);
    });
    return players;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest players.');
  }
}

async function getAllRsvps() {
  const rsvpResults = await sql<RSVPDB>`SELECT * FROM rsvp;`;
  return rsvpResults.rows;
}

export async function fetchDebtPlayers() {
  noStore();
  try {
    const data = await sql<DebtPlayerRaw>`
      SELECT *
      FROM players
      WHERE balance < 0
      ORDER BY balance ASC
      LIMIT ${TOP_COUNT}`;

    const todayHistoryResults = await sql`SELECT phone_number, type FROM history WHERE change < 0 AND updated_at > now() - interval '12 hour'`;
    const todayHistory =  todayHistoryResults.rows.filter(({ type }) => type != 'prize')

    const rsvp = await getAllRsvps();
    const todayDate = (new Date()).toISOString().slice(0,10);
    const players = data.rows;
    players.forEach((player) => {
      player.arrived = !!todayHistory.find(({ phone_number}) => phone_number === player.phone_number);
      player.rsvpForToday = !!rsvp.find(({ phone_number, date }) => phone_number === player.phone_number && date === todayDate);
      player.rsvps = rsvp.filter(({ phone_number }) => phone_number === player.phone_number).map(({ date }) => date);

    });
    return players;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest players.');
  }
}

export async function fetchGeneralPlayersCardData() {
  noStore();

  try {
    const allPlayersResult = await sql`SELECT * FROM players`;
    const allPlayers = allPlayersResult.rows;

    const totalNumberOfPlayers = allPlayers.length;
    const playersWithDebt = allPlayers.filter((player) => player.balance < 0);
    const numberOfPlayersWithDebt = playersWithDebt.length;
    const totalRunnerDebt = allPlayers.filter((player) => player.balance > 0).reduce((acc, player) => acc + player.balance, 0);
    const totalPlayersDebt = playersWithDebt.reduce((acc, player) => acc + player.balance, 0);

    return {
      totalNumberOfPlayers,
      numberOfPlayersWithDebt,
      totalRunnerDebt,
      totalPlayersDebt,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export async function fetchRSVPAndArrivalData() {
  noStore();
  try {
    const now =new Date();
    const dayOfTheWeek = now.toLocaleString('en-us', { weekday: 'long' });
    const rsvp = await getAllRsvps();
    const todayDate = (new Date()).toISOString().slice(0,10);

    const allPlayersResult = await sql`SELECT * FROM players`;
    const allPlayers = allPlayersResult.rows;
    allPlayers.forEach(player => {
      player.rsvpForToday = !!rsvp.find(({ phone_number, date }) => phone_number === player.phone_number && date === todayDate);
      player.rsvps = rsvp.filter(({ phone_number }) => phone_number === player.phone_number).map(({ date }) => date);
    })
    const rsvpForToday = allPlayers.filter(player => player.rsvpForToday).length

    const todayHistoryResults = await sql`SELECT phone_number, type, change FROM history WHERE change < 0 AND updated_at > now() - interval '12 hour'`;
    const todayHistory =  todayHistoryResults.rows.filter(({ type }) => type != 'prize');

    const todayTournamentResult = await sql<TournamentDB>`SELECT * FROM tournaments WHERE day = ${dayOfTheWeek}`;
    const todayTournament = todayTournamentResult.rows[0];
    const todayTournamentMaxPlayers = todayTournament.rsvp_required ? todayTournament?.max_players : null;

    if (todayHistory.length === 0){
      return {
        rsvpForToday,
        arrivedToday: 0,
        todayCreditIncome: 0,
        todayCashIncome: 0,
        todayTransferIncome: 0,
        reEntriesCount: 0,
        todayTournamentMaxPlayers,
        todayTournament
      };
    }
    const reEntriesCount = todayHistory.length - (Array.from(new Set(todayHistory.map(({ phone_number }) => phone_number)))).length;

    const todayCreditIncome = todayHistory.filter(({ type }) => type === 'cash').reduce((acc, { change }) => acc + change, 0);
    const todayCashIncome = todayHistory.filter(({ type }) => type === 'credit').reduce((acc, { change }) => acc + change, 0);
    const todayTransferIncome = todayHistory.filter(({ type }) => type === 'wire').reduce((acc, { change }) => acc + change, 0);
    const arrivedToday =  (Array.from(new Set(todayHistory.map(({ phone_number }) => phone_number)))).length;


    return {
      rsvpForToday,
      arrivedToday,
      todayCreditIncome: todayCreditIncome < 0 ? -1 * todayCreditIncome : todayCreditIncome,
      todayCashIncome: todayCashIncome < 0 ? -1 * todayCashIncome : todayCashIncome,
      todayTransferIncome: todayTransferIncome < 0 ? -1 * todayTransferIncome : todayTransferIncome,
      reEntriesCount,
      todayTournamentMaxPlayers,
      todayTournament
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}


export async function fetchFinalTablePlayers(stringDate?: string) {
  noStore();
  try {
    const date = stringDate ?? (new Date()).toISOString().slice(0,10);
    const winnersResult = await sql<WinnerDB>`SELECT * FROM winners WHERE date = ${date}`;
    const winnersObject = JSON.parse((winnersResult.rows[0] || { winners:'{}'}).winners);
    const allPlayersResult = await sql<PlayerDB>`SELECT * FROM players`;
    const allPlayers = allPlayersResult.rows;
    allPlayers.forEach(player => {
        // @ts-ignore
      player.position = winnersObject[player.phone_number] || 0;
    })

    return allPlayers.filter(player => player.position > 0).sort((a,b)=> a.position < b.position ? -1 : 1);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch final table players data.');
  }
}

export async function fetchPlayersPrizes() {
  noStore();
  try {
    const prizesResult = await sql<PrizeDB>`SELECT * FROM prizes ORDER BY tournament DESC`;
    const prizes = prizesResult.rows;
    const playersResult = await sql<PlayerDB>`SELECT * FROM players`;
    const players = playersResult.rows;
    prizes.forEach(prize => {
        const player = players.find(p => p.phone_number === prize.phone_number);
        if (player){
            prize.player = player;
        }
    });
    return prizes
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch final table players data.');
  }
}



 async function fetchSortedPlayers(query: string, sortBy: string, currentPage: number){
   const offset = (currentPage - 1) * ITEMS_PER_PAGE;

   switch (sortBy) {
     case 'name':
       return sql<PlayerDB>`
        SELECT * FROM players WHERE name::text ILIKE ${`%${query}%`} OR phone_number::text ILIKE ${`%${query}%`} OR notes::text ILIKE ${`%${query}%`}
        ORDER BY name ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;

     case 'balance':
       return sql<PlayerDB>`
        SELECT * FROM players WHERE name::text ILIKE ${`%${query}%`} OR phone_number::text ILIKE ${`%${query}%`} OR notes::text ILIKE ${`%${query}%`}
        ORDER BY balance DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
     case 'phone':
       return sql<PlayerDB>`
        SELECT * FROM players WHERE name::text ILIKE ${`%${query}%`} OR phone_number::text ILIKE ${`%${query}%`} OR notes::text ILIKE ${`%${query}%`}
        ORDER BY phone_number ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
     case 'notes':
       return sql<PlayerDB>`
        SELECT * FROM players WHERE name::text ILIKE ${`%${query}%`} OR phone_number::text ILIKE ${`%${query}%`} OR notes::text ILIKE ${`%${query}%`}
        ORDER BY notes DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
     default:
       return sql<PlayerDB>`
        SELECT * FROM players WHERE name::text ILIKE ${`%${query}%`} OR phone_number::text ILIKE ${`%${query}%`} OR notes::text ILIKE ${`%${query}%`}
        ORDER BY updated_at DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
   }
}
export async function fetchFilteredPlayers(
  query: string,
  currentPage: number,
  sortBy: string = 'updated_at'
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const playersResultPromise = fetchSortedPlayers(query, sortBy, currentPage)

    const playersHistoryCountResultPromise = sql<Counts>`
      SELECT
       phone_number, 
       count(phone_number) 
        FROM history 
         GROUP BY phone_number
    `;

    const rsvp = await getAllRsvps();
    const [playersHistoryCountResult, playersResult] = await Promise.all([playersHistoryCountResultPromise, playersResultPromise]);
    const playersHistoryCount = playersHistoryCountResult.rows;
    const players = playersResult.rows;

    const todayDate = (new Date()).toISOString().slice(0,10);
    players.forEach((player) => {
      const historyCount = playersHistoryCount.find(({ phone_number}) => phone_number === player.phone_number);
      player.historyCount = historyCount?.count ?? 0;
      player.rsvpForToday = !!rsvp.find(({ phone_number, date }) => phone_number === player.phone_number && date === todayDate);
      player.rsvps = rsvp.filter(({ phone_number }) => phone_number === player.phone_number).map(({ date }) => date);
    });
    return players;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch FilteredPlayers.');
  }
}
export async function fetchPlayersPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM players
    WHERE
      name ILIKE ${`%${query}%`} OR
      phone_number ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of players.');
  }
}
export async function fetchTodayPlayers(query?: string) {
  noStore();
  try {
    const todayDate = (new Date()).toISOString().slice(0,10);
    const winnersResult = await sql<WinnerDB>`SELECT * FROM winners WHERE date = ${todayDate}`;
    const winnersObject = JSON.parse((winnersResult.rows[0] || { winners:'{}'}).winners);
    const now = new Date();
    const dayOfTheWeek = now.toLocaleString('en-us', { weekday: 'long' });
    const tournamentsResult = await sql<TournamentDB>`SELECT * FROM tournaments WHERE day = ${dayOfTheWeek}`;
    const tournament = tournamentsResult.rows[0];
    const rsvp_required = tournament.rsvp_required;


    const playersResults = await sql<PlayerDB>`SELECT * FROM players`;
    const players = playersResults.rows;
    const rsvp = await getAllRsvps();

    const todayHistoryResults = await sql`SELECT * FROM history WHERE change < 0 AND updated_at > now() - interval '12 hour'`;
    const todayHistory =  todayHistoryResults.rows.filter(({ type }) => type != 'prize' )

    players.forEach((player) => {
      const playerItems = todayHistory.filter(({ phone_number}) => phone_number === player.phone_number) as LogDB[];
      player.arrived = playerItems.length > 0;
      player.entries = playerItems.length;


      player.name = player.name.trim();
      player.historyLog = playerItems;

      // @ts-ignore
      player.position = winnersObject[player.phone_number] || 0;

      player.rsvpForToday = !!rsvp.find(({ phone_number, date }) => phone_number === player.phone_number && date === todayDate);
      player.rsvps = rsvp.filter(({ phone_number }) => phone_number === player.phone_number).map(({ date }) => date);
    });

    // @ts-ignore
    const results = players.filter(p => (!query && p.arrived) ||
        (!query && p.rsvpForToday && rsvp_required) ||
        (query && query.length > 0 && (p.name.includes(query) ||  p.phone_number.includes(query))))

    results.sort((a,b)=> a.name < b.name ? -1 : 1);

    return results;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the fetchTodayPlayers.');
  }
}

export async function fetchTournamentsData() {
  noStore();
  try {
    const tournamentsResults = await sql<TournamentDB>`SELECT * FROM tournaments`;
    const tournaments =  tournamentsResults.rows;
    const historyResults = await sql`SELECT * FROM history WHERE change < 0 ORDER BY updated_at DESC`;
    const history =  historyResults.rows.filter(({ type }) => type !== 'prize');

    const dateToPlayerMap = {};
    return history.reduce((acc, { phone_number, change, type, updated_at }) => {
      const newAcc = {...acc};
      const dateAsString = updated_at.toISOString();
      const dateObj = new Date(updated_at);
      const tournament = tournaments.find(({ day }) => day === dateObj.toLocaleString('en-us', {weekday: 'long'}));

      if (dateObj.getTime() < (new Date('2024-06-15T10:00:00.000Z')).getTime()){
        return newAcc;
      }
      const date = dateAsString.slice(0,10);
      if (!newAcc[date]){
        newAcc[date] = {
          tournamentName: tournament?.name,
          cash: 0,
          credit: 0,
          wire: 0,
          total: 0,
          players: 0,
          entries: 0,
          reentries: 0,
          date
        }
      }
      const amount = -1 * change;
      newAcc[date].total += amount;
      newAcc[date].entries += 1;
      newAcc[date][type] += amount;

      // @ts-ignore
      const datePlayers = dateToPlayerMap[date];
      if (datePlayers){
        if (!datePlayers.includes(phone_number)){
          datePlayers.push(phone_number);
          newAcc[date].players += 1;
        }else {
          newAcc[date].reentries += 1;
        }
      }else{
        // @ts-ignore
        dateToPlayerMap[date] = [phone_number];
        newAcc[date].players += 1;
      }

      return newAcc;
    }, {});

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the fetch incomes.');
  }
}



export async function fetchAllUsers() {
  noStore();
  try {
    const playersResults = await sql<PlayerDB>`SELECT * FROM players`;
    const userResults = await sql<User>`SELECT * FROM users`;
    const users = userResults.rows;
    const players = playersResults.rows;
    users.forEach(user => {
      const player = players.find(p => p.phone_number === user.phone_number);
      if (player){
        user.name = player.name;
      }
    });

    return users.sort((a,b)=> a.phone_number < b.phone_number ? -1 : 1);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of users.');
  }
}


export async function fetchAllBugs() {
  noStore();
  try {
    const data = await sql<BugDB>`  SELECT  * FROM bugs  `;
    return data.rows;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch bugs.');
  }
}
export async function fetchAllPlayersForExport() {
  noStore();
  try {
    const data = await sql<PlayerDB>`
      SELECT
        name,
        phone_number,
        balance,
        notes
      FROM players
    `;
    return data.rows;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch bugs.');
  }
}
export async function fetchTournaments() {
  noStore();
  try {
    const tournamentsResult = await sql<TournamentDB>`
      SELECT * FROM tournaments ORDER BY i ASC`;

    return tournamentsResult.rows;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tournaments.');
  }
}
export async function fetchFeatureFlags() {
  noStore();
  try {
    const flagsResult = await sql<FeatureFlagDB>`
      SELECT * FROM feature_flags`;

    const prizesEnabled = flagsResult.rows.find(flag => flag.flag_name === 'prizes')?.is_open;
    const placesEnabled = flagsResult.rows.find(flag => flag.flag_name === 'places')?.is_open;
    const rsvpEnabled = flagsResult.rows.find(flag => flag.flag_name === 'rsvp')?.is_open;
    const playerRsvpEnabled = flagsResult.rows.find(flag => flag.flag_name === 'player_can_rsvp')?.is_open;
    return {
      prizesEnabled,
      placesEnabled,
      rsvpEnabled,
      playerRsvpEnabled
    }
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch flagsResult.');
  }
}
export async function fetchPlayerById(id: string) {
  noStore();
  try {
    const data = await sql<PlayerDB>`
      SELECT
        *
      FROM players
      WHERE id = ${id};
    `;

    const player = data.rows[0];
    if (player){
      const rsvpResults = await sql<RSVPDB>`SELECT * FROM rsvp WHERE phone_number = ${player.phone_number}`;
      const playerRsvp = rsvpResults.rows;


      const historyData = await sql<LogDB>`
      SELECT *
      FROM history
      WHERE phone_number = ${player.phone_number}
      order by history.updated_at asc;
    `;

      player.historyLog = historyData.rows;
      player.rsvps = playerRsvp.map(({ date }) => date);
    }


    return player;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetchPlayerById.');
  }
}

export async function fetchTournamentByDay(day: string) {
  noStore();
  const dayName = day.slice(0, 1).toUpperCase() + day.slice(1).toLowerCase()
  try {
    const data = await sql<TournamentDB>`
      SELECT
        *
      FROM tournaments
      WHERE day = ${dayName};
    `;

    return data.rows[0];

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetchTournamentById.');
  }
}

export async function fetchRsvpCountForTodayTournament() {
  noStore();
  try {
    const rsvp = await getAllRsvps();
    const todayDate = (new Date()).toISOString().slice(0,10);

    const allPlayersResult = await sql`SELECT * FROM players`;
    const allPlayers = allPlayersResult.rows;
    allPlayers.forEach(player => {
      player.rsvpForToday = !!rsvp.find(({ phone_number, date }) => phone_number === player.phone_number && date === todayDate);
      player.rsvps = rsvp.filter(({ phone_number }) => phone_number === player.phone_number).map(({ date }) => date);
    })
    return allPlayers.filter(player => player.rsvpForToday).length

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetchTournamentById.');
  }
}

export async function fetchPlayerByUserId(id: string) {
  noStore();
  try {
    const todayDate = (new Date()).toISOString().slice(0,10);

      const usersResult = await sql<User>`SELECT * FROM users WHERE id = ${id};`;
      const user = usersResult.rows && usersResult.rows.length ? usersResult.rows[0] : null;

      const playersResult = await sql<PlayerDB>`SELECT * FROM players WHERE phone_number = ${user?.phone_number};`;

      const player = playersResult.rows && playersResult.rows.length ? playersResult.rows[0] : null;

      if (player){
        const rsvpResults = await sql<RSVPDB>`SELECT * FROM rsvp WHERE date = ${todayDate} AND phone_number = ${player.phone_number};`;
        const rsvp = !!rsvpResults.rows[0];

        const historyData = await sql<LogDB>`
            SELECT * FROM history
            WHERE history.phone_number = ${player.phone_number}
            order by history.updated_at asc;
          `;

        player.historyLog = historyData.rows;
        player.rsvpForToday = rsvp;
      }

      return player;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetchPlayerByUserId.');
  }
}

export async function fetchUserById(id: string) {
  noStore();
  try {

    const data = await sql<User>`SELECT * FROM users WHERE id = ${id};`;

    return data && data.rows.length ? data.rows[0] : null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetchPlayerByPhoneNumber.');
  }
}
