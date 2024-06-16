import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import {fetchDebtPlayers} from "@/app/lib/data";
import {DebtPlayerRaw} from "@/app/lib/definitions";
import {formatCurrency} from "@/app/lib/utils";
import Link from "next/link";
import {DoubleTicksIcon, TickIcon} from "@/app/ui/icons";
import {Suspense} from "react";
import {PlayersSkeleton} from "@/app/ui/skeletons";

export default async function DebtPlayers() {
    const debtPlayers = await fetchDebtPlayers();

  return (
      <Suspense fallback={<PlayersSkeleton />}>


    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
         Players with Debt
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">

         <div className="bg-white px-6">
          {debtPlayers.map((player: DebtPlayerRaw, i) => {

              return (
                <Link
                    key={player.id}
                    href={`/dashboard/players/${player.id}/data`}
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
                    className="mr-4 rounded-full zoom-on-hover"
                    width={55}
                    height={55}
                  />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold md:text-base" >
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
                  <div>
                      {
                          player.rsvpForToday && !player.arrived && <TickIcon size={24}/>
                      }
                      {
                          player.rsvpForToday && player.arrived && <DoubleTicksIcon size={24}/>
                      }
                  </div>
              </div>
                </Link>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
      </Suspense>
  );
}
