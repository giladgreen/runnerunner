'use client';
import {ArrowRightOnRectangleIcon} from '@heroicons/react/24/outline';
import React, {useCallback, useEffect, useState} from "react";
import AreYouSure from "@/app/ui/client/AreYouSure";

const TIMEOUT = 15 * 60;
const TIMEOUT_WARNING = TIMEOUT - 60;

export default function SignOutButton({signOut, playerScreen }: { signOut: () => void, playerScreen?: boolean}) {
    const [showedAlert, setShowedAlert] = useState(false);
    const [intervalStarted, setIntervalStarted] = useState(false);
    const [eventListener, setEventListener] = useState(false);
    const [idleTimeout, setIdleTimeout] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const intervalCallback = useCallback(()=>{
        if (idleTimeout < TIMEOUT){
            setIdleTimeout(t => t + 1);
        }
    },[idleTimeout])

    if (!playerScreen && !intervalStarted) {
        setInterval(intervalCallback,1_000)
        setIntervalStarted(true);
    }
    useEffect(()=>{
        if (!playerScreen && !eventListener){
            document.addEventListener('mousemove', (_e) => {
                setIdleTimeout(0);
            });
            setEventListener(true);
        }
        if (idleTimeout > TIMEOUT && !showedAlert) {

            setShowedAlert(true);
            alert('התנתקת מהמערכת בשל חוסר פעילות');
            signOut();
        }
    },[idleTimeout, eventListener, showedAlert])


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

                style={{ marginTop: playerScreen ? 5 : 0, background: idleTimeout < TIMEOUT_WARNING ? 'transparent' : (idleTimeout % 2 === 0 ? '#FF5555' : 'transparent')}}    >
                <ArrowRightOnRectangleIcon className={playerScreen ? "w-10" : "w-6"}/>
                {!playerScreen && <div className="hidden md:block">התנתק</div>}
                {!playerScreen && idleTimeout > TIMEOUT_WARNING && idleTimeout > 0 && <div className="hidden md:block" style={{ margin:'0 20px'}}>({TIMEOUT - idleTimeout})</div>}
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
