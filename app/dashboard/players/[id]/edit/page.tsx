import Form from '@/app/ui/players/edit-form';
import Breadcrumbs from '@/app/ui/players/breadcrumbs';
import { fetchPlayerById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [player] = await Promise.all([
        fetchPlayerById(id),

    ]);
    if (!player) {
        notFound();
    }
    player.id = id;
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'players', href: '/dashboard/players' },
                    {
                        label: 'Edit player',
                        href: `/dashboard/players/${id}/edit`,
                        active: true,
                    },
                    {
                        label: player.name,
                        img: player.image_url,
                        active: true
                    }
                ]}
            />
            <Form player={player} />
        </main>
    );
}
