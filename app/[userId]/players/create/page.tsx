import CreatePlayerForm from '@/app/ui/client/CreatePlayerForm';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';

export default async function CreatePlayerPage({ params }: { params: { userId: string } }) {

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'players', href: `/${params.userId}/players` },
                    {
                        label: 'Create player',
                        href: `/${params.userId}/players/create`,
                        active: true,
                    },
                ]}
            />
            <CreatePlayerForm userId={params.userId} prevPage={`/${params.userId}/players`}/>
        </main>
    );
}
