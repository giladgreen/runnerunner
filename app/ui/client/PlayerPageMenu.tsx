'use client';
import React, { useState } from 'react';
import { ArrowRightIcon, ArrowRightOnRectangleIcon, Bars3Icon} from '@heroicons/react/24/outline';

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
        <Bars3Icon
          className="w-8"
          style={{ marginTop: 7, marginRight: -7 }}
        />
      </button>

        <div
            className={`rtl player_page_menu ${
                showMenu ? 'player_page_menu_opened' : 'player_page_menu_closed'
            }`}
        >
            <div className="player_page_menu_header" onClick={() => {
                setShowMenu((val) => !val);
            }}>
                <ArrowRightIcon style={{ maxHeight: 30 }}/>
            </div>
            <div className="player_page_menu_body">

                <div
                    style={{marginTop: 20}}
                    onClick={() => {
                        signout();
                    }}
                    className="flex"
                >

                    <ArrowRightOnRectangleIcon style={{maxHeight: 30}}/>
                    יציאה

                </div>
            </div>

        </div>
    </div>
  );
}
/*

 */
