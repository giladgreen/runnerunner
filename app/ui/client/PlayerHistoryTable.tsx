'use client';
import {
  formatCurrency,
  formatCurrencyColor,
  formatType,
} from '@/app/lib/utils';
import { PlayerDB } from '@/app/lib/definitions';
import { formatDateToLocal, getTime } from '@/app/lib/clientDateUtils';
import Avatar from '@/app/ui/client/Avatar';
import Link from 'next/link';
import RSVPButton from '@/app/ui/client/RSVPButton';
import EntriesButton from '@/app/ui/client/EntriesButton';
import DeletePositionButton from '@/app/ui/client/DeletePositionButton';
import OpenCreditModalButton from '@/app/ui/client/OpenCreditModalButton';
import OpenPositionModalButton from '@/app/ui/client/OpenPositionModalButton';
import OpenPrizeModalButton from '@/app/ui/client/OpenPrizeModalButton';
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
              style={{
                width: '100%',
                padding: 20,
                border: '1px solid gray',
                borderRadius: 10,
                marginBottom: 10,
              }}
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
      <table className="rtl hidden min-w-full text-gray-900 md:table">
        <thead className="rtl rounded-lg text-left text-sm font-normal ">
          <tr>
            <th
              scope="col"
              className="px-4 py-5 font-medium sm:pl-6"
              style={{ textAlign: 'right' }}
            >
              שינוי
            </th>
            <th
              scope="col"
              className="px-3 py-5 font-medium"
              style={{ textAlign: 'right' }}
            >
              סוג
            </th>
            <th
              scope="col"
              className="px-3 py-5 font-medium"
              style={{ textAlign: 'right' }}
            >
              סיבה
            </th>
            <th
              scope="col"
              className="px-3 py-5 font-medium"
              style={{ textAlign: 'right' }}
            >
              קרדיט מעודכן
            </th>

            <th
              scope="col"
              className="px-3 py-5 font-medium"
              style={{ textAlign: 'right' }}
            >
              עודכן על ידי
            </th>
            <th
              scope="col"
              className="px-3 py-5 font-medium"
              style={{ textAlign: 'right' }}
            >
              תאריך עדכון
            </th>
          </tr>
        </thead>
        <tbody className="rtl bg-white">
          {historyLogs?.map((log) => (
            <tr
              key={player.id}
              className="rtl w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
            >
              <td
                className="ltr rsvp-icon whitespace-nowrap px-3 py-3 "
                style={{ textAlign: 'right' }}
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
                className="ltr rsvp-icon whitespace-nowrap px-3 py-3 "
                style={{ textAlign: 'right' }}
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
