import type { NextAuthConfig } from 'next-auth';
import { sql } from '@vercel/postgres';
import { UserDB } from '@/app/lib/definitions';

export const authConfig = {
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    authorized: async ({ auth, request: { nextUrl } }) => {
      const loggedInUser = auth?.user;
      const isLoggedIn = !!loggedInUser;
      let isAdmin: boolean = false;
      let isWorker: boolean = false;
      let userUUID: string | undefined = undefined;
      if (isLoggedIn) {
        const usersResult =
          await sql<UserDB>`SELECT * FROM users WHERE phone_number = ${
            loggedInUser!.email
          }`;
        const userFromDB = usersResult.rows[0];
        isAdmin = userFromDB?.is_admin;
        isWorker = userFromDB?.is_worker;
        //  console.log('## userFromDB', userFromDB)
        userUUID = userFromDB?.id;
      }
      if (userUUID ==='undefined') {
        return false;
      }
      if (isLoggedIn && !nextUrl.pathname.includes(userUUID!)) {
        return Response.redirect(
          new URL(
            `/${userUUID}${isAdmin || isWorker ? '/current_tournament' : '/player_registration'}`,
            nextUrl,
          ),
        );
      }

      if (!isLoggedIn && nextUrl.pathname.length > 40) {
        return false;
      }



      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
