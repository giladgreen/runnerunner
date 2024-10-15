import Link from 'next/link';
import NavLinks from '@/app/ui/client/NavLinks';

import { signOut } from '@/auth';
import SignOutButton from '@/app/ui/client/SignOutButton';
import { fetchFeatureFlags, fetchUserById } from '@/app/lib/data';

export default async function SideNav({ userId }: { userId: string }) {
  const { prizesEnabled } = await fetchFeatureFlags();
  const user = await fetchUserById(userId);
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;
  const isRegularUser = !isAdmin && !isWorker;
  const homepage = `/${userId}`;
  return (
    <div className="fixed-side-nav rtl flex h-full flex-col px-3 py-4 md:px-2">
      <Link className="rounded-md bg-blue-600" href={homepage}>
        <div className="cellular" style={{ padding: 10 }}>
          <img
            src="/runner-white-logo.png"
            width={50}
            height={50}
            alt="runner"
          />
        </div>
        <div className="wide-screen">
          <img
            src="/runner-white-logo.png"
            width={166}
            height={166}
            alt="runner"
          />
        </div>
      </Link>

      <div
        style={{
          padding: 5,
          color: 'rgb(47, 111, 235)',
          textAlign: 'right',
        }}
      >
        <span style={{ color: 'black' }}>מחובר כ: </span>
        <b> {user.name ?? user.phone_number}</b>
      </div>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks user={user} prizesEnabled={prizesEnabled} />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <div
          className="cellular"
          style={{ width: isRegularUser ? '65vw' : '5vw' }}
        ></div>

        <SignOutButton
          signOut={async () => {
            'use server';

            await signOut({ redirect: true, redirectTo: '/' });
          }}
        />
      </div>
    </div>
  );
}
