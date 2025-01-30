import SideNav from '@/app/ui/client/SideNav';
import { fetchFeatureFlags, fetchPlayerByUserId, fetchUserById } from '@/app/lib/data';
import { signOut } from '@/auth';
import AdminPageMenu from '@/app/ui/client/AdminPageMenu';
import React from 'react';
import ExitButton from '@/app/ui/client/ExitButton';
import PlayerHeaderLinkSection from '@/app/ui/client/PlayerHeaderLinkSection';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { userId: string };
}) {
  const [user, { prizesEnabled, playersSeeCreditEnabled }] =
    await Promise.all([fetchUserById(params.userId), fetchFeatureFlags()]);

  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;

  const isAdminPlayer = (isAdmin || isWorker) && user.is_player;
  if (isAdmin || isWorker) {
    return (
      <div>
        <div className="only-wide-screen flex h-screen flex-col md:flex-row md:overflow-hidden">
          <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
            {children}
          </div>
          <div className="w-full flex-none md:w-64">
            <SideNav userId={params.userId} />
          </div>
        </div>

        <div className="cellular flex h-screen flex-col md:flex-row md:overflow-hidden">
          <div
            className="flex-grow md:overflow-y-auto md:p-12 main-layout"
          >
            {children}
          </div>
          <div className="full-size-fixed-div">
            <div className="player-header ">

              <AdminPageMenu
                userId={params.userId}
                isAdmin={isAdmin}
                isWorker={isWorker}
                prizesEnabled={prizesEnabled}
                isAdminPlayer={isAdminPlayer}
                signout={async () => {
                  'use server';

                  await signOut({ redirect: true, redirectTo: '/' });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const player = await fetchPlayerByUserId(params.userId);


  const playerName = user.name ?? player?.name;

  return (
    <div className="player-pages flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="player-header-div">
        <ExitButton
          signout={async () => {
            'use server';
            await signOut({ redirect: true, redirectTo: '/' });
          }}
        />
        <div className="icon">
          <img src="/logo.png" width={177} height={120} />
        </div>
        <PlayerHeaderLinkSection userId={params.userId} playerName={playerName} player={player} playersSeeCreditEnabled={playersSeeCreditEnabled}/>

      </div>
      <div className="player-page-body flex-grow">{children}</div>
    </div>
  );
}
