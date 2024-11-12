'use client';

import { PlayerDB, TournamentDB, TRANSLATIONS } from '@/app/lib/definitions';
import {
  getCurrentDate,
  getDayOfTheWeek,
  getTodayDate,
} from '@/app/lib/clientDateUtils';
import RSVPButton from '@/app/ui/client/RSVPButton';
import { Switch } from '@nextui-org/react';
import BlurFade from '@/app/ui/components/ui/blur-fade';

export function getRSVPSForTheNextWeek(
  tournaments: TournamentDB[],
  player: PlayerDB,
  isPlayerPage: boolean,
) {
  const dayOfTheWeek = getDayOfTheWeek();
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const today = days.indexOf(dayOfTheWeek);
  const tournamentsToRegister = tournaments.filter(
    (tournament) =>
      days.indexOf(tournament.day) >= today &&
      (!tournament.rsvp_required || tournament.max_players !== 0),
  );

  if (tournamentsToRegister.length === 0) {
    return null;
  }

  const rsvpsForTheNextWeek = tournamentsToRegister.filter(tournament => !tournament.rsvp_required || tournament.max_players !== 0).map((tournament, index) => {
    const tournamentDayIndex = days.indexOf(tournament.day);
    const date = getCurrentDate(
      getCurrentDate().getTime() +
        1000 * 60 * 60 * 24 * (tournamentDayIndex - today),
    );
    const dayOfTheWeek = getDayOfTheWeek(date.getTime());
    const stringDate = date.toISOString().slice(0, 10);

    const tournamentMaxPlayers = tournament.max_players;
    const tournamentCurrentRegisteredPlayers = tournament.rsvpForToday;
    const placesLeft =
      tournamentMaxPlayers - tournamentCurrentRegisteredPlayers;

    const isPlayerRsvpForDate = Boolean(
      player.rsvps.find(
        (r) =>
          new Date(r.date).toISOString().slice(0, 10) === stringDate &&
          r.tournamentId === tournament.id,
      ),
    );

    // @ts-ignore
    let text = ` ${TRANSLATIONS[dayOfTheWeek]} - ${tournament.name}   `;
    let boldText = '';
    if (!tournament.rsvp_required) {
      text += '(אין צורך ברישום)';
    } else {
      if (tournamentCurrentRegisteredPlayers >= tournamentMaxPlayers) {
        text += '(אין יותר מקום)';
      } else if (placesLeft <= 20) {
        text += `(נשארו ${placesLeft} מקומות אחרונים)`;
      }
      if (isPlayerPage) {
        boldText = isPlayerRsvpForDate
          ? 'אתה רשום לטורניר זה'
          : ' אינך רשום לטורניר';
      } else {
        boldText = isPlayerRsvpForDate
          ? ' השחקן רשום לטורניר'
          : ' השחקן אינו רשום לטורניר';
      }
    }

    const item = (
      <div key={tournament.id} className="tournament_rsvp_line">
        {tournament.rsvp_required ? (
          tournament.max_players === 0 ? (
            ''
          ) : (
            <RSVPButton
              isPlayerPage={isPlayerPage}
              disabled={
                tournamentCurrentRegisteredPlayers >= tournamentMaxPlayers
              }
              player={player}
              stringDate={stringDate}
              text={text}
              boldText={boldText}
              tournamentId={tournament.id}
            />
          )
        ) : (
          <div style={{ display: 'flex' }}>
            {text}
          </div>
        )}
      </div>
    );

    return isPlayerPage ? <BlurFade delay={index * 0.6}><div className="user-tournament-rsvp-item">{item}</div></BlurFade> : item;
  });

  return rsvpsForTheNextWeek;
}
