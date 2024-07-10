import {fetchFeatureFlags, fetchTournamentsData} from "@/app/lib/data";
import {formatDateToLocal} from "@/app/lib/utils";
import {getFinalTablePlayersContent} from "@/app/ui/client/helpers";
import {getDayIncome} from "@/app/ui/client/helpers";

export default async function TournamentsDataPage({ userId }: {userId?:string}) {
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
                {  // @ts-ignore
                    tournamentsData.map(key => tournaments[key]).map(async (dateItem) => {
                        const dayIncome = getDayIncome(dateItem);

                        const date = (new Date(dateItem.date)).toISOString().slice(0,10);

                        const finalTableData = await getFinalTablePlayersContent(date, true, userId);

                        return <tr
                            key={dateItem.date}
                            className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                        >
                            <th className="px-4 py-5 font-medium">
                                <div style={{ marginBottom:20}}>
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

