'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import {PlayerForm} from "@/app/lib/definitions";


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
const CreateCreditLog =  z.object({
    change: z.coerce.number(),
    note: z.string().min(1, 'change note can not be left empty'),
});
const UpdatePlayer = FormSchema.omit({ id: true, updated_at: true, image_url: true, balance:true, note: true , phone_number: true });
export type State = {
    errors?: {
        name?: string[];
        balance?: string[];
        change?: string[];
        phone_number?: string[];
        note?: string[];
        notes?: string[];
        description?: string[];
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
    redirect('/dashboard');
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

    const {  name, balance, note, phone_number, notes } = validatedFields.data;
    const phoneNumber = phone_number.replaceAll('-', '');

    try {
        await sql`
      INSERT INTO players (name, balance, phone_number, image_url, notes)
      VALUES (${name}, ${balance}, ${phoneNumber}, '/players/default.png', ${notes ?? ''})
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
    const currentBalance = player.balance;
    const newBalance = currentBalance + change;
    try {
        await sql`
      INSERT INTO history (phone_number, change, note)
      VALUES (${player.phone_number}, ${change}, ${validatedFields.data.note})
    `;
        const date = new Date().toISOString();
        await sql`
      UPDATE players
      SET balance = ${newBalance}, updated_at=${date}
      WHERE id = ${player.id}
    `;

    } catch (error) {
        console.log('## create log error', error)
        return {
            message: 'Database Error: Failed to Create log.',
        };
    }
    revalidatePath('/dashboard/players');
  //  redirect('/dashboard/players');


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

    const { name, notes } = validatedFields.data;
    const date = new Date().toISOString();

    try {
        await sql`
      UPDATE players
      SET name = ${name}, notes = ${notes}, updated_at=${date}
      WHERE id = ${id}
    `;
    } catch (error) {
        console.log('## updatePlayer error', error)
        return { message: 'Database Error: Failed to Update Player.' };
    }

    revalidatePath('/dashboard/players');
    redirect('/dashboard/players');
}

export async function deletePlayer(id: string) {
    await validateAdmin();

    try {
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
        await signIn('credentials', formData);
    } catch (error) {
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
