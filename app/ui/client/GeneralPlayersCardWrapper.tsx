import { fetchGeneralPlayersCardData } from '@/app/lib/data';
import { Suspense } from 'react';
import { CardsSkeleton } from '@/app/ui/skeletons';
import { formatCurrency } from '@/app/lib/utils';
import Card from '@/app/ui/client/Card';

export default async function GeneralPlayersCardWrapper() {
  const {
    totalNumberOfPlayers,
    numberOfPlayersWithDebt,
    totalRunnerDebt,
    totalPlayersDebt,
  } = await fetchGeneralPlayersCardData();
  return (
    <div className="full-width grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Suspense fallback={<CardsSkeleton count={4} />}>
        <Card
          title=" סה״כ חוב שחקנים"
          value={formatCurrency(totalPlayersDebt)}
          type="money"
          oneLine
        />
        <Card
          title="שחקנים עם חוב"
          value={numberOfPlayersWithDebt}
          type="debt"
          oneLine
        />

        <Card
          title="חוב ראננר לשחקנים"
          value={formatCurrency(totalRunnerDebt)}
          type="money"
          oneLine
        />
        <Card
          title="סה״כ שחקנים"
          value={totalNumberOfPlayers}
          type="players"
          oneLine
        />
      </Suspense>
    </div>
  );
}
