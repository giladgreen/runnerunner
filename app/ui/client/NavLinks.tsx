'use client';

import {
  UserGroupIcon,
  HomeIcon,
  BanknotesIcon,
  WrenchScrewdriverIcon,
  GiftIcon,
  InformationCircleIcon,
  PuzzlePieceIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { UserDB } from '@/app/lib/definitions';
import ClipboardDocumentCheckIcon from '@heroicons/react/24/outline/ClipboardDocumentCheckIcon';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
export const Nevigationlinks = (userId: string) => [
  {
    name: 'עמוד הבית',
    href: `/${userId}`,
    icon: HomeIcon,
    admin: true,
  },
  {
    name: 'פרטי השחקן שלי',
    href: `/${userId}/player_data`,
    icon: InformationCircleIcon,
    adminPlayer: true,
  },
  {
    name: 'טורניר נוכחי',
    href: `/${userId}/current_tournament`,
    icon: PuzzlePieceIcon,
    admin: true,
    worker: true,
  },
  {
    name: 'טורנירים קודמים',
    href: `/${userId}/tournaments`,
    icon: BanknotesIcon,
    admin: true,
    worker: true,
  },
  {
    name: 'כל השחקנים',
    href: `/${userId}/players`,
    icon: UserGroupIcon,
    admin: true,
    worker: true,
  },
  {
    name: 'פרסים',
    href: `/${userId}/prizes`,
    icon: GiftIcon,
    admin: true,
    worker: true,
    prizesLink: true,
  },
  {
    name: 'מדריך למשתמש',
    href: `/${userId}/user_guide`,
    icon: InformationCircleIcon,
    admin: true,
    worker: true,
  },
  {
    name: 'הגדרות',
    href: `/${userId}/configurations`,
    icon: WrenchScrewdriverIcon,
    admin: true,
    worker: true,
  },
  {
    name: 'מידע',
    href: `/${userId}`,
    icon: InformationCircleIcon,
    player: true,
  },
  {
    name: 'רישום',
    href: `/${userId}/player_registration`,
    icon: PuzzlePieceIcon,
    player: true,
    isRsvp: true,
  },
  {
    name: 'תקנון',
    href: `/${userId}/terms`,
    icon: ClipboardDocumentCheckIcon,
    player: true,
  },
  {
    name: ' פרסים',
    href: `/${userId}/player_prizes`,
    icon: GiftIcon,
    player: true,
    prizesLink: true,
  },
];

export default function NavLinks({
  user,
  prizesEnabled,
}: {
  user: UserDB;
  prizesEnabled: boolean;
}) {
  const pathname = usePathname();
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;
  const isPlayer = !isAdmin && !isWorker && user.is_player;
  const isAdminPlayer = (isAdmin || isWorker) && user.is_player;

  return (
    <>
      {Nevigationlinks(user.id)
        .filter(
          (link) =>
            (!link.prizesLink || prizesEnabled) &&
            ((isAdmin && link.admin) ||
              (isWorker && link.worker) ||
              (isAdminPlayer && link.adminPlayer) ||
              (isPlayer && link.player)),
        )
        .filter(Boolean)
        .map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'rtl side-menu-item flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3  font-medium  md:flex-none md:justify-start md:p-2 md:px-3',
                {
                  'side-menu-item-selected': pathname === link.href,
                },
              )}
            >
              <LinkIcon className="w-6" />
              <div className="" style={{ }}>{link.name}</div>
            </Link>
          );
        })
        .filter(Boolean)}
    </>
  );
}
