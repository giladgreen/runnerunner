const { tests } = require('./seed');
const { db } = require('@vercel/postgres');
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

async function main() {
  console.log('## pre test start');
  const client = await db.connect();
  await client.sql`DROP TABLE IF EXISTS tournaments;`;
  await client.sql`DROP TABLE IF EXISTS players;`;
  await client.sql`DROP TABLE IF EXISTS bugs;`;
  await client.sql`DROP TABLE IF EXISTS history;`;
  await client.sql`DROP TABLE IF EXISTS winners;`;
  await client.sql`DROP TABLE IF EXISTS rsvp;`;
  await client.sql`DROP TABLE IF EXISTS prizes;`;
  await client.sql`DROP TABLE IF EXISTS images;`;
  await client.sql`DROP TABLE IF EXISTS feature_flags;`;
  await client.end();

  await tests();
}

main();
