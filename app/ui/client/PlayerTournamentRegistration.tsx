'use client';
import React from 'react';
import {
 ArrowDownLeftIcon, BanknotesIcon,
   ClockIcon, UsersIcon
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { PlayerDB, TournamentDB, TRANSLATIONS } from '@/app/lib/definitions';
import BlurFade from '@/app/ui/components/ui/blur-fade';
import { BookmarkIcon, BookmarkSlashIcon, CircleStackIcon } from '@heroicons/react/24/solid';
import { rsvpPlayerForDay } from '@/app/lib/actions';
import Spinner from '@/app/ui/client/Spinner';
import { RingLoader } from 'react-spinners';

//TODO: extract all style into classes

const PlayerTournamentRegistration= ({
                                                       tournament,
                                                       stringDate,
                                                       player,
                                                       index,
                                                       isPlayerRsvpForDate,dayOfTheWeek
}: {tournament: TournamentDB,stringDate:string, player:PlayerDB, index: number, isPlayerRsvpForDate:boolean, dayOfTheWeek:string})=>  {
const page =  usePathname();
const [pending, setPending] = React.useState(false);
  const registrationNeeded = tournament.rsvp_required;
  const tournamentMaxPlayers = tournament.max_players;
  const tournamentCurrentRegisteredPlayers = tournament.rsvpForToday;
  const placesLeft =
    tournamentMaxPlayers - tournamentCurrentRegisteredPlayers;

  const timeBeforeLastRebuy = (tournament.last_phase_for_rebuy + 2 ) * tournament.phase_length;
  const date = new Date('2024-01-01T' + tournament.start_time + ':00');
  const endDate = new Date(date.getTime() + (timeBeforeLastRebuy * 60_000));
  const endDateTime = endDate.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

  return  <BlurFade key={tournament.id} delay={index * 0.6}>
    <div className="user-tournament-rsvp-item">
      <div
        key={tournament.id}
        className="tournament_rsvp_line"
        style={{ display: 'block', margin: '15px 0' }}
      >
        {/* day and hour */}
        <div
          className="tournament-data"
        >
                <span>
                  {' '}
                  {
                    // @ts-ignore
                    TRANSLATIONS[dayOfTheWeek]
                  }{' '}
                </span>
          <div style={{ display: 'flex' }}>
            {tournament.start_time}
            <ClockIcon style={{ width: 20, marginRight: 6 }} />
          </div>
        </div>
        {/* tournament name */}
        <div
          style={{
            width: '100%',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <b>{tournament.name}</b>
        </div>
        {/* first data section: players count + phase long + first phase blinds  */}
        <div
          style={{
            width: '95%',
            margin: 10,
            background: '#cfcfcf44',
            borderRadius: 5,
            padding: 6,
          }}
        >
          <div
            style={{
              display: 'block',
              alignItems: 'right',
              textAlign: 'right',
              paddingRight: 0,
              fontSize: 15,
            }}
          >
            <div
              style={{
                width: '100%',
                alignItems: 'right',
                textAlign: 'right',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}
            >
              <div style={{ display: 'flex' }}>
                <UsersIcon style={{ width: 20, marginLeft: 6 }} />
                שחקנים
              </div>
              {tournamentCurrentRegisteredPlayers}
              /
              {tournamentMaxPlayers}
            </div>

            <div
              style={{
                width: '100%',
                alignItems: 'right',
                textAlign: 'right',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}
            >
              <div style={{ display: 'flex' }}>
                <ClockIcon style={{ width: 20, marginLeft: 6 }} />
                משך שלב
              </div>
              {tournament.phase_length}  דקות
            </div>

            <div
              style={{
                width: '100%',
                alignItems: 'right',
                textAlign: 'right',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex' }}>
                <BanknotesIcon style={{ width: 20, marginLeft: 6 }} />
                שלב ראשון
              </div>
              200
              /
              100
            </div>
          </div>
        </div>
        {/* second data section: stuck size, entry, re-entry, late reg  */}
        <div
          style={{
            width: '95%',
            margin: 10,
            background: '#cfcfcf44',
            borderRadius: 5,
            padding: 6,
          }}
        >
          <div
            style={{
              display: 'block',
              alignItems: 'right',
              textAlign: 'right',
              paddingRight: 0,
              fontSize: 15,
            }}
          >
            <div
              style={{
                width: '100%',
                alignItems: 'right',
                textAlign: 'right',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}
            >
              <div style={{ display: 'flex' }}>
                <CircleStackIcon style={{ width: 20, marginLeft: 6 }} />
                ערימה התחלתית
              </div>
              { tournament.initial_stack.toLocaleString()}
            </div>

            <div
              style={{
                width: '100%',
                alignItems: 'right',
                textAlign: 'right',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}
            >
              <div style={{ display: 'flex' }}>
                <BanknotesIcon style={{ width: 20, marginLeft: 6 }} />
                כניסה ראשונה
              </div>
              ₪{tournament.buy_in}
            </div>

            <div
              style={{
                width: '100%',
                alignItems: 'right',
                textAlign: 'right',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}
            >
              <div style={{ display: 'flex' }}>
                <BanknotesIcon style={{ width: 20, marginLeft: 6 }} />
                כניסה נוספת
              </div>
              ₪{tournament.re_buy}
            </div>
            <div
              style={{
                width: '100%',
                alignItems: 'right',
                textAlign: 'right',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex' }}>
                <ClockIcon style={{ width: 20, marginLeft: 6 }} />
                כניסה מאוחרת, עד שלב
               <span style={{ margin: '0 3px' }}> {tournament.last_phase_for_rebuy}</span>
              </div>

              <div style={{ display: 'flex' }}>
                ±
                {endDateTime}
              </div>

            </div>
          </div>
        </div>

        {/* third data section: registry  */}
        <div
          style={{
            width: '95%',
            margin: 10,
            background: isPlayerRsvpForDate ? '#ccffcc44':'#ffcccc44',
            borderRadius: 5,
            padding: 6,
          }}
        >
          <div
            style={{
              display: 'block',
              alignItems: 'right',
              textAlign: 'right',
              paddingRight: 0,
              fontSize: 15,
            }}
          >
            <div
              style={{
                width: '100%',
                alignItems: 'right',
                textAlign: 'right',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}
            >
              <div style={{ display: 'flex' }}>
                <ArrowDownLeftIcon
                  style={{ width: 20, marginLeft: 6 }}
                />
                <b>רישום</b>
              </div>
            </div>

            <div
              style={{
                width: '100%',
                alignItems: 'right',
                textAlign: 'right',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}
            >
              <div style={{ display: 'flex' }}>
                {isPlayerRsvpForDate ? (
                  <BookmarkIcon style={{ width: 20, marginLeft: 6 }} />
                ) : (
                  <BookmarkSlashIcon
                    style={{ width: 20, marginLeft: 6 }}
                  />
                )}
                {registrationNeeded ? (isPlayerRsvpForDate ? 'אתה רשום לטורניר זה' : ' אינך רשום לטורניר') : 'אין צורך ברישום'}
              </div>
            </div>

            {registrationNeeded && placesLeft > 0 && <div
              style={{
                width: '100%',
                alignItems: 'right',
                textAlign: 'right',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ textAlign:'left', alignItems:'left', width:'100%', fontSize:20, cursor:'pointer' }}>
                {!pending && <u
                  onClick={()=>{
                    setPending(true);
                    console.log('## calling rsvpPlayerForDay', player.phone_number, stringDate, tournament.id, !isPlayerRsvpForDate);
                    rsvpPlayerForDay(
                      player.phone_number,
                      stringDate,
                      tournament.id,
                      !isPlayerRsvpForDate,
                      page,
                    );
                    setTimeout(()=>{
                      setPending(false);
                    },2300);
                  }}
                >
                 { isPlayerRsvpForDate ? ' לביטול רישום' : ' לרישום לטורניר'}

               </u>}
                {pending && <div style={{ textAlign:'left', alignItems:'left', width:'100%', paddingRight:'70%' }}>
                  <RingLoader color="var(--white)" loading={true} size={35}/>
                </div>}
              </div>

            </div>}
            {!registrationNeeded && <div
              style={{
                width: '100%',
                alignItems: 'right',
                textAlign: 'right',
                display: 'flex',
                justifyContent: 'space-between',

              }}
            >
              <div style={{ textAlign: 'left', alignItems: 'left', width: '100%', fontSize: 20, cursor: 'pointer', color: 'transparent' }}>
                ...
              </div>

              </div>
              }
              {registrationNeeded && placesLeft < 1 && <div
                style={{
                  width: '100%',
                  alignItems: 'right',
                  textAlign: 'right',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ textAlign: 'left', alignItems: 'left', width: '100%', fontSize: 20 }}>
                  <b> לא נותרו מקומות</b>

                </div>

              </div>}
            </div>
              </div>
              </div>
              </div>
              </BlurFade>

            }


            export default PlayerTournamentRegistration;
