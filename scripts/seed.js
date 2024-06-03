const { db } = require('@vercel/postgres');
const {
  players,
  users,
  logs,
  templates,
  DEMO_USERS_PHONES
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

const dropTablesBefore = process.argv[2] === 'drop';

async function seedTemplates(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS templates (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        day TEXT NOT NULL UNIQUE,
        template TEXT NOT NULL,
        i INT NOT NULL,
        amount INT NOT NULL,
        updated_at timestamp NOT NULL DEFAULT now()
      );
    `;

    console.log(`Created "templates" table`);

    // Insert data into the "users" table
    const insertedTemplates = await Promise.all(
      templates.map(async (template, index) => {
        return client.sql`
        INSERT INTO templates (day, template, amount, i)
        VALUES (${template.day}, ${template.template}, ${template.amount}, ${index+1});
      `;
      }),
    );

    console.log(`Seeded ${insertedTemplates.length} templates`);

    return {
      createTable,
      insertedTemplates
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
        is_admin BOOLEAN DEFAULT FALSE
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (phone_number, password, is_admin)
        VALUES (${user.phone_number}, ${hashedPassword}, ${user.is_admin});
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
    image_url VARCHAR(255) NOT NULL default '/players/default.png',
    balance INT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    notes VARCHAR(500) NOT NULL default '',
    updated_at timestamp NOT NULL DEFAULT now(),
    sunday_rsvp BOOLEAN DEFAULT FALSE,
    monday_rsvp BOOLEAN DEFAULT FALSE,
    tuesday_rsvp BOOLEAN DEFAULT FALSE,
    wednesday_rsvp BOOLEAN DEFAULT FALSE,
    thursday_rsvp BOOLEAN DEFAULT FALSE,
    saturday_rsvp BOOLEAN DEFAULT FALSE
  );
`;

    console.log(`Created "players" table`);

    // Insert data into the "players" table
    const insertedPlayers = await Promise.all(
      players.map(
        (player, index) => {
          const rsvp = index % 2 === 0 ? true : false;
          return client.sql`
        INSERT INTO players (name, phone_number, balance, image_url, notes, sunday_rsvp, monday_rsvp, tuesday_rsvp, wednesday_rsvp, thursday_rsvp, saturday_rsvp)
        VALUES (${player.name}, ${player.phone_number}, ${player.balance}, ${player.image_url}, ${player.notes ?? ''}, ${rsvp}, ${rsvp}, ${rsvp}, ${rsvp}, ${rsvp}, ${rsvp})
        ON CONFLICT (id) DO NOTHING;
      `
        },
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


    //update DEMO USERs:

    await Promise.all(DEMO_USERS_PHONES.map(phoneNumber => client.sql`delete from history where phone_number = ${phoneNumber};`));
    await Promise.all(DEMO_USERS_PHONES.map(phoneNumber => Promise.all(
        logs.map(
            (log) => client.sql`
        INSERT INTO history (phone_number, change, note, updated_at, updated_by)
        VALUES (${phoneNumber}, ${log.change}, ${log.note}, ${log.updated_at}, ${log.updated_by}); `,
        ),
    )))


    return {
      createTable,
      insertedHistoryLogs
    };
  } catch (error) {
    console.error('Error seeding history:', error);
    throw error;
  }
}

async function main() {
  console.log('## main start')

  const client = await db.connect();
  console.log('## db connected')

  if (dropTablesBefore){
    console.log('## drop tables')
      await client.sql`DROP TABLE IF EXISTS templates`;
      await client.sql`DROP TABLE IF EXISTS users`;
      await client.sql`DROP TABLE IF EXISTS players`;
      await client.sql`DROP TABLE IF EXISTS history`;
  }

  await seedTemplates(client);
  await seedUsers(client);
  await createBugReportTable(client);
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
