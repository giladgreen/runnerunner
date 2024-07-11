import CreateNewTodayPlayerButton from '@/app/ui/client/CreateNewTodayPlayerButton';
import TodayPlayersTable from "@/app/ui/client/TodayPlayersTable";
import TodaySearch from "@/app/ui/client/TodaySearch";
import {fetchFeatureFlags, fetchTodayPlayers, fetchUserById} from "@/app/lib/data";
import FinalTablePlayers from "@/app/ui/client/FinalTablePlayers";
import PlayersPrizes from "@/app/ui/client/PlayersPrizes";
import RSVPAndArrivalCardWrapper from "@/app/ui/client/RSVPAndArrivalCardWrapper";
import TodayTournamentNameCardWrapper from "@/app/ui/client/TodayTournamentNameCardWrapper";
import React from "react";

export default async function CurrentTournament({
   params,
   searchParams,
}: {
    searchParams?: {
        query?: string;
    };
    params:{ userId: string };
}) {
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

    const players = await fetchTodayPlayers(searchParams?.query);
    const { prizesEnabled, placesEnabled} = await fetchFeatureFlags();

    return (
        <div className="w-full full-width" >
            <div className="flex w-full items-center justify-between full-width">
                <TodayTournamentNameCardWrapper params={params}/>
            </div>
            <div className="flex w-full items-center justify-between full-width">
                <RSVPAndArrivalCardWrapper  params={params}/>
            </div>
            { placesEnabled && <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <FinalTablePlayers title="Places"  params={params}/>
            </div> }
            {prizesEnabled && <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <PlayersPrizes title="Players Prizes" showOnlyToday  params={params}/>
            </div>}
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <TodaySearch placeholder="search players"/>
                <CreateNewTodayPlayerButton params={params}/>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <TodayPlayersTable players={players}  params={params}/>
            </div>

        </div>
    );
}
