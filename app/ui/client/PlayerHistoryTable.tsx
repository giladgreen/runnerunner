'use client';
import { formatCurrency, formatType } from '@/app/lib/utils';
import { PlayerDB } from '@/app/lib/definitions';
import { formatDateToLocal, getTime } from '@/app/lib/clientDateUtils';
import React from 'react';

export default function PlayerHistoryTable({ player }: { player: PlayerDB }) {
  const balances = [] as number[];

  const historyLogs = player.historyLog
    ?.filter((log) => log.type === 'credit')
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
    <div style={{ width: '100%' }}>
      <div className="md:hidden">
        {historyLogs.map((log) => {
          return (
            <div
              key={log.id}
              className="history-table-log"
            >
              <div className="flex ">
                <div style={{ marginLeft: 3 }}> שינוי:</div>
                <div style={{ marginLeft: 30 }}>
                  {' '}
                  {formatCurrency(log.change)}
                </div>
                <div style={{ marginLeft: 3 }}>סוג:</div>
                <div>{formatType(log.type)}</div>
              </div>
              <div className="flex " style={{ marginBottom: 20 }}>
                <div style={{ marginLeft: 3 }}>סיבה:</div>
                <div>{log.note}</div>
              </div>
              <div>
                <div className="flex ">
                  <div style={{ marginLeft: 3 }}> קרדיט מעודכן:</div>
                  <div> {formatCurrency(log.currentBalance)}</div>
                </div>
                <div>
                  {formatDateToLocal(log.updated_at)}, {getTime(log.updated_at)}
                </div>

                <div className="flex " style={{ marginTop: 6 }}>
                  <div style={{ marginLeft: 3 }}> עודכן על ידי:</div>
                  <div>{log.updated_by}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <table className="rtl  min-w-full md:table hide-mobile">
        <thead className="rtl rounded-lg text-left  font-normal hide-mobile">
          <tr>
            <th
              scope="col"
              className="px-4 py-5 font-medium sm:pl-6 align-text-right"

            >
              שינוי
            </th>
            <th
              scope="col"
              className="px-3 py-5 font-medium align-text-right"

            >
              סוג
            </th>
            <th
              scope="col"
              className="px-3 py-5 font-medium align-text-right"

            >
              סיבה
            </th>
            <th
              scope="col"
              className="px-3 py-5 font-medium align-text-right"

            >
              קרדיט מעודכן
            </th>

            <th
              scope="col"
              className="px-3 py-5 font-medium align-text-right"

            >
              עודכן על ידי
            </th>
            <th
              scope="col"
              className="px-3 py-5 font-medium align-text-right"

            >
              תאריך עדכון
            </th>
          </tr>
        </thead>
        <tbody className="rtl hide-mobile">
          {historyLogs?.map((log) => (
            <tr
              key={player.id}
              className="rtl w-full border-b py-3  last-of-type:border-none  "
            >
              <td
                className="ltr rsvp-icon whitespace-nowrap px-3 py-3 align-text-right"

              >
                {formatCurrency(log.change)}
              </td>
              <td className="rsvp-icon whitespace-nowrap px-3 py-3 ">
                {formatType(log.type)}
              </td>
              <td className="rsvp-icon whitespace-nowrap px-3 py-3 ">
                {log.note}
              </td>
              <td
                className="ltr rsvp-icon whitespace-nowrap px-3 py-3 align-text-right"

              >
                {formatCurrency(log.currentBalance)}
              </td>
              <td className="rsvp-icon whitespace-nowrap px-3 py-3 ">
                <div>{log.updated_by}</div>
              </td>

              <td className="rsvp-icon whitespace-nowrap px-3 py-3 ">
                {formatDateToLocal(log.updated_at)}, {getTime(log.updated_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
