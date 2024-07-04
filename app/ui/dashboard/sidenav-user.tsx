import Link from 'next/link';
import RunnerLogo from '@/app/ui/runner-logo';
import {PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';
import {SignOutButton} from "@/app/ui/dashboard/sign-out-button";

export default function SideNavUser() {

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

            <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>

            <form
                action={async () => {
                    'use server';
                    await signOut();
                }}
            >
                <SignOutButton/>
            </form>
        </div>
    </div>
  );
}
