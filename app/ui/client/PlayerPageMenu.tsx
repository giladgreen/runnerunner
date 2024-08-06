'use client';
import React, { useState } from 'react';

import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

export default function PlayerPageMenu({ signout }: { signout: () => void }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div>
      <button
        className=""
        onClick={() => {
          setShowMenu((val) => !val);
        }}
      >
        <span className="sr-only">תפריט</span>
        <EllipsisVerticalIcon
          className="w-8"
          style={{ marginTop: 7, marginRight: -7 }}
        />
      </button>

      <div
        className={`rtl player_page_menu ${
          showMenu ? 'player_page_menu_opened' : 'player_page_menu_closed'
        }`}
        onClick={() => {
          setShowMenu((val) => !val);
        }}
      >
        <button
          onClick={() => {
            signout();
          }}
        >
          התנתק
        </button>
      </div>
    </div>
  );
}
/*

 */
