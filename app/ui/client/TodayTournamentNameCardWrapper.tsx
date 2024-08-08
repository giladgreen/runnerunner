'use client';

import { Suspense } from 'react';
import { CardsSkeleton } from '@/app/ui/skeletons';
import Card from '@/app/ui/client/Card';
import { TournamentDB, TRANSLATIONS } from '@/app/lib/definitions';
export default function TodayTournamentNameCardWrapper({
  todayTournament,
}: {
  todayTournament: TournamentDB | null;
}) {
  return (
    <div
      className="full-width grid gap-1 sm:grid-cols-1 lg:grid-cols-1"
      style={{ marginBottom: 20 }}
    >
      <Suspense
        key={todayTournament?.id}
        fallback={<CardsSkeleton count={1} />}
      >
        <Card
          oneLine
          type="tournament"
          title="טורניר נוכחי"
          value={`${
            // @ts-ignore
            todayTournament ? TRANSLATIONS[todayTournament.day] : ''
          } -  ${
            !todayTournament ||
            (todayTournament.max_players === 0 && todayTournament.rsvp_required)
              ? 'אין טורניר היום'
              : todayTournament.name
          }`}
        />
      </Suspense>
    </div>
  );
}
