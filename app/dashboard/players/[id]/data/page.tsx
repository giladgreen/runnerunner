import Breadcrumbs from '@/app/ui/players/breadcrumbs';
import { fetchPlayerById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import {formatCurrency, formatDateToLocal, getTime} from "@/app/lib/utils";
import Form from "@/app/ui/players/create-log-form";
import {TemplateDB} from "@/app/lib/definitions";
import {fetchTemplates} from "@/app/lib/actions";
import HistoryTable from "@/app/ui/players/history-table";

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const templates: TemplateDB[] = (await fetchTemplates()) as TemplateDB[];
    const player = await fetchPlayerById(id);
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
                        label: player.name,
                        img: player.image_url,
                        active: true
                    }
                ]}
            />
            <div>
                <div>Phone number: {player.phone_number}  </div>
                <div> {player.notes}  </div>
                <h1 style={{ zoom: 2 }}><b>Current Balance: {formatCurrency(player.balance)}</b></h1>
                <hr style={{marginTop: 10, marginBottom: 20}}/>
                <Form player={player} templates={templates}/>

                <hr style={{marginTop: 20, marginBottom: 20}}/>

                <HistoryTable player={player} isRestrictedData={false}/>
            </div>
        </main>
    );
}
