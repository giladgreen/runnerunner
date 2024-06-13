import {fetchTodayPlayers, fetchUserByPhoneNumber} from "@/app/lib/data";
import {notFound} from "next/navigation";

import SideNavUser from "@/app/ui/dashboard/sidenav-user";
import {FinalTablePlayers, RSVPAndArrivalCardWrapper} from "@/app/ui/dashboard/cards";
import Search from "@/app/ui/todaysearch";
import {CreateNewTodayPlayer} from "@/app/ui/players/buttons";
import TodaysPlayersTable from "@/app/ui/players/today-players-table";
export default async function Page({ params, searchParams }: { params: { id: string }, searchParams?: {
        query?: string;
    } }) {
    const connectedUserPhoneNumber = params.id;
    const user = await fetchUserByPhoneNumber(connectedUserPhoneNumber);
    if (!user) {
        notFound();
    }
    const players = await fetchTodayPlayers(searchParams?.query);
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNavUser username={user.name}/>
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">

                <div className="w-full" style={{width: '100%'}}>
                    <div className="flex w-full items-center justify-between" style={{width: '100%'}}>
                        <RSVPAndArrivalCardWrapper/>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                        <FinalTablePlayers title="Players Place"/>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                        <Search placeholder="search players"/>
                        <CreateNewTodayPlayer connectedUserPhoneNumber={connectedUserPhoneNumber}/>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                        <TodaysPlayersTable players={players} prevPage={`/worker/${connectedUserPhoneNumber}`} username={user.name}/>
                    </div>

                </div>
            </div>
        </div>
    );
}
