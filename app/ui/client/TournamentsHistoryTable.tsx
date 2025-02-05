'use client';
import { PlayerDB } from '@/app/lib/definitions';

export default function TournamentsHistoryTable({
  player,
}: {
  player: PlayerDB;
}) {
  const tournamentsData = player.tournamentsData;
  if (tournamentsData.length === 0) {

    return <div></div>;
  }


  return (
    <div className="rtl" style={{ marginTop: 30, marginBottom: 20, background: 'transparent', color: 'white' }}>
      <div className="rtl" style={{ zoom: 2 }}>
        <u>
          <b>הסטוריית זכיות</b>
        </u>
      </div>
      <table className="rtl min-w-full md:table">
        <thead className="text-left  font-normal">
          <tr>
            <th
              scope="col"
              className="px-1 py-3 font-medium align-text-right"

            >
              תאריך
            </th>
            <th
              scope="col"
              className="px-1 py-3 font-medium align-text-right"

            >
              טורניר
            </th>
            <th
              scope="col"
              className="px-1 py-3 font-medium align-text-right"

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
              className="w-full border-b py-1  last-of-type:border-none "
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
