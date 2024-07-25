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
import React from 'react';
import Link from 'next/link';
import CreateBugForm from '@/app/ui/client/CreateBugForm';
import { formatDateToLocal } from '@/app/lib/utils';
import ExportPlayersWithMarketingInfoButton from '@/app/ui/client/ExportPlayersWithMarketingInfoButton';

function Seperator() {
  return <div className="config-seperator" />;
}

function TournamentsLink({ userId }: { userId: string }) {
  return (
    <div className="config-section" style={{ marginBottom: 20 }}>
      <Link
        href={`/${userId}/configurations/tournaments`}
        className="mt-4 rounded-md bg-blue-400 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        ניהול טורנירים
      </Link>
    </div>
  );
}

function PrizesInfoLink({ userId }: { userId: string }) {
  return (
    <div className="config-section" style={{ marginBottom: 20 }}>
      <Link
        href={`/${userId}/configurations/prizes`}
        className="mt-4 rounded-md bg-blue-400 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        הגדרות פרסים
      </Link>
    </div>
  );
}

function FeatureFlagsLink({ userId }: { userId: string }) {
  return (
    <div className="config-section">
      <Link
        href={`/${userId}/configurations/flags`}
        className="mt-4 rounded-md bg-blue-700 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Feature Flags
      </Link>
    </div>
  );
}

function UserPermissionsLink({ userId }: { userId: string }) {
  return (
    <div className="config-section" style={{ marginBottom: 20 }}>
      <Link
        href={`/${userId}/configurations/users`}
        className="mt-4 rounded-md bg-blue-700 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        ניהול משתמשים
      </Link>
    </div>
  );
}

function ReportBugForm({ bugs }: { bugs: BugDB[] }) {
  return (
    <div className="config-section" style={{ marginTop: 130 }}>
      <h1 className="text-2xl">Report a bug</h1>
      <CreateBugForm />
      <hr style={{ marginTop: 20, marginBottom: 10 }} />
      <div>
        <div>
          <u>{bugs.length > 0 ? 'Known bugs:' : ''}</u>
        </div>
        <div>
          {bugs.map((bug) => (
            <div key={bug.id} style={{ marginTop: 20 }}>
              <div>
                <div>reported: {formatDateToLocal(bug.updated_at)}</div>
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
  const { prizesEnabled, placesEnabled } = await fetchFeatureFlags();
  const importEnabled = user.is_admin && user.phone_number === '0587869910';
  const bugs = await fetchAllBugs();
  const players = await fetchAllPlayersForExport();
  // const images = await fetchAllImagesForExport();
  const playersPlaces = await fetchFinalTablePlayers();
  const tournament = await fetchTournamentByDay();
  const { chosenPrizes } = await fetchPlayersPrizes();
  const prizes = chosenPrizes;

  return (
    <div className="w-full rtl">
      <div className="config-section" style={{ textAlign: 'right', zoom: 1.5, marginBottom:20 }}>
        <u> <b>הגדרות ואדמיניסטרציה</b></u>
      </div>

      <div className="config-section" style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 20 }}>
          <b>ייצוא דאטה לקובץ CSV</b>
        </div>
        <ExportPlayersButton
          players={players as PlayerDB[]}
          playersPlaces={playersPlaces}
          tournament={tournament}
          prizes={prizes}
          prizesEnabled={prizesEnabled}
          placesEnabled={placesEnabled}
        />
      </div>

      <div className="config-section" style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 20 }}>
          <b>ייצוא רשימת שחקנים שאישרו תוכן שיווקי</b>
        </div>
        <ExportPlayersWithMarketingInfoButton players={players as PlayerDB[]} />
      </div>

      {importEnabled && (
        <div className="config-section" style={{ marginBottom: 20 }}>
          <div>
            <u>
              <b>ייבוא שחקנים מקובץ CSV</b>
            </u>
          </div>
          <div>כל שורה בקובץ צריכה להיות מהצורה:</div>
          <div style={{ marginBottom: 15 }}>
            <b>מספר טלפון, שם מלא, קרדיט, הערות</b>
          </div>
          <ImportPlayersButton />
        </div>
      )}

      {isAdmin && <UserPermissionsLink userId={params.userId} />}

      <PrizesInfoLink userId={params.userId} />

      <TournamentsLink userId={params.userId} />

      {isAdmin && <FeatureFlagsLink userId={params.userId} />}

      <ReportBugForm bugs={bugs} />

    </div>
  );
}
