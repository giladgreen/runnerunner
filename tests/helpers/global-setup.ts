// import {} from 'jest-specific-snapshot';
import * as nock from 'nock';

process.env.POSTGRES_URL="postgres://default:gU9uDTSOLw8e@ep-restless-violet-a2nk8a48-pooler.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require"
process.env.POSTGRES_PRISMA_URL="postgres://default:gU9uDTSOLw8e@ep-restless-violet-a2nk8a48-pooler.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15"
process.env.POSTGRES_URL_NO_SSL="postgres://default:gU9uDTSOLw8e@ep-restless-violet-a2nk8a48-pooler.eu-central-1.aws.neon.tech:5432/verceldb"
process.env.POSTGRES_URL_NON_POOLING="postgres://default:gU9uDTSOLw8e@ep-restless-violet-a2nk8a48.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require"
process.env.POSTGRES_USER="default"
process.env.POSTGRES_HOST="ep-restless-violet-a2nk8a48-pooler.eu-central-1.aws.neon.tech"
process.env.POSTGRES_PASSWORD="gU9uDTSOLw8e"
process.env.POSTGRES_DATABASE="verceldb"
process.env.LOCAL="true"

// disabling all http requests.
nock.disableNetConnect();
// Allow localhost connections, so we can test local routes and mock servers.
nock.enableNetConnect('127.0.0.1');
