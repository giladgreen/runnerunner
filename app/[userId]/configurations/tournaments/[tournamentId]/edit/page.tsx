import EditTournamentForm from '@/app/ui/client/EditTournamentForm';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';
import { fetchTournamentByTournamentId } from '@/app/lib/data';
export default async function tournamentEditPage({
  params,
}: {
  params: { userId: string; tournamentId: string };
}) {
  const tournament = await fetchTournamentByTournamentId(
      params.tournamentId
  );

  return (
    <main className="rtl">
      <Breadcrumbs
        breadcrumbs={[
          { label: '.', href: `/${params.userId}` },
          {
            label: 'הגדרות',
            href: `/${params.userId}/configurations`,
          },
          {
            label: 'טורנירים',
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
