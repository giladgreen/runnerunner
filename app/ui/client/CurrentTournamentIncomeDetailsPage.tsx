'use client';

import React, { useEffect } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import RSVPAndArrivalCardWrapper from '@/app/ui/client/RSVPAndArrivalCardWrapper';
import {
  PlayerDB,
  TournamentDB,
  TournamentsAdjustmentsDB,
} from '@/app/lib/definitions';
import OpenTournamentAdjustmentChangeModalButton from '@/app/ui/client/OpenTournamentAdjustmentChangeModalButton';
import {
  DeleteTournamentAdjustmentLog,
  TournamentAdjustmentLog,
} from '@/app/lib/actions';
import Button from '@/app/ui/client/Button';
import { useFormState } from 'react-dom';
import { usePathname, useSearchParams } from 'next/navigation';

export default function CurrentTournamentIncomeDetailsPage({
  todayTournaments,
  players,
  userId,
  refreshEnabled,
  todayTournamentAdjustments,
}: {
  todayTournaments: TournamentDB[];
  todayTournamentAdjustments: TournamentsAdjustmentsDB[];
  players: PlayerDB[];
  userId: string;
  refreshEnabled: boolean;
}) {
  useEffect(() => {
    const id = setInterval(async () => {
      if (!refreshEnabled) {
        return;
      }
      console.log('## refreshing page');
      window.location.reload();
    }, 30_000);

    return () => clearInterval(id);
  }, []);

  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;

  if (todayTournaments.length === 0) {
    return null;
  }
  const rowsStyle = {
    fontSize: 20,
    marginTop: 15,
  };

  const cashStyle = {
    color: 'var(--green)',
  };

  const wireStyle = {
    color: 'var(--blue-light)',
  };

  const creditStyle = {
    color: 'var(--red-light)',
  };

  return (
    <div className="rtl">
      <Tabs>
        <TabList>
          {todayTournaments.map((todayTournament) => (
            <Tab key={todayTournament.id}> {todayTournament.name}</Tab>
          ))}
        </TabList>

        {todayTournaments.map((todayTournament, index) => {
          const {
            rsvpForToday,
            arrivedToday,
            todayCreditIncome,
            todayCashIncome,
            todayTransferIncome,
            reEntriesCount,
            adjustments,
          } = todayTournament;

          const tournamentAdjustments = todayTournamentAdjustments.filter(
            (item) => item.tournament_id === todayTournament.id,
          );
          players.forEach((player) => {
            const ids = player.historyLog.map((entry) => entry.id);
            const playerTournamentAdjustments = tournamentAdjustments.filter(
              (item) => ids.includes(item.history_log_id),
            );

            playerTournamentAdjustments.forEach((adjustment) => {
              if (
                !player.historyLog.find((item) => item.id === adjustment.id)
              ) {
                player.historyLog.push({
                  id: adjustment.id,
                  change: adjustment.change * -1,
                  tournament_id: adjustment.tournament_id,
                  type: adjustment.type,
                } as any);
              }
            });
          });
          const cashPlayers = players.filter(
            (p) =>
              p.historyLog.filter(
                (entry) =>
                  entry.tournament_id === todayTournament.id &&
                  entry.type === 'cash',
              ).length > 0,
          );

          const creditPlayers = players.filter(
            (p) =>
              p.historyLog.filter(
                (entry) =>
                  entry.tournament_id === todayTournament.id &&
                  entry.type === 'credit',
              ).length > 0,
          );
          const wirePlayers = players.filter(
            (p) =>
              p.historyLog.filter(
                (entry) =>
                  entry.tournament_id === todayTournament.id &&
                  entry.type === 'wire',
              ).length > 0,
          );

          const details = {
            amountOfCashEntries: cashPlayers.reduce((all, curPlayer) => {
              return (
                all +
                curPlayer.historyLog.filter(
                  (entry) =>
                    entry.tournament_id === todayTournament.id &&
                    entry.type === 'cash',
                ).length
              );
            }, 0),
            cashPlayers,
            amountOfCreditEntries: creditPlayers.reduce((all, curPlayer) => {
              return (
                all +
                curPlayer.historyLog.filter(
                  (entry) =>
                    entry.tournament_id === todayTournament.id &&
                    entry.type === 'credit',
                ).length
              );
            }, 0),
            creditPlayers,

            amountOfWireEntries: wirePlayers.reduce((all, curPlayer) => {
              return (
                all +
                curPlayer.historyLog.filter(
                  (entry) =>
                    entry.tournament_id === todayTournament.id &&
                    entry.type === 'wire',
                ).length
              );
            }, 0),
            wirePlayers,
          };

          return (
            <TabPanel key={todayTournament.id}>
              <div className="full-width w-full">
                {adjustments && adjustments.length > 0 && (
                  <div
                    style={rowsStyle}
                    className="full-width flex w-full items-center justify-between"
                  >
                    שינויים ידניים:
                  </div>
                )}
                {adjustments && adjustments.length > 0 && (
                  <div>
                    {adjustments.map((adjustment) => {
                      const deleteTournamentAdjustmentLogWithExtraData =
                        DeleteTournamentAdjustmentLog.bind(null, {
                          prevPage,
                          adjustmentId: adjustment.id,
                          userId,
                        });

                      const money = `₪${Math.abs(Number(adjustment.change))}${
                        adjustment.change < 0 ? '-' : ' '
                      }`;

                      return (
                        <div key={adjustment.id} style={{ margin: '15px 0' }}>
                          <div>
                            <span style={{ margin: '0 5px' }}>שינוי של</span>
                            <span style={{ margin: '0 5px' }}>{money}</span>
                            <span style={{ margin: '0 5px' }}>
                              ב
                              {adjustment.type === 'cash'
                                ? 'מזומן'
                                : 'העברות בנקאיות'}
                            </span>
                          </div>
                          <div>{adjustment.reason}</div>

                          <form
                            // @ts-ignore
                            action={deleteTournamentAdjustmentLogWithExtraData}
                          >
                            <div
                              style={{
                                border: '1px solid black',
                                maxWidth: 60,
                                textAlign: 'center',
                                borderRadius: 6,
                              }}
                            >
                              <button type="submit">מחק</button>
                            </div>
                          </form>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div
                  style={rowsStyle}
                  className="full-width flex w-full items-center justify-between"
                >
                  <OpenTournamentAdjustmentChangeModalButton
                    tournamentId={todayTournament.id}
                    userId={userId}
                  />
                </div>
                <hr style={rowsStyle}></hr>
                <div
                  style={rowsStyle}
                  className="full-width flex w-full items-center justify-between"
                >
                  אישורי הגעה: {rsvpForToday}
                </div>
                <div
                  style={rowsStyle}
                  className="full-width flex w-full items-center justify-between"
                >
                  הגיעו בפועל: {arrivedToday}
                </div>
                <div
                  style={rowsStyle}
                  className="full-width flex w-full items-center justify-between"
                >
                  מספרי הריביי: {reEntriesCount}
                </div>
                <div
                  style={{ ...rowsStyle, ...cashStyle }}
                  className="full-width flex w-full items-center justify-between"
                >
                  הכנסה ממזומן: ₪{todayCashIncome}
                </div>
                <div
                  style={{ ...rowsStyle, ...wireStyle }}
                  className="full-width flex w-full items-center justify-between"
                >
                  הכנסה מהעברה בנקאית: ₪{todayTransferIncome}
                </div>
                <div
                  style={{ ...rowsStyle, ...creditStyle }}
                  className="full-width flex w-full items-center justify-between"
                >
                  כניסות בקרדיט: ₪{todayCreditIncome}
                </div>
                <hr style={rowsStyle}></hr>
                <div style={{ ...rowsStyle, ...cashStyle }}>
                  <div style={rowsStyle}>
                    מספר הכניסות במזומן:
                    {details.amountOfCashEntries}
                  </div>
                  <div style={rowsStyle}>
                    שחקנים שנכנסו במזומן:
                    {details.cashPlayers.length}
                  </div>
                  {details.cashPlayers.length && (
                    <div style={rowsStyle}>פירוט:</div>
                  )}
                  <div>
                    {details.cashPlayers.map((player) => {
                      return (
                        <div key={`cash_${player.id}`}>
                          {player.name} ₪
                          {player.historyLog
                            .filter((item) => item.type === 'cash')
                            .reduce((sum, curLog) => {
                              return sum + -1 * curLog.change;
                            }, 0)}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <hr style={rowsStyle}></hr>
                <div style={{ ...rowsStyle, ...wireStyle }}>
                  <div style={rowsStyle}>
                    מספר הכניסות בהעברה בנקאית:
                    {details.amountOfWireEntries}
                  </div>
                  <div style={rowsStyle}>
                    שחקנים שנכנסו במזומן:
                    {details.wirePlayers.length}
                  </div>
                  {details.wirePlayers.length && (
                    <div style={rowsStyle}>פירוט:</div>
                  )}
                  <div>
                    {details.wirePlayers.map((player) => {
                      return (
                        <div key={`wire_${player.id}`}>
                          {player.name} ₪
                          {player.historyLog
                            .filter((item) => item.type === 'wire')
                            .reduce((sum, curLog) => {
                              return sum + -1 * curLog.change;
                            }, 0)}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <hr style={rowsStyle}></hr>
                <div style={{ ...rowsStyle, ...creditStyle }}>
                  <div style={rowsStyle}>
                    מספר הכניסות בקרדיט:
                    {details.amountOfCreditEntries}
                  </div>
                  <div style={rowsStyle}>
                    שחקנים שנכנסו במזומן:
                    {details.creditPlayers.length}
                  </div>
                  {details.creditPlayers.length && (
                    <div style={rowsStyle}>פירוט:</div>
                  )}
                  <div>
                    {details.creditPlayers.map((player) => {
                      return (
                        <div key={`credit_${player.id}`}>
                          {player.name} ₪
                          {player.historyLog
                            .filter((item) => item.type === 'credit')
                            .reduce((sum, curLog) => {
                              return sum + -1 * curLog.change;
                            }, 0)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabPanel>
          );
        })}
      </Tabs>
    </div>
  );
}
