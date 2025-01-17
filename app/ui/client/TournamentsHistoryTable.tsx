'use client';
import { PlayerDB } from '@/app/lib/definitions';

export default function TournamentsHistoryTable({
  player,
}: {
  player: PlayerDB;
}) {
  const tournamentsData = player.tournamentsData;
  if (tournamentsData.length === 0) {
    console.log('## no tournamentsData');

    return <div></div>;
  }
  console.log('## tournamentsData', tournamentsData);

  return (
    <div className="rtl" style={{ marginTop: 30, marginBottom: 20, background: 'transparent', color: 'white' }}>
      <div className="rtl" style={{ zoom: 2 }}>
        <u>
          <b>הסטוריית זכיות</b>
        </u>
      </div>
      <table className="rtl min-w-full md:table">
        <thead className="text-left text-sm font-normal">
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
        <tbody className="rtl">
          {tournamentsData?.map((tournamentData) => (
            <tr
              style={{ backgroundColor: 'rgba(250,250,250,0.1)' }}
              key={tournamentData.date}
              className="w-full border-b py-1 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
            >
              <td className="">
                {tournamentData.date}
              </td>
              <td className="">
                {tournamentData.tournament_name}
              </td>
              <td className="">
                #{tournamentData.place}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
