import SideNavUser from "@/app/ui/dashboard/sidenav-user";
import {formatCurrency} from "@/app/lib/utils";
import {
    fetchFeatureFlags,
    fetchPlayerByUserId,
    fetchRsvpCountForTodayTournament,
    fetchTournamentByDay
} from "@/app/lib/data";
import Image from "next/image";
import HistoryTable from "@/app/ui/players/history-table";
import {rsvpPlayerForDay} from "@/app/lib/actions";

const translation = {
    Sunday: 'יום ראשון',
    Monday: 'יום שני',
    Tuesday: 'יום שלישי',
    Wednesday: 'יום רביעי',
    Thursday: 'יום חמישי',
    Friday: 'יום שישי',
    Saturday: 'יום שבת',
}

const NO_NEED_FOR_RSVP = 'אין צורך ברישום לטורניר של היום';
const YOU_ARE_ALREADY_REGISTERED = 'אתה כבר רשום לטורניר של היום';
const YOU_ARE_NOT_REGISTERED = 'אתה לא רשום לטורניר של היום';
const NO_TOURNAMENT_TODAY = 'אין טורניר היום';
const NO_MORE_SPOTS = 'אין יותר מקום לטורניר של היום';
const CLICK_HERE_TO_UNREGISTER = 'לביטול לחץ כאן';
const CLICK_HERE_TO_REGISTER = 'לרישום לחץ כאן';
export default async function Page({ params }: { params: { id: string } }) {
    const userId = params.id;
    const {rsvpEnabled, playerRsvpEnabled} = await fetchFeatureFlags();
    const showRsvp = rsvpEnabled && playerRsvpEnabled;

    const player = await fetchPlayerByUserId(userId);
    if (!player) {
        return (
            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
                <div className="w-full flex-none md:w-64">
                    <SideNavUser/>
                </div>
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

    const rsvpCountForTodayTournament = await fetchRsvpCountForTodayTournament();

    const {rsvp_required, max_players} = todayTournament;

    const noTournamentToday = rsvp_required && max_players === 0;
    // @ts-ignore
    const todayTournamentData = noTournamentToday ? NO_TOURNAMENT_TODAY : `${translation[todayTournament.day]} -  ${todayTournament.max_players === 0 && todayTournament.rsvp_required ? 'אין טורניר היום' : todayTournament.name}`;
    // @ts-ignore
    const isRegisterForTodayTournament = player.rsvpForToday;
    const isFull = rsvpCountForTodayTournament >= max_players;

    const onRegisterSubmit = async (_formData: FormData) => {
        'use server'
        const todayDate = (new Date()).toISOString().slice(0, 10);
        await rsvpPlayerForDay(player.phone_number, todayDate, true, `/personal/${userId}`);
    };
    const onUnRegisterSubmit = async (_formData: FormData) => {
        'use server'
        const todayDate = (new Date()).toISOString().slice(0, 10);
        await rsvpPlayerForDay(player.phone_number, todayDate, false, `/personal/${userId}`);
    };

    const separator = <hr style={{marginTop: 20, marginBottom: 20}}/>;

    const divWithTopMargin = {marginTop: 40};
    const noRegistrationNeeded = <div style={divWithTopMargin} className="no_need_for_rsvp">
        {NO_NEED_FOR_RSVP}
    </div>

    const userIsRegisterDiv = <div>
        <div style={divWithTopMargin} className="rsvp_text rsvp_text-registered">
            {YOU_ARE_ALREADY_REGISTERED} ✅
        </div>
        <div style={divWithTopMargin}>
            <form action={onUnRegisterSubmit}>
                <button className="rsvp_button rsvp_button-registered">
                    {CLICK_HERE_TO_UNREGISTER}
                </button>
            </form>
        </div>
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
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNavUser/>
            </div>
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
                    <div> {player.notes}  </div>
                    <h1 style={{zoom: 2}}><b>Current Balance: {formatCurrency(player.balance)}</b></h1>
                    {showRsvp && separator}
                    {showRsvp && <div
                        className={noTournamentToday ? 'no_tournament_today' : (`tournament_data ${isRegisterForTodayTournament ? 'tournament_data_registered' : 'tournament_data_unregistered'}`)}> {todayTournamentData}</div>}
                    {showRsvp && !noTournamentToday && <div>
                        {!rsvp_required ? noRegistrationNeeded : registrationNeeded}
                    </div>}
                    {separator}

                    <HistoryTable player={player} isRestrictedData/>
                </div>
            </div>
        </div>
    )
        ;
}
