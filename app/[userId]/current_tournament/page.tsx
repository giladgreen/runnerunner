import CreateNewTodayPlayerButton from '@/app/ui/client/CreateNewTodayPlayerButton';
import TodayPlayersTable from "@/app/ui/client/TodayPlayersTable";
import TodaySearch from "@/app/ui/client/TodaySearch";
import {fetchFeatureFlags, fetchTodayPlayers} from "@/app/lib/data";
import FinalTablePlayers from "@/app/ui/client/FinalTablePlayers";
import PlayersPrizes from "@/app/ui/client/PlayersPrizes";
import RSVPAndArrivalCardWrapper from "@/app/ui/client/RSVPAndArrivalCardWrapper";
import TodayTournamentNameCardWrapper from "@/app/ui/client/TodayTournamentNameCardWrapper";

export default async function CurrentTournament({
   params,
   searchParams,
}: {
    searchParams?: {
        query?: string;
    };
    params:{ userId: string };
}) {
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
