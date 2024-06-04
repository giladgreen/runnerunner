import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

import {
  BugDB, Counts,
  DebtPlayerRaw, LogDB,
  MVPPlayerRaw, PlayerDB,
  PlayersTable, TemplateDB, User
} from './definitions';

export async function fetchMVPPlayers() {
  noStore();
  try {
    const data = await sql<MVPPlayerRaw>`
      SELECT *
      FROM players
      ORDER BY balance DESC
      LIMIT 5`;

    return data.rows;
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

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest players.');
  }
}

export async function fetchCardData() {
  noStore();

  try {
    const now = new Date();
    const dayOfTheWeek = now.toLocaleString('en-us', { weekday: 'long' });
    const rsvpPropName = `${dayOfTheWeek.toLowerCase()}_rsvp`

    const allPlayersResult = await sql`SELECT * FROM players`;
    const allPlayers = allPlayersResult.rows;

    const totalNumberOfPlayers = allPlayers.length;
    const playersWithDebt = allPlayers.filter((player) => player.balance < 0);
    const numberOfPlayersWithDebt = playersWithDebt.length;
    const totalRunnerDebt = allPlayers.filter((player) => player.balance > 0).reduce((acc, player) => acc + player.balance, 0);
    const totalPlayersDebt = playersWithDebt.reduce((acc, player) => acc + player.balance, 0);
    const rsvpForToday = allPlayers.filter(player => player[rsvpPropName]).length

    return {
      totalNumberOfPlayers,
      numberOfPlayersWithDebt,
      totalRunnerDebt,
      totalPlayersDebt,
      rsvpForToday
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
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
    console.log('phoneNumber', phoneNumber)

 const data = await sql<PlayerDB>`
      SELECT
        *
      FROM players
      WHERE phone_number = ${phoneNumber};
    `;

    const player = data.rows[0];
    console.log('player', player)

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
