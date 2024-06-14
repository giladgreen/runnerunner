import SideNavUser from "@/app/ui/dashboard/sidenav-user";
import {formatCurrency} from "@/app/lib/utils";
import {fetchPlayerByUserId, fetchRsvpCountForTodayTournament, fetchTournamentByDay} from "@/app/lib/data";
import Image from "next/image";
import HistoryTable from "@/app/ui/players/history-table";
export default async function Page({ params }: { params: { id: string } }) {
    const player = await fetchPlayerByUserId(params.id);
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

    const todayTournament = await fetchTournamentByDay((new Date()).toLocaleString('en-us', { weekday: 'long' }).toLowerCase())
    const rsvpCountForTodayTournament = await fetchRsvpCountForTodayTournament();

    console.log('## todayTournament', todayTournament)
    console.log('## rsvpCountForTodayTournament', rsvpCountForTodayTournament)
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
                    <h1 style={{ zoom: 2 }}><b>Current Balance: {formatCurrency(player.balance)}</b></h1>
                    <hr style={{marginTop: 20, marginBottom: 20}}/>
                    <HistoryTable player={player} isRestrictedData/>
                </div>
            </div>
        </div>
    );
}
