import MVPPlayers from '@/app/ui/client/MVPPlayers';
import DebtPlayers from "@/app/ui/client/DebtPlayers";
import {fetchFeatureFlags} from "@/app/lib/data";
import TodayTournamentNameCardWrapper from "@/app/ui/client/TodayTournamentNameCardWrapper";
import RSVPAndArrivalCardWrapper from "@/app/ui/client/RSVPAndArrivalCardWrapper";
import FinalTablePlayers from "@/app/ui/client/FinalTablePlayers";
import GeneralPlayersCardWrapper from "@/app/ui/client/GeneralPlayersCardWrapper";

export default async function HomePage({ params }: { params: { userId: string } }) {
    const { placesEnabled} = await fetchFeatureFlags();

    return (
        <div>
            <div className="flex w-full items-center justify-between full-width">
                <TodayTournamentNameCardWrapper params={params}/>
            </div>
            <RSVPAndArrivalCardWrapper params={params}/>
            {placesEnabled && <div style={{marginTop: 40}}>
                <FinalTablePlayers title="Today's Game Places" params={params}/>
            </div>}
            <hr style={{marginBottom: 30, marginTop: 10}}/>
            <GeneralPlayersCardWrapper/>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <MVPPlayers userId={params.userId}/>
                <DebtPlayers userId={params.userId}/>
            </div>
        </div>
    );
}
