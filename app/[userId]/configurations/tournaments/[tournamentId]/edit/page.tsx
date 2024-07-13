import EditTournamentForm from '@/app/ui/client/EditTournamentForm';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';
import { fetchTournamentByDay } from '@/app/lib/data';
export default async function tournamentEditPage({
  params,
}: {
  params: { userId: string; tournamentId: string };
}) {
  const dayOfTheWeek = params.tournamentId;

  const tournament = await fetchTournamentByDay(
    dayOfTheWeek.slice(0, 1).toUpperCase() +
      dayOfTheWeek.slice(1).toLowerCase(),
  );

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: '.', href: `/${params.userId}` },
          {
            label: 'Configurations',
            href: `/${params.userId}/configurations`,
          },
          {
            label: 'Tournament',
            href: `/${params.userId}/configurations/tournament`,
          },
        ]}
      />
      <EditTournamentForm
        tournament={tournament}
        prevPage={`/${params.userId}/configurations/tournaments`}
        userId={params.userId}
      />
    </main>
  );
}
