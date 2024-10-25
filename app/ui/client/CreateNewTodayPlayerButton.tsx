import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { UserPlusIcon } from '@heroicons/react/20/solid';
import {Tooltip} from "flowbite-react";

export default function CreateNewTodayPlayerButton({
  params,
}: {
  params: { userId: string; query: string };
}) {
  const href = `/${params.userId}/current_tournament/create?query=${params.query}`;
  return (
    <Link
      href={href}
      className="pointer rounded-md border p-2 hover:bg-gray-100"
    >
      <Tooltip
          content="צור שחקן חדש"
          color="primary"

      >
      <UserPlusIcon className="h-5 md:ml-4" cursor="copy"/>
      </Tooltip>
    </Link>

  );
}
