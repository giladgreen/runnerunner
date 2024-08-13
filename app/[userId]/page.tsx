import MVPPlayers from '@/app/ui/client/MVPPlayers';
import DebtPlayers from '@/app/ui/client/DebtPlayers';
import { fetchRSVPAndArrivalData, fetchUserById } from '@/app/lib/data';
import GeneralPlayersCardWrapper from '@/app/ui/client/GeneralPlayersCardWrapper';
import PlayerPage from '@/app/ui/client/PlayerPage';
import { TournamentDB } from '@/app/lib/definitions';
import AdminHomePage from '@/app/ui/client/AdminHomePage';
import { getFinalTablePlayersContent } from '@/app/ui/client/helpers';
import {getDayOfTheWeek, getTodayShortDate} from "@/app/lib/serverDateUtils";

export default async function HomePage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await fetchUserById(params.userId);
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;

  if (isAdmin || isWorker) {
      const dayOfTheWeek = getDayOfTheWeek();

      const { todayTournaments } = await fetchRSVPAndArrivalData(dayOfTheWeek);

    const date = getTodayShortDate();
    const contents: Array<JSX.Element | null> = await Promise.all(
      todayTournaments.map((t) =>
        getFinalTablePlayersContent(date, t.id, false, params.userId),
      ),
    );

    return (
      <div>
        <AdminHomePage
          todayTournaments={todayTournaments as TournamentDB[]}
          contents={contents}
        />

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
