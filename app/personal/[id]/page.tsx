import SideNavUser from "@/app/ui/dashboard/sidenav-user";
import {formatCurrency} from "@/app/lib/utils";
import {fetchPlayerByUserId, fetchRsvpCountForTodayTournament, fetchTournamentByDay} from "@/app/lib/data";
import Image from "next/image";
import HistoryTable from "@/app/ui/players/history-table";
import {rsvpPlayerForDay} from "@/app/lib/actions";
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
    const rsvpPropName = `${today}_rsvp`;
    const rsvpCountForTodayTournament = await fetchRsvpCountForTodayTournament();

    const {rsvp_required, max_players} = todayTournament;

    // @ts-ignore
    const isRegisterForTodayTournament = !!player[rsvpPropName];
    const isFull = rsvpCountForTodayTournament >= max_players;

    const buttonStyle = {
        cursor: 'pointer',
        color: 'blue',
        textDecoration: 'underline',
    }


    const onRegisterSubmit = async (_formData: FormData) => {
        'use server'
        await rsvpPlayerForDay(player.phone_number, rsvpPropName, true, `/personal/${userId}`);
    };
    const onUnRegisterSubmit = async (_formData: FormData) => {
        'use server'
        await rsvpPlayerForDay(player.phone_number, rsvpPropName, false, `/personal/${userId}`);
    };


    const unregisterButton = <form action={onUnRegisterSubmit}>
        <button >
            press <span style={buttonStyle}><b>HERE</b></span>
        </button>
    </form>


    const separator = <hr style={{marginTop: 20, marginBottom: 20}}/>;
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
                    {separator}
                    <div>
                        {rsvp_required ? (
                            <div>
                                <div style={{marginBottom: 20}}>
                                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                                    <u>Today's tournament requires registration.</u>
                                </div>
                                <div style={{marginBottom: 30}}>
                                    {isRegisterForTodayTournament ? (
                                        <div>
                                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                                            You <b>are</b> registered for today's tournament.
                                        </div>
                                    ) : (
                                        <div>
                                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                                            You are <b>not</b> registered for today's tournament.
                                        </div>
                                    )}
                                </div>
                                <div style={{marginBottom: 40}}>
                                    {isRegisterForTodayTournament ? (
                                        <div>
                                            <form action={onUnRegisterSubmit}>
                                                <button>
                                                    To <b>cancel</b> your registration, press <span style={buttonStyle}><b>HERE</b></span>
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        <div>
                                            {isFull ? (
                                                <div>
                                                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                                                    Today's tournament is already <b>full</b>. No more registrations are allowed.
                                                </div>
                                            ) : (
                                                <div>
                                                    <form action={onRegisterSubmit}>
                                                        <button>
                                                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                                                            To <b>register</b> for today's tournament, press <span
                                                            style={buttonStyle}><b>HERE</b></span>
                                                        </button>
                                                    </form>
                                                </div>

                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div>
                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                                Today's tournament is open for all players. No RSVP is required.
                            </div>
                        )}

                    </div>
                    {separator}

                    <HistoryTable player={player} isRestrictedData/>
                </div>
            </div>
        </div>
    );
}
