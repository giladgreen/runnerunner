import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import RunnerLogo from '@/app/ui/runner-logo';

import { signOut } from '@/auth';
import {SignOutButton} from "@/app/ui/dashboard/sign-out-button";

export default async function SidenavAdmin() {
     const user = {name:'',phone_number:''};
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <RunnerLogo />
        </div>
      </Link>
        <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
            <div style={{paddingLeft: 10, paddingBottom: 10, color: 'rgb(47, 111, 235)'}}>
                <b>connected: {user.name ?? user.phone_number}</b>
            </div>
            <NavLinks/>
            <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
            <form
                action={async () => {
                    'use server';

                    await signOut({redirect: true, redirectTo: '/'});
                }}
            >
                <SignOutButton/>
            </form>
        </div>
    </div>
  );
}
