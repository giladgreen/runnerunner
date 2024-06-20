import { CreateNewTodayPlayer } from '@/app/ui/players/buttons';
import TodaysPlayersTable from "@/app/ui/players/today-players-table";
import Search from "@/app/ui/todaysearch";
import {fetchFeatureFlags, fetchTodayPlayers} from "@/app/lib/data";
import {
    FinalTablePlayers,
    PlayersPrizes,
    RSVPAndArrivalCardWrapper,
    TodayTournamentNameCardWrapper
} from "@/app/ui/dashboard/cards";
export default async function Page({
                                       searchParams,
                                   }: {
    searchParams?: {
        query?: string;
    };
}) {
    const players = await fetchTodayPlayers(searchParams?.query);
    const { prizesEnabled, placesEnabled} = await fetchFeatureFlags();

    return (
        <div className="w-full full-width" >
            <div className="flex w-full items-center justify-between full-width">
                <TodayTournamentNameCardWrapper/>
            </div>
            <div className="flex w-full items-center justify-between full-width">
                <RSVPAndArrivalCardWrapper/>
            </div>
            { placesEnabled && <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <FinalTablePlayers title="Places"/>
            </div> }
            {prizesEnabled && <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <PlayersPrizes title="Players Prizes" prevPage={`/dashboard/currenttournament`}/>
            </div>}
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="search players"/>
                <CreateNewTodayPlayer/>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <TodaysPlayersTable players={players}/>
            </div>

        </div>
    );
}
