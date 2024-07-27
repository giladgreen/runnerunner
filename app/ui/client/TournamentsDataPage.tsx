import { fetchFeatureFlags, fetchTournamentsData } from '@/app/lib/data';
import { formatDateToLocal } from '@/app/lib/utils';
import { getFinalTablePlayersContent } from '@/app/ui/client/helpers';
import { getDayIncome } from '@/app/ui/client/helpers';

export default async function TournamentsDataPage({
  userId,
}: {
  userId?: string;
}) {
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
              <th className="rtl px-3 py-5 font-medium smaller-on-mobile" style={{ textAlign: 'right'}}>
                <b> טורניר</b>
              </th>
              <th className="rtl px-3 py-5 font-medium smaller-on-mobile" style={{ textAlign: 'right'}}>
                <b>הכנסות</b>
              </th>
              <th className="rtl px-1 py-5 font-medium smaller-on-mobile" style={{ textAlign: 'right'}}>
                <b> שחקנים</b>
              </th>
              <th className="rtl px-1 py-5 font-medium smaller-on-mobile" style={{ textAlign: 'right'}}>
                <b>כניסות </b>
              </th>

                <th className="rtl px-2 py-5 font-medium smaller-on-mobile" style={{ textAlign: 'right'}}>
                  <b>דירוג </b>
                </th>

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
                        <th className="px-4 py-5 font-medium">
                          <div className="smaller-on-mobile" style={{textAlign: 'right'}}>{dateItem.tournamentName}</div>
                          <div className="wide-screen" style={{marginBottom: 20, marginTop:10, textAlign: 'right'}}>
                            {formatDateToLocal(dateItem.date)}
                          </div>
                          <div className="cellular smaller-on-mobile" style={{ marginTop:10, textAlign: 'right'}}>
                            {`${dateItem.date.slice(5, 7)} / ${dateItem.date.slice(8, 10)}`}
                          </div>
                          <div className="cellular" style={{ marginTop:5, textAlign: 'right'}}>
                            {dateItem.date.slice(0,4)}
                          </div>

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

                          <th className="px-3 py-5 font-medium smaller-on-mobile players-final-table-cell">
                            {finalTableData}
                          </th>

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
