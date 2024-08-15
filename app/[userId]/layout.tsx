import SideNav from '@/app/ui/client/SideNav';
import { fetchFeatureFlags, fetchUserById } from '@/app/lib/data';
import { signOut } from '@/auth';
import PlayerPageMenu from '@/app/ui/client/PlayerPageMenu';
import AdminPageMenu from '@/app/ui/client/AdminPageMenu';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { userId: string };
}) {
  const user = await fetchUserById(params.userId);
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;
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
            className="flex-grow p-6 md:overflow-y-auto md:p-12"
            style={{ paddingTop: 90 }}
          >
            {children}
          </div>
          <div className="player-header">
            <img
              src="/runner-white-logo.png"
              width={50}
              height={50}
              alt="runner"
            />
            <AdminPageMenu
              userId={params.userId}
              isAdmin={isAdmin}
              isWorker={isWorker}
              signout={async () => {
                'use server';

                await signOut({ redirect: true, redirectTo: '/' });
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  const { rsvpEnabled, playerRsvpEnabled } = await fetchFeatureFlags();
  const showRsvp = rsvpEnabled && playerRsvpEnabled;

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      <div className="player-header">
        <img src="/runner-white-logo.png" width={50} height={50} alt="runner" />
        <PlayerPageMenu
          showRsvp={showRsvp}
          userId={params.userId}
          signout={async () => {
            'use server';

            await signOut({ redirect: true, redirectTo: '/' });
          }}
        />
      </div>
    </div>
  );
}
