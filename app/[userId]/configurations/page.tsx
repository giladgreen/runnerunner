import {
  fetchAllPlayersForExport,
  fetchFeatureFlags,
  fetchUserById,
} from '@/app/lib/data';
import ImportPlayersButton from '@/app/ui/client/ImportPlayersButton';
import { PlayerDB } from '@/app/lib/definitions';
import React from 'react';
import ExportPlayersWithMarketingInfoButton from '@/app/ui/client/ExportPlayersWithMarketingInfoButton';
import Card from '@/app/ui/client/Card';
import NoPermissionsPage from '@/app/ui/client/NoPermissionsPage';

function TournamentsLink({ userId }: { userId: string }) {
  return (
    <div
      className="config-section-link  "
    >
      <a
        href={`/${userId}/configurations/tournaments`}
        className="flex h-10 items-center rounded-lg  px-4  font-medium text-white transition-colors  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
      >
        <div >לחץ כאן</div>
      </a>
    </div>
  );
}
function CalcLink({ userId }: { userId: string }) {
  return (
    <div
      className="config-section-link  "
    >
      <a
        href={`/${userId}/configurations/calc`}
        className="flex h-10 items-center rounded-lg  px-4  font-medium text-white transition-colors  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
      >
        <div >לחץ כאן</div>
      </a>
    </div>
  );
}

function BugsLink({ userId }: { userId: string }) {
  return (
    <div
      className="config-section-link  "
    >
      <a
        href={`/${userId}/configurations/bugs`}
        className="flex h-10 items-center rounded-lg  px-4  font-medium text-white transition-colors  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
      >
        <div >לחץ כאן</div>
      </a>
    </div>
  );
}

function ChangeLogsLink({ userId }: { userId: string }) {
  return (
    <div
      className="config-section-link  "
    >
      <a
        href={`/${userId}/configurations/change-logs`}
        className="flex h-10 items-center rounded-lg  px-4  font-medium text-white transition-colors  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
      >
        <div >לחץ כאן</div>
      </a>
    </div>
  );
}

function PrizesInfoLink({ userId }: { userId: string }) {
  return (
    <div
      className="config-section-link "
    >
      <a
        href={`/${userId}/configurations/prizes`}
        className="flex h-10 items-center rounded-lg  px-4  font-medium text-white transition-colors  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
      >
        <div >לחץ כאן</div>
      </a>
    </div>
  );
}

function FeatureFlagsLink({ userId }: { userId: string }) {
  return (
    <div
      className="config-section-link "
    >
      <a
        href={`/${userId}/configurations/flags`}
        className="flex h-10 items-center rounded-lg  px-4  font-medium text-white transition-colors  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
      >
        <div >לחץ כאן</div>
      </a>
    </div>
  );
}

function UserPermissionsLink({ userId }: { userId: string }) {
  return (
    <div
      className="config-section-link "
    >
      <a
        href={`/${userId}/configurations/users`}
        className="flex h-10 items-center rounded-lg  px-4  font-medium text-white transition-colors  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
      >
        <div >לחץ כאן</div>
      </a>
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
    return <NoPermissionsPage />;
  }
  const importEnabled = user.is_admin && user.phone_number === '0587869910';
  const ffEnabled = importEnabled;

  const players = await fetchAllPlayersForExport();
  const { prizesEnabled } = await fetchFeatureFlags();
  //TODO::: fix export here..
  // const images = await fetchAllImagesForExport();
  // const tournaments = await fetchTournamentsByDay();
  // for (const tournament of tournaments) {
  //   tournament.playersPlaces = await  fetchFinalTablePlayers(tournament.id);
  // }
  // const { chosenPrizes } = await fetchPlayersPrizes();
  // const prizes = chosenPrizes;

  return (
    <div className="full-width rtl" style={{ marginBottom: 20 }}>
      <div
        className="config-section"
        style={{ textAlign: 'right', zoom: 1.5, marginBottom: 20 }}
      >
        <u>
          <b>הגדרות ואדמיניסטרציה</b>
        </u>
      </div>
      <div
        className="full-width rtl grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        style={{ marginBottom: 20 }}
      >
        <Card
          title="ייצוא רשימת שחקנים שאישרו תוכן שיווקי"
          value={
            <ExportPlayersWithMarketingInfoButton
              players={players as PlayerDB[]}
            />
          }
          type="export"
          oneLine
        />

        {prizesEnabled && (
          <Card
            title="הגדרות פרסים"
            value={<PrizesInfoLink userId={params.userId} />}
            type="prize"
            oneLine
          />
        )}

        <Card
          title=" ניהול טורנירים"
          value={<TournamentsLink userId={params.userId} />}
          type="tournament"
          oneLine
        />
        <Card
          title="חישוב פרסים במזומן"
          value={<CalcLink userId={params.userId} />}
          type="tournament"
          oneLine
        />
        <Card
          title="דיווח על באגים"
          value={<BugsLink userId={params.userId} />}
          type="tournament"
          oneLine
        />
        <Card
          title="מעקב שינויים"
          value={<ChangeLogsLink userId={params.userId} />}
          type="tournament"
          oneLine
        />
        {isAdmin && (
          <Card
            title="הרשאות משתמשים"
            value={<UserPermissionsLink userId={params.userId} />}
            type="players"
            oneLine
          />
        )}

        {ffEnabled && (
          <Card
            title="feature flags"
            value={<FeatureFlagsLink userId={params.userId} />}
            type="flags"
            oneLine
          />
        )}

        {importEnabled && (
          <Card
            title="ייבוא שחקנים מקובץ CSV"
            value={
              <div
                className="config-section"
                style={{ width: '100%', fontSize: 17 }}
              >
                <div>כל שורה בקובץ צריכה להיות מהצורה:</div>
                <div style={{ marginBottom: 15 }}>
                  <b>מספר טלפון, שם מלא, קרדיט, הערות</b>
                </div>
                <ImportPlayersButton />
              </div>
            }
            type="import"
            oneLine
          />
        )}
      </div>


    </div>
  );
}
