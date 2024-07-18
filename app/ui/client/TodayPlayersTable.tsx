import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/app/lib/utils';
import RSVPButton from '@/app/ui/client/RSVPButton';
import OpenCreditModalButton from '@/app/ui/client/OpenCreditModalButton';
import { DoubleTicksIcon } from '@/app/ui/icons';
import {PlayerDB, PrizeInfoDB, TournamentDB} from '@/app/lib/definitions';
import OpenPositionModalButton from '@/app/ui/client/OpenPositionModalButton';
import OpenPrizeModalButton from '@/app/ui/client/OpenPrizeModalButton';
import EntriesButton from '@/app/ui/client/EntriesButton';

export default async function TodayPlayersTable({
  allPlayers,
  players,
  userId,
  prizesEnabled,
  placesEnabled,
  rsvpEnabled,
  titleText, 
  isRsvpRequired,
  tournaments,
  prizesInformation
}: {
  allPlayers: PlayerDB[];
  players: PlayerDB[];
  userId: string;
  titleText: string;
  prizesEnabled: boolean;
  placesEnabled: boolean;
  rsvpEnabled: boolean;
  isRsvpRequired: boolean;
  rsvpPlayersCount:number;
  tournaments:TournamentDB[];
  prizesInformation:PrizeInfoDB[];
}) {

  const getLink = (player: PlayerDB) => {
    return `/${userId}/players/${player.id}/edit`;
  };
  const playersWithEnoughCredit = allPlayers.filter(p=> p.balance > -2000);


  return (
    <div className="full-width mt-6 flow-root">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {titleText}
      </div>

      <div className="inline-block min-w-full align-middle">
        <div className="w-full rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {players?.map((player) => (
              <div
                key={player.id}
                className="full-width w-full rounded-md bg-white"
                style={{ marginBottom: 20 }}
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={player.image_url}
                        className="zoom-on-hover mr-2 rounded-full"
                        width={40}
                        height={40}
                        alt={`${player.name}'s profile picture`}
                      />
                      <div>{player.name}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {player.phone_number}
                    </div>
                  </div>
                  {rsvpEnabled && isRsvpRequired && (
                    <td className="rsvp-icon pointer whitespace-nowrap px-3 py-3">
                      <RSVPButton player={player} />
                    </td>
                  )}
                </div>

                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <div className="text-xl font-medium">
                      <Link href={getLink(player)}>
                        balance: {formatCurrency(player.balance)}
                      </Link>
                    </div>
                    <div className="text-l font-medium">{player.notes}</div>
                  </div>
                  <div>
                    {rsvpEnabled && player.rsvpForToday && player.arrived && (
                      <DoubleTicksIcon size={24} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Player
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Phone
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Balance
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Notes
                </th>

                {rsvpEnabled && isRsvpRequired && (
                  <th scope="col" className="px-3 py-5 font-medium">
                    RSVP
                  </th>
                )}
                <th scope="col" className="px-3 py-5 font-medium">
                  Arrived
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Buyins
                </th>
                {placesEnabled && (
                  <th scope="col" className="px-3 py-5 font-medium"></th>
                )}
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {players?.map((player) => (
                <tr
                  key={player.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3 font-large">
                      <Image
                        src={player.image_url}
                        className="zoom-on-hover rounded-full"
                        width={40}
                        height={40}
                        alt={`${player.name}'s profile picture`}
                      />
                      <div className="font-large">{player.name}</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-large">
                    {player.phone_number}
                  </td>
                  <td className={`whitespace-nowrap px-3 py-3 `}>
                    <Link href={getLink(player)}  className="font-large">
                      {formatCurrency(player.balance)}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Link href={getLink(player)}>{player.notes}</Link>
                  </td>

                  {rsvpEnabled && isRsvpRequired && (
                    <td className="rsvp-icon pointer whitespace-nowrap px-3 py-3">
                      <RSVPButton player={player} />
                    </td>
                  )}
                  <td className="rsvp-icon whitespace-nowrap px-3 py-3 ">
                    {player.arrived ? '✔️' : ''}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 ">
                    <EntriesButton player={player} />
                  </td>
                  {placesEnabled && (
                    <td className="whitespace-nowrap px-3 py-3 ">
                      {player.position && Number(player.position) > 0 ? (
                        <div
                          className="text-lg"
                          style={{
                            background: '#6666CCCC',
                            color: 'white',
                            width: 30,
                            height: 30,
                            borderRadius: 50,
                            textAlign: 'center',
                          }}
                        >
                          #{player.position}
                        </div>
                      ) : (
                        ''
                      )}
                    </td>
                  )}
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <OpenCreditModalButton
                        players={playersWithEnoughCredit}
                        player={player}
                        tournaments={tournaments}
                        userId={userId}
                      />
                      {placesEnabled && (
                        <OpenPositionModalButton player={player} />
                      )}
                      {prizesEnabled && (
                        <OpenPrizeModalButton player={player} prizesInformation={prizesInformation}/>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
