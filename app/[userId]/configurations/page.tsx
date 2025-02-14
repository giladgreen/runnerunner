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
import {
  ArchiveBoxArrowDownIcon,
  BanknotesIcon,
  GiftIcon,
  PuzzlePieceIcon,
  UserGroupIcon,
  BugAntIcon, FlagIcon, ArrowDownOnSquareStackIcon
} from '@heroicons/react/24/outline';

function TournamentsLink({ userId }: { userId: string }) {
  return (
    <div
      className="config-section-link  "
    >
      <a
        href={`/${userId}/configurations/tournaments`}
        className="items-center text-section"      >
        ניהול טורנירים
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
        className="items-center text-section"      >
        חישוב פרסים במזומן
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
        className="items-center text-section"      >
        דיווח על באגים
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
        className="items-center text-section"      >
        מעקב שינויים
      </a>
    </div>
  );
}

function PrizesInfoLink({ userId }: { userId: string }) {
  return (
    <div
      className="config-section-link ">
      <a
        href={`/${userId}/configurations/prizes`}
        className="items-center text-section"

      >
       הגדרות פרסים
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
        className="items-center text-section"      >
        Feature Flags
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
        className="items-center text-section"      >
        הרשאות משתמשים
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
        <div className="config-item">
          <div className="text-section ">
            <ExportPlayersWithMarketingInfoButton
              players={players as PlayerDB[]}
            />
          </div>
          <div className="config-item-icon-div">
            <ArchiveBoxArrowDownIcon className="h-5 w-5" />
          </div>
        </div>
        {prizesEnabled && (
          <div className="config-item">
            <div className="text-section ">
              <PrizesInfoLink userId={params.userId} />
            </div>
            <div className="config-item-icon-div">
              <GiftIcon className="h-5 w-5" />
            </div>
          </div>
        )}

        <div className="config-item">
          <div className="text-section ">
            <TournamentsLink userId={params.userId} />
          </div>
          <div className="config-item-icon-div">
            <PuzzlePieceIcon className="h-5 w-5" />
          </div>
        </div>

        <div className="config-item">
          <div className="text-section ">
            <ChangeLogsLink userId={params.userId} />
          </div>
          <div className="config-item-icon-div">
            <BanknotesIcon className="h-5 w-5" />
          </div>
        </div>

        <div className="config-item">
          <div className="text-section ">
            <UserPermissionsLink userId={params.userId} />
          </div>
          <div className="config-item-icon-div">
            <UserGroupIcon className="h-5 w-5" />
          </div>
        </div>

        <div className="config-item">
          <div className="text-section ">
            <CalcLink userId={params.userId} />
          </div>
          <div className="config-item-icon-div">
            <BanknotesIcon className="h-5 w-5" />
          </div>
        </div>

        <div className="config-item">
          <div className="text-section ">
            <BugsLink userId={params.userId} />
          </div>
          <div className="config-item-icon-div">
            <BugAntIcon className="h-5 w-5" />
          </div>
        </div>

        {ffEnabled && (
          <div className="config-item">
            <div className="text-section ">
              <FeatureFlagsLink userId={params.userId} />
            </div>
            <div className="config-item-icon-div">
              <FlagIcon className="h-5 w-5" />
            </div>
          </div>
        )}

        {importEnabled && (
          <div className="config-item">
            <div className="text-section ">
                <ImportPlayersButton />
            </div>
            <div className="config-item-icon-div">
              <ArrowDownOnSquareStackIcon className="h-5 w-5" />
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
