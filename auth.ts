import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { sql } from '@vercel/postgres';
import type { UserDB } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import * as cache from './app/lib/cache';
async function updateUserLastLoggedInDate(phone_number: string){



  await sql<UserDB>`UPDATE users SET last_logged_in_at = now(), logged_in_count=logged_in_count+1 WHERE phone_number=${phone_number} `;
  const user =  (await sql<UserDB>`SELECT * FROM users WHERE phone_number=${phone_number}`).rows[0];
  console.log(`
  
  user: ${JSON.stringify(user)}
  
  
  `)

  cache.saveUser(user);
}
async function getUserByPhoneNumber(
  phone_number: string,
): Promise<UserDB | undefined> {
  try {
    const usersResult =
      await sql<UserDB>`SELECT * FROM users WHERE phone_number=${phone_number}`;
    return usersResult.rows[0];
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

        if (passwordsMatch){
          updateUserLastLoggedInDate(phone_number);

          return { ...user, email: user.phone_number };
        }

        console.error('Error: Invalid credentials');
        return null;
      },
    }),
  ],
});
