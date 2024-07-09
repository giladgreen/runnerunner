import {TournamentsDataPage} from "@/app/ui/dashboard/cards";
import SideNavWorker from "@/app/ui/dashboard/sidenav-worker";
import React from "react";
import {fetchUserById} from "@/app/lib/data";
import {notFound} from "next/navigation";

export default async function TournamentsPage({ params }: { params: { id: string }}) {
    const connectedUserId = params.id;
    const user = await fetchUserById(connectedUserId);
    if (!user) {
        notFound();
    }
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNavWorker username={user.name!} userId={user.id!}/>
            </div>
            <TournamentsDataPage userId={user.id!}/>
        </div>
    );

}
