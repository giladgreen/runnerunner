'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';


const FormSchema = z.object({
    id: z.string(),
    image_url: z.string(),
    name: z.string().min(1, 'name can not be left empty'),
    balance: z.coerce.number(),
    phone_number: z.string().min(1, 'name can not be left empty'),
    updated_at: z.string(),
    reason: z.string(),
});
const CreatePlayer = FormSchema.omit({ id: true, updated_at: true, image_url: true });
const UpdatePlayer = FormSchema.omit({ id: true, updated_at: true, image_url: true, balance:true, reason: true });
export type State = {
    errors?: {
        name?: string[];
        balance?: string[];
        phone_number?: string[];
        reason?: string[];
    };
    message?: string | null;
};

async function validateAdmin(){

}
export async function createPlayer(prevState: State, formData: FormData) {
    await validateAdmin();
    const validatedFields = CreatePlayer.safeParse({
        name: formData.get('name'),
        balance: formData.get('balance'),
        phone_number: formData.get('phone_number'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Player.',
        };
    }

    const {  name, balance, phone_number } = validatedFields.data;
    const phoneNumber = phone_number.replaceAll('-', '');

    const updated_at = new Date().toISOString().split('T')[0];

    try {
        await sql`
      INSERT INTO players (name, balance, phone_number, updated_at, image_url)
      VALUES (${name}, ${balance}, ${phoneNumber}, ${updated_at}, '/players/default.png')
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


export async function updatePlayer(
    id: string,
    prevState: State,
    formData: FormData,
) {
    await validateAdmin();
    console.log('## updatePlayer id', id)
    console.log('## updatePlayer formData', formData)

    const validatedFields = UpdatePlayer.safeParse({
        name: formData.get('name'),
        phone_number: formData.get('phone_number'),
    });

    if (!validatedFields.success) {
        console.log('## updatePlayer error', validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Player.',
        };
    }

    const { name, phone_number } = validatedFields.data;
    const date = new Date().toISOString().split('T')[0];
    const phoneNumber = phone_number.replaceAll('-', '');
    console.log('## updatePlayer id', id)

    try {
        await sql`
      UPDATE players
      SET name = ${name}, phone_number = ${phoneNumber}, updated_at=${date}
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
