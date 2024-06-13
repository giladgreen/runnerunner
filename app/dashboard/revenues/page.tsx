import { fetchRevenues} from '@/app/lib/data';
import {
    WalletIcon,
    CreditCardIcon,
    ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/solid';
import {formatCurrency, formatDateToLocal} from "@/app/lib/utils";
import {lusitana} from "@/app/ui/fonts";

export default async function RevenuesPage() {
    const revenues = await fetchRevenues();

    return (
        <div className="w-full revenue-table">
            <table className="min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                    <th className="px-4 py-5 font-medium">
                        <b>Date</b>
                    </th>
                    <th className="px-3 py-5 font-medium">
                        <b>Revenue</b>
                    </th>
                    <th className="px-3 py-5 font-medium">
                        <b>Players Count</b>
                    </th>
                    <th className="px-3 py-5 font-medium">
                        <b>Entries</b>
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white">
                {Object.keys(revenues).map(key => revenues[key]).map((dateItem) => {
                    const dayIncome = (<div className={`${lusitana.className} truncate rounded-xl bg-white px-4 py-4 text-center text-2xl`}
                    > <div>
                        <div style={{fontSize: 20, marginBottom:10}}>
                            <b>{formatCurrency(dateItem.total)}</b>
                        </div>
                        <div  style={{width:'100%' }} className="card-table revenue-table-revenue-cell">
                            <table  style={{fontSize: 15, width:'100%'}}  cellSpacing="0" cellPadding="0">
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

                 return <tr
                     key={dateItem.date}
                     className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                 >
                     <th className="px-4 py-5 font-medium">
                         {formatDateToLocal(dateItem.date)}
                     </th>
                     <th className="px-3 py-5 font-medium">
                         {dayIncome}
                     </th>
                     <th className="px-3 py-5 font-medium">
                         {dateItem.players} players
                     </th>
                     <th className="px-3 py-5 font-medium">
                         {dateItem.entries - dateItem.reentries} times {dateItem.reentries > 0 ? `(+ ${dateItem.reentries} re-entries)` : ``}
                     </th>
                 </tr>
                })}
                </tbody>
            </table>
        </div>
    );
}
