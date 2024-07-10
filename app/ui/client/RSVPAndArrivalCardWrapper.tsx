import {fetchFeatureFlags, fetchRSVPAndArrivalData} from "@/app/lib/data";
import {formatCurrency} from "@/app/lib/utils";
import {ArrowLeftOnRectangleIcon, CreditCardIcon, WalletIcon} from "@heroicons/react/24/solid";
import {Suspense} from "react";
import {CardsSkeleton} from "@/app/ui/skeletons";
import Card from "@/app/ui/client/Card";

export default async function RSVPAndArrivalCardWrapper({params}:{ params: {userId: string }}) {
    const { rsvpEnabled } = await fetchFeatureFlags();

    const {
        rsvpForToday,
        todayTournamentMaxPlayers,
        arrivedToday,
        todayCreditIncome,
        todayCashIncome,
        todayTransferIncome,
        reEntriesCount,
        todayTournament
    } = await fetchRSVPAndArrivalData();
    const { rsvp_required } = todayTournament;
    const rsvpForTodayText = rsvp_required ? (`${rsvpForToday}${todayTournamentMaxPlayers ?` / ${todayTournamentMaxPlayers}`:''}`) : 'ללא'
    const todayIncome = <div>
        <div style={{fontSize: 20, marginBottom:10}}>
            <b>{formatCurrency(todayCreditIncome + todayCashIncome + todayTransferIncome)}</b>
        </div>
        <div  className="card-table full-width">
            <table  style={{fontSize: 15}} className="full-width" cellSpacing="0" cellPadding="0">
                <thead>
                <tr>
                    <th scope="col" className="table-text-item" data-tooltip="Credit" title="Credit">
                        <b>{formatCurrency(todayCreditIncome)}</b>
                    </th>
                    <th scope="col" className="table-text-item" data-tooltip="Cash" title="Cash">
                        <b>{formatCurrency(todayCashIncome)}</b>
                    </th>
                    <th scope="col" className="table-text-item" data-tooltip="Wire transfer" title="Wire transfer">
                        <b>{formatCurrency(todayTransferIncome)}</b>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th scope="col" >
                        <div className="table-item" data-tooltip="Credit" title="Credit">
                            <CreditCardIcon className="h-6 w-9 text-gray-700"/>
                        </div>
                    </th>
                    <th scope="col" >
                        <div className="table-item" data-tooltip="Cash" title="Cash">
                            <WalletIcon className="h-6 w-9 text-gray-700"/>
                        </div>
                    </th>
                    <th scope="col" >
                        <div className="table-item" data-tooltip="Wire transfer" title="Wire transfer">
                            <ArrowLeftOnRectangleIcon className="h-6 w-9 text-gray-700"/>
                        </div>
                    </th>
                </tr>
                <tr>
                    <th scope="col"  style={{ marginTop:-5}}>
                        <div className="table-item smaller-test" data-tooltip="Credit" title="Credit">
                            credit
                        </div>
                    </th>
                    <th scope="col" >
                        <div className="table-item smaller-test" data-tooltip="Cash" title="Cash">
                            cash
                        </div>
                    </th>
                    <th scope="col" >
                        <div className="table-item smaller-test" data-tooltip="Wire transfer" title="Wire transfer">
                            money wire
                        </div>
                    </th>
                </tr>
                </tbody>
            </table>
        </div>

    </div>

    // const oneLinerStyle = {padding: 50, fontSize: 40}
    return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 full-width" style={{marginBottom: 20}} >
        <Suspense fallback={<CardsSkeleton count={4}/>}>
            {rsvpEnabled && <Card title="RSVP" value={<div >{rsvpForTodayText}</div>} type="rsvp" oneLine/>}
            <Card title="Arrived" value={<div >{arrivedToday}</div>} type="arrived" oneLine/>
            <Card title="Re Entries" value={<div >{reEntriesCount}</div>} type="money" oneLine/>
            <Card title="Income" value={todayIncome} type="money"/>
        </Suspense>
    </div>
}

