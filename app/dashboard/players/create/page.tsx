import Form from '@/app/ui/players/create-form';
import Breadcrumbs from '@/app/ui/players/breadcrumbs';

export default async function Page() {

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'players', href: '/dashboard/players' },
                    {
                        label: 'Create player',
                        href: '/dashboard/players/create',
                        active: true,
                    },
                ]}
            />
            <Form redirectAddress={'/dashboard/players'}/>
        </main>
    );
}
