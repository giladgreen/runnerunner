
import MVPPlayers from '@/app/ui/dashboard/mvp-players';
import { Suspense } from 'react';
import {CardsSkeleton, PlayersSkeleton} from '@/app/ui/skeletons';
import {
     GeneralPlayersCardWrapper, RSVPAndArrivalCardWrapper
} from '@/app/ui/dashboard/cards';
import DebtPlayers from "@/app/ui/dashboard/debt-players";

export default async function Page() {
    return (
        <main>
            <RSVPAndArrivalCardWrapper />
            <GeneralPlayersCardWrapper />
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <MVPPlayers />
                <DebtPlayers />


            </div>
        </main>
    );
}
