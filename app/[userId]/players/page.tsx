import Pagination from '@/app/ui/client/Pagination';
import Search from '@/app/ui/client/Search';
import PlayersTable from '@/app/ui/client/PlayersTable';
import CreateNewPlayerButton from '@/app/ui/client/CreateNewPlayerButton';
import { PlayersTableSkeleton } from '@/app/ui/skeletons';
import React, { Suspense } from 'react';
import { fetchPlayersPagesCount, fetchUserById } from '@/app/lib/data';
import GeneralPlayersCardWrapper from '@/app/ui/client/GeneralPlayersCardWrapper';

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

  const query = searchParams?.query || '';
  const sortBy = searchParams?.sort || 'updated_at';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchPlayersPagesCount(query);

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
          query={query}
          currentPage={currentPage}
          sortBy={sortBy}
          userId={params.userId}
        />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
