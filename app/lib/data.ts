import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

import {
  BugDB, Counts,
  DebtPlayerRaw, LogDB,
  MVPPlayerRaw, PlayerDB,
  PlayersTable,User
} from './definitions';

export async function fetchMVPPlayers() {
  noStore();
  try {
    const data = await sql<MVPPlayerRaw>`
      SELECT players.balance, players.name, players.image_url, players.phone_number, players.id
      FROM players
      ORDER BY players.balance DESC
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
      SELECT players.balance, players.name, players.image_url, players.phone_number, players.id
      FROM players
      WHERE players.balance < 0
      ORDER BY players.balance ASC
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
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const playerCountPromise = sql`SELECT COUNT(*) FROM players`;
    const playerWithDebtCountPromise = sql`SELECT COUNT(*) FROM players WHERE players.balance < 0`;
    const totalRunnerDebtPromise = sql`SELECT SUM(balance) as debt FROM players WHERE players.balance > 0`;
    const totalPlayersDebtPromise = sql`SELECT SUM(balance) as debt FROM players WHERE players.balance < 0`;

    const data = await Promise.all([
      playerCountPromise,
      playerWithDebtCountPromise,
      totalRunnerDebtPromise,
      totalPlayersDebtPromise
    ]);

    const totalNumberOfPlayers = Number(data[0].rows[0].count ?? '0');
    const numberOfPlayersWithDebt = Number(data[1].rows[0].count ?? '0');
    const totalRunnerDebt = Number(data[2].rows[0].debt ?? '0');
    const totalPlayersDebt = Number(data[3].rows[0].debt ?? '0');


    return {
      totalNumberOfPlayers,
      numberOfPlayersWithDebt,
      totalRunnerDebt,
      totalPlayersDebt
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 10;
export async function fetchFilteredPlayers(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const playersResultPromise = await sql<PlayersTable>`
      SELECT
        players.id,
        players.name,
        players.phone_number,
        players.image_url,
        players.balance,
        players.updated_at,
        players.notes
      FROM players
      WHERE
        players.name::text ILIKE ${`%${query}%`} OR
        players.phone_number::text ILIKE ${`%${query}%`}
      ORDER BY players.updated_at DESC
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
      players.name ILIKE ${`%${query}%`} OR
      players.phone_number ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of players.');
  }
}

export async function fetchAllBugs() {
  noStore();
  try {
    const data = await sql<BugDB>`
      SELECT
        id,
        description,
        updated_at
      FROM bugs
    `;


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
export async function fetchPlayerById(id: string) {
  noStore();
  try {
    const data = await sql<PlayerDB>`
      SELECT
        players.name,
        players.phone_number,
        players.image_url,
        players.balance,
        players.updated_at,
        players.notes
      FROM players
      WHERE players.id = ${id};
    `;

    const player = data.rows[0];
    const historyData = await sql<LogDB>`
      SELECT
        history.id,
        history.change,
        history.note,
        history.updated_at,
        history.updated_by
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

export async function fetchPlayerByPhoneNumber(phoneNumber: string) {
  noStore();
  try {
    console.log('phoneNumber', phoneNumber)

 const data = await sql<PlayerDB>`
      SELECT
        name,
        phone_number,
        image_url,
        balance,
        updated_at,
        notes
      FROM players
      WHERE phone_number = ${phoneNumber};
    `;

    const player = data.rows[0];
    console.log('player', player)

    const historyData = await sql<LogDB>`
      SELECT
        history.id,
        history.change,
        history.note,
        history.updated_at,
        history.updated_by
      FROM history
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
