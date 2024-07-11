import EditPlayerForm from '@/app/ui/client/EditPlayerForm';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';
import {fetchFeatureFlags, fetchPlayerById, fetchTournaments, fetchUserById} from '@/app/lib/data';
import {formatCurrency} from "@/app/lib/utils";
import CreateLogForm from "@/app/ui/client/CreateLogForm";
import HistoryTable from "@/app/ui/client/HistoryTable";
import TournamentsHistoryTable from "@/app/ui/client/TournamentsHistoryTable";
import PlayersPrizesPage from "@/app/[userId]/prizes/PlayersPrizesPage";
import NotFound from "@/app/[userId]/players/[playerId]/edit/NotFound";
import React from "react";

export default async function EditPlayerPage({ params }: { params: { userId:string, playerId: string } }) {
    const user = await fetchUserById(params.userId);
    const isAdmin = user.is_admin;
    const isWorker = user.is_worker;
    if (!isAdmin && !isWorker) {
        return (
            <div className="w-full">
                <div className="flex w-full items-center justify-between">
                    <h1 className="text-2xl"><b><u>You do not have permissions to see this page</u></b></h1>
                </div>
            </div>);
    }

    const playerId = params.playerId;
    const { rsvpEnabled} = await fetchFeatureFlags();
    const tournaments = await fetchTournaments();
    const player = await fetchPlayerById(playerId, true);

    if (!player) {
        return <NotFound params={params} />;
    }
    player.id = playerId;
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'players', href: `/${params.userId}/players`},
                    {
                        label: 'Edit player',
                        href: `/${params.userId}/players/${playerId}/edit`,
                        active: true,
                    },
                    {
                        label: player.name,
                        img: player.image_url,
                        active: true
                    }
                ]}
            />
            <EditPlayerForm player={player} tournaments={tournaments} rsvpEnabled={Boolean(rsvpEnabled)} userId={params.userId}/>
            <div>
                <div>Phone number: {player.phone_number}  </div>
                <div> {player.notes}  </div>
                <h1 style={{zoom: 2}}><b>Current Balance: {formatCurrency(player.balance)}</b></h1>


                <hr style={{marginTop: 10, marginBottom: 20}}/>
                <CreateLogForm player={player} prevPage={`/${params.userId}/players`} userId={params.userId}/>

                <hr style={{marginTop: 20, marginBottom: 20}}/>

                <HistoryTable player={player} isRestrictedData={false}/>

                <TournamentsHistoryTable player={player}/>

                <div style={{marginTop:50}}>
                    <PlayersPrizesPage playerPhone={player.phone_number} />
                </div>
            </div>
        </main>
    );
}
