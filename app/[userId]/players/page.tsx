import Pagination from '@/app/ui/client/Pagination';
import Search from '@/app/ui/client/Search';
import PlayersTable from '@/app/ui/client/PlayersTable';
import CreateNewPlayerButton from '@/app/ui/client/CreateNewPlayerButton';
import { PlayersTableSkeleton } from '@/app/ui/skeletons';
import React, { Suspense } from 'react';
import {
  fetchFeatureFlags,
  fetchFilteredPlayers,
  fetchPlayersPagesCount,
  fetchTournaments,
  fetchUserById,
} from '@/app/lib/data';
import GeneralPlayersCardWrapper from '@/app/ui/client/GeneralPlayersCardWrapper';
import NoPermissionsPage from '@/app/ui/client/NoPermissionsPage';
import { getDayOfTheWeek } from '@/app/lib/serverDateUtils';
import { TRANSLATIONS } from '@/app/lib/definitions';

export default async function Page({
  searchParams,
  params,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    sort?: string;
  };
  params: { userId: string };
}) {
  const user = await fetchUserById(params.userId);
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;
  if (!isAdmin && !isWorker) {
    return <NoPermissionsPage />;
  }

  const query = searchParams?.query || '';
  const sortBy = searchParams?.sort || 'updated_at';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchPlayersPagesCount(query);

  const { rsvpEnabled } = await fetchFeatureFlags();
  const players = await fetchFilteredPlayers(query, currentPage, sortBy);

  const dayOfTheWeek = getDayOfTheWeek();
  const tournaments = await fetchTournaments();

  const todayTournaments = tournaments.filter(
    (tournament) => tournament.day === dayOfTheWeek,
  );
  const isRsvpNotRequired =
    todayTournaments.length === 0 ||
    !todayTournaments.find((t) => t.rsvp_required && t.max_players > 0);

  return (
    <div className="full-width w-full">
      <div className="full-width flex w-full items-center justify-between">
        <GeneralPlayersCardWrapper />
      </div>
      <div className="rtl mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="חיפוש שחקן" />

        <CreateNewPlayerButton params={params} />
      </div>
      <Suspense key={query + currentPage} fallback={<PlayersTableSkeleton />}>
        <PlayersTable
          userId={params.userId}
          players={players}
          isAdmin={isAdmin}
          todayTournaments={todayTournaments}
          rsvpEnabled={rsvpEnabled}
          isRsvpNotRequired={isRsvpNotRequired}
        />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
