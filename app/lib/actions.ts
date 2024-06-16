'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import {PlayerDB, PlayerForm, User, TournamentDB, WinnerDB, RSVPDB} from "@/app/lib/definitions";
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
        buy_in?: string[];
        re_buy?: string[];
        max_players?: string[];
        rsvp_required?: string[];
    };
    message?: string | null;
};


export async function createReport(formData: FormData) {
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
console.log('## image_url', image_url)
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


export async function importPlayers(players: {name: string; phone_number: string; balance: number, notes:string }[]) {
    const existingPlayers = (await sql<PlayerDB>`SELECT * FROM players`).rows;
    try {
        const date = (new Date((new Date()).getTime() - 24 * 60 * 60 * 1000)).toISOString();
        const playersToInsert = players.filter(p => !existingPlayers.find(ep => ep.phone_number === p.phone_number));
        await Promise.all(
            playersToInsert.map(
                (player) => sql<PlayerDB>`
        INSERT INTO players (name, phone_number, balance, notes, updated_at)
        VALUES (${player.name}, ${player.phone_number}, ${player.balance}, ${player.notes}, ${date});
      `,
            ),
        );

        await Promise.all(
             playersToInsert.map(
                (player) => sql`
        INSERT INTO history (phone_number, change, note, type)
        VALUES (${player.phone_number}, ${player.balance}, 'imported balance', 'credit');
      `
            ),
        );
    } catch (error) {
        console.error('## importPlayers error', error)
        return {
            message: 'Database Error: Failed to import Players.',
        };
    }
    revalidatePath('/dashboard');
    redirect('/dashboard');
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

    if (isNaN(newPositionNumber) || newPositionNumber < 1){
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
