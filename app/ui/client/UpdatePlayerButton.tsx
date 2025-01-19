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
      className="link-button rounded-md border p-2 "
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
