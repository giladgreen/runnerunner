import MVPPlayers from '@/app/ui/dashboard/mvp-players';
import {
     GeneralPlayersCardWrapper, RSVPAndArrivalCardWrapper
} from '@/app/ui/dashboard/cards';
import DebtPlayers from "@/app/ui/dashboard/debt-players";

export default async function Page() {
    return (
        <main>
            <RSVPAndArrivalCardWrapper />
            <hr style={{ marginBottom: 30}}/>
            <GeneralPlayersCardWrapper />
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <MVPPlayers />
                <DebtPlayers />


            </div>
        </main>
    );
}
