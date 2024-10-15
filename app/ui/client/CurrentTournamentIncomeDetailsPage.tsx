'use client';

import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import RSVPAndArrivalCardWrapper from '@/app/ui/client/RSVPAndArrivalCardWrapper';
import { PlayerDB, TournamentDB } from '@/app/lib/definitions';

export default function CurrentTournamentIncomeDetailsPage({
  todayTournaments,
  players,
}: {
  todayTournaments: TournamentDB[];
  players: PlayerDB[];
}) {
  if (todayTournaments.length === 0) {
    return null;
  }
  const rowsStyle = {
    fontSize: 20,
    marginTop: 15,
  };

  const cashStyle = {
    color: '#00AA00',
  };

  const wireStyle = {
    color: '#0000BB',
  };

  const creditStyle = {
    color: '#AA0033',
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
          } = todayTournament;

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
                <div
                  style={{
                    position: 'fixed',
                    top: 5,
                    left: 5,
                    textAlign: 'center',
                    background: 'orange',
                    padding: '5px 10px',
                    zIndex: 99,
                  }}
                >
                  {todayTournament.name}
                </div>
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
                  כניסות בקדריט: ₪{todayCreditIncome}
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
                  {details.cashPlayers.length && <div style={rowsStyle}>פירוט:</div>}
                  <div>
                    {details.cashPlayers.map((player) => {
                      return (
                        <div key={`cash_${player.id}`}>
                          {player.name} ₪
                          {player.historyLog.reduce((sum, curLog) => {
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
                  {details.wirePlayers.length && <div style={rowsStyle}>פירוט:</div>}
                  <div>
                    {details.wirePlayers.map((player) => {
                      return (
                          <div key={`wire_${player.id}`}>
                            {player.name} ₪
                            {player.historyLog.reduce((sum, curLog) => {
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
                  {details.creditPlayers.length && <div style={rowsStyle}>פירוט:</div>}
                  <div>
                    {details.creditPlayers.map((player) => {
                      return (
                          <div key={`credit_${player.id}`}>
                            {player.name} ₪
                            {player.historyLog.reduce((sum, curLog) => {
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
