'use client';

import {
  UserGroupIcon,
  HomeIcon,BanknotesIcon,
  WrenchScrewdriverIcon,
  ArrowDownOnSquareIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {UserDB} from "@/app/lib/definitions";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = (userId: string) => [
  {
    name: 'homepage',
    href: `/${userId}`,
    icon: HomeIcon,
    admin: true,
  },
  {
    name: "current tournament",
    href: `/${userId}/current_tournament`,
    icon: ArrowDownOnSquareIcon,
    admin: true,
    worker: true,
  },
  {
    name: "previous tournaments",
    href: `/${userId}/tournaments`,
    icon: BanknotesIcon,
    admin: true,
    worker: true,
  },
  {
    name: 'all players',
    href: `/${userId}/players`,
    icon: UserGroupIcon,
    admin: true,
    worker: true,
  },

  {
    name: 'prizes',
    href: `/${userId}/prizes`,
    icon: GiftIcon,
    admin: true,
    worker: true,
  },

  {
    name: 'configurations',
    href: `/${userId}/configurations`,
    icon: WrenchScrewdriverIcon,
    admin: true,
    worker: true,
  },
  {
    name: 'player',
    href: `/${userId}`,
    icon: UserGroupIcon,
    player: true,
  },
];

export default function NavLinks({user}:{user: UserDB}) {
  const pathname = usePathname();
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;
  const isPlayer = !isAdmin && !isWorker;
  return (
    <>
      {links(user.id).filter(link => (isAdmin && link.admin) || (isWorker && link.worker) || (isPlayer && link.player)  ).map((link) => {
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
      }).filter(Boolean)}
    </>
  );
}
