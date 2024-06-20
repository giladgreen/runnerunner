import type { NextAuthConfig } from 'next-auth';
import {sql} from "@vercel/postgres";
import { User} from "@/app/lib/definitions";

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
                const usersResult = await sql<User>`SELECT * FROM users WHERE phone_number = ${loggedInUser!.email}`;
                const userFromDB = usersResult.rows[0];
                isAdmin = Boolean(userFromDB && userFromDB.is_admin);
                isWorker = Boolean(userFromDB && userFromDB.is_worker);
                userUUID = userFromDB?.id;
            }
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnWorker = nextUrl.pathname.startsWith('/worker');
            const isOnPersonal = nextUrl.pathname.startsWith('/personal');

            if (isOnDashboard) {
                return isAdmin;
            }

            if (isOnWorker) {
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
