import Pagination from '@/app/ui/players/pagination';
import Search from '@/app/ui/search';
import PlayersTable from '@/app/ui/players/players-table';
import { CreateNewPlayer } from '@/app/ui/players/buttons';
import { PlayersTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchPlayersPagesCount } from '@/app/lib/data';
import {GeneralPlayersCardWrapper} from "@/app/ui/dashboard/cards";

export default async function Page({
                                       searchParams,
                                   }: {
    searchParams?: {
        query?: string;
        page?: string;
        sort?: string;
    };
}) {
    const query = searchParams?.query || '';
    const sortBy = searchParams?.sort || 'updated_at';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchPlayersPagesCount(query);

    return (
        <div className="w-full full-width">
            <div className="flex w-full items-center justify-between full-width">
                <GeneralPlayersCardWrapper />
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="search players" />
                <CreateNewPlayer />

            </div>
            <Suspense key={query + currentPage} fallback={<PlayersTableSkeleton />}>
                <PlayersTable query={query} currentPage={currentPage} sortBy={sortBy} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}
