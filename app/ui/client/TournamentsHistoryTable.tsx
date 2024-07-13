import { PlayerDB } from '@/app/lib/definitions';

export default async function TournamentsHistoryTable({
  player,
}: {
  player: PlayerDB;
}) {
  const tournamentsData = player.tournamentsData;
  if (tournamentsData.length === 0) {
    return null;
  }
  return (
    <div style={{ marginTop: 30, marginBottom: 20 }}>
      <div>
        <u>
          <b>Tournaments History</b>
        </u>
      </div>
      <table className=" min-w-full text-gray-900 md:table">
        <thead className="rounded-lg text-left text-sm font-normal">
          <tr>
            <th scope="col" className="px-1 py-3 font-medium">
              Date
            </th>
            <th scope="col" className="px-1 py-3 font-medium">
              Tournament
            </th>
            <th scope="col" className="px-1 py-3 font-medium">
              Place
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {tournamentsData?.map((tournamentData) => (
            <tr
              key={tournamentData.date}
              className="w-full border-b py-1 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
            >
              <td className="whitespace-nowrap px-1 py-2">
                {tournamentData.date}
              </td>
              <td className="whitespace-nowrap px-1 py-2">
                {tournamentData.tournament_name}
              </td>
              <td className="whitespace-nowrap px-1 py-2">
                #{tournamentData.place}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
