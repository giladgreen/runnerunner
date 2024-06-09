'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import {PlayerDB, PlayerForm, User, TemplateDB} from "@/app/lib/definitions";
import bcrypt from "bcrypt";
import {unstable_noStore as noStore} from "next/dist/server/web/spec-extension/unstable-no-store";

const FormSchema = z.object({
    id: z.string(),
    image_url: z.string(),
    name: z.string().min(1, 'name can not be left empty'),
    balance: z.coerce.number(),
    phone_number: z.string().min(1, 'name can not be left empty'),
    updated_at: z.string(),
    note: z.string().min(1, 'balance note can not be left empty'),
    notes: z.string(),
});
const CreatePlayer = FormSchema.omit({ id: true, updated_at: true });
const CreateUsageLog =  z.object({
    change: z.coerce.number(),
    note: z.string().min(1, 'change note can not be left empty'),
});

const UpdateTemplate =  z.object({
    amount: z.coerce.number(),
    template: z.string()
});

const UpdatePlayer = z.object({
    name: z.string().min(1, 'name can not be left empty'),
    notes: z.string(),
    sunday_rsvp: z.boolean().optional(),
    monday_rsvp: z.boolean().optional(),
    tuesday_rsvp: z.boolean().optional(),
    wednesday_rsvp: z.boolean().optional(),
    thursday_rsvp: z.boolean().optional(),
    saturday_rsvp: z.boolean().optional()
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
        template?: string[];
        amount?: string[];
        position?: string[];
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
        console.log('## createReport error', error)
        return {
            message: 'Database Error: Failed to Create report.',
        };
    }
    revalidatePath('/dashboard/configurations');
    redirect('/dashboard/configurations');
}
export async function createPlayer(redirectAddress: string, prevState: State, formData: FormData) {
    const sunday_rsvp = !!formData.get('sunday_rsvp');
    const monday_rsvp = !!formData.get('monday_rsvp');
    const tuesday_rsvp = !!formData.get('tuesday_rsvp');
    const wednesday_rsvp = !!formData.get('wednesday_rsvp');
    const thursday_rsvp = !!formData.get('thursday_rsvp');
    const saturday_rsvp = !!formData.get('saturday_rsvp');
    const name = formData.get('name') as string;
    const balance = formData.get('balance') as string;
    const note = formData.get('note') as string;
    const phone_number = formData.get('phone_number') as string;
    const notes = formData.get('notes') as string;
    const image_url = (formData.get('image_url') as string) ?? '/players/default.png'
    const phoneNumber = phone_number.replaceAll('-', '');

    try {
        await sql`
      INSERT INTO players (name, balance, phone_number, image_url, notes, sunday_rsvp, monday_rsvp, tuesday_rsvp, wednesday_rsvp, thursday_rsvp, saturday_rsvp)
      VALUES (${name}, ${balance}, ${phoneNumber}, ${image_url} , ${notes ?? ''}, ${sunday_rsvp}, ${monday_rsvp}, ${tuesday_rsvp}, ${wednesday_rsvp}, ${thursday_rsvp}, ${saturday_rsvp})
    `;

        await sql`
      INSERT INTO history (phone_number, change, note, type)
      VALUES (${phoneNumber}, ${balance}, ${note}, 'credit')
    `;

    } catch (error) {
        console.log('## createPlayer error', error)
        return {
            message: 'Database Error: Failed to Create Player.',
        };
    }
    revalidatePath(redirectAddress);
    redirect(redirectAddress);


}


export async function importPlayers(players: { name: string; phone_number: string; balance: number, notes:string }[]) {
    const existingPlayers = (await sql<PlayerDB>`SELECT * FROM players`).rows;
    try {
        const playersToInsert = players.filter(p => !existingPlayers.find(ep => ep.phone_number === p.phone_number));
        await Promise.all(
            playersToInsert.map(
                (player) => sql<PlayerDB>`
        INSERT INTO players (name, phone_number, balance, notes)
        VALUES (${player.name}, ${player.phone_number}, ${player.balance}, ${player.notes});
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
        console.log('## importPlayers error', error)
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
        console.log('## all history deleted')
        await sql`DELETE FROM players`;
        console.log('## all history players')
    } catch (error) {
        console.log('## resetAllPlayersAndHistory error', error)
        return {
            message: 'Database Error: Failed to reset Players.',
        };
    }
    revalidatePath('/dashboard');
    redirect('/dashboard');
}


export async function createPlayerLog(player: PlayerForm, prevState: State, formData: FormData, redirectAddress:string ,usage: boolean = true){
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
      INSERT INTO history (phone_number, change, note, type)
      VALUES (${player.phone_number}, ${change}, ${validatedFields.data.note}, ${type})
    `;
    }catch(error){
        console.log('### create log error', error)
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
            console.log('## create log error', error)
            return {
                message: 'Database Error: Failed to update player balance on credit change.',
            };
        }
    }

    revalidatePath(redirectAddress);
    redirect(redirectAddress);
}

export async function createPlayerUsageLog(data : {player: PlayerForm, redirectAddress:string}, prevState: State, formData: FormData){
    return createPlayerLog(data.player, prevState, formData, data.redirectAddress, true);
}

export async function setPlayerPosition(playerId: string, prevState: State, formData: FormData){
   const newPosition =  formData.get('position') as string;
    try {
        const date = new Date().toISOString();

        await sql`
      UPDATE players
      SET position = ${newPosition}, updated_at=${date}
      WHERE id = ${playerId}
    `;

    } catch (error) {
        console.log('## create log error', error)
        return {
            message: 'Database Error: Failed to setPlayerPosition.',
        };
    }
    revalidatePath('/dashboard/todayplayers');
    redirect('/dashboard/todayplayers');
}
export async function fetchFinalTablePlayers() {
    try {
        const allPlayersResult = await sql<PlayerDB>`SELECT * FROM players WHERE position > 0 ORDER BY position ASC`;
        return allPlayersResult.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch final table players data.');
    }
}


export async function createPlayerNewCreditLog(data : {player: PlayerForm, redirectAddress:string}, prevState: State, formData: FormData){
    return createPlayerLog(data.player, prevState, formData, data.redirectAddress, false);
}
export async function updatePlayer(
    {id, redirectAddress}: {id: string, redirectAddress: string,},
    prevState: State,
    formData: FormData,
) {

    const validatedFields = UpdatePlayer.safeParse({
        name: formData.get('name'),
        notes: formData.get('notes'),
    });

    if (!validatedFields.success) {
        console.log('## updatePlayer error', validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Player.',
        };
    }
    const sunday_rsvp = !!formData.get('sunday_rsvp');
    const monday_rsvp = !!formData.get('monday_rsvp');
    const tuesday_rsvp = !!formData.get('tuesday_rsvp');
    const wednesday_rsvp = !!formData.get('wednesday_rsvp');
    const thursday_rsvp = !!formData.get('thursday_rsvp');
    const saturday_rsvp = !!formData.get('saturday_rsvp');
    const image_url = (formData.get('image_url') as string);

    const { name, notes } = validatedFields.data;

    const date = new Date().toISOString();
    try {
        await sql`
      UPDATE players
      SET name = ${name}, image_url = ${image_url}, notes = ${notes}, updated_at=${date} , sunday_rsvp = ${sunday_rsvp}, monday_rsvp = ${monday_rsvp}, tuesday_rsvp = ${tuesday_rsvp}, wednesday_rsvp = ${wednesday_rsvp}, thursday_rsvp = ${thursday_rsvp}, saturday_rsvp = ${saturday_rsvp}
      WHERE id = ${id}
    `;
    } catch (error) {
        console.log('## updatePlayer error', error)
        return { message: 'Database Error: Failed to Update Player.' };
    }

    revalidatePath(redirectAddress);
    redirect(redirectAddress);
}
export async function updateTemplate(
    id: string,
    prevState: State,
    formData: FormData,
) {

    const validatedFields = UpdateTemplate.safeParse({
        template: formData.get('template'),
        amount: formData.get('amount'),
    });

    if (!validatedFields.success) {
        console.log('## updateTemplate error', validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Template.',
        };
    }

    const { template, amount } = validatedFields.data;
    const date = new Date().toISOString();

    try {
        await sql`
      UPDATE templates
      SET template = ${template}, amount = ${amount}, updated_at=${date}
      WHERE id = ${id}
    `;
    } catch (error) {
        console.log('## updateTemplate error', error)
        return { message: 'Database Error: Failed to Update Template.' };
    }

    revalidatePath('/dashboard/configurations');
    redirect('/dashboard/configurations');
}

export async function fetchTemplates(

) {

    try {
        const data = await sql<TemplateDB>`
      SELECT * FROM templates ORDER BY i ASC
     `;

        return data.rows;
    } catch (error) {
        console.log('## fetchTemplates error', error)
        return { message: 'Database Error: Failed to fetch Templates .' };
    }
}


export async function resetAllRsvp() {
    try {
        await sql`UPDATE players SET sunday_rsvp = false, monday_rsvp = false, tuesday_rsvp = false, wednesday_rsvp = false, thursday_rsvp = false, saturday_rsvp = false`;
    } catch (error) {
        return { message: 'Database Error: Failed to resetAllRsvp.' };
    }
    revalidatePath('/dashboard/players');
    redirect('/dashboard/players');
}
export async function resetPlayersPositions() {

    try {
        await sql`UPDATE players SET position = '0' WHERE position > 0`;

    } catch (error) {
        return { message: 'Database Error: Failed to resetPlayersPositions.' };
    }
    revalidatePath('/dashboard/todayplayers');
    redirect('/dashboard/todayplayers');
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
        console.log('## error', error)
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
    redirect('/dashboard/users');
}


export async function rsvpPlayerForDay(phone_number:string, rsvpAttribute: string, val: boolean, prevPage: string){
    noStore();
    const playerResult = await sql<PlayerDB>`SELECT * FROM players WHERE phone_number = ${phone_number}`;
    const player = playerResult.rows[0]
    try {
        // @ts-ignore
        await sql`UPDATE players SET sunday_rsvp = ${rsvpAttribute === 'sunday_rsvp' ? val : player['sunday_rsvp'] as boolean}, monday_rsvp = ${rsvpAttribute === 'monday_rsvp' ? val : player['monday_rsvp'] as boolean}, tuesday_rsvp = ${rsvpAttribute === 'tuesday_rsvp' ? val : player['tuesday_rsvp'] as boolean}, wednesday_rsvp = ${rsvpAttribute === 'wednesday_rsvp' ? val : player['wednesday_rsvp'] as boolean}, thursday_rsvp = ${rsvpAttribute === 'thursday_rsvp' ? val : player['thursday_rsvp'] as boolean}, saturday_rsvp = ${rsvpAttribute === 'saturday_rsvp' ? val : player['saturday_rsvp'] as boolean} where phone_number = ${phone_number};`;
    } catch (error) {
        console.error('rsvpPlayerForDay Error:', error);
        return false;
    }

    revalidatePath(prevPage);
    redirect(prevPage);
}
