import {
  fetchPlayersPrizes,
  fetchRSVPAndArrivalData,
  fetchTodayPlayersPhoneNumbers,
  fetchUserById,
  getAllPlayers,
  getTodayTournamentsAdjustments,
} from '@/app/lib/data';
import NoPermissionsPage from '@/app/ui/client/NoPermissionsPage';
import React from 'react';
import CurrentTournamentIncomeDetailsPage from '@/app/ui/client/CurrentTournamentIncomeDetailsPage';
import { getDayOfTheWeek, getTodayShortDate } from '@/app/lib/serverDateUtils';
import RegisterSave from '@/app/ui/client/RegisterSave';
import TodayTournamentNameCardWrapper from '@/app/ui/client/TodayTournamentNameCardWrapper';
import {
  getFinalTablePlayersContent,
  getPlayersPrizesContent,
} from '@/app/ui/client/helpers';

export default async function DetailsPage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await fetchUserById(params.userId);
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;

  if (!isAdmin && !isWorker) {
    return <NoPermissionsPage />;
  }

  const dayOfTheWeek = getDayOfTheWeek();

  const { todayTournaments } = await fetchRSVPAndArrivalData(dayOfTheWeek);
  const todayTournamentsAdjustments = await getTodayTournamentsAdjustments();
  todayTournaments.forEach((t) => {
    t.adjustments = todayTournamentsAdjustments.filter(
      (a) => a.tournament_id === t.id,
    );
  });
  const noTournamentsToday =
    todayTournaments.length === 0 ||
    !todayTournaments.find((t) => t.max_players > 0 || !t.rsvp_required);

  if (noTournamentsToday) {
    return <div className="full-width w-full">אין נתונים</div>;
  }
  const now = new Date().getTime();
  const tournamentStart = now - 15 * 60 * 60 * 1000;
  /*
  type: 'wire',
  updated_at: 2024-10-15T12:03:13.134Z
 */
  const todayTournamentsIds = todayTournaments.map((t) => t.id);
  const allPlayers = await getAllPlayers();
  const playersWithHistoryLogRelevantForToday = allPlayers
    .map((p) => ({
      ...p,
      historyLog: (p.historyLog ?? []).filter((item) => {
        if (item.archive) {
          return false;
        }
        if (item.change > 0) {
          return false;
        }
        if (
          !item.tournament_id ||
          !todayTournamentsIds.includes(item.tournament_id)
        ) {
          return false;
        }
        if (new Date(item.updated_at).getTime() < tournamentStart) {
          return false;
        }
        return true;
      }),
    }))
    .filter((p) => p.historyLog && p.historyLog.length);

  // console.log('## allPlayers',allPlayers.filter(p=> p.historyLog && p.historyLog.length))
  return (
    <CurrentTournamentIncomeDetailsPage
      todayTournaments={todayTournaments}
      players={playersWithHistoryLogRelevantForToday}
      userId={params.userId}
      refreshEnabled={user.refresh_enabled}
    />
  );
}
