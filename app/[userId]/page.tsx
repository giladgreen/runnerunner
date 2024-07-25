import MVPPlayers from '@/app/ui/client/MVPPlayers';
import DebtPlayers from '@/app/ui/client/DebtPlayers';
import { fetchFeatureFlags, fetchUserById } from '@/app/lib/data';
import TodayTournamentNameCardWrapper from '@/app/ui/client/TodayTournamentNameCardWrapper';
import RSVPAndArrivalCardWrapper from '@/app/ui/client/RSVPAndArrivalCardWrapper';
import FinalTablePlayers from '@/app/ui/client/FinalTablePlayers';
import GeneralPlayersCardWrapper from '@/app/ui/client/GeneralPlayersCardWrapper';
import PlayerPage from '@/app/ui/client/PlayerPage';

export default async function HomePage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await fetchUserById(params.userId);
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;
  const { placesEnabled } = await fetchFeatureFlags();

  if (isAdmin || isWorker) {
    return (
      <div>
        <div className="full-width flex w-full items-center justify-between">
          <TodayTournamentNameCardWrapper params={params} />
        </div>
        <RSVPAndArrivalCardWrapper params={params} />
        {placesEnabled && (
          <div style={{ marginTop: 40 }}>
            <FinalTablePlayers title="דירוג טורניר נוכחי" params={params} />
          </div>
        )}
        <hr style={{ marginBottom: 30, marginTop: 10 }} />
        <GeneralPlayersCardWrapper />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
          <MVPPlayers userId={params.userId} />
          <DebtPlayers userId={params.userId} />
        </div>
      </div>
    );
  }

  return <PlayerPage params={params} />;
}
