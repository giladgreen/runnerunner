import {
  fetchAllBugs,
  fetchAllPlayersForExport,
  fetchFeatureFlags,
  fetchFinalTablePlayers,
  fetchPlayersPrizes,
  fetchTournamentByDay,
  fetchUserById,
} from '@/app/lib/data';
import ImportPlayersButton from '@/app/ui/client/ImportPlayersButton';
import ExportPlayersButton from '@/app/ui/client/ExportPlayersButton';
import { BugDB, PlayerDB } from '@/app/lib/definitions';
import React, {Suspense} from 'react';
import Link from 'next/link';
import CreateBugForm from '@/app/ui/client/CreateBugForm';
import { formatDateToLocal } from '@/app/lib/utils';
import ExportPlayersWithMarketingInfoButton from '@/app/ui/client/ExportPlayersWithMarketingInfoButton';
import {CardsSkeleton} from "@/app/ui/skeletons";
import Card from "@/app/ui/client/Card";
import DeleteBugButton from "@/app/ui/client/DeleteBugButton";

function TournamentsLink({ userId }: { userId: string }) {
  return (
      <div className="config-section" style={{marginBottom: 20, textAlign: 'center', width: '100%'}}>
          <a
              href={`/${userId}/configurations/tournaments`}
              className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"

          >
              <div style={{textAlign: 'center', width: '100%'}}>לחץ כאן</div>
          </a>
      </div>


)
    ;
}

function PrizesInfoLink({userId}: { userId: string }) {
    return (
        <div className="config-section" style={{marginBottom: 20, textAlign: 'center', width: '100%'}}>
            <a
                href={`/${userId}/configurations/prizes`}
                className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"

        >
            <div style={{textAlign: 'center', width: '100%'}}>לחץ כאן</div>
        </a>
    </div>
  );
}

function FeatureFlagsLink({userId}: { userId: string }) {
  return (
      <div className="config-section" style={{marginBottom: 20, textAlign: 'center', width: '100%'}}>
          <a
              href={`/${userId}/configurations/flags`}
              className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"

          >
              <div style={{textAlign: 'center', width: '100%'}}>לחץ כאן</div>
          </a>
      </div>
)
    ;
}

function UserPermissionsLink({userId}: { userId: string }) {
    return (
        <div className="config-section" style={{marginBottom: 20, textAlign: 'center', width: '100%'}}>
            <a
                href={`/${userId}/configurations/users`}
                className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"

          >
              <div style={{textAlign: 'center', width: '100%'}}>לחץ כאן</div>
          </a>
      </div>
)
    ;
}

function ReportBugForm({bugs, userId}: { bugs: BugDB[], userId: string }) {
    return (
        <div className="config-section rtl" style={{marginTop: 130 , textAlign:'right'}}>
            <h1 className="text-2xl">דיווח על תקלה</h1>
            <CreateBugForm/>
            <hr style={{marginTop: 20, marginBottom: 10}}/>
            <div>
                <div>
                    <u>{bugs.length > 0 ? 'בעיות ידועות:' : ''}</u>
        </div>
        <div>
          {bugs.map((bug) => (
            <div key={bug.id} style={{ marginTop: 20, border: '1px solid #CCCCCC', padding: 5, borderRadius: 8 }}>
              <div>
                  <DeleteBugButton id={bug.id} userId={userId}/>
                <div> {formatDateToLocal(bug.updated_at)}</div>
                <div>{bug.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function ConfigurationPage({
  params,
}: {
  params: { userId: string };
}) {
    const user = await fetchUserById(params.userId);
    const isAdmin = user.is_admin;
    const isWorker = user.is_worker;
    if (!isAdmin && !isWorker) {
        return (
            <div className="w-full">
                <div className="flex w-full items-center justify-between">
                    <h1 className="text-2xl">
                        <b>
                            <u>אין לך הרשאות לראות עמוד זה</u>
                        </b>
                    </h1>
                </div>
            </div>
        );
    }
    const importEnabled = user.is_admin && user.phone_number === '0587869910';
    const bugs = await fetchAllBugs();
    const players = await fetchAllPlayersForExport();
    // const images = await fetchAllImagesForExport();
    const playersPlaces = await fetchFinalTablePlayers();
    const tournament = await fetchTournamentByDay();
    const {chosenPrizes} = await fetchPlayersPrizes();
    const prizes = chosenPrizes;

    return <div
        className="full-width rtl"
        style={{marginBottom: 20}}
    >
        <div className="config-section" style={{textAlign: 'right', zoom: 1.5, marginBottom: 20}}>
            <u> <b>הגדרות ואדמיניסטרציה</b></u>
        </div>
        <div
            className="full-width grid gap-6 sm:grid-cols-2 lg:grid-cols-4 rtl"
            style={{marginBottom: 20}}
        >
        <Card
            title="ייצוא קרדיט שחקנים לקובץ CSV"
            value={<ExportPlayersButton
                players={players as PlayerDB[]}
                playersPlaces={playersPlaces}
                tournament={tournament}
                prizes={prizes}
            />}
            type="export"
            oneLine
        />

        <Card
            title="ייצוא רשימת שחקנים שאישרו תוכן שיווקי"
            value={ <ExportPlayersWithMarketingInfoButton players={players as PlayerDB[]}/>}
            type="export"
            oneLine
        />

        <Card
            title="הגדרות פרסים"
            value={ <PrizesInfoLink userId={params.userId}/>}
            type="prize"
            oneLine
        />

        <Card
            title=" ניהול טורנירים"
            value={ <TournamentsLink userId={params.userId}/>}
            type="prize"
            oneLine
        />

            {isAdmin && <Card
                title="הרשאות משתמשים"
                value={ <UserPermissionsLink userId={params.userId}/>}
                type="export"
                oneLine
            />}

            {importEnabled && <Card
                title="feature flags"
                value={ <FeatureFlagsLink userId={params.userId}/>}
                type="export"
                oneLine
            />}

            {importEnabled &&<Card
            title="ייבוא שחקנים מקובץ CSV"
            value={
                <div className="config-section" style={{width: '100%', fontSize:17}}>
                    <div>כל שורה בקובץ צריכה להיות מהצורה:</div>
                    <div style={{marginBottom: 15}}>
                     <b>מספר טלפון, שם מלא, קרדיט, הערות</b>
                    </div>
                    <ImportPlayersButton/>
                </div>
            }
            type="export"
            oneLine
            />}

        </div>
        <ReportBugForm bugs={bugs} userId={params.userId}/>
    </div>
}
