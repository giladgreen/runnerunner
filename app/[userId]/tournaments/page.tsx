import TournamentsDataPage from "@/app/ui/client/TournamentsDataPage";
import {fetchUserById} from "@/app/lib/data";
import React from "react";

export default async function TournamentsPage({params}:{params: {userId: string}}) {
    const user = await fetchUserById(params.userId);
    const isAdmin = user.is_admin;
    const isWorker = user.is_worker;
    if (!isAdmin && !isWorker) {
        return (
            <div className="w-full">
                <div className="flex w-full items-center justify-between">
                    <h1 className="text-2xl"><b><u>You do not have permissions to see this page</u></b></h1>
                </div>
            </div>);
    }
    return <TournamentsDataPage/>
}
