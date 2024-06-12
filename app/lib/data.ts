import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

import {
  BugDB, Counts,
  DebtPlayerRaw, LogDB,
  MVPPlayerRaw, PlayerDB,
  PlayersTable, TemplateDB, User
} from './definitions';
import {GeneralPlayersCardWrapper} from "@/app/ui/dashboard/cards";


export async function fetchMVPPlayers() {
  noStore();
  try {
    const data = await sql<MVPPlayerRaw>`
      SELECT *
      FROM players
      ORDER BY balance DESC
      LIMIT 5`;

    const todayHistoryResults = await sql`SELECT phone_number FROM history WHERE change < 0 AND updated_at > now() - interval '6 hour' group by phone_number`;
    const todayHistory =  todayHistoryResults.rows.filter(({ type }) => type != 'prize' );

    const players = data.rows;
    players.forEach((player) => {
      player.arrived = !!todayHistory.find(({ phone_number}) => phone_number === player.phone_number);
    });
    return players;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest players.');
  }
}

export async function fetchDebtPlayers() {
  noStore();
  try {
    const data = await sql<DebtPlayerRaw>`
      SELECT *
      FROM players
      WHERE balance < 0
      ORDER BY balance ASC
      LIMIT 5`;

    const todayHistoryResults = await sql`SELECT phone_number FROM history WHERE change < 0 AND updated_at > now() - interval '6 hour' group by phone_number`;
    const todayHistory =  todayHistoryResults.rows.filter(({ type }) => type != 'prize' )

    const players = data.rows;
    players.forEach((player) => {
      player.arrived = !!todayHistory.find(({ phone_number}) => phone_number === player.phone_number);
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
    const now = new Date();
    const dayOfTheWeek = now.toLocaleString('en-us', { weekday: 'long' });
    const rsvpPropName = `${dayOfTheWeek.toLowerCase()}_rsvp`

    const allPlayersResult = await sql`SELECT * FROM players`;
    const allPlayers = allPlayersResult.rows;

    const rsvpForToday = allPlayers.filter(player => player[rsvpPropName]).length

    const todayHistoryResults = await sql`SELECT phone_number, type, change FROM history WHERE change < 0 AND updated_at > now() - interval '6 hour'`;
    const todayHistory =  todayHistoryResults.rows.filter(({ type }) => type != 'prize' );
    if (todayHistory.length === 0){
      return {
        rsvpForToday,
        arrivedToday: 0,
        todayCreditIncome: 0,
        todayCashIncome: 0,
        todayTransferIncome: 0,
        reEntriesCount: 0
      };
    }
    const minChange = todayHistory.reduce((acc, { change }) => Math.min(acc, change), 9999);

    const reEntriesCount = todayHistory.filter(({ change }) => change === minChange).length;
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
      reEntriesCount
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}


export async function fetchFinalTablePlayers() {
  noStore();
  try {
    const allPlayersResult = await sql<PlayerDB>`SELECT * FROM players WHERE position > 0 ORDER BY position ASC`;
    return allPlayersResult.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch final table players data.');
  }
}


const ITEMS_PER_PAGE = 8;
export async function fetchFilteredPlayers(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const playersResultPromise = await sql<PlayersTable>`
      SELECT
        *
      FROM players
      WHERE
        name::text ILIKE ${`%${query}%`} OR
        phone_number::text ILIKE ${`%${query}%`}
      ORDER BY updated_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    const playersHistoryCountResultPromise = sql<Counts>`
      SELECT
       phone_number, 
       count(phone_number) 
        FROM history 
         GROUP BY phone_number
    `;

    const [playersHistoryCountResult, playersResult] = await Promise.all([playersHistoryCountResultPromise, playersResultPromise]);
    const playersHistoryCount = playersHistoryCountResult.rows;
    const players = playersResult.rows;

    players.forEach((player) => {
      const historyCount = playersHistoryCount.find(({ phone_number}) => phone_number === player.phone_number);
      player.historyCount = historyCount?.count ?? 0;
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
  try {
    const now = new Date();
    const dayOfTheWeek = now.toLocaleString('en-us', { weekday: 'long' });
    const rsvpPropName = `${dayOfTheWeek.toLowerCase()}_rsvp`

    const playersResults = await sql<PlayersTable>`
      SELECT *
      FROM players`;

    const todayHistoryResults = await sql`SELECT * FROM history WHERE change < 0 AND updated_at > now() - interval '12 hour'`;
    const todayHistory =  todayHistoryResults.rows.filter(({ type }) => type != 'prize' )

    const players = playersResults.rows;
    players.forEach((player) => {
      const playerItems = todayHistory.filter(({ phone_number}) => phone_number === player.phone_number);


      player.arrived = playerItems.length > 0;
      player.entries = playerItems.length;
      player.name = player.name.trim()
    });


    // @ts-ignore
    const results = players.filter(p => p.arrived || !!p[rsvpPropName] || (query && query.length > 0 && (p.name.includes(query) ||  p.phone_number.includes(query))))
    results.sort((a,b)=> a.name < b.name ? -1 : 1);

    return results;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the fetchTodayPlayers.');
  }
}

export async function fetchRevenues() {
  try {
    const historyResults = await sql`SELECT * FROM history WHERE change < 0 ORDER BY updated_at DESC`;
    const history =  historyResults.rows.filter(({ type }) => type !== 'prize');
    // history.forEach((item) => {
    //   console.log('## history item, date:',item.updated_at.toISOString().slice(0,10), ' phone_number:', item.phone_number, ' change:', item.change, ' type:', item.type);
    // });
    const dateToPlayerMap = {};
    return history.reduce((acc, { phone_number, change, type, updated_at }) => {
      const dateAsString = updated_at.toISOString();
      const date = dateAsString.slice(0,10);
      if (!acc[date]){
        acc[date] = {
          cash: 0,
          credit: 0,
          wire: 0,
          total: 0,
          players: 0,
          entries: 0,
          date
        }
      }
      const amount = -1 * change;
      acc[date].total += amount;
      acc[date].entries += 1;
      acc[date][type] += amount;

      // @ts-ignore
      const datePlayers = dateToPlayerMap[date];
      if (datePlayers){
        if (!datePlayers.includes(phone_number)){
          datePlayers.push(phone_number);
          acc[date].players += 1;
        }
      }else{
        // @ts-ignore
        dateToPlayerMap[date] = [phone_number];
      }

      return acc;
    }, {});

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the fetch revenue.');
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

    return users;
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
export async function fetchTemplates() {
  noStore();
  try {
    const templatesResult = await sql<TemplateDB>`
      SELECT * FROM templates ORDER BY i ASC`;

    return templatesResult.rows;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch bugs.');
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
    const historyData = await sql<LogDB>`
      SELECT *
      FROM history
      WHERE history.phone_number = ${player.phone_number}
      order by history.updated_at asc;
    `;

    player.historyLog = historyData.rows;

    return player;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetchPlayerById.');
  }
}

export async function fetchTemplateById(id: string) {
  noStore();
  try {
    const data = await sql<TemplateDB>`
      SELECT
        *
      FROM templates
      WHERE id = ${id};
    `;

    return data.rows[0];

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetchTemplateById.');
  }
}

export async function fetchPlayerByPhoneNumber(phoneNumber: string) {
  noStore();
  try {

 const data = await sql<PlayerDB>`
      SELECT
        *
      FROM players
      WHERE phone_number = ${phoneNumber};
    `;

    const player = data.rows[0];

    const historyData = await sql<LogDB>`
      SELECT * FROM history
      WHERE history.phone_number = ${player.phone_number}
      order by history.updated_at asc;
    `;

    player.historyLog = historyData.rows;

    return player;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetchPlayerByPhoneNumber.');
  }
}

export async function fetchUserByPhoneNumber(phoneNumber: string) {
  noStore();
  try {

 const data = await sql<User>`
      SELECT
        *
      FROM users
      WHERE phone_number = ${phoneNumber};
    `;

    const user = data.rows[0];

    return user;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetchPlayerByPhoneNumber.');
  }
}
