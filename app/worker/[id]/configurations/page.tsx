import {
    fetchAllBugs,
    fetchAllPlayersForExport,
    fetchFinalTablePlayers, fetchPlayersPrizes, fetchTournamentByDay,
    fetchUserById
} from "@/app/lib/data";
import {ExportPlayers} from "@/app/ui/players/client-buttons";
import {BugDB, PlayerDB, PrizeDB, TournamentDB} from "@/app/lib/definitions";
import React from "react";
import CreateBugForm from "@/app/ui/players/create-bug-form";
import {formatDateToLocal} from "@/app/lib/utils";
import SideNavWorker from "@/app/ui/dashboard/sidenav-worker";
import {notFound} from "next/navigation";

function Seperator() {
    return <div className="config-seperator"/>
}

function ExportPlayersButton({players, playersPlaces, tournament, prizes, worker}: { players: PlayerDB[], playersPlaces: PlayerDB[],tournament: TournamentDB, prizes: PrizeDB[], worker?: boolean }) {
    return <div className="config-section">
        <div style={{marginBottom: 20}}><b>Export players data to CSV file { !worker ? '+ current tournament places' :''}</b></div>
        <ExportPlayers players={players as PlayerDB[]} playersPlaces={playersPlaces} worker={worker}  tournament={tournament} prizes={prizes}/>
    </div>
}

function ReportBugForm({bugs}: { bugs: BugDB[] }) {
    return <div className="config-section" style={{marginTop: 130}}>
        <h1 className="text-2xl">Report a bug</h1>
        <CreateBugForm/>
        <hr style={{marginTop: 20, marginBottom: 10}}/>
        <div>
            <div>
                <u>{bugs.length > 0 ? 'Known bugs:' : ''}</u>
            </div>
            <div>
                {bugs.map((bug) => (
                    <div key={bug.id} style={{marginTop: 20}}>
                        <div>
                            <div>
                                reported: {formatDateToLocal(bug.updated_at)}
                            </div>
                            <div>
                                {bug.description}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
}


export default async function Page({ params, searchParams }: { params: { id: string }, searchParams?: {
        query?: string;
    } }) {
    const connectedUserId = params.id;
    const user = await fetchUserById(connectedUserId);
    if (!user) {
        notFound();
    }

    const bugs = await fetchAllBugs();
    const players = await fetchAllPlayersForExport();
    const playersPlaces = await fetchFinalTablePlayers();
    const tournament = await fetchTournamentByDay();
    const prizes = await fetchPlayersPrizes();
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNavWorker username={user.name!} userId={user.id!}/>
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">

                <div className="config-section">
                    <b>Configurations</b>
                </div>
                <Seperator/>
                <ExportPlayersButton players={players} playersPlaces={playersPlaces}  tournament={tournament} prizes={prizes} worker/>
                <Seperator/>
                <ReportBugForm bugs={bugs}/>
            </div>
        </div>
    );

}
