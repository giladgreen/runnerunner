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
          title="Total players"
          value={totalNumberOfPlayers}
          type="players"
          oneLine
        />
        <Card
          title="Our Obligations"
          value={formatCurrency(totalRunnerDebt)}
          type="money"
          oneLine
        />
        <Card
          title="Players with debt"
          value={numberOfPlayersWithDebt}
          type="debt"
          oneLine
        />
        <Card
          title="Players debt"
          value={formatCurrency(totalPlayersDebt)}
          type="money"
          oneLine
        />
      </Suspense>
    </div>
  );
}
