import MVPPlayers from '@/app/ui/dashboard/mvp-players';
import {
    FinalTablePlayers,
    GeneralPlayersCardWrapper, PlayersPrizes, RSVPAndArrivalCardWrapper, TodayTournamentNameCardWrapper
} from '@/app/ui/dashboard/cards';
import DebtPlayers from "@/app/ui/dashboard/debt-players";
import {fetchFeatureFlags} from "@/app/lib/data";

export default async function Page() {
    const { prizesEnabled, placesEnabled} = await fetchFeatureFlags();

    return (
        <div>
            <div className="flex w-full items-center justify-between full-width">
                <TodayTournamentNameCardWrapper/>
            </div>
            <RSVPAndArrivalCardWrapper/>
            {placesEnabled && <div style={{marginTop: 40}}>
                <FinalTablePlayers title="Today's Game Places"/>
            </div>}
            {prizesEnabled && <div style={{marginTop: 40}}>
                <PlayersPrizes title="Players Prizes" />
            </div>}
            <hr style={{marginBottom: 30, marginTop: 10}}/>
            <GeneralPlayersCardWrapper/>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <MVPPlayers/>
                <DebtPlayers/>
            </div>
        </div>
    );
}
