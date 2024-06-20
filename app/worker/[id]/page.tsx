import {fetchFeatureFlags, fetchTodayPlayers, fetchUserById} from "@/app/lib/data";
import {notFound} from "next/navigation";
import SideNavWorker from "@/app/ui/dashboard/sidenav-worker";
import {
    FinalTablePlayers,
    PlayersPrizes,
    RSVPAndArrivalCardWrapper,
    TodayTournamentNameCardWrapper
} from "@/app/ui/dashboard/cards";
import Search from "@/app/ui/todaysearch";
import {CreateNewTodayPlayer} from "@/app/ui/players/buttons";
import TodaysPlayersTable from "@/app/ui/players/today-players-table";
export default async function Page({ params, searchParams }: { params: { id: string }, searchParams?: {
        query?: string;
    } }) {
    const connectedUserId = params.id;
    const user = await fetchUserById(connectedUserId);
    if (!user) {
        notFound();
    }
    const players = await fetchTodayPlayers(searchParams?.query);
    const { prizesEnabled, placesEnabled} = await fetchFeatureFlags();


    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNavWorker username={user.name!} userId={user.id!}/>
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">

                <div className="w-full full-width">
                    <div className="flex w-full items-center justify-between full-width" >
                        <TodayTournamentNameCardWrapper/>
                    </div>
                    <div className="flex w-full items-center justify-between full-width" >
                        <RSVPAndArrivalCardWrapper/>
                    </div>
                    {placesEnabled && <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                        <FinalTablePlayers title="Players Place"/>
                    </div>}
                    {prizesEnabled && <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                        <PlayersPrizes title="Players Prizes" prevPage={`/worker/${connectedUserId}`}/>
                    </div>}
                    <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                        <Search placeholder="search players"/>
                        <CreateNewTodayPlayer connectedUserId={connectedUserId}/>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                        <TodaysPlayersTable players={players} prevPage={`/worker/${connectedUserId}`} username={user.name} userId={user.id} worker/>
                    </div>

                </div>
            </div>
        </div>
    );
}
