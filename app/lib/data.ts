import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore} from 'next/cache';

import {
  BugDB, Counts,
  DebtPlayerRaw, FeatureFlagDB, LogDB, MVPPlayer,
  MVPPlayerRaw, PlayerDB, PrizeDB, RSVPDB,
  TournamentDB, User, WinnerDB
} from './definitions';

const ITEMS_PER_PAGE = 30;
const TOP_COUNT = 8;

function positionComparator(a: PlayerDB,b: PlayerDB) {
  return a.position < b.position ? -1 : 1;
};
function phoneNumberComparator(a: User,b: User) {
  return a.phone_number < b.phone_number ? -1 : 1;
};

function nameComparator(a: PlayerDB,b: PlayerDB) {
  return a.name < b.name ? -1 : 1;
};

function getTodayShortDate(){
  return (new Date()).toISOString().slice(0,10);
}

function getDayOfTheWeek(date?: Date){
  const base = date ?? new Date();
  return base.toLocaleString('en-us', { weekday: 'long' });
}

function sumArrayByProp(array:any[], propName:string){
  return array.reduce((acc, player) => acc + player[propName], 0);
}

async function getAllFlags(){
  const data = await sql<FeatureFlagDB>`SELECT * FROM feature_flags`;
  return data.rows;
}
async function getAllBugs(){
  const data = await sql<BugDB>`SELECT * FROM bugs`;
  return data.rows;
}
async function getAllPrizes(){
  const prizesResult = await sql<PrizeDB>`SELECT * FROM prizes ORDER BY tournament DESC`;
  return prizesResult.rows;
}
async function getAllRsvps() {
  const rsvpResults = await sql<RSVPDB>`SELECT * FROM rsvp;`;
  return rsvpResults.rows;
}

async function getUserById(userId: string){
  const usersResult = await sql<User>`SELECT * FROM users WHERE id = ${userId};`;
  return usersResult.rows && usersResult.rows.length ? usersResult.rows[0] : null;
}

async function getPlayerById(playerId: string){
  const data = await sql<PlayerDB>`SELECT * FROM players WHERE id = ${playerId};`;
  const player = data?.rows[0];
  if (!player){
    return null;
  }

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

  return player;
}

async function isPlayerRsvp(playerPhoneNumber:string, date: string){
  const rsvpResults = await sql<RSVPDB>`SELECT * FROM rsvp WHERE date = ${date} AND phone_number = ${playerPhoneNumber};`;
  return rsvpResults.rows.length > 0;
}

async function getPlayerByPhoneNumber(phoneNumber: string){
  const playersResult = await sql<PlayerDB>`SELECT * FROM players WHERE phone_number = ${phoneNumber};`;
  return playersResult.rows && playersResult.rows.length ? playersResult.rows[0] : null;
}

async function getTodayTournament(day?: string){
  const dayOfTheWeek= day ?? getDayOfTheWeek();
  const todayTournamentResult = await sql<TournamentDB>`SELECT * FROM tournaments WHERE day = ${dayOfTheWeek}`;
 return todayTournamentResult.rows[0];
}

async function getAllTournaments(){
  const tournamentsResults = await sql<TournamentDB>`SELECT * FROM tournaments ORDER BY i ASC`;
  return tournamentsResults.rows;
}

async function getDateWinnersRecord(date: string){
  const winnersResult = await sql<WinnerDB>`SELECT * FROM winners WHERE date = ${date}`;
  return winnersResult.rows[0];
}

async function getPlayerHistory(playerPhoneNumber: string){
  const historyData = await sql<LogDB>`
            SELECT * FROM history
            WHERE history.phone_number = ${playerPhoneNumber}
            order by history.updated_at asc;
          `;

  return historyData.rows;
}
async function getTodayHistory(){
  const todayHistoryResults = await sql`SELECT * FROM history WHERE change < 0 AND updated_at > now() - interval '12 hour'  ORDER BY updated_at DESC`;
  return todayHistoryResults.rows.filter(({ type }) => type != 'prize');
}

async function getAllPlayersWithCredit(min: number)  {
  const playersResult = await sql<PlayerDB>`SELECT * FROM players WHERE balance > ${min}`;
  return playersResult.rows;
}
async function getAllPlayers()  {
  const [allPlayersResult, rsvpResults] = await Promise.all([sql<PlayerDB>`SELECT * FROM players`, sql<RSVPDB>`SELECT * FROM rsvp;`])
  const allPlayers = allPlayersResult.rows;
  const rsvp = rsvpResults.rows;
  const todayDate = getTodayShortDate();

  allPlayers.forEach(player => {
    player.rsvpForToday = !!rsvp.find(({ phone_number, date }) => phone_number === player.phone_number && date === todayDate);
    player.rsvps = rsvp.filter(({ phone_number }) => phone_number === player.phone_number).map(({ date }) => date);
  })

  return allPlayers;
}

async function getAllUsers()  {
  const usersResult = await sql<User>`SELECT * FROM users`;
  return usersResult.rows;

}

async function getTopMVPPlayers(){
  const players = await sql<MVPPlayerRaw>`
      SELECT *
      FROM players
      WHERE balance > 0
      ORDER BY balance DESC
      LIMIT ${TOP_COUNT}`;

  return players.rows;
}

async function getTopDebtPlayers(){
  const players = await sql<DebtPlayerRaw>`
      SELECT *
      FROM players
      WHERE balance < 0
      ORDER BY balance ASC
      LIMIT ${TOP_COUNT}`;

  return players.rows;
}

async function fetchTopPlayers(players: MVPPlayerRaw[] | DebtPlayerRaw[]) {
  try {
    const todayDate = getTodayShortDate();

    const todayHistory = (await getTodayHistory()).filter(({ type }) => type != 'prize' && type != 'credit_to_other');
    const rsvp = await getAllRsvps();

    players.forEach((player) => {
      player.arrived = !!todayHistory.find(({ phone_number}) => phone_number === player.phone_number);
      player.rsvpForToday = !!rsvp.find(({ phone_number, date }) => phone_number === player.phone_number && date === todayDate);
      player.rsvps = rsvp.filter(({ phone_number }) => phone_number === player.phone_number).map(({ date }) => date);
    });
    return players;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch fetchTopPlayers.');
  }
}
export async function fetchMVPPlayers() {
  noStore();
  const players = await getTopMVPPlayers();
  return fetchTopPlayers(players);
}

export async function fetchDebtPlayers() {
  noStore();
  const players = await getTopDebtPlayers();
  return fetchTopPlayers(players);
}

export async function fetchGeneralPlayersCardData() {
  noStore();

  try {
    const allPlayers = await getAllPlayers()

    const totalNumberOfPlayers = allPlayers.length;
    const playersWithDebt = allPlayers.filter((player) => player.balance < 0);
    const numberOfPlayersWithDebt = playersWithDebt.length;
    const totalRunnerDebt = sumArrayByProp(allPlayers.filter((player) => player.balance > 0), 'balance')
    const totalPlayersDebt = sumArrayByProp(playersWithDebt,'balance');

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
    const allPlayers = await getAllPlayers();

    const rsvpForToday = allPlayers.filter(player => player.rsvpForToday).length

    const todayHistory = await getTodayHistory();

    const todayTournament = await getTodayTournament();

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

    const todayCreditIncome = sumArrayByProp( todayHistory.filter(({ type }) => type === 'cash'),'change');
    const todayCashIncome = sumArrayByProp( todayHistory.filter(({ type }) => type === 'credit'),'change');
    const todayTransferIncome = sumArrayByProp( todayHistory.filter(({ type }) => type === 'wire'),'change');
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
    const date = stringDate ?? getTodayShortDate();
    const winnersResult = await getDateWinnersRecord(date);
    const winnersObject =  winnersResult ? JSON.parse(winnersResult.winners) : {};
    const winnersPhoneNumbers = Object.keys(winnersObject);
    const allPlayers = (await getAllPlayers()).filter(player => winnersPhoneNumbers.includes(player.phone_number)).map(player => {
      const playerObj = winnersObject[player.phone_number];
      player.position = playerObj?.position || 0;
      player.hasReceived = Boolean(playerObj?.hasReceived);
      return player;
    })

    return allPlayers.sort(positionComparator);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch final table players data.');
  }
}

export async function fetchPlayersPrizes() {
  noStore();
  try {
    const prizes = await getAllPrizes()
    const players = await getAllPlayers()
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

    const todayDate = getTodayShortDate();
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
export async function fetchPlayersPagesCount(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*) FROM players WHERE
      name ILIKE ${`%${query}%`} OR
      phone_number ILIKE ${`%${query}%`} OR 
      notes::text ILIKE ${`%${query}%`}
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
    const todayDate = getTodayShortDate();
    const winnersRecord = await getDateWinnersRecord(todayDate);
    const winnersObject = winnersRecord ? JSON.parse(winnersRecord.winners) : {};

    const tournament = await getTodayTournament();
    const rsvp_required = tournament.rsvp_required;

    const players = await getAllPlayers()
    const rsvp = await getAllRsvps();

    const todayHistory =  (await getTodayHistory()).filter(({ type }) => type != 'prize'  && type != 'credit_to_other' )

    players.forEach((player) => {
      const playerItems = todayHistory.filter(({ phone_number}) => phone_number === player.phone_number) as LogDB[];
      player.arrived = playerItems.length > 0;
      player.entries = playerItems.length;


      player.name = player.name.trim();
      player.historyLog = playerItems;

      // @ts-ignore
      player.position = (winnersObject[player.phone_number])?.position || 0;

      player.rsvpForToday = !!rsvp.find(({ phone_number, date }) => phone_number === player.phone_number && date === todayDate);
      player.rsvps = rsvp.filter(({ phone_number }) => phone_number === player.phone_number).map(({ date }) => date);
    });

    // @ts-ignore
    const results = players.filter(p => (!query && p.arrived) ||
        (!query && p.rsvpForToday && rsvp_required) ||
        (query && query.length > 0 && (p.name.includes(query) ||  p.phone_number.includes(query))))

    results.sort(nameComparator);

    return results;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the fetchTodayPlayers.');
  }
}

export async function fetchTournamentsData() {
  noStore();
  try {
    const tournaments =  await getAllTournaments()
    const history =  await getTodayHistory()

    const dateToPlayerMap = {};
    return history.reduce((acc, { phone_number, change, type, updated_at }) => {
      const newAcc = {...acc};
      const dateAsString = updated_at.toISOString();
      const dateObj = new Date(updated_at);
      const tournament = tournaments.find(({ day }) => day === getDayOfTheWeek(dateObj));

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

export async function fetchPlayersWithEnoughCredit(){
  noStore();
  try {
    return await getAllPlayersWithCredit(99);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the fetch incomes.');
  }
}

export async function fetchAllUsers() {
  noStore();
  try {
    const [users, players] = await Promise.all([getAllUsers(), getAllPlayers()]);

    users.forEach(user => {
      const player = players.find(p => p.phone_number === user.phone_number);
      if (player){
        user.name = player.name;
      }
    });

    return users.sort(phoneNumberComparator);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of users.');
  }
}


export async function fetchAllBugs() {
  noStore();
  try {
    return await getAllBugs();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch bugs.');
  }
}
export async function fetchAllPlayersForExport() {
  noStore();
  try {
    return await getAllPlayers();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch bugs.');
  }
}
export async function fetchTournaments() {
  noStore();
  try {
    return getAllTournaments();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tournaments.');
  }
}
export async function fetchFeatureFlags() {
  noStore();
  try {
    const flagsResult = await getAllFlags();

    const prizesEnabled = flagsResult.find(flag => flag.flag_name === 'prizes')?.is_open;
    const placesEnabled = flagsResult.find(flag => flag.flag_name === 'places')?.is_open;
    const rsvpEnabled = flagsResult.find(flag => flag.flag_name === 'rsvp')?.is_open;
    const playerRsvpEnabled = flagsResult.find(flag => flag.flag_name === 'player_can_rsvp')?.is_open;
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
    return await getPlayerById(id);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetchPlayerById.');
  }
}

export async function fetchTournamentByDay(day?: string) {
  noStore();
  try {
    const dayName = day ?? (new Date()).toLocaleString('en-us', {weekday: 'long'});

    return await getTodayTournament(dayName)

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetchTournamentById.');
  }
}

export async function fetchRsvpCountForTodayTournament() {
  noStore();
  try {
    const allPlayers = await getAllPlayers();
    return allPlayers.filter(player => player.rsvpForToday).length;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetchTournamentById.');
  }
}

export async function fetchPlayerByUserId(id: string) {
  noStore();
  try {


      const user = await getUserById(id);
      if (!user){
        return null;
      }
      const player = await getPlayerByPhoneNumber(user?.phone_number)

      if (player){
        const todayDate = getTodayShortDate();
        const rsvp = await isPlayerRsvp(player.phone_number, todayDate)
        player.historyLog = await getPlayerHistory(player.phone_number);
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
    return await getUserById(id)
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetchPlayerByPhoneNumber.');
  }
}
