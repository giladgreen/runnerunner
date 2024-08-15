import bcrypt from "bcrypt";
import {sql} from "@vercel/postgres";
import {BugDB, ImageDB, LogDB, PlayerDB, PrizeInfoDB, TournamentDB, UserDB} from "@/app/lib/definitions";

export function getFormData(data: any) {
    return {
        get: (prop: string) => {
            for (const key of Object.keys(data)) {
                if (prop === key) return data[key];
            }
        },
    } as FormData;
}

export async function clearDB(){
    await sql`DELETE FROM bugs`;
    await sql`DELETE FROM users`;
    await sql`DELETE FROM players`;
    await sql`DELETE FROM history`;
    await sql`DELETE FROM images`;
    await sql`DELETE FROM tournaments`;
    await sql`DELETE FROM prizes_info`;
    await sql`DELETE FROM deleted_tournaments`;
    await sql`DELETE FROM deleted_users`;
    await sql`DELETE FROM deleted_bugs`;
    await sql`DELETE FROM deleted_players`;
    await sql`DELETE FROM deleted_history`;
    await sql`DELETE FROM deleted_rsvp`;
    await sql`DELETE FROM deleted_prizes`;
    await sql`DELETE FROM deleted_prizes_info`;
}

export async function createDefaultUser(userId: string) {
    const hashedPassword = await bcrypt.hash('123456', 10);

    await sql`INSERT INTO users (id, name, phone_number,password, is_admin) VALUES (${userId}, 'gilad','0587869910',${hashedPassword}, true)`;
}

export async function getHistoryLogs(phoneNumber?: string) {
    if (phoneNumber){
        return (await sql<LogDB>`
            SELECT * 
            FROM history WHERE phone_number = ${phoneNumber}`).rows;
    }

    return (await sql<LogDB>`
            SELECT * 
            FROM history`).rows;
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
   return  (await sql<PlayerDB>`
            SELECT * 
            FROM players`).rows;

}

export async function getAllUsers() {
   return  (await sql<UserDB>`
            SELECT * 
            FROM users`).rows;

}

export async function getAllImages() {
   return  (await sql<ImageDB>`SELECT * FROM images`).rows;

}
