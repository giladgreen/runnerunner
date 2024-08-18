import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';
import {
  BugDB,
  FeatureFlagDB,
  ImageDB,
  LogDB,
  PlayerDB,
  PrizeInfoDB,
  TournamentDB,
  UserDB, WinnerDB,
} from '@/app/lib/definitions';

export function getFormData(data: any) {
  return {
    get: (prop: string) => {
      for (const key of Object.keys(data)) {
        if (prop === key) return data[key];
      }
    },
    set: (prop: string, value: any) => {
      data[prop] = value;
    },
  } as FormData;
}

export async function clearDB() {
  await sql`DELETE FROM winners`;
  await sql`DELETE FROM images`;
  await sql`DELETE FROM feature_flags`;

  await sql`DELETE FROM bugs`;
  await sql`DELETE FROM deleted_bugs`;

  await sql`DELETE FROM users`;
  await sql`DELETE FROM deleted_users`;

  await sql`DELETE FROM players`;
  await sql`DELETE FROM deleted_players`;

  await sql`DELETE FROM history`;
  await sql`DELETE FROM deleted_history`;

  await sql`DELETE FROM tournaments`;
  await sql`DELETE FROM deleted_tournaments`;

  await sql`DELETE FROM prizes_info`;
  await sql`DELETE FROM deleted_prizes_info`;

  await sql`DELETE FROM rsvp`;
  await sql`DELETE FROM deleted_rsvp`;

  await sql`DELETE FROM prizes`;
  await sql`DELETE FROM deleted_prizes`;
}

export async function createDefaultUser(userId: string) {
  const hashedPassword = await bcrypt.hash('123456', 10);

  await sql`INSERT INTO users (id, name, phone_number,password, is_admin) VALUES (${userId}, 'gilad','0587869910',${hashedPassword}, true)`;
}

export async function createDefaultPlayer() {
  await sql`INSERT INTO players (name, phone_number, notes) VALUES ('gilad green','0587869910','sweet dude')`;
  await sql`INSERT INTO history (phone_number, change, note, type, archive) VALUES ('0587869910',0,'cool cool cool','credit',true)`;

  return (
    await sql<PlayerDB>`select * from players where phone_number='0587869910'`
  ).rows[0];
}

export async function createOtherPlayer() {
  await sql`INSERT INTO players (name, phone_number, notes) VALUES ('someone else','0542609910','some dude')`;
  await sql`INSERT INTO history (phone_number, change, note, type, archive) VALUES ('0542609910',1000,'cool cool cool','credit',true)`;

  return (
    await sql<PlayerDB>`select * from players where phone_number='0542609910'`
  ).rows[0];
}

export async function createDefaultTournament() {
  await sql`INSERT INTO tournaments (day,name, i, buy_in,re_buy,max_players, rsvp_required ) 
        VALUES ('Sunday','PT',1,250,150,90,true)`;

  return (await sql<TournamentDB>`select * from tournaments`).rows[0];
}

export async function getHistoryLogs(phoneNumber?: string) {
  if (phoneNumber) {
    return (
      await sql<LogDB>`
            SELECT * 
            FROM history WHERE phone_number = ${phoneNumber}`
    ).rows;
  }

  return (
    await sql<LogDB>`
            SELECT * 
            FROM history`
  ).rows;
}

export async function getAllBugs() {
  return (await sql<BugDB>`SELECT * FROM bugs`).rows;
}

export async function getAllDeletedBugs() {
  return (await sql<BugDB>`SELECT * FROM deleted_bugs`).rows;
}

export async function getAllTournaments() {
  return (await sql<TournamentDB>`SELECT * FROM tournaments`).rows;
}

export async function getAllDeletedTournaments() {
  return (await sql<TournamentDB>`SELECT * FROM deleted_tournaments`).rows;
}

export async function getAllPrizesInfo() {
  return (await sql<PrizeInfoDB>`SELECT * FROM prizes_info`).rows;
}

export async function getAllDeletedPrizesInfo() {
  return (await sql<PrizeInfoDB>`SELECT * FROM deleted_prizes_info`).rows;
}

export async function getAllPlayers() {
  return (
    await sql<PlayerDB>`
            SELECT * 
            FROM players`
  ).rows;
}

export async function getAllDeletedPlayers() {
  return (
    await sql<PlayerDB>`
            SELECT * 
            FROM deleted_players`
  ).rows;
}

export async function getAllUsers() {
  return (
    await sql<UserDB>`
            SELECT * 
            FROM users`
  ).rows;
}

export async function getAllImages() {
  return (await sql<ImageDB>`SELECT * FROM images`).rows;
}

export async function getTournamentWinners(tournamentId: string) {
  return (await sql<WinnerDB>`SELECT * FROM winners WHERE tournament_id = ${tournamentId}`).rows[0];
}

export async function getAllFF() {
  return (await sql<FeatureFlagDB>`SELECT * FROM feature_flags`).rows;
}

export async function insertFF(name: string, is_open: boolean) {
  await sql`INSERT INTO feature_flags (flag_name, is_open) VALUES (${name}, ${is_open});`;
}
