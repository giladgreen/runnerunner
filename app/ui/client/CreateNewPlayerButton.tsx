import Link from "next/link";
import {PlusIcon} from "@heroicons/react/24/outline";
import React from "react";

export default function CreateNewPlayerButton({ params }: { params: { userId: string } }) {
    return (
        <Link
            href={`/${params.userId}/players/create`}
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
            <span className="hidden md:block">create new player</span>{' '}
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}
