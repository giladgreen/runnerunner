import TournamentsDataPage from '@/app/ui/client/TournamentsDataPage';
import { fetchUserById } from '@/app/lib/data';
import React from 'react';
import NoPermissionsPage from "@/app/ui/client/NoPermissionsPage";

export default async function TournamentsPage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await fetchUserById(params.userId);
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;
  if (!isAdmin && !isWorker) {
    return <NoPermissionsPage />
  }
  return <TournamentsDataPage userId={params.userId} />;
}
