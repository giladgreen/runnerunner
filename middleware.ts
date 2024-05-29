import type { NextRequest } from 'next/server'
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
// export function middleware(request: NextRequest) {
//     const currentUser = request.cookies.get('currentUser')?.value
//     console.log('## currentUser', currentUser);
//     console.log('## request.nextUrl.pathname', request.nextUrl.pathname);
//     // if (currentUser && !request.nextUrl.pathname.startsWith('/dashboard')) {
//     //     console.log('redirecting to dashboard');
//     //     // return Response.redirect(new URL('/dashboard', request.url))
//     // }
//     //
//     // if (!currentUser && !request.nextUrl.pathname.startsWith('/login')) {
//     //     console.log('redirecting to login');
//     //
//     //     // return Response.redirect(new URL('/login', request.url))
//     // }
// }


export default NextAuth(authConfig).auth;

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
