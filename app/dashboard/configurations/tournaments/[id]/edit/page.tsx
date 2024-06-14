import EditTournamentForm from '@/app/ui/players/edit-tournament-form';
import Breadcrumbs from '@/app/ui/players/breadcrumbs';
import {fetchTournamentByDay} from '@/app/lib/data';
import { notFound } from 'next/navigation';
export default async function Page({ params }: { params: { id: string } }) {
    const dayOfTheWeek = params.id;
    const tournament = await fetchTournamentByDay(dayOfTheWeek);
    if (!tournament) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'dashboard', href: '/dashboard' },
                    {
                        label: 'Configurations',
                        href: `/dashboard/Configurations`,
                    }
                ]}
            />
            <EditTournamentForm tournament={tournament} />
        </main>
    );
}
