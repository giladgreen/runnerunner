import Link from 'next/link';
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
      className="pointer rounded-md border p-2 "
    >
      <Tooltip content="צור שחקן חדש" color="primary">
        <UserPlusIcon className="h-5 md:ml-4" cursor="copy" />
      </Tooltip>
    </Link>
  );
}
