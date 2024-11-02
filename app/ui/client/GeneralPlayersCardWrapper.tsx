import { fetchGeneralPlayersCardData } from '@/app/lib/data';
import { Suspense } from 'react';
import { CardsSkeleton } from '@/app/ui/skeletons';
import { formatCurrency } from '@/app/lib/utils';
import Card from '@/app/ui/client/Card';
import NumberTicker from "@/components/ui/number-ticker";

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
          value={<NumberTicker value={totalPlayersDebt} useCurrency/>}
          type="money"
          oneLine
        />
        <Card
          title="שחקנים עם חוב"
          value={<NumberTicker value={numberOfPlayersWithDebt} useCurrency={false}/>}
          type="debt"
          oneLine
        />

        <Card
          title="חוב ראנר לשחקנים"
          value={<NumberTicker value={totalRunnerDebt} useCurrency/>}
          type="money"
          oneLine
        />
        <Card
          title="סה״כ שחקנים"
          value={<NumberTicker value={totalNumberOfPlayers} useCurrency={false}/>}
          type="players"
          oneLine
        />
      </Suspense>
    </div>
  );
}
