import { fetchRevenues} from '@/app/lib/data';
import Image from "next/image";
import Link from "next/link";
import {formatCurrency, formatDateToLocal} from "@/app/lib/utils";
import RSVPButton from "@/app/ui/players/rsvp-button";

export default async function RevenuesPage() {
    const revenues = await fetchRevenues();

    return (
        <div className="w-full revenue-table">
            <table className="min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                    <th  className="px-4 py-5 font-medium">
                        Date
                    </th>
                    <th  className="px-3 py-5 font-medium">
                        Total
                    </th>
                    <th  className="px-3 py-5 font-medium">
                        Credit
                    </th>
                    <th  className="px-3 py-5 font-medium">
                        Cash
                    </th>
                    <th  className="px-3 py-5 font-medium">
                        Money Wire
                    </th>
                    <th  className="px-3 py-5 font-medium">
                        Entries
                    </th>
                    <th  className="px-3 py-5 font-medium">
                        Players Count
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white">
                {Object.keys(revenues).map(key => revenues[key]).map((dateItem) => (
                    <tr
                        key={dateItem.date}
                        className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                        <th  className="px-4 py-5 font-medium">
                            {formatDateToLocal(dateItem.date)}
                        </th>
                        <th  className="px-3 py-5 font-medium">
                            {formatCurrency(dateItem.total)}
                        </th>
                        <th  className="px-3 py-5 font-medium">
                            {formatCurrency(dateItem.credit)}
                        </th>
                        <th  className="px-3 py-5 font-medium">
                            {formatCurrency(dateItem.cash)}
                        </th>
                        <th  className="px-3 py-5 font-medium">
                            {formatCurrency(dateItem.wire)}
                        </th>
                        <th  className="px-3 py-5 font-medium">
                            {dateItem.entries}
                        </th>
                        <th  className="px-3 py-5 font-medium">
                            {dateItem.players}
                        </th>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
