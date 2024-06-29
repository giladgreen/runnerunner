import CreatePlayerForm from '@/app/ui/players/create-form';
import Breadcrumbs from '@/app/ui/players/breadcrumbs';

export default async function Page() {

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: `today's players`, href: '/dashboard/currenttournament' },
                    {
                        label: 'Create player',
                        href: '/dashboard/players/create',
                        active: true,
                    },
                ]}
            />
            <CreatePlayerForm prevPage="/dashboard/currenttournament"/>
        </main>
    );
}
