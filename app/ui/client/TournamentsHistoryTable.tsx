'use client';
import { PlayerDB } from '@/app/lib/definitions';

export default function TournamentsHistoryTable({
  player,
}: {
  player: PlayerDB;
}) {
  const tournamentsData = player.tournamentsData;
  if (tournamentsData.length === 0) {
    return <div>אין נתוני טורנירים להצגה</div>;
  }
  return (
    <div className="rtl" style={{ marginTop: 30, marginBottom: 20 }}>
      <div className="rtl">
        <u>
          <b>הסטורית זכיות</b>
        </u>
      </div>
      <table className="rtl min-w-full text-gray-900 md:table">
        <thead className="rounded-lg text-left text-sm font-normal">
          <tr>
            <th
              scope="col"
              className="px-1 py-3 font-medium"
              style={{ textAlign: 'right' }}
            >
              תאריך
            </th>
            <th
              scope="col"
              className="px-1 py-3 font-medium"
              style={{ textAlign: 'right' }}
            >
              טורניר
            </th>
            <th
              scope="col"
              className="px-1 py-3 font-medium"
              style={{ textAlign: 'right' }}
            >
              מקום
            </th>
          </tr>
        </thead>
        <tbody className="rtl bg-white">
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
