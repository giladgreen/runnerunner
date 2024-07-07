'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import fetch  from 'node-fetch';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import {
    PlayerDB,
    PlayerForm,
    UserDB,
    TournamentDB,
    WinnerDB,
    RSVPDB,
    ImageDB,
    LogDB,
    PrizeDB
} from "@/app/lib/definitions";
import bcrypt from "bcrypt";
import {unstable_noStore as noStore} from "next/dist/server/web/spec-extension/unstable-no-store";
const DAY = 24 * 60 * 60 * 1000;
const TARGET_MAIL = 'green.gilad+runner@gmail.com'
let clearOldRsvpLastRun = (new Date('2024-06-15T10:00:00.000Z')).getTime();

const ADMINS =  ['0587869910','0524803571','0524803577','0508874068'];
const WORKERS =  ['0526841902'];

const phoneToName = {
    '0587869910': 'גלעד גרין',
    '0524803571': 'אבי אסרף',
    '0524803577': 'עוז',
    '0508874068': 'מירי',
    '0526841902': 'דניאל',
};


function sendEmail(to: string, subject: string, body: string){

    const auth =  {
        user: process.env.EMAIL_ADDRESS,
            pass: process.env.GMAIL_APP_PASSWORD,
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth
    });

    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to,
        subject,
        text: body
    };
    console.log('## sending email to:', to)
    console.log('## subject:', subject)
    console.log('## body:', body)
    if (process.env.LOCAL==='true'){
        console.log('## skipping sending email locally')
        return;
    }
    transporter.sendMail(mailOptions, function(error: any, info: { response: string; }){
        if (error) {
            console.error('error sending mail:',error.message);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

export async function removeOldRsvp(){
    const now = (new Date()).getTime();
    if (now - clearOldRsvpLastRun < DAY){
        return;
    }
    try {
        console.log('## remove Old Rsvp')
        await sql`DELETE FROM rsvp WHERE created_at < now() - interval '48 hour'`;
        clearOldRsvpLastRun = (new Date()).getTime();
    } catch (error) {
        console.error('rsvpPlayerForDay Error:', error);
    }
}


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

function startTransaction(){
    return sql`BEGIN;`;
}

function commitTransaction(){
    return sql`COMMIT;`;

}

function cancelTransaction(){
    return sql`ROLLBACK;`;

}


function insertIntoBugs(description: string){
    return sql`INSERT INTO bugs (description) VALUES (${description})`;
}

function insertIntoImages(phoneNumber: string, imageUrls:string){
    return sql`INSERT INTO images (phone_number, image_url) VALUES (${phoneNumber}, ${imageUrls})`;
}

function insertIntoHistory(phoneNumber: string, balance:number, note = '', type = 'credit'){
    return sql`
      INSERT INTO history (phone_number, change, note, type)
      VALUES (${phoneNumber}, ${balance}, ${note}, ${type})
    `;
}
async function touchPlayer(phoneNumber: string){
    return sql`UPDATE players SET updated_at=${new Date().toISOString()} WHERE phone_number = ${phoneNumber}`;
}

async function insertIntoPlayers(name: string, balance:number, phoneNumber:string, imageUrl: string, note:string, notes?:string){
    try {
        await startTransaction();
        await sql`
          INSERT INTO players (name, phone_number, image_url, notes)
          VALUES (${name}, ${phoneNumber}, ${imageUrl} , ${notes ?? ''})
        `;

        await insertIntoHistory(phoneNumber, balance, note, 'credit');
        await commitTransaction();
    } catch (e) {
        await cancelTransaction();
        throw e;
    }
}

export async function createReport(formData: FormData) {
    const description = formData.get('description') as string;
    try {
        await insertIntoBugs(description);
        sendEmail(TARGET_MAIL, 'New bug report', description);
    } catch (error) {
        console.error('## createReport error', error)
        return {
            message: 'Database Error: Failed to Create report.',
        };
    }

    revalidatePath('/dashboard/configurations');//TODO: if worker need to return to a different url
    redirect('/dashboard/configurations');
}

export async function createPlayer(prevPage: string, _prevState: State, formData: FormData) {
    const name = formData.get('name') as string;
    const balance = formData.get('balance') as string;
    const note = formData.get('note') as string ?? '';
    const phone_number = formData.get('phone_number') as string;
    const notes = formData.get('notes') as string ?? '';
    let image_url = (formData.get('image_url') as string) ?? '/players/default.png'
    const phoneNumber = phone_number.replaceAll('-', '');

    if (!image_url || image_url.trim().length < 7){
        image_url = '/players/default.png';
    }
    try {
        if (image_url !== '/players/default.png'){
            await insertIntoImages (phoneNumber,image_url);
        }
    }  catch (error) {
        console.error('## failed to add image', error)
    }
    try {
        await insertIntoPlayers(name, Number(balance), phoneNumber, image_url,note, notes);
        sendEmail(TARGET_MAIL, 'New player created', `player name: ${name}
phone: ${phone_number}`)
    } catch (error) {
        console.error('## createPlayer error', error)
        return {
            message: 'Database Error: Failed to Create Player.',
        };
    }

    revalidatePath(prevPage);
    redirect(prevPage);
}

async function getPlayerByPhoneNumber(phoneNumber: string){
    const playersResult = await sql<PlayerDB>`SELECT * FROM players AS P 
JOIN (SELECT phone_number, sum(change) AS balance FROM history WHERE phone_number = ${phoneNumber} AND (type = 'credit_to_other' OR type ='credit') GROUP BY phone_number) AS H
ON P.phone_number = H.phone_number
WHERE P.phone_number = ${phoneNumber};`;

    const player =  playersResult.rows[0] ?? null;
    if (player){
        player.balance = Number(player.balance)
    }
    return player;
}
async function getPlayerById(playerId:string){
    const playerResult = await sql<PlayerDB>`SELECT * FROM players AS P 
JOIN (SELECT phone_number, sum(change) AS balance FROM history WHERE type = 'credit_to_other' OR type ='credit' GROUP BY phone_number) AS H
ON P.phone_number = H.phone_number
WHERE P.id = ${playerId};`;

    const player =  playerResult?.rows[0] ?? null;
    if (player){
        player.balance = Number(player.balance)
    }
    return player
}

async function handleCreditByOther(type: string, otherPlayerPhoneNumber: string, change:number, note:string, player:PlayerForm){
    let otherPlayer;
    let useOtherPlayerCredit;
    let historyNote;
    let otherHistoryNote;

    if (type === 'credit_by_other'){
        if (!otherPlayerPhoneNumber){
            console.error('### did npt get other person data')
            return {
                message: 'did npt get other person data.',
            };
        }
        otherPlayer = await getPlayerByPhoneNumber(otherPlayerPhoneNumber as string)
        if (!otherPlayer){
            console.error('### did not find other person data')
            return {
                message: 'did not find other person data.',
            };
        }
        useOtherPlayerCredit = true;
        historyNote = `${note}
(על חשבון ${otherPlayer.name} ${otherPlayer.phone_number} ) `;

        otherHistoryNote = `${note}
(לטובת ${player.name} ${player.phone_number} ) `;
    }

    return {
        otherPlayer: otherPlayer as unknown as PlayerDB,
        useOtherPlayerCredit,
        historyNote,
        otherHistoryNote
    }
}

async function getUserName(user: { userName?:string, phoneNumber?:string}){
    let username = user.userName;
    if (user.phoneNumber){
        const userResult = await sql<UserDB>`SELECT * FROM users WHERE phone_number = ${user.phoneNumber}`;
        const userFromDB = userResult.rows[0];
        if (userFromDB){
            username = userFromDB.name ?? username ?? user.phoneNumber;
        }
    }
    return username ?? 'unknown';
}

export async function createPlayerLog(player: PlayerForm, formData: FormData, prevPage:string ,usage: boolean, user: { userName?:string, phoneNumber?:string}){
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

    const username = await getUserName(user);
    const change = validatedFields.data.change * (usage ? -1 : 1);

    let type = usage ? (formData.get('type') as string ?? 'prize') :  'credit' ;
    console.log('## type:', type)
    const otherPlayerPhoneNumber = formData.get('other_player') as string;
    const  {
        otherPlayer,
        useOtherPlayerCredit,
        historyNote,
        otherHistoryNote,
        message
    } = await handleCreditByOther(type, otherPlayerPhoneNumber, change, validatedFields.data.note, player);
    if (message){
        return {
            message,
        };
    }

    try
    {
        await startTransaction();
        if (useOtherPlayerCredit){
            await sql`
              INSERT INTO history (phone_number, change, note, type, updated_by, other_player_phone_number)
              VALUES 
              (${player.phone_number}, ${0}, ${ historyNote}, ${'credit_by_other'}, ${username}, ${otherPlayerPhoneNumber as string}),
              (${otherPlayerPhoneNumber as string}, ${change}, ${otherHistoryNote}, ${'credit_to_other'}, ${username}, '')
            `;

        } else {
            await sql`
              INSERT INTO history (phone_number, change, note, type, updated_by)
              VALUES (${player.phone_number}, ${change}, ${validatedFields.data.note}, ${type}, ${username})
            `;
        }
        const date = new Date().toISOString();
        const playerPhoneToUpdate = useOtherPlayerCredit && otherPlayer ? otherPlayer.phone_number: player.phone_number;
        await touchPlayer(playerPhoneToUpdate);

        await commitTransaction();
    } catch(error) {
        await cancelTransaction();
        console.error('### create log error', error)
        return {
            message: 'Database Error: Failed to Create log.',
        };
    }

    revalidatePath(prevPage);
    redirect(prevPage);
}

export async function createPlayerUsageLog(data : {player: PlayerForm, prevPage:string, username?: string, phoneNumber?: string}, _prevState: State, formData: FormData){
    return createPlayerLog(data.player, formData, data.prevPage, true, { userName: data.username, phoneNumber: data.phoneNumber});
}

export async function createPlayerNewCreditLog(data : {player: PlayerForm, prevPage:string, phoneNumber: string}, _prevState: State, formData: FormData){
    return createPlayerLog(data.player, formData, data.prevPage, false, { phoneNumber: data.phoneNumber});
}

export async function setPlayerPosition({playerId, prevPage}:{playerId: string, prevPage: string}, _prevState: State, formData: FormData){
    const newPosition = Number(formData.get('position') as string);

    if (isNaN(newPosition) || newPosition < 0){
         return {
              message: 'Invalid Position. Failed to set Player Position.',
         };
    }
    try {
        const date = (new Date()).toISOString().slice(0,10);
        const today = (new Date()).toLocaleString('en-us', {weekday: 'long'});

        const player = await getPlayerById(playerId);
        if (!player){
            return {
                message: 'Invalid Position. Failed to find Player.',
            };
        }

        const [todayTournamentResult, winnersResult] = await Promise.all([
            sql<TournamentDB>`SELECT * FROM tournaments WHERE day = ${today};`, sql<WinnerDB>`SELECT * FROM winners WHERE date = ${date}`]);

        const todayTournament = todayTournamentResult.rows[0];
        let winnersObject = winnersResult.rows[0];

        if (winnersObject){
            const newWinnersObject = {
                ...JSON.parse(winnersObject.winners),
                [player.phone_number]: {
                    position: newPosition,
                    hasReceived: false,
                }
            }
            if (newPosition == 0){
                delete newWinnersObject[player.phone_number];
            }
            await sql`UPDATE winners SET winners=${JSON.stringify(newWinnersObject)} WHERE date = ${date}`;

        }else{
            const newWinnersObject = { [player.phone_number]: {position: newPosition, hasReceived: false}};
            await sql`INSERT INTO winners (date, tournament_name, winners) VALUES (${date}, ${todayTournament.name}, ${JSON.stringify(newWinnersObject)})`;
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

export async function givePlayerPrizeOrCredit({stringDate, playerId,userPhoneNumber, prevPage}:{stringDate?:string, userPhoneNumber?:string, playerId: string, prevPage: string}, _prevState: State, formData: FormData){
    try {
        await startTransaction();
        const player = await getPlayerById(playerId);
        if (!player) {
            console.error('## givePlayerPrizeOrCredit Failed to find player')
            return {
                message: 'Failed to find player.',
            };
        }

        const type = formData.get('type') as string;
        const credit = formData.get('credit') as string;
        const date = stringDate ?? (new Date()).toISOString().slice(0, 10);
        const day = (new Date(date)).toLocaleString('en-us', {weekday: 'long'});

        const [tournamentResult, winnersResult] = await Promise.all([
            sql<TournamentDB>`SELECT * FROM tournaments WHERE day = ${day};`, sql<WinnerDB>`SELECT * FROM winners WHERE date = ${date}`]);

        const winners = winnersResult.rows[0];
        if (!winners) {
            console.error('## givePlayerPrizeOrCredit Failed to find winners in DB')
            return {
                message: 'Failed to find winners in DB.',
            };
        }
        const winnersObject = JSON.parse(winners.winners);
        const newWinnersObject = {...winnersObject};
        const playerObject = winnersObject[player.phone_number];
        if (!playerObject) {
            console.error('## givePlayerPrizeOrCredit Failed to find player in winners object')
            return {
                message: 'Failed to find player in winners object.',
            };
        }
        const position = playerObject.position;
        const hasReceived = playerObject.hasReceived;
        if (hasReceived) {
            console.error('## givePlayerPrizeOrCredit Player has already received prize')
            return {
                message: 'Player has already received prize.',
            };
        }
        const tournament = tournamentResult.rows[0];
        const tournamentName = tournament.name;

        if (type === 'credit') {
            const amount = Number(credit);
            if (isNaN(amount) || amount < 1){
                console.error('## givePlayerPrizeOrCredit Invalid credit amount:', credit)
                return {
                    message: 'Invalid credit amount.',
                };
            }

            const note = `#${position} - מקום ${tournamentName}`;

            try {
                await touchPlayer(player.phone_number);
                const userResult = userPhoneNumber ? (await sql<UserDB>`SELECT * FROM users WHERE phone_number = ${userPhoneNumber}`).rows[0] : null;
                await sql`
          INSERT INTO history (phone_number, change, note, type, updated_by)
          VALUES (${player.phone_number}, ${amount}, ${note}, 'credit', ${userResult?.name ?? 'unknown'})
        `;
            } catch (e) {
                console.error('## givePlayerPrizeOrCredit error', e)
                await cancelTransaction();
                throw e;
            }

        }

        newWinnersObject[player.phone_number] = {
            ...playerObject,
            hasReceived: true,
        }


        await sql`UPDATE winners SET winners=${JSON.stringify(newWinnersObject)} WHERE date = ${winners.date}`;

        await commitTransaction();
        revalidatePath(prevPage);
        redirect(prevPage);
    }catch(error){
        console.error('## givePlayerPrizeOrCredit error', error);
        await cancelTransaction();
        return {
            message: 'Database Error: Failed to givePlayerPrizeOrCredit.',
        };
    }
}
export async function setPlayerPrize({playerId, prevPage}:{playerId: string, prevPage: string}, _prevState: State, formData: FormData){
    const newPrize =  formData.get('prize') as string;

    if (!newPrize){
         return {
              message: 'Invalid Prize. Failed to set Player Prize.',
         };
   }
    try {
        const player = await getPlayerById(playerId);
        if (!player){
            return {
                message: 'Set Prize. Failed to find Player.',
            };
        }
        const today = (new Date()).toLocaleString('en-us', {weekday: 'long'});

        const todayTournamentResult = await sql<TournamentDB>`SELECT * FROM tournaments WHERE day = ${today};`;
        const todayTournament = todayTournamentResult.rows[0];
        const date = (new Date()).toISOString().slice(0,10);
        const todayTournamentData = `${todayTournament.name} ${date}`;
        await sql`INSERT INTO prizes (tournament, phone_number, prize) VALUES (${todayTournamentData}, ${player.phone_number}, ${newPrize})`;
        revalidatePath(prevPage);
        redirect(prevPage);
    } catch (error) {
        console.error('## create log error', error)
        return {
            message: 'Database Error: Failed to setPlayerPrize.',
        };
    }

}


export async function updatePlayer(
    {id, prevPage}: {id: string, prevPage: string,},
    _prevState: State,
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
            const player = await getPlayerById(id)
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
      SET name = ${name},
      image_url = ${image_url},
      notes = ${notes}, 
      updated_at=${date}
      WHERE id = ${id} `;

        revalidatePath(prevPage);
        redirect(prevPage);
    } catch (error) {
        console.error('## updatePlayer error', error)
        return { message: 'Database Error: Failed to Update Player.' };
    }


}

export async function updateTournament(
    id: string,
    _prevState: State,
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
        sendEmail(TARGET_MAIL, 'tournaments update', `name: ${name}, buy_in: ${buy_in}, re_buy: ${re_buy}, max_players: ${max_players}, rsvp_required: ${rsvp_required}`)

        revalidatePath('/dashboard/configurations/tournaments');
        redirect('/dashboard/configurations/tournaments');
    } catch (error) {
        console.error('## updateTournament error', error)
        return { message: 'Database Error: Failed to update Tournament.' };
    }


}

export async function deletePlayer(id: string) {

    try {
        await startTransaction();

        const player = await getPlayerById(id);
        if (!player) {
            return;
        }
        const {phone_number} = player;
        await sql`DELETE FROM history WHERE phone_number = ${phone_number}`;
        await sql`DELETE FROM players WHERE id = ${id}`;
        await commitTransaction();
        sendEmail(TARGET_MAIL, 'player deleted', `name: ${player.name}, phone: ${player}   image: ${player.image_url}  notes: ${player.notes}`)

        revalidatePath('/dashboard/players');

    } catch (error) {
        await cancelTransaction();
        return { message: 'Database Error: Failed to Delete Player.' };
    }
}

export async function deletePrize( {id, prevPage}: {id: string, prevPage: string,}) {
    try {
        await sql`DELETE FROM prizes WHERE id = ${id}`;
        revalidatePath(prevPage);
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Player.' };
    }
}

export async function authenticate(
    _prevState: string | undefined,
    formData: FormData,
): Promise<string | undefined> {
    try {
        let phoneNumber = ((formData.get('email') as string) ?? '').trim().replaceAll('-','');
        phoneNumber = `${phoneNumber.startsWith('0') ? '' :'0'}${phoneNumber}`;
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
    user_json_url:string,
    _prevState: string | undefined,
    formData: FormData,
): Promise<string | undefined> {
    let user_phone_number;
    if (user_json_url){
        const response = await fetch(user_json_url,  { method: "Get" })
        // @ts-ignore
        user_phone_number = (await response.json()).user_phone_number as string;
    } else{
        user_phone_number = formData.get('phone_number') as string;
    }

    const phoneNumber = `${user_phone_number.startsWith('0') ? '' :'0'}${user_phone_number}`;

    const password = formData.get('password') as string;
    const userResult  = await sql<UserDB>`SELECT * FROM users WHERE phone_number = ${phoneNumber}`;
    const existingPlayer = await getPlayerByPhoneNumber(phoneNumber);
    const existingUser = userResult.rows[0];
    if (existingUser) {
        return 'User with phone number already exists';
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin = ADMINS.includes(phoneNumber);
    const isWorker = WORKERS.includes(phoneNumber);
    // @ts-ignore
    const name = phoneToName[phoneNumber] ? phoneToName[phoneNumber] as string :  existingPlayer?.name ?? '--';
    await sql`
      INSERT INTO users (phone_number, password, name, is_admin, is_worker)
      VALUES (${phoneNumber}, ${hashedPassword}, ${name}, ${isAdmin}, ${isWorker})
    `;
    sendEmail(TARGET_MAIL, 'New user created', `phone: ${phoneNumber}  ${existingPlayer?.name ? `name: ${existingPlayer?.name}`:''}`)

    const signInFormData = new FormData();
    signInFormData.set('email', phoneNumber);
    signInFormData.set('password', password);
    await signIn('credentials', signInFormData);
    redirect(`/`);
}

export async function updateFFValue(name:string, newValue:boolean) {
    noStore();
    try {
        await sql`UPDATE feature_flags SET is_open = ${newValue} WHERE flag_name = ${name}`;
        revalidatePath('/dashboard/configurations/flags');
        redirect('/dashboard/configurations/flags');
    } catch (error) {
        console.error('Database updateFFValue Error:', error);
        return false;
    }

}

export async function updateIsUserAdmin(id:string) {
    noStore();
    try {
        const users = await sql<UserDB>`SELECT * FROM users WHERE id = ${id}`;
        const user = users.rows[0];

        if (ADMINS.includes(user.phone_number)) {
            return;
        }
        await sql`UPDATE users SET is_admin = ${!user.is_admin} WHERE id = ${id}`;
        redirect('/dashboard/configurations/users');

    } catch (error) {
        console.error('Database Error:', error);
        return false;
    }
}


export async function updateIsUserWorker(id:string) {
    noStore();
    try {
        const users = await sql<UserDB>`SELECT * FROM users WHERE id = ${id}`;
        const user = users.rows[0];
        await sql`UPDATE users SET is_worker = ${!user.is_worker} WHERE id = ${id}`;
        redirect('/dashboard/configurations/users');
    } catch (error) {
        console.error('Database Error:', error);
        return false;
    }
}



export async function deleteUser(id:string) {
    noStore();
    try {
        const users = await sql<UserDB>`SELECT * FROM users WHERE id = ${id}`;
        const user = users.rows[0];

        if (user.is_admin || user.is_worker) {
            return;
        }
        await sql`DELETE FROM users WHERE id = ${id}`;
        redirect('/dashboard/configurations/users');

    } catch (error) {
        console.error('Database Error:', error);
        return false;
    }
}


export async function rsvpPlayerForDay(phone_number:string, date:string, val: boolean, prevPage: string){
    noStore();
    try {
        // await removeOldRsvp();

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
        revalidatePath(prevPage);
        redirect(prevPage);
    } catch (error) {
        console.error('rsvpPlayerForDay Error:', error);
        return false;
    }


}


export async function undoPlayerLastLog(phone_number:string, prevPage: string){
    noStore();
    let otherPlayerPhoneNumber;
    try {
        await startTransaction();
        const logsResult = await sql<LogDB>`SELECT * FROM history WHERE phone_number = ${phone_number} AND type != 'credit_to_other' ORDER BY updated_at DESC LIMIT 1`;
        const lastLog = logsResult.rows[0];

        if (lastLog){
            const amount = lastLog.change;
            const type = lastLog.type;

            if (amount === 0 && type === 'credit_by_other'){
                otherPlayerPhoneNumber =  lastLog.other_player_phone_number
            }

            if (amount < 0 && lastLog.type === 'credit') {
                await touchPlayer(phone_number);
            }
            await sql`DELETE FROM history where id = ${lastLog.id}`;
            if (otherPlayerPhoneNumber){
                const otherPlayerLogsResult = await sql<LogDB>`SELECT * FROM history WHERE phone_number = ${otherPlayerPhoneNumber} AND type = 'credit_to_other' ORDER BY updated_at DESC LIMIT 1`;
                const otherPlayerLastLog = otherPlayerLogsResult.rows[0];

                if (otherPlayerLastLog){
                    const otherPlayerAmount = otherPlayerLastLog.change;
                    if (otherPlayerAmount < 0) {
                        await touchPlayer(otherPlayerPhoneNumber);
                    }

                    await sql`DELETE FROM history where id = ${otherPlayerLastLog.id}`;
                }
            }
        }
        await commitTransaction();
        revalidatePath(prevPage);
        redirect(prevPage);
    } catch (error) {
        await cancelTransaction();
        console.error('undoPlayerLastLog Error:', error);
    }
}


export async function importPlayers(playersToInsert: PlayerDB[]) {
    try {
        await sql`BEGIN;`

        await sql`DELETE from history;`
        await sql`DELETE from players;`


        console.log('## import step: 1 - get existing DB data')
        const existingPlayersImages = (await sql<ImageDB>`SELECT * FROM images`).rows;

        console.log('## import step: 2 - insert NEW data')

        const date = '2024-01-01T10:10:00.000Z';
        console.log(`## playersToInsert ${playersToInsert.length}`)

        playersToInsert.forEach(p => {
            const existingImage = existingPlayersImages.find(ep => ep.phone_number === p.phone_number);
            if (existingImage){
                p.image_url = existingImage.image_url;
            } else  {
                p.image_url = '/players/default.png';
            }
        })

        const arr = playersToInsert.map((player) => ({ ...player, updated_at: date }));

        await sql.query(
            `INSERT INTO players (name, phone_number, notes, updated_at, image_url)
     SELECT name, phone_number, notes, updated_at, image_url FROM json_populate_recordset(NULL::players, $1)`,
            [JSON.stringify(arr)]
        );

        const arr2 = playersToInsert.map((player) => ({ ...player,change:player.balance, updated_at: date, note: 'ארכיון', type: 'credit', archive: true }));

        await sql.query(
            `INSERT INTO history (phone_number, change, note, type, updated_at, archive)
     SELECT phone_number, change, note, type, updated_at, archive FROM json_populate_recordset(NULL::history, $1)`,
            [JSON.stringify(arr2)]
        );


        await sql`COMMIT;`
        console.log('## import Done')
        sendEmail(TARGET_MAIL, 'Import is done', `inserted ${playersToInsert.length} players`);
        redirect('/')
    } catch (error) {
        await sql`ROLLBACK;`
        // @ts-ignore
        console.log(`## import error: ${error.message}`)

        console.log('## Rollback Done')
        return {
            message: 'Database Error: Failed to import Players.',
        };
    }


}
