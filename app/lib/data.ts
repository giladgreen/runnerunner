import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

import {
  DebtPlayerRaw, LogDB,
  MVPPlayerRaw, PlayerDB,
  PlayerForm,
  PlayersTable,
} from './definitions';
import { formatCurrency } from './utils';

// export async function fetchRevenue() {
//   // Add noStore() here to prevent the response from being cached.
//   // This is equivalent to in fetch(..., {cache: 'no-store'}).
//   noStore();
//   try {
//     // Artificially delay a response for demo purposes.
//     // Don't do this in production :)
//
//     console.log('Fetching revenue data...');
//     await new Promise((resolve) => setTimeout(resolve, 3000));
//
//     const data = await sql<Revenue>`SELECT * FROM revenue`;
//
//     console.log('Data fetch completed after 3 seconds.');
//
//     return data.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     //throw new Error('Failed to fetch revenue data.');
//   }
// }

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
    const players = await sql<PlayersTable>`
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

    return players.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Players.');
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
        history.updated_at
      FROM history
      WHERE history.phone_number = ${player.phone_number}
      order by history.updated_at asc;
    `;

    player.historyLog = historyData.rows;

    return player;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch player.');
  }
}

// export async function fetchCustomers() {
//   noStore();
//   try {
//     const data = await sql<CustomerField>`
//       SELECT
//         id,
//         name
//       FROM customers
//       ORDER BY name ASC
//     `;
//
//     const customers = data.rows;
//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     // throw new Error('Failed to fetch all customers.');
//   }
// }

// export async function fetchFilteredCustomers(query: string) {
//   noStore();
//   try {
//     const data = await sql<CustomersTableType>`
// 		SELECT
// 		  customers.id,
// 		  customers.name,
// 		  customers.email,
// 		  customers.image_url,
// 		  COUNT(players.id) AS total_players,
// 		  SUM(CASE WHEN players.status = 'pending' THEN players.amount ELSE 0 END) AS total_pending,
// 		  SUM(CASE WHEN players.status = 'paid' THEN players.amount ELSE 0 END) AS total_paid
// 		FROM customers
// 		LEFT JOIN players ON customers.id = players.customer_id
// 		WHERE
// 		  customers.name ILIKE ${`%${query}%`} OR
//         customers.email ILIKE ${`%${query}%`}
// 		GROUP BY customers.id, customers.name, customers.email, customers.image_url
// 		ORDER BY customers.name ASC
// 	  `;
//
//     const customers = data.rows.map((customer) => ({
//       ...customer,
//       total_pending: formatCurrency(customer.total_pending),
//       total_paid: formatCurrency(customer.total_paid),
//     }));
//
//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch customer table.');
//   }
// }
//
// export async function getUser(email: string) {
//   noStore();
//   try {
//     const user = await sql`SELECT * FROM users WHERE email=${email}`;
//     return user.rows[0] as User;
//   } catch (error) {
//     console.error('Failed to fetch user:', error);
//     throw new Error('Failed to fetch user.');
//   }
// }
