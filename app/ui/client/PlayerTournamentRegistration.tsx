'use client';
import React from 'react';
// @ts-ignore
import { Circle as SpinningChip } from 'react-awesome-spinners'
import { usePathname } from 'next/navigation';
import { PlayerDB, TournamentDB, TRANSLATIONS } from '@/app/lib/definitions';
import BlurFade from '@/app/ui/components/ui/blur-fade';
import { rsvpPlayerForDay } from '@/app/lib/actions';
import ClockIcon from '@/app/ui/client/ClockIcon';
import SandClockIcon from '@/app/ui/client/SandClockIcon';
import FirstStageIcon from '@/app/ui/client/FirstStageIcon';
import InitialStackIcon from '@/app/ui/client/InitialStackIcon';
import DollarCircleIcon from '@/app/ui/client/DollarCircleIcon';
import RsvpArrowIcon from '@/app/ui/client/RsvpArrowIcon';

function getDate(date: string) {
  const dateArray = date.split('-');
  const year = dateArray[0].slice(2);
  const month = dateArray[1].startsWith('0') ? dateArray[1].slice(1) : dateArray[1];
  const day = dateArray[2].startsWith('0') ? dateArray[2].slice(1) : dateArray[2];
  return `${day}.${month}.${year}`;
}
const PlayerTournamentRegistration = ({
  tournament,
  stringDate,
  player,
  index,
  isPlayerRsvpForDate,
  dayOfTheWeek,
  playerRsvpEnabled,
}: {
  tournament: TournamentDB;
  stringDate: string;
  player: PlayerDB;
  index: number;
  isPlayerRsvpForDate: boolean;
  playerRsvpEnabled: boolean;
  dayOfTheWeek: string;
}) => {
  const page = usePathname();
  const [pending, setPending] = React.useState(false);
  const registrationNeeded = tournament.rsvp_required;
  const tournamentMaxPlayers = tournament.max_players;
  const tournamentCurrentRegisteredPlayers = tournament.rsvpForToday;
  const placesLeft = tournamentMaxPlayers - tournamentCurrentRegisteredPlayers;

  const tournamentDate = getDate(stringDate);
  return (
    <BlurFade key={tournament.id} delay={index * 0.4}>
      <div className="user-tournament-rsvp-item">
        <div key={tournament.id} className="tournament_rsvp_line">
          <div className="tournament_name">
            <b>{tournament.name}</b>
          </div>
          <div className="tournament_description">{tournament.description}</div>

          {/* day and hour */}
          <div className="tournament_time">
            <div className="tournament_time-clock">
              {' '}
              <ClockIcon />
            </div>
            <span className="tournament_time-start_time">
              {' '}
              {tournament.start_time}
            </span>
            <span className="tournament_time-day-of-week">
              {
                // @ts-ignore
                TRANSLATIONS[dayOfTheWeek]
              }
            </span>
            <span>{tournamentDate}</span>
          </div>

          <div className="tournament_divider" />

          {/* first data section: players count + phase long + first phase blinds  */}
          <div className="tournament-section">
            <div className="tournament-section-row">
              <div style={{ display: 'flex' }}>
                <div className="tournament-section-row-icon">
                  <SandClockIcon />
                </div>
                משך שלב
              </div>
              {tournament.phase_length} דק׳
            </div>
            <div className="tournament-section-row">
              <div style={{ display: 'flex' }}>
                <div className="tournament-section-row-icon">
                  <FirstStageIcon />
                </div>
                שלב ראשון
              </div>
              100/200
            </div>
            <div className="tournament-section-row">
              <div style={{ display: 'flex' }}>
                <div className="tournament-section-row-icon">
                  <InitialStackIcon />
                </div>
                ערימה התחלתית
              </div>
              {tournament.initial_stack.toLocaleString()}
            </div>
          </div>

          <div className="tournament-section">
            <div className="tournament-section-row">
              <div style={{ display: 'flex' }}>
                <div className="tournament-section-row-icon">
                  <DollarCircleIcon />
                </div>
                עלות כניסה ראשונה
              </div>
              ₪{tournament.buy_in}
            </div>
            <div className="tournament-section-row">
              <div style={{ display: 'flex' }}>
                <div className="tournament-section-row-icon">
                  <DollarCircleIcon />
                </div>
                עלות כניסה נוספת
              </div>
              ₪{tournament.re_buy}
            </div>
            <div className="tournament-section-row">
              <div style={{ display: 'flex' }}>
                <div className="tournament-section-row-icon tournament-section-row-icon-clock">
                  <ClockIcon />
                </div>
                כניסה מאוחרת
              </div>

              <div style={{ display: 'flex' }}>
                עד שלב {tournament.last_phase_for_rebuy}
              </div>
            </div>
          </div>
          <div
            className={`tournament-rsvp-status-section ${registrationNeeded ? (isPlayerRsvpForDate ? 'tournament-rsvp-status-section-registered' : 'tournament-rsvp-status-section-unregistered') : 'tournament-rsvp-status-section-no-registration-needed'}`}
          >
            <div style={{ width: 20, position: 'relative', top: 9 }}>
              <RsvpArrowIcon />
            </div>
            {registrationNeeded
              ? isPlayerRsvpForDate
                ? 'אתה רשום לטורניר '
                : ' אינך רשום לטורניר'
              : 'אין צורך ברישום'}
          </div>

          {registrationNeeded && playerRsvpEnabled && (
            <div
              className={`tournament-rsvp-button-section ${isPlayerRsvpForDate || placesLeft === 0 ? 'tournament-rsvp-button-section-registered' : 'tournament-rsvp-button-section-unregistered'}`}
              onClick={() => {
                setPending(true);
                rsvpPlayerForDay(
                  player.phone_number,
                  stringDate,
                  tournament.id,
                  !isPlayerRsvpForDate,
                  page,
                );
                setTimeout(() => {
                  setPending(false);
                }, 1200);
              }}
            >
              {!pending && placesLeft > 0 && ( <>
                {isPlayerRsvpForDate ? 'לביטול הרשמה' : 'להרשמה'}
                <span > &larr;</span>
              </>)}
              {!pending && placesLeft === 0 && ( <>
                לא נותרו מקומות להערב
              </>)}

                {pending && (  <SpinningChip color="var(--white)" size={20} />)}

            </div>
          )}
        </div>
      </div>
    </BlurFade>
  );
};

export default PlayerTournamentRegistration;
