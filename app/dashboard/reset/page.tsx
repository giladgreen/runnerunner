import {ResetPlayersAndHistory} from "@/app/ui/players/client-buttons";

import React from "react";


export default async function Page() {
    return (
        <div className="w-full">

            <div className="config-section">
                <div><u><b>Delete all players and history</b></u></div>
                <ResetPlayersAndHistory/>
            </div>
        </div>
    );
}
