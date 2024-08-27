import {fetchFeatureFlags, fetchTournamentsData} from '@/app/lib/data';
import { getFinalTablePlayersContent } from '@/app/ui/client/helpers';
import { getDayIncome } from '@/app/ui/client/helpers';
import {
  formatDateToLocal,
  getTodayShortDate,
} from '@/app/lib/serverDateUtils';
import { dateComparator } from '@/app/lib/utils';

export default async function TournamentsDataPage({
  userId,
}: {
  userId?: string;
}) {
  const tournamentsObject = await fetchTournamentsData();
const { prizesEnabled } = await fetchFeatureFlags();
  const tournamentsData = Object.keys(tournamentsObject);
  tournamentsData.sort(dateComparator);
  const tournamentsFullData = tournamentsData
    .map((tournamentData) => {
      // @ts-ignore
      const tournamentDataByDate = tournamentsObject[tournamentData];
      const tournamentsIds = Object.keys(tournamentDataByDate);

      // @ts-ignore
      return tournamentsIds.map((id) => tournamentDataByDate[id]);
    })
    .flat();

  let tournamentsRange = '';
  if (tournamentsData.length > 1) {
    const first = formatDateToLocal(tournamentsData[0]).split(',')[1];
    const last = formatDateToLocal(
      tournamentsData[tournamentsData.length - 1],
    ).split(',')[1];
    tournamentsRange = `${last} עד ${first}`;
  }

  return (
    <div className="tournaments-data-table rtl w-full">
      {tournamentsFullData.length === 0 && (
        <div className="text-center">עוד אין מידע להציג</div>
      )}
      {tournamentsFullData.length > 0 && (
        <div style={{ textAlign: 'right' }}>
          {tournamentsFullData.length} טורנירים{' '}
        </div>
      )}
      <div style={{ textAlign: 'right' }}> {tournamentsRange} </div>
      {tournamentsFullData.length > 0 && (
        <table
          className="min-w-full text-gray-900 md:table"
          style={{ marginRight: -10 }}
        >
          <thead className=" rounded-lg text-left text-sm font-normal">
            <tr>
              <th
                className="smaller-on-mobile px-3 py-5 font-medium"
                style={{ textAlign: 'right' }}
              >
                <b> טורניר</b>
              </th>
              <th
                className="smaller-on-mobile px-3 py-5 font-medium"
                style={{ textAlign: 'right' }}
              >
                <b>הכנסות</b>
              </th>
              <th
                className="smaller-on-mobile px-1 py-5 font-medium"
                style={{ textAlign: 'right' }}
              >
                <b> שחקנים</b>
              </th>
              <th
                className="smaller-on-mobile px-1 py-5 font-medium"
                style={{ textAlign: 'right' }}
              >
                <b>כניסות </b>
              </th>

              <th
                className="smaller-on-mobile px-2 py-5 font-medium"
                style={{ textAlign: 'right' }}
              >
                <b>דירוג </b>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {tournamentsFullData.map(async (dateItem) => {
              const dayIncome = getDayIncome(dateItem);
              const date = dateItem.date;

              const finalTableData = await getFinalTablePlayersContent(
                  prizesEnabled,
                date,
                dateItem.tournamentId,
                true,
                userId,
              );

              return (
                <tr
                  key={dateItem.date}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <th className="px-4 py-5 font-medium">
                    <div
                      className="smaller-on-mobile"
                      style={{ textAlign: 'right' }}
                    >
                      {dateItem.tournamentName}
                    </div>
                    <div
                      className="wide-screen"
                      style={{
                        marginBottom: 20,
                        marginTop: 10,
                        textAlign: 'right',
                      }}
                    >
                      {formatDateToLocal(dateItem.date)}
                    </div>
                    <div
                      className="cellular smaller-on-mobile"
                      style={{ marginTop: 10, textAlign: 'right' }}
                    >
                      {`${dateItem.date.slice(5, 7)} / ${dateItem.date.slice(
                        8,
                        10,
                      )}`}
                    </div>
                    <div
                      className="cellular"
                      style={{ marginTop: 5, textAlign: 'right' }}
                    >
                      {dateItem.date.slice(0, 4)}
                    </div>
                  </th>
                  <th className="smaller-on-mobile px-3 py-5 font-medium">
                    {dayIncome}
                  </th>
                  <th
                    className="smaller-on-mobile px-3 py-5 font-medium"
                    style={{ textAlign: 'right' }}
                  >
                    {dateItem.players} שחקנים
                  </th>
                  <th
                    className="smaller-on-mobile px-3 py-5 font-medium"
                    style={{ textAlign: 'right' }}
                  >
                    {dateItem.entries - dateItem.reentries} כניסות{' '}
                    {dateItem.reentries > 0
                      ? `(+ ${dateItem.reentries} כניסות מחדש)`
                      : ``}
                  </th>

                  <th className="smaller-on-mobile players-final-table-cell px-3 py-5 font-medium">
                    {finalTableData}
                  </th>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
