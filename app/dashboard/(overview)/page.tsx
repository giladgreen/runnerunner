
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
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-2" style={{marginBottom:20}}>
                <Suspense fallback={<CardsSkeleton count={2} />}>
                    <RSVPAndArrivalCardWrapper />
                </Suspense>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton count={4}/>}>
                    <GeneralPlayersCardWrapper />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">

                <Suspense fallback={<PlayersSkeleton />}>
                    <MVPPlayers />
                </Suspense>
                <Suspense fallback={<PlayersSkeleton />}>
                    <DebtPlayers />
                </Suspense>

            </div>
        </main>
    );
}
