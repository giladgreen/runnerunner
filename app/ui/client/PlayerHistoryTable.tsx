'use client';
import { formatCurrency, formatType } from '@/app/lib/utils';
import { PlayerDB } from '@/app/lib/definitions';
import { formatDateToLocal, getTime } from '@/app/lib/clientDateUtils';

export default function PlayerHistoryTable({ player }: { player: PlayerDB }) {
  const balances = [] as number[];

  const historyLog = player.historyLog
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
      {historyLog.map((log) => {
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
  );
}
