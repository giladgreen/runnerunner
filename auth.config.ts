import type { NextAuthConfig } from 'next-auth';
import {sql} from "@vercel/postgres";
import { UserDB} from "@/app/lib/definitions";

export const authConfig = {
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        authorized: async ({ auth, request: { nextUrl } }) =>{
            const loggedInUser = auth?.user;

            const isLoggedIn = !!loggedInUser;
            let isAdmin: boolean = false;
            let isWorker: boolean = false;
            let userUUID: string | undefined = undefined;

            if (isLoggedIn) {
                const usersResult = await sql<UserDB>`SELECT * FROM users WHERE phone_number = ${loggedInUser!.email}`;
                const userFromDB = usersResult.rows[0];
              //  console.log('## userFromDB', userFromDB)
                userUUID = userFromDB?.id;
            }
            // console.log('## loggedInUser', loggedInUser)
            // console.log('## nextUrl.pathname', nextUrl.pathname)

            if (isLoggedIn && !nextUrl.pathname.includes(userUUID!)) {
                return Response.redirect(new URL(`/${userUUID}`, nextUrl));
            }

            return true;


        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
