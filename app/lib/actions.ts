'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
const _ = require("lodash");
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import {
    PlayerDB,
    PlayerForm,
    User,
    TournamentDB,
    WinnerDB,
    RSVPDB,
    ImageDB,
    LogDB,
    PrizeDB
} from "@/app/lib/definitions";
import bcrypt from "bcrypt";
import {unstable_noStore as noStore} from "next/dist/server/web/spec-extension/unstable-no-store";

const CreateUsageLog =  z.object({
    change: z.coerce.number(),
    note: z.string().min(1, 'change note can not be left empty'),
});

const UpdateTournament =  z.object({
    buy_in: z.coerce.number(),
    re_buy: z.coerce.number(),
    max_players: z.coerce.number(),
    rsvp_required: z.coerce.boolean(),
    name: z.string()
});

const UpdatePlayer = z.object({
    name: z.string().min(1, 'name can not be left empty'),
    notes: z.string(),
});


export type State = {
    errors?: {
        name?: string[];
        balance?: string[];
        change?: string[];
        phone_number?: string[];
        note?: string[];
        notes?: string[];
        description?: string[];
        amount?: string[];
        position?: string[];
        prize?: string[];
        buy_in?: string[];
        re_buy?: string[];
        max_players?: string[];
        rsvp_required?: string[];
    };
    message?: string | null;
};


export async function createReport(worker:boolean, formData: FormData) {
    const description = formData.get('description') as string;
    try {
        await sql`
      INSERT INTO bugs (description)
      VALUES (${description})
    `;


    } catch (error) {
        console.error('## createReport error', error)
        return {
            message: 'Database Error: Failed to Create report.',
        };
    }
    const url = worker ? '/' : '/dashboard/configurations';
    revalidatePath('/dashboard/configurations');
    redirect('/dashboard/configurations');
}
export async function createPlayer(prevPage: string, prevState: State, formData: FormData) {
    const name = formData.get('name') as string;
    const balance = formData.get('balance') as string;
    const note = formData.get('note') as string;
    const phone_number = formData.get('phone_number') as string;
    const notes = formData.get('notes') as string;
    let image_url = (formData.get('image_url') as string) ?? '/players/default.png'
    const phoneNumber = phone_number.replaceAll('-', '');

    if (!image_url || image_url.trim().length < 7){
        image_url = '/players/default.png';
    }

    try {
        if (image_url !== '/players/default.png'){
            await sql`INSERT INTO images (phone_number, image_url) VALUES (${phoneNumber}, ${image_url})`;
        }

    }  catch (error) {
        console.error('## add image error', error)
    }
    try {
        await sql`
      INSERT INTO players (name, balance, phone_number, image_url, notes)
      VALUES (${name}, ${balance}, ${phoneNumber}, ${image_url} , ${notes ?? ''})
    `;

        await sql`
      INSERT INTO history (phone_number, change, note, type)
      VALUES (${phoneNumber}, ${balance}, ${note}, 'credit')
    `;

    } catch (error) {
        console.error('## createPlayer error', error)
        return {
            message: 'Database Error: Failed to Create Player.',
        };
    }
    revalidatePath(prevPage);
    redirect(prevPage);


}


export async function importPlayers(players: PlayerDB[]) {
    const existingPlayersImages = (await sql<ImageDB>`SELECT * FROM images`).rows;
    const existingPlayers = (await sql<PlayerDB>`SELECT * FROM players`).rows;
    try {
        const date = '2024-01-01T10:10:00.000Z';
        const playersToInsert = players.filter(p => !existingPlayers.find(ep => ep.phone_number === p.phone_number));
        const playersToUpdate = players.filter(p => existingPlayers.find(ep => ep.phone_number === p.phone_number));


        playersToInsert.forEach(p => {
            const existingImage = existingPlayersImages.find(ep => ep.phone_number === p.phone_number);
            if (existingImage){
                p.image_url = existingImage.image_url;
            } else  {
                p.image_url = '/players/default.png';
            }
        })

        const playersToInsertBatches = _.chunk(playersToInsert, 10);
        const playersToUpdateBatches = _.chunk(playersToUpdate, 10);

        //insert new players
        for (const batch of playersToInsertBatches) {
            await Promise.all(batch.map((player: PlayerDB) => sql`INSERT INTO players (name, phone_number, balance, notes, updated_at, image_url)
            VALUES (${player.name}, ${player.phone_number}, ${player.balance}, ${player.notes}, ${date}, ${player.image_url});`))
        }
        //update existing players
        for (const batch of playersToUpdateBatches) {
            await Promise.all(batch.map((player: PlayerDB) => sql`UPDATE players SET balance = ${player.balance}, name=${player.name}, notes=${player.notes}, updated_at=${date} WHERE phone_number= ${player.phone_number})`))
        }
        const archive = 'ארכיון'
        for (const batch of playersToInsertBatches) {
            await Promise.all(batch.map((player: PlayerDB) => {
                sql`DELETE FROM history WHERE phone_number= ${player.phone_number}`
            }))
        }
        for (const batch of playersToInsertBatches) {
            await Promise.all(batch.map((player: PlayerDB) => {
                sql`INSERT INTO history (phone_number, change, note, type, updated_at)
                VALUES (${player.phone_number}, ${player.balance}, ${archive}, 'credit', ${date})`
            }))
        }

        for (const batch of playersToUpdateBatches) {
            await Promise.all(batch.map((player: PlayerDB) => sql`UPDATE history SET change = ${player.balance} WHERE phone_number = ${player.phone_number} AND type = 'credit' AND note = ${archive}`))
        }
        revalidatePath('/dashboard');
        redirect('/dashboard');
    } catch (error) {
        console.error('## importPlayers error', error)
        return {
            message: 'Database Error: Failed to import Players.',
        };
    }

}

export async function resetAllPlayersAndHistory() {
    try {
        await sql`DELETE FROM history`;
        await sql`DELETE FROM players`;
    } catch (error) {
        console.error('## resetAllPlayersAndHistory error', error)
        return {
            message: 'Database Error: Failed to reset Players.',
        };
    }
    revalidatePath('/dashboard');
    redirect('/dashboard');
}


export async function createPlayerLog(player: PlayerForm, formData: FormData, prevPage:string ,usage: boolean, username?:string){
    const validatedFields = CreateUsageLog.safeParse({
        change: formData.get('change'),
        note: formData.get('note'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Player.',
        };
    }

    const change = validatedFields.data.change * (usage ? -1 : 1);
    const type = usage ? (formData.get('type') as string ?? 'prize') :  'credit' ;

    const currentBalance = player.balance;
    try
    {
        await sql`
      INSERT INTO history (phone_number, change, note, type, updated_by)
      VALUES (${player.phone_number}, ${change}, ${validatedFields.data.note}, ${type}, ${username ?? 'super-admin'})
    `;

    }catch(error){
        console.error('### create log error', error)
        return {
            message: 'Database Error: Failed to Create log.',
        };
    }
    if (type === 'credit' || type === 'prize') {
        const newBalance = currentBalance + change;
        try {
            const date = new Date().toISOString();

            await sql`
      UPDATE players
      SET balance = ${newBalance}, updated_at=${date}
      WHERE id = ${player.id}
    `;

        } catch (error) {
            console.error('## create log error', error)
            return {
                message: 'Database Error: Failed to update player balance on credit change.',
            };
        }
    }

    revalidatePath(prevPage);
    redirect(prevPage);
}

export async function createPlayerUsageLog(data : {player: PlayerForm, prevPage:string, username?: string}, _prevState: State, formData: FormData){
    return createPlayerLog(data.player, formData, data.prevPage, true, data.username);
}

export async function setPlayerPosition({playerId, prevPage}:{playerId: string, prevPage: string}, prevState: State, formData: FormData){
    const newPosition =  formData.get('position') as string;
    const newPositionNumber = Number(newPosition);

    if (isNaN(newPositionNumber) || newPositionNumber < 0){
         return {
              message: 'Invalid Position. Failed to set Player Position.',
         };
   }
    try {
        const date = (new Date()).toISOString().slice(0,10);
        const playerResult = await sql<PlayerDB>`SELECT * FROM players WHERE id = ${playerId}`;
        const player = playerResult.rows[0];
        if (!player){
            return {
                message: 'Invalid Position. Failed to find Player.',
            };
        }

        const today = (new Date()).toLocaleString('en-us', {weekday: 'long'});

        const todayTournamentResult = await sql<TournamentDB>`
      SELECT
        *
      FROM tournaments
      WHERE day = ${today};
    `;
        const todayTournament = todayTournamentResult.rows[0];
        const winnersResult = await sql<WinnerDB>`SELECT * FROM winners WHERE date = ${date}`;
        let winnersObject = winnersResult.rows[0];

        if (winnersObject){
            const newWinnersObject = {
                ...JSON.parse(winnersObject.winners),
                [player.phone_number]: newPositionNumber
            }
            await sql`UPDATE winners SET winners=${JSON.stringify(newWinnersObject)} WHERE date = ${date}`;

        }else{
            await sql`INSERT INTO winners (date, tournament_name, winners) VALUES (${date}, ${todayTournament.name}, ${JSON.stringify({ [player.phone_number]: newPositionNumber})})`;
        }

    } catch (error) {
        console.error('## create log error', error)
        return {
            message: 'Database Error: Failed to setPlayerPosition.',
        };
    }
    revalidatePath(prevPage);
    redirect(prevPage);
}

export async function setPlayerPrize({playerId, prevPage}:{playerId: string, prevPage: string}, prevState: State, formData: FormData){
    const newPrize =  formData.get('prize') as string;

    if (!newPrize){
         return {
              message: 'Invalid Prize. Failed to set Player Prize.',
         };
   }
    try {
        const playerResult = await sql<PlayerDB>`SELECT * FROM players WHERE id = ${playerId}`;
        const player = playerResult.rows[0];
        if (!player){
            return {
                message: 'Set Prize. Failed to find Player.',
            };
        }
        const today = (new Date()).toLocaleString('en-us', {weekday: 'long'});

        const todayTournamentResult = await sql<TournamentDB>`
      SELECT
        *
      FROM tournaments
      WHERE day = ${today};
    `;
        const todayTournament = todayTournamentResult.rows[0];
        const date = (new Date()).toISOString().slice(0,10);
        const todayTournamentData = `${todayTournament.name} ${date}`;
        await sql`INSERT INTO prizes (tournament, phone_number, prize) VALUES (${todayTournamentData}, ${player.phone_number}, ${newPrize})`;

    } catch (error) {
        console.error('## create log error', error)
        return {
            message: 'Database Error: Failed to setPlayerPrize.',
        };
    }
    revalidatePath(prevPage);
    redirect(prevPage);
}

export async function createPlayerNewCreditLog(data : {player: PlayerForm, prevPage:string}, _prevState: State, formData: FormData){
    return createPlayerLog(data.player, formData, data.prevPage, false, 'super-admin');
}
export async function updatePlayer(
    {id, prevPage}: {id: string, prevPage: string,},
    prevState: State,
    formData: FormData,
) {

    const validatedFields = UpdatePlayer.safeParse({
        name: formData.get('name'),
        notes: formData.get('notes'),
    });

    if (!validatedFields.success) {
        console.error('## updatePlayer error', validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Player.',
        };
    }
    const image_url = (formData.get('image_url') as string);

    const { name, notes } = validatedFields.data;

    try {
        if (image_url && image_url.length > 2 && image_url !== '/players/default.png'){
            const player = (await sql<PlayerDB>`SELECT * FROM players WHERE id = ${id}`).rows[0];
            if (player && player.image_url !== image_url){
                await sql`INSERT INTO images (phone_number, image_url) VALUES (${player.phone_number}, ${image_url})`;
            }
        }

    }  catch (error) {
        console.error('## add image error', error)
    }

    const date = new Date().toISOString();
    try {
        await sql`
      UPDATE players
      SET name = ${name}, image_url = ${image_url}, notes = ${notes}, updated_at=${date}
      WHERE id = ${id}
    `;
    } catch (error) {
        console.error('## updatePlayer error', error)
        return { message: 'Database Error: Failed to Update Player.' };
    }

    revalidatePath(prevPage);
    redirect(prevPage);
}

export async function updateTournament(
    id: string,
    prevState: State,
    formData: FormData,
) {

    const validatedFields = UpdateTournament.safeParse({
        name: formData.get('name'),
        buy_in: formData.get('buy_in'),
        re_buy: formData.get('re_buy'),
        max_players: formData.get('max_players'),
        rsvp_required: formData.get('rsvp_required'),
    });

    if (!validatedFields.success) {
        console.error('## updateTournament error', validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update tournament.',
        };
    }

    const { name, buy_in, re_buy, max_players, rsvp_required } = validatedFields.data;
    const date = new Date().toISOString();

    try {
        await sql`
      UPDATE tournaments
      SET name = ${name}, buy_in = ${buy_in},re_buy = ${re_buy},max_players = ${max_players},rsvp_required=${rsvp_required}, updated_at=${date}
      WHERE id = ${id}
    `;
    } catch (error) {
        console.error('## updateTournament error', error)
        return { message: 'Database Error: Failed to update Tournament.' };
    }

    revalidatePath('/dashboard/configurations/tournaments');
    redirect('/dashboard/configurations/tournaments');
}

export async function deletePlayer(id: string) {

    try {
        const playerResult  =await sql<PlayerDB>`SELECT * FROM players WHERE id = ${id}`;
        const player = playerResult.rows[0];
        if (!player) {
            return;
        }
        const {phone_number} = player;
        await sql`DELETE FROM history WHERE phone_number = ${phone_number}`;
        await sql`DELETE FROM players WHERE id = ${id}`;
        revalidatePath('/dashboard/players');
        return { message: 'Deleted Player.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Player.' };
    }
}

export async function deletePrize( {id, prevPage}: {id: string, prevPage: string,},) {
    try {
        const prizeResult  =await sql<PrizeDB>`SELECT * FROM prizes WHERE id = ${id}`;
        const prize = prizeResult.rows[0];
        if (!prize) {
            return;
        }

        await sql`DELETE FROM prizes WHERE id = ${id}`;
        revalidatePath(prevPage);
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Player.' };
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
): Promise<string | undefined> {
    try {


        const phoneNumber = ((formData.get('email') as string) ?? '').trim().replaceAll('-','');
        formData.set('email', phoneNumber);
        await signIn('credentials', formData);
    } catch (error) {
        console.error('## authenticate error', error)
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'name or password is incorrect';
                default:
                    return 'An error occurred.';
            }
        }
        throw error;
    }
}

export async function signUp(
    prevState: string | undefined,
    formData: FormData,
): Promise<string | undefined> {
    const phoneNumber = ((formData.get('phone_number') as string) ?? '').trim().replaceAll('-','');
    const password = formData.get('password') as string;
    const userResult  = await sql<User>`SELECT * FROM users WHERE phone_number = ${phoneNumber}`;
    const existingUser = userResult.rows[0];
    if (existingUser) {
        return 'User with phone number already exists';
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await sql`
      INSERT INTO users (phone_number, password)
      VALUES (${phoneNumber}, ${hashedPassword})
    `;

    if (phoneNumber === '0524803571' || phoneNumber === '0524803577'){
        await sql`
      UPDATE users
      SET is_admin = true
      WHERE phone_number = ${phoneNumber}
    `;
    }
    revalidatePath('/signin');
    redirect('/signin');
    return;
}

export async function updateIsUserAdmin(id:string) {
    noStore();
    try {
        const users = await sql<User>`SELECT * FROM users WHERE id = ${id}`;
        const user = users.rows[0];
        await sql`UPDATE users SET is_admin = ${!user.is_admin} WHERE id = ${id}`;
    } catch (error) {
        console.error('Database Error:', error);
        return false;
    }
    redirect('/dashboard/configurations/users');
}


export async function updateIsUserWorker(id:string) {
    noStore();
    try {
        const users = await sql<User>`SELECT * FROM users WHERE id = ${id}`;
        const user = users.rows[0];
        await sql`UPDATE users SET is_worker = ${!user.is_worker} WHERE id = ${id}`;
    } catch (error) {
        console.error('Database Error:', error);
        return false;
    }
    redirect('/dashboard/configurations/users');
}


export async function rsvpPlayerForDay(phone_number:string, date:string, val: boolean, prevPage: string){
    noStore();
    try {
        const rsvpResult = await sql<RSVPDB>`SELECT * FROM rsvp WHERE phone_number = ${phone_number} AND date = ${date}`;
        const existingRsvp = rsvpResult.rows[0];

        if (val && existingRsvp){
            //already rsvp
            return;
        }
        if (!val && !existingRsvp){
            //already not rsvp
            return;
        }
         if (val && !existingRsvp){
             await sql`INSERT INTO rsvp (date, phone_number) VALUES (${date}, ${phone_number})`;

        }else{
             await sql`DELETE FROM rsvp WHERE id = ${existingRsvp.id}`;
         }

    } catch (error) {
        console.error('rsvpPlayerForDay Error:', error);
        return false;
    }

    revalidatePath(prevPage);
    redirect(prevPage);
}


export async function undoPlayerLastLog(phone_number:string){
    noStore();
    try {
        const logsResult = await sql<LogDB>`SELECT * FROM history WHERE phone_number = ${phone_number} ORDER BY updated_at DESC LIMIT 1`;
        const lastLog = logsResult.rows[0];

        if (lastLog){
             await sql`DELETE FROM history where id = ${lastLog.id}`;

        }
    } catch (error) {
        console.error('undoPlayerLastLog Error:', error);
        return false;
    }

    revalidatePath('/dashboard/currenttournament');
    redirect('/dashboard/currenttournament');
}
