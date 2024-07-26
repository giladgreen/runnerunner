import { fetchRSVPAndArrivalData } from '@/app/lib/data';
import { Suspense } from 'react';
import { CardsSkeleton } from '@/app/ui/skeletons';
import Card from '@/app/ui/client/Card';
import { TRANSLATIONS } from '@/app/lib/definitions';
export default async function TodayTournamentNameCardWrapper({
  params,
}: {
  params: { userId: string };
}) {
  const { todayTournament } = await fetchRSVPAndArrivalData();
  return (
    <div
      className="full-width grid gap-1 sm:grid-cols-1 lg:grid-cols-1"
      style={{ marginBottom: 20 }}
    >
      <Suspense fallback={<CardsSkeleton count={1} />}>
        <Card
          oneLine
          type="today"
          title="טורניר נוכחי"
          value={`${
            // @ts-ignore
            TRANSLATIONS[todayTournament.day]
          } -  ${
            todayTournament.max_players === 0 && todayTournament.rsvp_required
              ? 'אין טורניר היום'
              : todayTournament.name
          }`}
        />
      </Suspense>
    </div>
  );
}
