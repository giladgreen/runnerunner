import { fetchFeatureFlags, fetchTournamentsData } from '@/app/lib/data';
import { formatDateToLocal } from '@/app/lib/utils';
import { getFinalTablePlayersContent } from '@/app/ui/client/helpers';
import { getDayIncome } from '@/app/ui/client/helpers';

export default async function TournamentsDataPage({
  userId,
}: {
  userId?: string;
}) {
  const { placesEnabled } = await fetchFeatureFlags();

  const tournaments = await fetchTournamentsData();

  const tournamentsData = Object.keys(tournaments);

  return (
    <div className="tournaments-data-table w-full">
      {tournamentsData.length === 0 && (
        <div className="text-center">עוד אין מידע להציג</div>
      )}
      {tournamentsData.length > 0 && (
        <table className="min-w-full text-gray-900 md:table rtl">
          <thead className=" rounded-lg text-left text-sm font-normal rtl">
            <tr className="rtl">
              <th className="rtl px-3 py-5 font-medium smaller-on-mobile-smaller" style={{ textAlign: 'right'}}>
                <b>תאריך טורניר</b>
              </th>
              <th className="rtl px-3 py-5 font-medium smaller-on-mobile" style={{ textAlign: 'right'}}>
                <b>הכנסות</b>
              </th>
              <th className="rtl px-1 py-5 font-medium smaller-on-mobile" style={{ textAlign: 'right'}}>
                <b>כמות שחקנים</b>
              </th>
              <th className="rtl px-1 py-5 font-medium smaller-on-mobile" style={{ textAlign: 'right'}}>
                <b>כניסות מחדש</b>
              </th>
              {placesEnabled && (
                <th className="rtl px-2 py-5 font-medium smaller-on-mobile" style={{ textAlign: 'right'}}>
                  <b>דירוג מנצחים</b>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white">
            {
              // @ts-ignore
              tournamentsData
                .map(
                  (key) =>
                    // @ts-ignore
                    tournaments[key],
                )
                .map(async (dateItem) => {
                  const dayIncome = getDayIncome(dateItem);

                  const date = new Date(dateItem.date)
                      .toISOString()
                      .slice(0, 10);

                  const finalTableData = await getFinalTablePlayersContent(
                      date,
                      `${formatDateToLocal(dateItem.date)} ${dateItem.tournamentName}`,
                      true,
                      userId,
                  );

                  return (
                      <tr
                          key={dateItem.date}
                          className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                      >
                        <th className="px-4 py-5 font-medium smaller-on-mobile-smaller">
                          <div style={{marginBottom: 20, textAlign: 'right'}}>
                            {formatDateToLocal(dateItem.date)}
                          </div>
                          <div style={{textAlign: 'right'}}>{dateItem.tournamentName}</div>
                        </th>
                        <th className="px-3 py-5 font-medium smaller-on-mobile">{dayIncome}</th>
                        <th className="px-3 py-5 font-medium smaller-on-mobile" style={{textAlign: 'right'}}>
                          {dateItem.players} שחקנים
                        </th>
                        <th className="px-3 py-5 font-medium smaller-on-mobile" style={{textAlign: 'right'}}>
                          {dateItem.entries - dateItem.reentries} כניסות{' '}
                          {dateItem.reentries > 0
                              ? `(+ ${dateItem.reentries} כניסות מחדש)`
                              : ``}
                        </th>
                        {placesEnabled && (
                            <th className="px-3 py-5 font-medium smaller-on-mobile">
                              {finalTableData}
                            </th>
                        )}
                      </tr>
                  );
                })
            }
          </tbody>
        </table>
      )}
    </div>
  );
}
