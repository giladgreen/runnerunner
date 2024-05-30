const { db } = require('@vercel/postgres');
const {
  players,
  customers,
  revenue,
  users,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

const dropTablesBefore = false;

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedPlayers(client) {
  try {
    console.log(`seedPlayers start`);

    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    console.log(`seedPlayers , created EXTENSION`);

    // Create the "players" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL default '/players/default.png',
    balance INT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    notes VARCHAR(500) NOT NULL default '',
    updated_at timestamp NOT NULL DEFAULT now()
  );
`;

    console.log(`Created "players" table`);

    // Insert data into the "players" table
    const insertedPlayers = await Promise.all(
      players.map(
        (player) => client.sql`
        INSERT INTO players (name, phone_number, balance, image_url, notes)
        VALUES (${player.name}, ${player.phone_number}, ${player.balance}, ${player.image_url}, ${player.notes ?? ''})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedPlayers.length} players`);

    return {
      createTable,
      players: insertedPlayers,
    };
  } catch (error) {
    console.error('Error seeding players:');
    console.error('stack:', error.stack);
    console.error('message', error.message);
    throw error;
  }
}

async function seedHistory(client) {
  try {
    // Create the "history" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS history (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         phone_number VARCHAR(20) NOT NULL,
         change INT NOT NULL,
         note VARCHAR(255) NOT NULL,
         updated_by VARCHAR(20) DEFAULT 'admin',
         updated_at timestamp with time zone NOT NULL DEFAULT now()
      );
    `;

    console.log(`Created "history" table`);

    const insertedHistoryLogs = await Promise.all(
        players.map(
            (player) => client.sql`
        INSERT INTO history (phone_number, change, note)
        VALUES (${player.phone_number}, ${player.balance}, 'legacy balance')
        ON CONFLICT (id) DO NOTHING;
      `,
        ),
    );

    console.log(`Seeded ${insertedHistoryLogs.length} history`);

    return {
      createTable,
      insertedHistoryLogs
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();
if (dropTablesBefore){
    await client.sql`DROP TABLE IF EXISTS players`;
    await client.sql`DROP TABLE IF EXISTS history`;
}

  await seedPlayers(client);

  await seedHistory(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
