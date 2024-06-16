import SideNavUser from "@/app/ui/dashboard/sidenav-user";
import {formatCurrency} from "@/app/lib/utils";
import {fetchPlayerByUserId, fetchRsvpCountForTodayTournament, fetchTournamentByDay} from "@/app/lib/data";
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

export default async function Page({ params }: { params: { id: string } }) {
    const userId = params.id;
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

    const today = (new Date()).toLocaleString('en-us', {weekday: 'long'}).toLowerCase();
    const todayTournament = await fetchTournamentByDay(today)

    const rsvpCountForTodayTournament = await fetchRsvpCountForTodayTournament();

    const {rsvp_required, max_players} = todayTournament;

    const noTournamentToday = rsvp_required && max_players === 0;
    // @ts-ignore
    const todayTournamentData = noTournamentToday ? `אין היום טורניר` : `${translation[todayTournament.day]} -  ${todayTournament.name}`;
    // @ts-ignore
    const isRegisterForTodayTournament = player.rsvpForToday;
    const isFull = rsvpCountForTodayTournament >= max_players;

    const buttonStyle = {
        cursor: 'pointer',
        color: 'blue',
        textDecoration: 'underline',
    }

    const onRegisterSubmit = async (_formData: FormData) => {
        'use server'
        const todayDate = (new Date()).toISOString().slice(0,10);
        await rsvpPlayerForDay(player.phone_number, todayDate, true, `/personal/${userId}`);
    };
    const onUnRegisterSubmit = async (_formData: FormData) => {
        'use server'
        const todayDate = (new Date()).toISOString().slice(0,10);
        await rsvpPlayerForDay(player.phone_number, todayDate, false, `/personal/${userId}`);
    };

    const separator = <hr style={{marginTop: 20, marginBottom: 20}}/>;

    const divWithTopMargin = {marginTop: 40};
    const noRegistrationNeeded = <div style={divWithTopMargin}>
        אין צורך ברישום לטורניר של היום
    </div>

    const registrationNeeded = <div>
        {!isFull && <div>
            { isRegisterForTodayTournament ? (
                <div>
                    <div style={divWithTopMargin}>
                        אתה כבר רשום לטורניר של היום
                    </div>
                    <div style={divWithTopMargin}>
                        <form action={onUnRegisterSubmit}>
                            <button>
                                לביטול הרישום לחץ <span style={buttonStyle}><b>כאן</b></span>
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div>
                    <div style={divWithTopMargin}>
                        אתה לא רשום לטורניר של היום
                    </div>
                    <div style={divWithTopMargin}>
                        <form action={onRegisterSubmit}>
                            <button>
                                לרישום  לחץ <span style={buttonStyle}><b>כאן</b></span>
                            </button>
                        </form>
                    </div>

                </div>
            )}
        </div>}

        {isFull && !isRegisterForTodayTournament && <div style={divWithTopMargin}>
            אין יותר מקום לטורניר של היום
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

                    <div className="truncate text-sm font-semibold md:text-base" >
                        {player.name}
                    </div>

                    <div>Phone number: {player.phone_number}  </div>
                    <div> {player.notes}  </div>
                    <h1 style={{zoom: 2}}><b>Current Balance: {formatCurrency(player.balance)}</b></h1>
                    {separator}
                    <div> {todayTournamentData}</div>
                    {!noTournamentToday && <div>
                        {!rsvp_required ? noRegistrationNeeded : registrationNeeded }
                    </div>}
                    {separator}

                    <HistoryTable player={player} isRestrictedData/>
                </div>
            </div>
        </div>
    )
        ;
}
