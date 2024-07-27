import {
  formatDateToLocal,
  formatCurrency,
  getTime,
  formatType,
  formatCurrencyColor,
} from '@/app/lib/utils';
import { PlayerDB } from '@/app/lib/definitions';

export default async function HistoryTable({
  player,
  isRestrictedData,
}: {
  player: PlayerDB;
  isRestrictedData: boolean;
}) {
  const balances = [] as number[];

  const historyLog = player.historyLog
    ?.filter((log) => !isRestrictedData || log.type === 'credit')
    .map((log, index) => {
      if (index === 0) {
        balances.push(log.change);
      }
      if (
        (log.type === 'credit' ||
          log.type === 'credit_to_other' ||
          log.type === 'prize') &&
        index > 0
      ) {
        balances.push(balances[balances.length - 1] + log.change);
      }

      let currentBalance = balances[balances.length - 1];

      return {
        ...log,
        currentBalance,
      };
    });

  return (
    <table className=" rtl min-w-full text-gray-900 md:table">
      <thead className="rtl rounded-lg text-left text-sm font-normal">
        <tr>
          <th
            scope="col"
            className="smaller-on-mobile px-1 py-3 font-medium"
            style={{ textAlign: 'right' }}
          >
            סכום
          </th>
          <th
            scope="col"
            className="smaller-on-mobile px-1 py-3 font-medium"
            style={{ textAlign: 'right' }}
          >
            סוג
          </th>
          <th
            scope="col"
            className="smaller-on-mobile px-1 py-3 font-medium"
            style={{ textAlign: 'right' }}
          >
            הערה
          </th>

          <th
            scope="col"
            className="smaller-on-mobile px-1 py-3 font-medium"
            style={{ textAlign: 'right' }}
          >
            קרדיט נוכחי
          </th>
          <th
            scope="col"
            className="smaller-on-mobile px-3 py-5 font-medium"
            style={{ textAlign: 'right' }}
          >
            תאריך
          </th>
          <th
            scope="col"
            className="wide-screen smaller-on-mobile px-3 py-5 font-medium"
            style={{ textAlign: 'right' }}
          >
            עודכן על ידי
          </th>
        </tr>
      </thead>
      <tbody className="rtl bg-white">
        {historyLog?.map((log) => (
          <tr
            key={log.id}
            className="rtl w-full border-b py-1 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
          >
            <td
              className="ltr smaller-on-mobile whitespace-nowrap px-1 py-2"
              style={{
                textAlign: 'right',
                color: formatCurrencyColor(log.change),
              }}
            >
              {formatCurrency(log.change)}
            </td>
            <td
              className="smaller-on-mobile whitespace-nowrap px-1 py-2"
              style={{ textAlign: 'right' }}
            >
              {formatType(log.type)}
            </td>
            <td
              className="smaller-on-mobile whitespace-nowrap px-1 py-2"
              style={{ textAlign: 'right' }}
            >
              {log.note}
            </td>

            <td
              className="ltr smaller-on-mobile whitespace-nowrap px-1 py-2"
              style={{
                textAlign: 'right',
                color: formatCurrencyColor(log.currentBalance),
              }}
            >
              {formatCurrency(log.currentBalance)}
            </td>
            <td
              className="smaller-on-mobile-smaller whitespace-nowrap py-3 pl-6 pr-3"
              style={{ textAlign: 'right' }}
            >
              {formatDateToLocal(log.updated_at)}, {getTime(log.updated_at)}
            </td>
            <td
              className="wide-screen whitespace-nowrap px-3 py-3"
              style={{ textAlign: 'right' }}
            >
              {log.updated_by}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
