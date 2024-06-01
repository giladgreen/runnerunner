import Form from '@/app/ui/players/edit-template-form';
import Breadcrumbs from '@/app/ui/players/breadcrumbs';
import { fetchTemplateById} from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const template = await fetchTemplateById(id);
    if (!template) {
        notFound();
    }
    template.id = id;
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
            <Form template={template} />
        </main>
    );
}
