import Form from '@/app/ui/players/create-bug-form';
import {fetchAllBugs, fetchAllPlayersForExport} from "@/app/lib/data";
import {formatDateToLocal} from "@/app/lib/utils";
import {ImportPlayers, ExportPlayers} from "@/app/ui/players/client-buttons";
import {PlayerDB} from "@/app/lib/definitions";

export default async function Page() {
    const bugs = await fetchAllBugs();
    const players = await fetchAllPlayersForExport();

    return (
        <div className="w-full">
            <div><u>Import players from CSV file</u></div>
            <div>each line in the file should be in the form of:</div>
            <div style={{ marginBottom: 15}}><b>name, phone number, balance, notes</b></div>

            <ImportPlayers/>
            <hr className="my-4"/>
            <div style={{ marginBottom: 20}}>Export players data to CSV file</div>
            <ExportPlayers players={players as PlayerDB[]}/>
            <hr className="my-4"/>
            <div className="w-full">
                <h1 className="text-2xl">Report a bug</h1>
                <Form/>
                <hr style={{marginTop: 20, marginBottom: 10}}/>
                <div>
                    <div>
                        <u>{bugs.length > 0 ? 'Known bugs:' : ''}</u>
                    </div>
                    <div>
                        {bugs.map((bug) => (
                            <div key={bug.id} style={{marginTop: 20}}>
                                <div>
                                    <div>
                                        reported: {formatDateToLocal(bug.updated_at)}
                                    </div>
                                    <div>
                                        {bug.description}
                                    </div>
                                </div>
                            </div>
                        ))}


                    </div>


                </div>
            </div>


        </div>
    );
}
