import Link from 'next/link';
import NavLinks from '@/app/ui/client/NavLinks';
import { Tooltip } from 'flowbite-react';
import {version} from '@/package.json';
import { signOut } from '@/auth';
import SignOutButton from '@/app/ui/client/SignOutButton';
import { fetchFeatureFlags, fetchUserById } from '@/app/lib/data';

export default async function SideNav({ userId }: { userId: string }) {
  const { prizesEnabled } = await fetchFeatureFlags();
  const user = await fetchUserById(userId);
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;
  const showVersion = user.phone_number === '0587869910';
  const isRegularUser = !isAdmin && !isWorker;
  const homepage = `/${userId}`;
  const appVersion = `version: ${version}`;
  return (
    <div className="fixed-side-nav rtl flex h-full flex-col px-3 py-4 md:px-2">
      <Link className="icon-background rounded-md" href={homepage}>
        <div className="cellular" style={{ padding: 10 }}>
          <img src="/logo.png" width={50} height={50} alt="runner" />
        </div>
        <div className="wide-screen" style={{ padding: '10px 0' }}>
          <img
            src="/logo.png"
            width={166}
            height={166}
            alt="runner"
            style={{ marginRight: 30 }}
          />
        </div>
      </Link>

      <div className="user-logged-in">
        {showVersion ? (
          <Tooltip
            placement={'left'}
            content={ appVersion}
            color="primary"
          >
            <span style={{ color: 'black' }}>מחובר כ: </span>

            <b> {user.name ?? user.phone_number}</b>
          </Tooltip>
        ) : (
          <div>
            <span style={{ color: 'black' }}>מחובר כ: </span>
            <b> {user.name ?? user.phone_number}</b>
          </div>
        )}
      </div>
      <div className="flex grow flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks user={user} prizesEnabled={prizesEnabled} />
        <div className=" h-auto w-full grow rounded-md md:block"></div>
        <div
          className="cellular"
          style={{ width: isRegularUser ? '65vw' : '5vw' }}
        ></div>

        <SignOutButton
          signOut={async () => {
            'use server';
            console.log('user is signing out..');
            await signOut({ redirect: true, redirectTo: '/' });
            console.log('after sign out');
          }}
        />
      </div>
    </div>
  );
}
