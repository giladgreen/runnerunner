import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import React from 'react';
import {UserPlusIcon} from "@heroicons/react/20/solid";

export default function CreateNewPlayerButton({
  params,
}: {
  params: { userId: string };
}) {
  return (
    <Link
      href={`/${params.userId}/players/create`}
      className="pointer rounded-md border p-2 hover:bg-gray-100"    >
      <span className="sr-only">create new player</span>
      <UserPlusIcon className="h-5 md:ml-4" title="יצירת שחקן חדש"/>
    </Link>
  );
}
