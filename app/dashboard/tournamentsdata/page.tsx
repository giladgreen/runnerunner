import {fetchFeatureFlags, fetchTournamentsData} from '@/app/lib/data';
import {
    WalletIcon,
    CreditCardIcon,
    ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/solid';
import {formatCurrency, formatDateToLocal} from "@/app/lib/utils";
import {lusitana} from "@/app/ui/fonts";
import {getFinalTablePlayersContent} from "@/app/ui/dashboard/cards";

function getDayIncome(dateItem: { total: number,credit: number,cash: number, wire: number }){
    return  (<div className={`${lusitana.className} truncate rounded-xl bg-white px-4 py-4 text-center text-2xl`}
    > <div>
        <div style={{fontSize: 20, marginBottom:10}}>
            <b>{formatCurrency(dateItem.total)}</b>
        </div>
        <div className="card-table tournaments-data-table-income-cell full-width">
            <table style={{fontSize: 15}} className="full-width" cellSpacing="0" cellPadding="0">
                <thead>
                <tr>
                    <th scope="col" className="table-text-item" data-tooltip="Credit" title="Credit">
                        <b>{formatCurrency(dateItem.credit)}</b>
                    </th>
                    <th scope="col" className="table-text-item" data-tooltip="Cash" title="Cash">
                        <b>{formatCurrency(dateItem.cash)}</b>
                    </th>
                    <th scope="col" className="table-text-item" data-tooltip="Wire transfer" title="Wire transfer">
                        <b>{formatCurrency(dateItem.wire)}</b>
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
    </div>)
}

export default async function TournamentsDataPage() {
    const {  placesEnabled} = await fetchFeatureFlags();

    const tournaments = await fetchTournamentsData();
    const tournamentsData =  Object.keys(tournaments);

    return (
        <div className="w-full tournaments-data-table">
            {tournamentsData.length === 0 && <div className="text-center">No Data yet</div>}
            {tournamentsData.length > 0 && <table className="min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                    <th className="px-4 py-5 font-medium">
                        <b>Date</b>
                    </th>
                    <th className="px-3 py-5 font-medium">
                        <b>Income</b>
                    </th>
                    <th className="px-3 py-5 font-medium">
                        <b>Players Count</b>
                    </th>
                    <th className="px-3 py-5 font-medium">
                        <b>Buyins</b>
                    </th>
                    {placesEnabled && <th className="px-3 py-5 font-medium">
                        <b>Places</b>
                    </th>}
                </tr>
                </thead>
                <tbody className="bg-white">
                {tournamentsData.map(key => tournaments[key]).map(async (dateItem) => {
                    const dayIncome = getDayIncome(dateItem);

                    const date = (new Date(dateItem.date)).toISOString().slice(0,10);

                    const finalTableData = await getFinalTablePlayersContent(date, true);

                 return <tr
                     key={dateItem.date}
                     className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                 >
                     <th className="px-4 py-5 font-medium">
                        <div>
                            {formatDateToLocal(dateItem.date)}
                        </div>
                         <div>
                             {dateItem.tournamentName}
                         </div>
                     </th>
                     <th className="px-3 py-5 font-medium">
                         {dayIncome}
                     </th>
                     <th className="px-3 py-5 font-medium">
                         {dateItem.players} players
                     </th>
                     <th className="px-3 py-5 font-medium">
                         {dateItem.entries - dateItem.reentries} buyins {dateItem.reentries > 0 ? `(+ ${dateItem.reentries} rebuys)` : ``}
                     </th>
                    {placesEnabled && <th className="px-3 py-5 font-medium">
                         { finalTableData }
                     </th>}
                 </tr>
                })}
                </tbody>
            </table>}
        </div>
    );
}
