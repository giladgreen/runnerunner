'use client';
import {ArrowRightOnRectangleIcon} from '@heroicons/react/24/outline';
import React, {useState} from "react";
import AreYouSure from "@/app/ui/client/AreYouSure";

export default function SignOutButton({signOut, playerScreen }: { signOut: () => void, playerScreen?: boolean}) {

    const [showConfirmation, setShowConfirmation] = useState(false);

    return (
        <div>
            <button
                onClick={() => {
                    setShowConfirmation(true);
                }}
                className={playerScreen ?
                    "" :
                    "rtl flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
                    }

                style={{ marginTop: playerScreen ? 5 : 0}}    >
                <ArrowRightOnRectangleIcon className={playerScreen ? "w-10" : "w-6"}/>
                {!playerScreen &&<div className="hidden md:block">התנתק</div>}
            </button>
            {showConfirmation && (
                <AreYouSure
                    onConfirm={() => {
                        setShowConfirmation(false);
                        signOut();
                    }}
                    onCancel={() => setShowConfirmation(false)}
                    subtext=""
                    text="האם להתנתק?"
                />
            )}
        </div>
    );
}
