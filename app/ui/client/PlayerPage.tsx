import {formatCurrency} from "@/app/lib/utils";
import {
    fetchFeatureFlags,
    fetchPlayerByUserId,
    fetchRsvpCountForTodayTournament,
    fetchTournamentByDay,
    fetchPlayerCurrentTournamentHistory
} from "@/app/lib/data";
import Image from "next/image";
import HistoryTable from "@/app/ui/client/HistoryTable";
import {rsvpPlayerForDay} from "@/app/lib/actions";
import TournamentsHistoryTable from "@/app/ui/client/TournamentsHistoryTable";
import { TRANSLATIONS} from "@/app/lib/definitions";
import PlayersPrizesPage from "@/app/[userId]/prizes/PlayersPrizesPage";
import Card from "@/app/ui/client/Card";
import {PlayerSetupNameModal} from "@/app/ui/client/PlayerSetupNameModal";



const NO_NEED_FOR_RSVP = 'אין צורך ברישום לטורניר של היום';
const YOU_ARE_ALREADY_REGISTERED = 'אתה רשום לטורניר של היום';
const YOU = 'אתה';
const ARE_NOT = 'לא';
const REGISTERED_FOR_TODAY = 'רשום לטורניר של היום';
const YOU_ARE_NOT_REGISTERED =<span>{YOU}<b> {ARE_NOT}</b> {REGISTERED_FOR_TODAY}</span>
const NO_TOURNAMENT_TODAY = 'אין טורניר היום';
const NO_MORE_SPOTS = 'אין יותר מקום לטורניר של היום';
const CLICK_HERE_TO_UNREGISTER = 'לביטול הרשמה לחץ כאן';
const CLICK_HERE_TO_REGISTER = 'לרישום לחץ כאן';
const YOU_ARE_ALREADY_IN_THE_GAME = 'אתה כבר במשחק';

export default async function PlayerPage({ params }: { params: { userId: string } }) {
    const {rsvpEnabled, playerRsvpEnabled} = await fetchFeatureFlags();
    const showRsvp = rsvpEnabled && playerRsvpEnabled;

    const player = await fetchPlayerByUserId(params.userId);
    if (!player) {
        return (
            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
                <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
                    <div>
                        No data for this player yet..
                    </div>
                    <div>
                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                        To reserve a spot for today's tournament, please contact us by whatsapp: 050-8874068
                    </div>
                </div>
            </div>
        );
    }
    if (player.name === 'UNKNOWN PLAYER') {
        return <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
            <PlayerSetupNameModal player={player}/>
        </div>
    }


    const todayTournament = await fetchTournamentByDay();
    const playerCurrentTournamentHistory = await fetchPlayerCurrentTournamentHistory(player.phone_number);
    const playerArrived = playerCurrentTournamentHistory.filter(({type}) => type !== 'credit_to_other').length > 0;
    const showUnregisterButton = playerCurrentTournamentHistory.filter(({type}) => type !== 'credit_to_other').length === 0;
    const rsvpCountForTodayTournament = await fetchRsvpCountForTodayTournament();

    const {rsvp_required, max_players} = todayTournament;

    const noTournamentToday = rsvp_required && max_players === 0;
    // @ts-ignore
    const todayTournamentData = noTournamentToday ? NO_TOURNAMENT_TODAY : `${TRANSLATIONS[todayTournament.day]} -  ${todayTournament.max_players === 0 && todayTournament.rsvp_required ? 'אין טורניר היום' : todayTournament.name}`;
    // @ts-ignore
    const isRegisterForTodayTournament = player.rsvpForToday;
    const isFull = rsvpCountForTodayTournament >= max_players;

    const separator = <hr style={{marginTop: 20, marginBottom: 20}}/>;

    const registrationStatus = isFull ? (isRegisterForTodayTournament ? (playerArrived ? YOU_ARE_ALREADY_IN_THE_GAME : YOU_ARE_ALREADY_REGISTERED) : NO_MORE_SPOTS) : (isRegisterForTodayTournament ? YOU_ARE_ALREADY_REGISTERED : YOU_ARE_NOT_REGISTERED)

    const onSubmit = async (_formData: FormData) => {
        'use server'
        const todayDate = (new Date()).toISOString().slice(0, 10);
        await rsvpPlayerForDay(player.phone_number, todayDate, !isRegisterForTodayTournament, `/${params.userId}`);
    };

    return (
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
                <div>
                    <Image
                        src={player.image_url}
                        alt={`${player.name}'s profile picture`}
                        className="mr-4 rounded-full zoom-on-hover"
                        width={55}
                        height={55}
                    />

                    <div className="truncate text-sm font-semibold md:text-base">
                        {player.name}
                    </div>

                    <div>{player.phone_number}  </div>

                    <h1 style={{zoom: 2}}><b>קרדיט: {formatCurrency(player.balance)}</b></h1>
                    {showRsvp && separator}
                    {showRsvp &&<Card title="טורניר היום" value={`${
                        // @ts-ignore
                        TRANSLATIONS[todayTournament.day]} -  ${todayTournament.max_players === 0 && todayTournament.rsvp_required ? 'אין טורניר היום' : todayTournament.name}`} />
                    }

                    {showRsvp && !noTournamentToday && <Card title="מצב הרשמה" value={!rsvp_required ? NO_NEED_FOR_RSVP : registrationStatus}/>}
                    {showRsvp && !noTournamentToday && rsvp_required && !playerArrived &&
                        <Card title="הרשמה" value={
                            <form action={onSubmit}>
                              <button><u>{isRegisterForTodayTournament ? CLICK_HERE_TO_UNREGISTER : CLICK_HERE_TO_REGISTER}</u></button>
                            </form>
                         } />
                }
                {separator}
                <div><b><u>History</u></b></div>
                    <HistoryTable player={player} isRestrictedData/>

                    <TournamentsHistoryTable player={player}/>

                    <div style={{ width:100, height:50, margin: '30px 0'}}>

                    </div>
                    <PlayersPrizesPage playerPhone={player.phone_number} />
                </div>
            </div>
    )
        ;
}
