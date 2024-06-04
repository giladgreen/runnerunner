import SideNavUser from "@/app/ui/dashboard/sidenav-user";
import {formatCurrency, formatDateToLocal, getTime} from "@/app/lib/utils";
import {fetchPlayerByPhoneNumber} from "@/app/lib/data";
import {notFound} from "next/navigation";
import Image from "next/image";
import HistoryTable from "@/app/ui/players/history-table";
export default async function Page({ params }: { params: { id: string } }) {
    const player = await fetchPlayerByPhoneNumber(params.id);
    if (!player) {
        notFound();
    }

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

                        <p className="truncate text-sm font-semibold md:text-base">
                            {player.name}
                        </p>

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
