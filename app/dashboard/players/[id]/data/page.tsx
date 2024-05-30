import Breadcrumbs from '@/app/ui/players/breadcrumbs';
import { fetchPlayerById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import {formatCurrency, formatDateToLocal, getTime} from "@/app/lib/utils";
import CreateLogForm from "@/app/ui/logs/create-form";

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [player] = await Promise.all([
        fetchPlayerById(id),
    ]);
    if (!player) {
        notFound();
    }
    player.id = id;
    const balances = [] as number[];
    const historyLog = player.historyLog?.map((log, index) => {

        if (index === 0) {
            balances.push(log.change);
        } else {
            balances.push(balances[index - 1] + log.change);
        }

        let currentBalance = balances[balances.length -1]


        return {
            ...log,
            currentBalance
        }
    })

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'players', href: '/dashboard/players' },
                    {
                        label: player.name,
                        img: player.image_url,
                        active: true
                    }
                ]}
            />
            <div>
                <div>Phone number: {player.phone_number}  </div>
                <div> {player.notes}  </div>
                <h1 style={{ zoom: 2 }}><b>Current Balance: {formatCurrency(player.balance)}</b></h1>
                <hr style={{marginTop: 10, marginBottom: 20}}/>
                <CreateLogForm player={player} />

                <hr style={{marginTop: 20, marginBottom: 20}}/>


                <table className="hidden min-w-full text-gray-900 md:table">
                    <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>


                        <th scope="col" className="px-3 py-5 font-medium">
                            Amount
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium">
                            Note
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium">
                            Updated By
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium">
                            Current Balance
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium">
                            Date & Time
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white">
                    {historyLog?.map((log) => (
                        <tr
                            key={log.id}
                            className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                        >


                            <td className="whitespace-nowrap px-3 py-3">
                                {formatCurrency(log.change)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3">
                                {log.note}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3">
                                {log.updated_by}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3">
                                {formatCurrency(log.currentBalance)}
                            </td>
                            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                {formatDateToLocal(log.updated_at)}, {getTime(log.updated_at)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
