import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import { fetchDebtPlayers } from '@/app/lib/data';
import { formatCurrency, formatCurrencyColor } from '@/app/lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';
import { PlayersSkeleton } from '@/app/ui/skeletons';
import { PlayerDB } from '@/app/lib/definitions';
import Avatar from '@/app/ui/client/Avatar';

export default async function DebtPlayers({
  userId,
  tournamentsIds,
}: {
  userId: string;
  tournamentsIds: string[];
}) {
  const debtPlayers = await fetchDebtPlayers();

  return (
    <Suspense fallback={<PlayersSkeleton />}>
      <div className="rtl flex w-full flex-col md:col-span-4">
        <h2 className={`${lusitana.className} rtl mb-4 text-xl md:text-2xl`}>
          בעלי חוב
        </h2>
        <div className="flex grow flex-col justify-between rounded-xl  p-4">
          <div className=" player-table px-6">
            {debtPlayers.map((player: PlayerDB, i) => {
              return (
                <Link
                  key={player.id}
                  href={`/${userId}/players/${player.id}/edit`}
                >
                  <div
                    key={player.id}
                    className={clsx(
                      'flex flex-row items-center justify-between py-4 player-table-row',
                      {
                        'border-t': i !== 0,
                      },
                    )}
                  >
                    <div className="flex items-center">
                      <Avatar
                        player={player}
                        style={{ marginLeft: 20, marginRight: 3 }}
                        tournamentIds={tournamentsIds}
                      />

                      <div className="min-w-0">
                        <div className="truncate  font-semibold md:text-base">
                          {player.name}
                        </div>
                        <div className="hidden   sm:block">
                          {player.phone_number}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${lusitana.className} ltr truncate  font-medium md:text-base`}
                      style={{
                        color: formatCurrencyColor(player.balance),
                      }}
                    >
                      {formatCurrency(player.balance)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
