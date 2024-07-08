import {formatDateToLocal, formatCurrency, getTime, formatType} from '@/app/lib/utils';
import {PlayerDB} from "@/app/lib/definitions";

export default async function HistoryTable({
   player,
    isRestrictedData
}: {
    player: PlayerDB;
    isRestrictedData: boolean
}) {
    const balances = [] as number[];

    const historyLog = player.historyLog?.filter(log => !isRestrictedData || log.type === 'credit').map((log, index) => {
        if (index === 0) {
            balances.push(log.change);
        }
        if ((log.type === 'credit' || log.type === 'credit_to_other' || log.type === 'prize') && index > 0) {
            balances.push(balances[balances.length - 1] + log.change);
        }

        let currentBalance = balances[balances.length -1];

        return {
            ...log,
            currentBalance
        }
    })

  return (
      <table className=" min-w-full text-gray-900 md:table">
        <thead className="rounded-lg text-left text-sm font-normal">
        <tr>
          <th scope="col" className="px-1 py-3 font-medium">
            Amount
          </th>
          <th scope="col" className="px-1 py-3 font-medium">
            Type
          </th>
          <th scope="col" className="px-1 py-3 font-medium">
            Note
          </th>

          <th scope="col" className="px-1 py-3 font-medium">
            Current Balance
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Date & Time
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Updated By
          </th>
        </tr>
        </thead>
        <tbody className="bg-white">
        {historyLog?.map((log) => (
            <tr
                key={log.id}
                className="w-full border-b py-1 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
            >
              <td className="whitespace-nowrap px-1 py-2">
                {formatCurrency(log.change)}
              </td>
              <td className="whitespace-nowrap px-1 py-2">
                {formatType(log.type)}
              </td>
              <td className="whitespace-nowrap px-1 py-2">
                {log.note}
              </td>

              <td className="whitespace-nowrap px-1 py-2">
                {formatCurrency(log.currentBalance)}
              </td>
              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                {formatDateToLocal(log.updated_at)}, {getTime(log.updated_at)}
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                {log.updated_by}
              </td>
            </tr>
        ))}
        </tbody>
      </table>
  );
}
