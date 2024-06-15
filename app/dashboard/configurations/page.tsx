import {fetchAllBugs, fetchAllPlayersForExport} from "@/app/lib/data";
import {ImportPlayers, ExportPlayers, ResetRSVP, ResetPlayersPosition} from "@/app/ui/players/client-buttons";
import {PlayerDB} from "@/app/lib/definitions";
import React from "react";
import Link from 'next/link';
import Form from "@/app/ui/players/create-bug-form";
import {formatDateToLocal} from "@/app/lib/utils";
import Image from "next/image";
import {DoubleTicksIcon, TickIcon} from "@/app/ui/icons";

function Seperator() {
    return <div className="config-seperator"/>
}

function ResetPlayersPositionButton() {
    return <div className="config-section">
        <div style={{marginBottom: 20}}>
            <Image
                title={'podium'}
                src={`/podium.png`}
                alt={`podium`}
                className="mr-4 zoom-on-hover"
                width={35}
                height={35}
            />
            <b>Reset players place</b>

        </div>
        <ResetPlayersPosition/>

        *should be performed at the beginning of each day
    </div>
}

function ResetRSVPButton() {
    return <div className="config-section">
        <div style={{marginBottom: 20}}>
            <DoubleTicksIcon size={20}/>
            <b>Reset RSVPs</b>
        </div>
        <ResetRSVP/>
        *should be performed at the beginning of each week
    </div>
}


function TournamentsLink() {
    return <div className="config-section">
        <Link href="/dashboard/configurations/tournaments"
              className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400">
            Tournaments
        </Link>

    </div>
}

function UserPermissionsLink() {
    return <div className="config-section">

        <Link href="/dashboard/configurations/users"
              className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400">
            Users permissions
        </Link>

    </div>
}


function ExportPlayersButton({players}: { players: PlayerDB[] }) {
    return <div className="config-section">
        <div style={{marginBottom: 20}}><b>Export players data to CSV file</b></div>
        <ExportPlayers players={players as PlayerDB[]}/>
    </div>
}

function ImportPlayersButton() {
    return <div className="config-section">
        <div><u><b>Import players from CSV file</b></u></div>
        <div>each line in the file should be in the form of:</div>
        <div style={{marginBottom: 15}}><b>name, phone number, balance, notes</b></div>
        <ImportPlayers/>
    </div>
}


function ReportBugForm({bugs}: { bugs: any[] }) {
    return <div className="config-section" style={{marginTop: 130}}>
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
}


export default async function Page() {
    const bugs = await fetchAllBugs();
    const players = await fetchAllPlayersForExport();

    return (
        <div className="w-full">

            <div className="config-section">
                <b>Configurations</b>
            </div>

            <Seperator/>
            <ResetPlayersPositionButton/>
            <Seperator/>
            <ResetRSVPButton/>
            <Seperator/>
            <ExportPlayersButton players={players}/>
            <Seperator/>
            <ImportPlayersButton/>
            <Seperator/>
            <UserPermissionsLink/>
            <Seperator/>
            <TournamentsLink/>
            <Seperator/>

            <ReportBugForm bugs={bugs}/>



        </div>
    );
}
