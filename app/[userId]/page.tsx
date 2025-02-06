import MVPPlayers from '@/app/ui/client/MVPPlayers';
import DebtPlayers from '@/app/ui/client/DebtPlayers';
import {
  fetchFeatureFlags,
  fetchRSVPAndArrivalData,
  fetchUserById,
  fetchWhalePlayersData,
} from '@/app/lib/data';
import GeneralPlayersCardWrapper from '@/app/ui/client/GeneralPlayersCardWrapper';
import PlayerPage from '@/app/ui/client/PlayerPage';
import { TournamentDB } from '@/app/lib/definitions';
import AdminHomePage from '@/app/ui/client/AdminHomePage';
import { getFinalTablePlayersContent } from '@/app/ui/client/helpers';
import { getDayOfTheWeek, getTodayShortDate } from '@/app/lib/serverDateUtils';
import WhalePlayers from '@/app/ui/client/WhalePlayers';

export default async function HomePage({
  params,
}: {
  params: { userId: string };
}) {


  const { prizesEnabled } = await fetchFeatureFlags();
  const user = await fetchUserById(params.userId);
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;

  if (isAdmin || isWorker) {
    const dayOfTheWeek = getDayOfTheWeek();

    const { todayTournaments } = await fetchRSVPAndArrivalData(dayOfTheWeek);
    const whales = await fetchWhalePlayersData();
    const hasWhales = whales && whales.length > 0;
    const date = getTodayShortDate();
    const contents: Array<JSX.Element | null> = await Promise.all(
      todayTournaments.map((t) =>
        getFinalTablePlayersContent(
          prizesEnabled,
          date,
          t.id,
          false,
          params.userId,
        ),
      ),
    );
    const todayTournamentsIds = todayTournaments.map((t) => t.id);
    return (
      <div>
        <AdminHomePage
          todayTournaments={todayTournaments as TournamentDB[]}
          contents={contents}
          userId={params.userId}
        />

        <GeneralPlayersCardWrapper />
        <div
          className={`rtl mt-6 grid grid-cols-1 gap-6 md:grid-cols-5 lg:grid-cols-${hasWhales ? 12 : 8}`}
        >
          <MVPPlayers
            userId={params.userId}
            tournamentsIds={todayTournamentsIds}
          />
          <DebtPlayers
            userId={params.userId}
            tournamentsIds={todayTournamentsIds}
          />
          {hasWhales && (
            <WhalePlayers
              userId={params.userId}
              tournamentsIds={todayTournamentsIds}
              whales={whales}
            />
          )}
        </div>
      </div>
    );
  }

  return <PlayerPage params={params} />;
}
