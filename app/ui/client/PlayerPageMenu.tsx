'use client';
import React, { useState } from 'react';
import {
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { Nevigationlinks } from '@/app/ui/client/NavLinks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PlayerPageMenu({
  signout,
  userId,
  showRsvp,
  prizesEnabled,
}: {
  userId: string;
  signout: () => void;
  showRsvp: boolean;
  prizesEnabled: boolean;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();

  return (
    <div>
      <button
        className=""
        onClick={() => {
          setShowMenu((val) => !val);
        }}
      >
        <span className="sr-only">תפריט</span>
        <Bars3Icon className="w-8" style={{ marginTop: 7, marginRight: -7, zoom: 1.3 }} />
      </button>

      <div
        className={`rtl player_page_menu ${
          showMenu ? 'player_page_menu_opened' : 'player_page_menu_closed'
        }`}
      >
        <div
          className="player_page_menu_header"
          onClick={() => {
            setShowMenu((val) => !val);
          }}
        >
          <ArrowRightIcon style={{ maxHeight: 30 }} />
        </div>
        <div className="player_page_menu_body">
          {Nevigationlinks(userId)
            .filter(
              (link) => link.player && (!link.prizesLink || prizesEnabled),
            )
            .filter((link) => showRsvp || !link.isRsvp)
            .map((link) => {
              const LinkIcon = link.icon;
              return (
                <Link
                  onClick={() => {
                    setTimeout(() => {
                      setShowMenu(false);
                    }, 300);
                  }}
                  key={link.name}
                  href={link.href}
                  className={`player-menu-item ${pathname === link.href ? 'player-menu-item-current' : ''}`}
                >
                  <LinkIcon className="w-6" style={{ margin: '0 4px' }} />
                  <div>{link.name}</div>
                </Link>
              );
            })}
          <div
            style={{ marginTop: 50, marginRight: 10, cursor: 'pointer' }}
            onClick={() => {
              signout();
            }}
            className="flex"
          >
            <ArrowRightOnRectangleIcon style={{ maxHeight: 30, cursor: 'pointer' }} />
            יציאה
          </div>
        </div>
      </div>
    </div>
  );
}
/*

 */
