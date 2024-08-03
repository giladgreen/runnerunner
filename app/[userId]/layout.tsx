import SideNav from '@/app/ui/client/SideNav';
import {fetchUserById} from "@/app/lib/data";
import {signOut} from "@/auth";
import PlayerPageMenu from "@/app/ui/client/PlayerPageMenu";

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
            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
                <div className="cellular rtl">
                    <SideNav userId={params.userId} />
                </div>
                <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
                <div className="only-wide-screen w-full flex-none md:w-64">
                    <SideNav userId={params.userId} />
                </div>
            </div>
        );
    }


  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="player-header">
            <img
                src="/runner-white-logo.png"
                width={50}
                height={50}
                alt="runner"
            />
            <PlayerPageMenu signout={async () => {
                'use server';

                await signOut({ redirect: true, redirectTo: '/' });
            }}
            />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
