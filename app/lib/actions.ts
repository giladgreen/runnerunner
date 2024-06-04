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
const CreatePlayer = FormSchema.omit({ id: true, updated_at: true, image_url: true });
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
    };
    message?: string | null;
};

async function validateAdmin(){

}
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
export async function createPlayer(prevState: State, formData: FormData) {
    await validateAdmin();
    const validatedFields = CreatePlayer.safeParse({
        name: formData.get('name'),
        balance: formData.get('balance'),
        note: formData.get('note'),
        notes: formData.get('notes'),
        phone_number: formData.get('phone_number'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Player.',
        };
    }
    const sunday_rsvp = !!formData.get('sunday_rsvp');
    const monday_rsvp = !!formData.get('monday_rsvp');
    const tuesday_rsvp = !!formData.get('tuesday_rsvp');
    const wednesday_rsvp = !!formData.get('wednesday_rsvp');
    const thursday_rsvp = !!formData.get('thursday_rsvp');
    const saturday_rsvp = !!formData.get('saturday_rsvp');
    const {  name, balance, note, phone_number, notes } = validatedFields.data;
    const phoneNumber = phone_number.replaceAll('-', '');

    try {
        await sql`
      INSERT INTO players (name, balance, phone_number, image_url, notes, sunday_rsvp, monday_rsvp, tuesday_rsvp, wednesday_rsvp, thursday_rsvp, saturday_rsvp)
      VALUES (${name}, ${balance}, ${phoneNumber}, '/players/default.png', ${notes ?? ''}, ${sunday_rsvp}, ${monday_rsvp}, ${tuesday_rsvp}, ${wednesday_rsvp}, ${thursday_rsvp}, ${saturday_rsvp})
    `;

        await sql`
      INSERT INTO history (phone_number, change, note)
      VALUES (${phoneNumber}, ${balance}, ${note})
    `;

    } catch (error) {
        console.log('## createPlayer error', error)
        return {
            message: 'Database Error: Failed to Create Player.',
        };
    }
    revalidatePath('/dashboard/players');
    redirect('/dashboard/players');


}


export async function importPlayers(players: { name: string; phone_number: string; balance: number, notes:string }[]) {
    await validateAdmin();
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
        INSERT INTO history (phone_number, change, note)
        VALUES (${player.phone_number}, ${player.balance}, 'imported balance');
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


export async function createPlayerLog(player: PlayerForm, prevState: State, formData: FormData, usage: boolean = true){
    await validateAdmin();
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
    const type = usage ? formData.get('type') as string :  'credit' ;
    const currentBalance = player.balance;
    try{
        await sql`
      INSERT INTO history (phone_number, change, note, type)
      VALUES (${player.phone_number}, ${change}, ${validatedFields.data.note}, ${type})
    `;
    }catch(error){
        console.log('## create log error', error)
        return {
            message: 'Database Error: Failed to Create log.',
        };
    }
    if (type === 'credit') {
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

    revalidatePath('/dashboard/players');
}

export async function createPlayerUsageLog(player: PlayerForm, prevState: State, formData: FormData){

    return createPlayerLog(player, prevState, formData, true);
}
export async function createPlayerNewCreditLog(player: PlayerForm, prevState: State, formData: FormData){
    return createPlayerLog(player, prevState, formData, false);
}
export async function updatePlayer(
    id: string,
    prevState: State,
    formData: FormData,
) {
    await validateAdmin();

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

    const { name, notes } = validatedFields.data;

    const date = new Date().toISOString();
    try {
        await sql`
      UPDATE players
      SET name = ${name}, notes = ${notes}, updated_at=${date} , sunday_rsvp = ${sunday_rsvp}, monday_rsvp = ${monday_rsvp}, tuesday_rsvp = ${tuesday_rsvp}, wednesday_rsvp = ${wednesday_rsvp}, thursday_rsvp = ${thursday_rsvp}, saturday_rsvp = ${saturday_rsvp}
      WHERE id = ${id}
    `;
    } catch (error) {
        console.log('## updatePlayer error', error)
        return { message: 'Database Error: Failed to Update Player.' };
    }

    revalidatePath('/dashboard/players');
    redirect('/dashboard/players');
}
export async function updateTemplate(
    id: string,
    prevState: State,
    formData: FormData,
) {
    await validateAdmin();

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
    await validateAdmin();

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
    await validateAdmin();

    try {
        await sql`UPDATE players SET sunday_rsvp = false, monday_rsvp = false, tuesday_rsvp = false, wednesday_rsvp = false, thursday_rsvp = false, saturday_rsvp = false`;
    } catch (error) {
        return { message: 'Database Error: Failed to resetAllRsvp.' };
    }
    revalidatePath('/dashboard/players');
    redirect('/dashboard/players');
}
export async function deletePlayer(id: string) {
    await validateAdmin();

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

