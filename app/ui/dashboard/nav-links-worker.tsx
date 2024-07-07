'use client';

import {
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {ArrowDownOnSquareIcon} from "@heroicons/react/20/solid";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
function getLinks(userId: string){
  return [
    {
      name: "current tournament",
      href: `/worker/${userId}`,
      icon: ArrowDownOnSquareIcon
    },
    {
      name: 'configurations',
      href: `/worker/${userId}/configurations`,
      icon: WrenchScrewdriverIcon,
    }
  ];
}

export default function NavLinksWorker({ userId}: {userId:string}) {
  const pathname = usePathname();
  const links = getLinks(userId)
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
                'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                {
                  'bg-sky-100 text-blue-600': pathname === link.href,
                },
            )}          >
            <LinkIcon className="w-6" />
            <div className="hidden md:block">{link.name}</div>
          </Link>
        );
      })}
    </>
  );
}
