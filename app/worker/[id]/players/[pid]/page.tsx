import Breadcrumbs from '@/app/ui/players/breadcrumbs';
import {fetchPlayerById} from '@/app/lib/data';
import { notFound } from 'next/navigation';
import {formatCurrency} from "@/app/lib/utils";
import HistoryTable from "@/app/ui/players/history-table";
import SideNavUser from "@/app/ui/dashboard/sidenav-user";
import Image from "next/image";

export default async function Page({ params }: { params: { pid: string } }) {
    const playerId = params.pid;
    const player = await fetchPlayerById(playerId);
    if (!player) {
        notFound();
    }
    player.id = playerId;
    return <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
            <SideNavUser/>
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'players', href: '/'},
                    {
                        label: player.name,
                        img: player.image_url,
                        active: true
                    }
                ]}
            />
            <div style={{display:'flex'}}>
            <div style={{ flex: 1}}>
                <div>Phone number: {player.phone_number}  </div>
                <div> {player.notes}  </div>
                <h1 style={{zoom: 2}}><b>Current Balance: {formatCurrency(player.balance)}</b></h1>
                <hr style={{marginTop: 10, marginBottom: 20}}/>

                <HistoryTable player={player} isRestrictedData={false}/>
            </div>
            <div style={{ flex: `0 0 200px;`, padding:20}}>
                <Image
                    src={player.image_url}
                    className="mr-2"
                    width={200}
                    height={250}
                    alt={`profile picture`}
                />


            </div>
            </div>
        </div>
    </div>

}
