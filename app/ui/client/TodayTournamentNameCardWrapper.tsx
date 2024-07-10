import {fetchRSVPAndArrivalData} from "@/app/lib/data";
import {Suspense} from "react";
import {CardsSkeleton} from "@/app/ui/skeletons";
import Card from "@/app/ui/client/Card";

export default async function TodayTournamentNameCardWrapper({ params }: { params: { userId: string } }) {
    const {
        todayTournament
    } = await fetchRSVPAndArrivalData();

    return <div className="grid gap-1 sm:grid-cols-1 lg:grid-cols-1 full-width" style={{marginBottom: 20}} >
        <Suspense fallback={<CardsSkeleton count={1}/>}>

            <Card oneLine title="Current Tournament" value={`${
                // @ts-ignore
                translation[todayTournament.day]} -  ${todayTournament.max_players === 0 && todayTournament.rsvp_required ? 'אין טורניר היום' : todayTournament.name}`} />
        </Suspense>
    </div>
}
