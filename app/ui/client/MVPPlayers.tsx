import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { fetchMVPPlayers } from '@/app/lib/data';
import { formatCurrency } from '@/app/lib/utils';
import Link from 'next/link';
import { TickIcon, DoubleTicksIcon } from '@/app/ui/icons';
import { Suspense } from 'react';
import { PlayersSkeleton } from '@/app/ui/skeletons';
import { PlayerDB } from '@/app/lib/definitions';

export default async function MVPPlayers({ userId }: { userId: string }) {
  const mvpPlayers = await fetchMVPPlayers();

  return (
    <Suspense fallback={<PlayersSkeleton />}>
      <div className="flex w-full flex-col md:col-span-4">
        <h2 className={`${lusitana.className} rtl mb-4 text-xl md:text-2xl`}>
          שחקנים מובילים
        </h2>
        <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
          <div className="bg-white px-6">
            {mvpPlayers.map((player: PlayerDB, i) => {
              return (
                <Link
                  key={player.id}
                  href={`/${userId}/players/${player.id}/edit`}
                >
                  <div
                    key={player.id}
                    className={clsx(
                      'flex flex-row items-center justify-between py-4',
                      {
                        'border-t': i !== 0,
                      },
                    )}
                  >
                    <div className="flex items-center">
                      <Image
                        src={player.image_url}
                        alt={`${player.name}'s profile picture`}
                        className="zoom-on-hover mr-4 rounded-full"
                        width={55}
                        height={55}
                      />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold md:text-base">
                          {player.name}
                        </div>
                        <div className="hidden text-sm text-gray-500 sm:block">
                          {player.phone_number}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                    >
                      {formatCurrency(player.balance)}
                    </div>
                    <div style={{ width: 20 }}>
                      {player.rsvpForToday && !player.arrived && (
                        <TickIcon size={24} />
                      )}
                      {player.rsvpForToday && player.arrived && (
                        <DoubleTicksIcon size={24} />
                      )}
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
