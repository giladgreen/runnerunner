import MVPPlayers from '@/app/ui/dashboard/mvp-players';
import {
    FinalTablePlayers,
    GeneralPlayersCardWrapper, PlayersPrizes, RSVPAndArrivalCardWrapper, TodayTournamentNameCardWrapper
} from '@/app/ui/dashboard/cards';
import DebtPlayers from "@/app/ui/dashboard/debt-players";

export default async function Page() {
    return (
        <div>
            <div className="flex w-full items-center justify-between full-width">
                <TodayTournamentNameCardWrapper/>
            </div>
            <RSVPAndArrivalCardWrapper/>
            <div style={{marginTop: 40}}>
                <FinalTablePlayers title="Today's Game Places"/>
            </div>
            <div style={{marginTop: 40}}>
                <PlayersPrizes title="Players Prizes" prevPage={`/dashboard`}/>
            </div>
            <hr style={{marginBottom: 30, marginTop: 10}}/>
            <GeneralPlayersCardWrapper/>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <MVPPlayers/>
                <DebtPlayers/>
            </div>
        </div>
    );
}
