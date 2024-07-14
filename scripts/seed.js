const { db } = require('@vercel/postgres');
///SELECT indexname, tablename, indexdef FROM pg_indexes

const { users, tournaments } = require('./placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedTournaments(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS tournaments (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        day TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        i INT NOT NULL,
        buy_in INT NOT NULL,
        re_buy INT NOT NULL,
        max_players INT NOT NULL,
        rsvp_required BOOLEAN NOT NULL,
        updated_at timestamp NOT NULL DEFAULT now()
      );
    `;

    console.log(`Created "tournaments" table`);
    const t = await client.sql`SELECT * FROM tournaments`;
    if (t.rows.length > 0) {
      return;
    }
    // Insert data into the "users" table
    const insertedTournaments = await Promise.all(
      tournaments.map(async (tournament, index) => {
        return client.sql`
        INSERT INTO tournaments (day, name, buy_in, re_buy, max_players, rsvp_required,i)
        VALUES (${tournament.day}, ${tournament.name}, ${
          tournament.buy_in
        }, ${Math.max(tournament.buy_in - 100, 0)}, ${tournament.max_players},${
          tournament.rsvp_required
        }, ${index + 1});
      `;
      }),
    );

    console.log(`Seeded ${insertedTournaments.length} tournaments`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        phone_number TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT,
        is_admin BOOLEAN DEFAULT FALSE,
        is_worker BOOLEAN DEFAULT FALSE,
        created_at timestamp NOT NULL DEFAULT now()
      );
    `;

    console.log(`Created "users" table`);
    const existingUsers = (await client.sql`select * from users`).rows;
    const usersToInsert = users.filter(
      (user) =>
        !existingUsers.find((u) => u.phone_number === user.phone_number),
    );
    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      usersToInsert.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (phone_number, password, is_admin, is_worker, name)
        VALUES (${user.phone_number}, ${hashedPassword}, ${user.is_admin}, ${user.is_worker}, ${user.name});
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

async function createBugReportTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "players" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS bugs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    description VARCHAR(500) NOT NULL,
    updated_at timestamp NOT NULL DEFAULT now()
  );
`;

    return {
      createTable,
    };
  } catch (error) {
    console.error('stack:', error.stack);
    console.error('message', error.message);
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
    phone_number VARCHAR(20) NOT NULL,
    notes VARCHAR(500) NOT NULL default '',
    image_url VARCHAR(255) NOT NULL default '/players/default.png',
    allowed_marketing BOOLEAN NOT NULL default FALSE,
    updated_at timestamp NOT NULL DEFAULT now()
  );
`;

    await client.sql`CREATE INDEX IF NOT EXISTS players_idx ON players (phone_number);`;
    await client.sql`CREATE INDEX IF NOT EXISTS players_name_idx ON players (name);`;

    console.log(`Created "players" table`);

    return {
      createTable,
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
         type VARCHAR(20) NOT NULL,
         note VARCHAR(255) NOT NULL,
         archive BOOLEAN NOT NULL DEFAULT FALSE,
         other_player_phone_number VARCHAR(20),
         updated_by VARCHAR(20) DEFAULT 'admin',
         updated_at timestamp with time zone NOT NULL DEFAULT now()
      );
    `;
    await client.sql`CREATE INDEX IF NOT EXISTS history_idx ON history (phone_number);`;
    await client.sql`CREATE INDEX IF NOT EXISTS history_change_idx ON history (change);`;
    await client.sql`CREATE INDEX IF NOT EXISTS history_type_idx ON history (type);`;
    await client.sql`CREATE INDEX IF NOT EXISTS history_updated_at_idx ON history (updated_at);`;

    console.log(`Created "history" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding history:', error);
    throw error;
  }
}

async function seedWinners(client) {
  try {
    // Create the "winners" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS winners (
         date VARCHAR(20) PRIMARY KEY,
         tournament_name TEXT NOT NULL,
         winners TEXT NOT NULL
      );
    `;

    console.log(`Created "winners" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding winners:', error);
    throw error;
  }
}

async function seedRSVP(client) {
  try {
    // Create the "rsvp" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS rsvp (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         date VARCHAR(20) NOT NULL,
         phone_number TEXT NOT NULL,
        created_at timestamp with time zone NOT NULL DEFAULT now()
      );
    `;
    await client.sql`CREATE INDEX IF NOT EXISTS rsvp_date_idx ON rsvp (date);`;
    await client.sql`CREATE INDEX IF NOT EXISTS rsvp_phone_number_idx ON rsvp (phone_number);`;

    console.log(`Created "rsvp" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding rsvp:', error);
    throw error;
  }
}

async function seedPrizes(client) {
  try {
    // Create the "rsvp" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS prizes (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         tournament TEXT NOT NULL,
         phone_number TEXT NOT NULL,
         prize TEXT NOT NULL,
         delivered BOOLEAN DEFAULT FALSE,
         created_at timestamp NOT NULL DEFAULT now()
      );
    `;

    await client.sql`
      CREATE TABLE IF NOT EXISTS prizes_info (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         name TEXT NOT NULL,
         extra TEXT,
         credit INT DEFAULT 0,
         created_at timestamp NOT NULL DEFAULT now()
      );
    `;

    console.log(`Created "rsvp" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding rsvp:', error);
    throw error;
  }
}

async function seedFF(client) {
  try {
    // Create the "feature_flags" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS feature_flags (
         flag_name TEXT NOT NULL PRIMARY KEY,
         is_open BOOLEAN NOT NULL
      );
    `;

    console.log(`Created "feature_flags" table`);
    const flags = (await client.sql`SELECT * FROM feature_flags `).rows;
    const flagsToInsert = [
      { flag_name: 'places', is_open: true },
      { flag_name: 'prizes', is_open: true },
      { flag_name: 'rsvp', is_open: true },
      { flag_name: 'player_can_rsvp', is_open: true },
      { flag_name: 'use_phone_validation', is_open: true },
    ];

    await Promise.all(
      flagsToInsert
        .filter((flag) => !flags.find((f) => f.flag_name === flag.flag_name))
        .map((flag) => {
          return client.sql`INSERT INTO feature_flags (flag_name, is_open)
        VALUES (${flag.flag_name}, ${flag.is_open});`;
        }),
    );

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding feature_flags:', error);
    throw error;
  }
}

async function seedImages(client) {
  try {
    // Create the "rsvp" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS images (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         phone_number TEXT NOT NULL,
         image_url TEXT NOT NULL
      );
    `;

    console.log(`Created "images" table`);

    const players = (await client.sql`SELECT * FROM players`).rows;
    const images = (await client.sql`SELECT * FROM images`).rows;
    const playersToUpdate = players
      .map((player) => {
        const image = images.find(
          (image) => image.phone_number === player.phone_number,
        );
        return {
          ...player,
          image,
        };
      })
      .filter(
        (player) => player.image && player.image_url.includes('default.png'),
      );

    console.log(`Found ${playersToUpdate.length} players to update image`);
    await Promise.all(
      playersToUpdate.map(
        (player) =>
          client.sql`UPDATE players SET image_url = ${player.image.image_url} WHERE phone_number = ${player.phone_number}`,
      ),
    );
    console.log(`Updated ${playersToUpdate.length} players`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding rsvp:', error);
    throw error;
  }
}

async function _fillUpHistory(client) {
  const total = 30 * 150;
  for (let i = 0; i < total; i++) {
    console.log(i, ' / ', total);
    await client.sql`INSERT INTO history (phone_number, change, type, note, updated_by)
        VALUES ('144',100, 'test', 'test', 'admin');`;
  }
}

async function seed() {
  console.log('## main start');

  const client = await db.connect();

  console.log('## db connected');
  await seedUsers(client);

  await seedTournaments(client);
  await createBugReportTable(client);
  await seedPlayers(client);
  await seedHistory(client);
  await seedWinners(client);
  await seedRSVP(client);
  await seedPrizes(client);
  await seedImages(client);
  await seedFF(client);

  await client.end();
}

function tests() {
  console.log('## tests seed');
  process.env.POSTGRES_URL =
    'postgres://default:gU9uDTSOLw8e@ep-restless-violet-a2nk8a48-pooler.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require';
  process.env.POSTGRES_PRISMA_URL =
    'postgres://default:gU9uDTSOLw8e@ep-restless-violet-a2nk8a48-pooler.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15';
  process.env.POSTGRES_URL_NO_SSL =
    'postgres://default:gU9uDTSOLw8e@ep-restless-violet-a2nk8a48-pooler.eu-central-1.aws.neon.tech:5432/verceldb';
  process.env.POSTGRES_URL_NON_POOLING =
    'postgres://default:gU9uDTSOLw8e@ep-restless-violet-a2nk8a48.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require';
  process.env.POSTGRES_USER = 'default';
  process.env.POSTGRES_HOST =
    'ep-restless-violet-a2nk8a48-pooler.eu-central-1.aws.neon.tech';
  process.env.POSTGRES_PASSWORD = 'gU9uDTSOLw8e';
  process.env.POSTGRES_DATABASE = 'verceldb';
  return seed();
}
module.exports = {
  tests,
  seed,
};
