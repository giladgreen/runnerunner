import { PencilIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React from 'react';

export default function UpdatePlayerButton({
  userId,
  id,
}: {
  userId: string;
  id: string;
}) {
  return (
    <Link
      href={`/${userId}/players/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
