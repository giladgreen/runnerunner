const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('./players_images_2024-07-13.csv');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  const items = [];
  for await (const line of rl) {
    const [phone, url] = line.split(',');
    items.push({ phone, url });
  }
  return items;
}

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
  //const items = await processLineByLine();

  const client = await db.connect();
  // let i = 0;
  // for (const item of items) {
  //   i++
  //   await client.sql`insert into images (phone_number, image_url) values (${item.phone},${item.url});`;
  //   console.log('## inser #', i, `         ${item.phone}, ${item.url}`)
  //}
  //   const user = await client.sql`select * from users where phone_number = '0587869910';`;
  //   console.log('## user', user.rows[0])
  //
  //   await client.sql`insert into users (phone_number,
  // password,
  // name,
  // is_admin,
  // is_worker
  // ) values ('0507736775',${user.rows[0].password},'oz',false,false);`;
  // console.log('## user created')
  //0507736775
  // await client.sql`delete from users where phone_number = '0587869910';`;
  // console.log('## user deleted')
  // const user = await client.sql`select * from users where phone_number = '0587869910';`;
  // console.log('## user', user.rows[0])
  //
  // const player = await client.sql`select * from players where phone_number = '0587869910';`;
  // console.log('## player', player.rows[0])

  // const players = (await client.sql`select * from players limit 22`).rows;
  //
  // for (const player of players) {
  //   await client.sql`update players set allowed_marketing = true where id = ${player.id}`;
  // }

  await client.sql`CREATE TABLE IF NOT EXISTS prizes_info (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         name TEXT NOT NULL,
         extra TEXT,
         credit INT DEFAULT 0,
         created_at timestamp NOT NULL DEFAULT now()
      )`;
  console.log('## done');

  await client.end();
}

main();
