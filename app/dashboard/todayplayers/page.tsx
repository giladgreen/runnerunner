import { CreateNewPlayer } from '@/app/ui/players/buttons';
import { lusitana } from '@/app/ui/fonts';
import TodaysPlayersTable from "@/app/ui/players/today-players-table";
export default async function Page() {

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <h1 className={`${lusitana.className} text-2xl`}>Today's Players</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <CreateNewPlayer />

            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">

                <TodaysPlayersTable/>
            </div>

        </div>
    );
}
