import Form from '@/app/ui/players/create-bug-form';
import {fetchAllBugs} from "@/app/lib/data";
import {formatDateToLocal} from "@/app/lib/utils";

export default async function Page() {
    const bugs = await fetchAllBugs();

    return (
        <div className="w-full">
           <Form />
            <hr style={{ marginTop: 20, marginBottom: 10 }}/>
            <div>
                <div>
                    <u>Known bugs:</u>
                </div>
                <div>
                    {bugs.map((bug) => (
                        <div key={bug.id} style={{ marginTop: 20}}>
                            <div>
                                <div>
                                    reported:  {formatDateToLocal(bug.updated_at)}
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
    );
}
