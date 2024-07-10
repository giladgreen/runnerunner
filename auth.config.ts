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
                console.log('## userFromDB', userFromDB)

                isAdmin = Boolean(userFromDB && userFromDB.is_admin);
                isWorker = Boolean(userFromDB && userFromDB.is_worker);
                userUUID = userFromDB?.id;
                if (userFromDB){
                    await sql`UPDATE last_connected_user SET phone_number = ${userFromDB.phone_number}, name = ${userFromDB.name}`;
                }
            }
            console.log('## loggedInUser', loggedInUser)
            console.log('## nextUrl.pathname', nextUrl.pathname)
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnWorker = nextUrl.pathname.startsWith('/worker');
            const isOnPersonal = nextUrl.pathname.startsWith('/personal');

            if (isOnDashboard) {
                return isAdmin;
            }

            if (isOnWorker) {
                if (isWorker && !nextUrl.pathname.includes(userUUID!)) {
                    return Response.redirect(new URL(`/worker/${userUUID}`, nextUrl));
                }
                return isWorker;
            }

            if (isOnPersonal) {
                return isLoggedIn;
            }

            if (isLoggedIn) {
                if (isAdmin) {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }

                if (isWorker) {
                    return Response.redirect(new URL(`/worker/${userUUID}`, nextUrl));
                }

                // @ts-ignore
                return Response.redirect(new URL(`/personal/${userUUID}`, nextUrl));
            }
            return true;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
