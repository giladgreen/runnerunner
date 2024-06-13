import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React from "react";
import {Button} from "@/app/ui/button";

export function CreateNewPlayer() {
  return (
    <Link
      href="/dashboard/players/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">create new player</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}


export function CreateNewTodayPlayer({connectedUserId}:{connectedUserId?: string}) {
  const href = connectedUserId ? `/worker/${connectedUserId}/create` : '/dashboard/todayplayers/create';
  return (
    <Link
      href={href}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">create new player</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdatePlayer({ id }: { id: string }) {
  return (
    <Link
        href={`/dashboard/players/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

