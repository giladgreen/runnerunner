import {formatCurrency, formatType} from "@/app/lib/utils";
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
import PlayersPrizes from "@/app/ui/client/PlayersPrizes";
import {LogDB} from "@/app/lib/definitions";
import { TRANSLATIONS} from "@/app/lib/definitions";
import PlayersPrizesPage from "@/app/[userId]/prizes/PlayersPrizesPage";


const NO_NEED_FOR_RSVP = 'אין צורך ברישום לטורניר של היום';
const YOU_ARE_ALREADY_REGISTERED = 'אתה כבר רשום לטורניר של היום';
const YOU = 'אתה';
const ARE_NOT = 'לא';
const REGISTERED_FOR_TODAY = 'רשום לטורניר של היום';
const YOU_ARE_NOT_REGISTERED =<span>{YOU} <u>{ARE_NOT}</u> {REGISTERED_FOR_TODAY}</span>
const NO_TOURNAMENT_TODAY = 'אין טורניר היום';
const NO_MORE_SPOTS = 'אין יותר מקום לטורניר של היום';
const CLICK_HERE_TO_UNREGISTER = 'לביטול לחץ כאן';
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
                        To reserve a spot for today's tournament, please contact us by whatsapp: 050-887-4068
                    </div>
                </div>
            </div>
        );
    }

    const todayTournament = await fetchTournamentByDay();
    const playerCurrentTournamentHistory = await fetchPlayerCurrentTournamentHistory(player.phone_number);
    const showUnregisterButton = playerCurrentTournamentHistory.filter(({type}) => type !== 'credit_to_other').length === 0;
    const rsvpCountForTodayTournament = await fetchRsvpCountForTodayTournament();

    const {rsvp_required, max_players} = todayTournament;

    const noTournamentToday = rsvp_required && max_players === 0;
    // @ts-ignore
    const todayTournamentData = noTournamentToday ? NO_TOURNAMENT_TODAY : `${TRANSLATIONS[todayTournament.day]} -  ${todayTournament.max_players === 0 && todayTournament.rsvp_required ? 'אין טורניר היום' : todayTournament.name}`;
    // @ts-ignore
    const isRegisterForTodayTournament = player.rsvpForToday;
    const isFull = rsvpCountForTodayTournament >= max_players;

    const onRegisterSubmit = async (_formData: FormData) => {
        'use server'
        const todayDate = (new Date()).toISOString().slice(0, 10);
        await rsvpPlayerForDay(player.phone_number, todayDate, true, `/${params.userId}`);
    };

    const onUnRegisterSubmit = async (_formData: FormData) => {
        'use server'
        const todayDate = (new Date()).toISOString().slice(0, 10);
        await rsvpPlayerForDay(player.phone_number, todayDate, false, `/${params.userId}`);
    };

    const separator = <hr style={{marginTop: 20, marginBottom: 20}}/>;

    const divWithTopMargin = {marginTop: 40};
    const noRegistrationNeeded = <div style={divWithTopMargin} className="no_need_for_rsvp">
        {NO_NEED_FOR_RSVP}
    </div>

    const userIsRegisterDiv = <div>

        {showUnregisterButton && <div style={divWithTopMargin} className="rsvp_text rsvp_text-registered">
            <div style={divWithTopMargin} className="rsvp_text rsvp_text-unregistered">
                {YOU_ARE_ALREADY_REGISTERED}
            </div>
            <form action={onUnRegisterSubmit} style={{marginTop:20}}>
                <button className="rsvp_button rsvp_button-registered" >
                    {CLICK_HERE_TO_UNREGISTER}
                </button>
            </form>
        </div>}

        {!showUnregisterButton && <div style={divWithTopMargin}>
            <div>{YOU_ARE_ALREADY_IN_THE_GAME}</div>
            <div>
            {playerCurrentTournamentHistory.map((item: LogDB) => {
                    return <div key={item.id}> <b>{formatCurrency(item.change)}</b> - {formatType(item.type)} </div>
                })}
            </div>
        </div>}
    </div>;

    const registrationNeeded = <div>
        {!isFull && <div>
            {isRegisterForTodayTournament ? (
                userIsRegisterDiv
            ) : (
                <div>
                    <div style={divWithTopMargin} className="rsvp_text rsvp_text-unregistered">
                        {YOU_ARE_NOT_REGISTERED}
                    </div>
                    <div style={divWithTopMargin}>
                        <form action={onRegisterSubmit}>
                            <button className="rsvp_button rsvp_button-unregistered">
                                {CLICK_HERE_TO_REGISTER}
                            </button>
                        </form>
                    </div>

                </div>
            )}
        </div>}

        {isFull &&
            <div>
                {!isRegisterForTodayTournament && <div style={divWithTopMargin} className="no_more_place">{NO_MORE_SPOTS}</div>}
                {isRegisterForTodayTournament && userIsRegisterDiv}
            </div>}
    </div>


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

                    <div>Phone number: {player.phone_number}  </div>

                    <h1 style={{zoom: 2}}><b>Current Balance: {formatCurrency(player.balance)}</b></h1>
                    {showRsvp && separator}
                    {showRsvp && <div
                        className={noTournamentToday ? 'no_tournament_today' : (`tournament_data ${isRegisterForTodayTournament ? 'tournament_data_registered' : 'tournament_data_unregistered'}`)}> {todayTournamentData}</div>}
                    {showRsvp && !noTournamentToday && <div>
                        {!rsvp_required ? noRegistrationNeeded : registrationNeeded}
                    </div>}
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