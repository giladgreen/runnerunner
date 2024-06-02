
import MVPPlayers from '@/app/ui/dashboard/mvp-players';
import { Suspense } from 'react';
import {CardsSkeleton, PlayersSkeleton} from '@/app/ui/skeletons';
import { lusitana } from '@/app/ui/fonts';
import {RSVPCardWrapper,CardWrapper} from '@/app/ui/dashboard/cards';
import DebtPlayers from "@/app/ui/dashboard/debt-players";

export default async function Page() {
    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-1 sm:grid-cols-1 lg:grid-cols-1" style={{marginBottom:20}}>
                <Suspense fallback={<CardsSkeleton count={1} />}>
                    <RSVPCardWrapper />
                </Suspense>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton count={4}/>}>
                    <CardWrapper />
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
