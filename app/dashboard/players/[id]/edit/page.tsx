import Form from '@/app/ui/players/edit-form';
import Breadcrumbs from '@/app/ui/players/breadcrumbs';
import {fetchFeatureFlags, fetchPlayerById, fetchTournaments} from '@/app/lib/data';
import { notFound } from 'next/navigation';
import {formatCurrency} from "@/app/lib/utils";
import CreateLogForm from "@/app/ui/players/create-log-form";
import HistoryTable from "@/app/ui/players/history-table";

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const { rsvpEnabled} = await fetchFeatureFlags();
    const tournaments = await fetchTournaments();
    const player = await fetchPlayerById(id);

    if (!player) {
        notFound();
    }
    player.id = id;
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'players', href: '/dashboard/players'},
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
            <Form player={player} prevPage={'/dashboard/players'} tournaments={tournaments} rsvpEnabled={Boolean(rsvpEnabled)}/>
            <div>
                <div>Phone number: {player.phone_number}  </div>
                <div> {player.notes}  </div>
                <h1 style={{zoom: 2}}><b>Current Balance: {formatCurrency(player.balance)}</b></h1>
                <hr style={{marginTop: 10, marginBottom: 20}}/>
                <CreateLogForm player={player}/>

                <hr style={{marginTop: 20, marginBottom: 20}}/>

                <HistoryTable player={player} isRestrictedData={false}/>
            </div>
        </main>
    );
}
