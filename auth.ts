import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

async function getUserByPhoneNumber(phone_number: string): Promise<User | undefined> {
    try {
        const user = await sql<User>`SELECT * FROM users WHERE phone_number=${phone_number}`;
        return user.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {


                const phone_number = credentials.email as string;
                const password = credentials.password as string;
                const user = await getUserByPhoneNumber(phone_number);
                if (!user) return null;
                const passwordsMatch = await bcrypt.compare(password, user.password);
                if (passwordsMatch) return { ...user, email: user.phone_number};

                console.error('Error: Invalid credentials');
                return null;
            },
        }),
    ],
});
