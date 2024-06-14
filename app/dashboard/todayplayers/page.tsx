import { CreateNewTodayPlayer } from '@/app/ui/players/buttons';
import { lusitana } from '@/app/ui/fonts';
import TodaysPlayersTable from "@/app/ui/players/today-players-table";
import Search from "@/app/ui/todaysearch";
import {fetchTodayPlayers} from "@/app/lib/data";
import {FinalTablePlayers, RSVPAndArrivalCardWrapper, TodayTournamentNameCardWrapper} from "@/app/ui/dashboard/cards";
export default async function Page({
                                       searchParams,
                                   }: {
    searchParams?: {
        query?: string;
    };
}) {
    const players = await fetchTodayPlayers(searchParams?.query);
    return (
        <div className="w-full" style={{width: '100%'}}>
            <div className="flex w-full items-center justify-between" style={{width: '100%'}}>
                <TodayTournamentNameCardWrapper/>
            </div>
            <div className="flex w-full items-center justify-between" style={{width: '100%'}}>
                <RSVPAndArrivalCardWrapper/>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <FinalTablePlayers title="Players Place"/>
            </div>
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
