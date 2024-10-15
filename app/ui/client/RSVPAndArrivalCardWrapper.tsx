'use client';

import { formatCurrency } from '@/app/lib/utils';
import {
  ArrowLeftOnRectangleIcon,
  CreditCardIcon,
  WalletIcon,
} from '@heroicons/react/24/solid';
import { Suspense } from 'react';
import { CardsSkeleton } from '@/app/ui/skeletons';
import Card from '@/app/ui/client/Card';
import { TournamentDB } from '@/app/lib/definitions';
import Link from 'next/link';

export default function RSVPAndArrivalCardWrapper({
  todayTournament,
  incomeAsLink,
  userId,
}: {
  todayTournament: TournamentDB;
  incomeAsLink: boolean;
  userId?: string;
}) {
  const {
    rsvpForToday,
    todayTournamentMaxPlayers,
    arrivedToday,
    todayCreditIncome,
    todayCashIncome,
    todayTransferIncome,
    reEntriesCount,
  } = todayTournament;

  const rsvpForTodayText = todayTournament.rsvp_required
    ? `${rsvpForToday}${
        todayTournamentMaxPlayers ? ` / ${todayTournamentMaxPlayers}` : ''
      }`
    : 'ללא';
  const todayIncomeContent = (
    <div>
      <div style={{ fontSize: 20, marginBottom: 10 }}>
        <b>
          {formatCurrency(
            todayCreditIncome + todayCashIncome + todayTransferIncome,
          )}
        </b>
      </div>
      <div className="card-table full-width">
        <table
          style={{ fontSize: 15 }}
          className="full-width"
          cellSpacing="0"
          cellPadding="0"
        >
          <thead>
            <tr>
              <th
                scope="col"
                className="table-text-item"
                data-tooltip="קרדיט"
                title="קרדיט"
              >
                <b>{formatCurrency(todayCreditIncome)}</b>
              </th>
              <th
                scope="col"
                className="table-text-item"
                data-tooltip="מזומן"
                title="מזומן"
              >
                <b>{formatCurrency(todayCashIncome)}</b>
              </th>
              <th
                scope="col"
                className="table-text-item"
                data-tooltip="העברה"
                title="העברה"
              >
                <b>{formatCurrency(todayTransferIncome)}</b>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="col">
                <div className="table-item" data-tooltip="קרדיט" title="קרדיט">
                  <CreditCardIcon className="h-6 w-9 text-gray-700" />
                </div>
              </th>
              <th scope="col">
                <div className="table-item" data-tooltip="מזומן" title="מזומן">
                  <WalletIcon className="h-6 w-9 text-gray-700" />
                </div>
              </th>
              <th scope="col">
                <div className="table-item" data-tooltip="העברה" title="העברה">
                  <ArrowLeftOnRectangleIcon className="h-6 w-9 text-gray-700" />
                </div>
              </th>
            </tr>
            <tr>
              <th scope="col" style={{ marginTop: -5 }}>
                <div
                  className="table-item smaller-test"
                  data-tooltip="קרדיט"
                  title="קרדיט"
                >
                  קרדיט
                </div>
              </th>
              <th scope="col">
                <div
                  className="table-item smaller-test"
                  data-tooltip="מזומן"
                  title="מזומן"
                >
                  מזומן
                </div>
              </th>
              <th scope="col">
                <div
                  className="table-item smaller-test"
                  data-tooltip="העברה"
                  title="העברה"
                >
                  העברה
                </div>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
  const todayIncome = incomeAsLink ? (
    <Link href={`/${userId}/current_tournament/details`}>
      {todayIncomeContent}
    </Link>
  ) : (
    todayIncomeContent
  );
  // const oneLinerStyle = {padding: 50, fontSize: 40}
  return (
    <div
      className="full-width grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      style={{ marginBottom: 20 }}
    >
      <Suspense fallback={<CardsSkeleton count={4} />}>
        <Card title="הכנסות" value={todayIncome} type="money" />
        <Card
          title="כניסות מחדש"
          value={<div>{reEntriesCount}</div>}
          type="money"
          oneLine
        />
        <Card
          title="הגעה"
          value={<div>{arrivedToday}</div>}
          type="arrived"
          oneLine
        />
        <Card
          title="אישורי הרשמה"
          value={<div>{rsvpForTodayText}</div>}
          type="rsvp"
          oneLine
        />
      </Suspense>
    </div>
  );
}
