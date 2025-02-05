import EditTournamentForm from '@/app/ui/client/EditTournamentForm';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';
import { fetchTournamentByTournamentId } from '@/app/lib/data';
export default async function tournamentEditPage({
  params,
}: {
  params: { userId: string; tournamentId: string };
}) {
  const tournament = await fetchTournamentByTournamentId(params.tournamentId);
  if (!tournament) {
    return null;
  }
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
            href: `/${params.userId}/configurations/tournaments`,
          },
          {
            label: tournament.name,
            href: `/${params.userId}/configurations/tournaments/${tournament.id}/edit`,
            active: true,
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
