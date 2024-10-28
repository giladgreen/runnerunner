import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { UserPlusIcon } from '@heroicons/react/20/solid';
import { Tooltip } from 'flowbite-react';

export default function CreateNewPlayerButton({
  params,
}: {
  params: { userId: string };
}) {
  return (
    <Link
      href={`/${params.userId}/players/create`}
      className="pointer rounded-md border p-2 hover:bg-gray-100"
    >
      <Tooltip content="צור שחקן חדש" color="primary">
        <UserPlusIcon className="h-5 md:ml-4" cursor="copy" />
      </Tooltip>
    </Link>
  );
}
