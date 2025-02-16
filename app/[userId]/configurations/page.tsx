import {
  fetchAllPlayersForExport,
  fetchFeatureFlags,
  fetchUserById,
} from '@/app/lib/data';
import ImportPlayersButton from '@/app/ui/client/ImportPlayersButton';
import { PlayerDB } from '@/app/lib/definitions';
import React from 'react';
import ExportPlayersWithMarketingInfoButton from '@/app/ui/client/ExportPlayersWithMarketingInfoButton';
import NoPermissionsPage from '@/app/ui/client/NoPermissionsPage';
import {
  ArchiveBoxArrowDownIcon,
  BanknotesIcon,
  GiftIcon,
  PuzzlePieceIcon,
  UserGroupIcon,
  BugAntIcon, FlagIcon, ArrowDownOnSquareStackIcon
} from '@heroicons/react/24/outline';


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
        <a
          href={`/${params.userId}/configurations/prizes`}
          className="text-section pointer items-center"
        >
          <div className="config-item">
            <div className="text-section config-section-link">
              הגדרות פרסים
            </div>
            <div className="config-item-icon-div">
              <GiftIcon className="h-5 w-5" />
            </div>
          </div>
        </a>
        )}
        <a
          href={`/${params.userId}/configurations/tournaments`}
          className="text-section pointer items-center"
        >
          <div className="config-item">
            <div className="text-section config-section-link">
              ניהול טורנירים
            </div>
            <div className="config-item-icon-div">
              <PuzzlePieceIcon className="h-5 w-5" />
            </div>
          </div>
        </a>

        <a
          href={`/${params.userId}/configurations/change-logs`}
          className="text-section pointer items-center"
        >
          <div className="config-item">
            <div className="text-section config-section-link">
              מעקב שינויים
            </div>
            <div className="config-item-icon-div">
              <BanknotesIcon className="h-5 w-5" />
            </div>
          </div>
        </a>
        <a
          href={`/${params.userId}/configurations/users`}
          className="text-section pointer items-center"
        >
          <div className="config-item">
            <div className="text-section config-section-link">
              הרשאות משתמשים
            </div>
            <div className="config-item-icon-div">
              <UserGroupIcon className="h-5 w-5" />
            </div>
          </div>
        </a>
        <a
          href={`/${params.userId}/configurations/calc`}
          className="text-section pointer items-center"
        >
          <div className="config-item">
            <div className="text-section config-section-link">
              חישוב פרסים במזומן
            </div>
            <div className="config-item-icon-div">
              <BanknotesIcon className="h-5 w-5" />
            </div>
          </div>
        </a>
        <a
          href={`/${params.userId}/configurations/bugs`}
          className="text-section pointer items-center"
        >
          <div className="config-item">
            <div className="text-section config-section-link">
              דיווח על באגים
            </div>
            <div className="config-item-icon-div">
              <BugAntIcon className="h-5 w-5" />
            </div>
          </div>
        </a>

        {ffEnabled && (
          <a
            href={`/${params.userId}/configurations/flags`}
            className="text-section pointer items-center"
          >
            <div className="config-item">
              <div className="text-section config-section-link">
                Feature Flags
              </div>
              <div className="config-item-icon-div">
                <FlagIcon className="h-5 w-5" />
              </div>
            </div>
          </a>
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
