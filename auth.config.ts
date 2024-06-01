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
            console.log('## loggedInUser', loggedInUser)
            const isLoggedIn = !!loggedInUser;
            let isAdmin: boolean = false;
            if (isLoggedIn) {
                const users = (await sql<User>`SELECT * FROM users`).rows;
                // @ts-ignore
                const userFromDB = users.find((user) => user.phone_number === loggedInUser!.email);
                isAdmin = Boolean(userFromDB && userFromDB.is_admin);
            }
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnPersonal = nextUrl.pathname.startsWith('/personal');
            console.log('## isAdmin', isAdmin)
            if (isOnDashboard) {
                return isAdmin;
            }else if (isOnPersonal) {
                return isLoggedIn;
            }else if (isLoggedIn) {
                if (isAdmin) {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }

                // @ts-ignore
                return Response.redirect(new URL(`/personal/${loggedInUser.email}`, nextUrl));
            }
            return true;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
