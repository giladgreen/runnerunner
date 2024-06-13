import MVPPlayers from '@/app/ui/dashboard/mvp-players';
import {
    FinalTablePlayers,
    GeneralPlayersCardWrapper, RSVPAndArrivalCardWrapper
} from '@/app/ui/dashboard/cards';
import DebtPlayers from "@/app/ui/dashboard/debt-players";

export default async function Page() {
    return (
        <div>
            <RSVPAndArrivalCardWrapper/>
            <div style={{marginTop: 40}}>
                <FinalTablePlayers title="Today's Game Players Place"/>
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
