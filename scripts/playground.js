const { tests } = require('./seed');
const { db } = require('@vercel/postgres');
process.env.POSTGRES_URL="postgres://default:gU9uDTSOLw8e@ep-restless-violet-a2nk8a48-pooler.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require"
process.env.POSTGRES_PRISMA_URL="postgres://default:gU9uDTSOLw8e@ep-restless-violet-a2nk8a48-pooler.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15"
process.env.POSTGRES_URL_NO_SSL="postgres://default:gU9uDTSOLw8e@ep-restless-violet-a2nk8a48-pooler.eu-central-1.aws.neon.tech:5432/verceldb"
process.env.POSTGRES_URL_NON_POOLING="postgres://default:gU9uDTSOLw8e@ep-restless-violet-a2nk8a48.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require"
process.env.POSTGRES_USER="default"
process.env.POSTGRES_HOST="ep-restless-violet-a2nk8a48-pooler.eu-central-1.aws.neon.tech"
process.env.POSTGRES_PASSWORD="gU9uDTSOLw8e"
process.env.POSTGRES_DATABASE="verceldb"

async function main() {

  const client = await db.connect();

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


  const user = await client.sql`select * from users `;
  console.log('## users', user.rows)
  await client.end();

}

main();
