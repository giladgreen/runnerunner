'use client';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useState } from 'react';
import AreYouSure from '@/app/ui/client/AreYouSure';
const MINUTE = 60;
const TIMEOUT = 15 * MINUTE;
const TIMEOUT_WARNING = TIMEOUT - MINUTE;

export default function SignOutButton({
  signOut,
  playerScreen,
}: {
  signOut: () => void;
  playerScreen?: boolean;
}) {
  const [isInside, setIsInside] = useState(false);
  const [showedAlert, setShowedAlert] = useState(false);
  const [intervalStarted, setIntervalStarted] = useState(false);
  const [eventListener, setEventListener] = useState(false);
  const [idleTimeout, setIdleTimeout] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const intervalCallback = useCallback(() => {
    if (idleTimeout < TIMEOUT) {
      setIdleTimeout((t) => t + 1);
    }
  }, [idleTimeout]);

  if (!playerScreen && !intervalStarted) {
    setInterval(intervalCallback, 1_000);
    setIntervalStarted(true);
  }
  useEffect(() => {
    if (!playerScreen && !eventListener) {
      document.addEventListener('mousemove', (_e) => {
        setIdleTimeout(0);
        setIsInside(true);
      });
      document.body.addEventListener('mouseleave', function (event) {
        if (
          event.clientY <= 0 ||
          event.clientX <= 0 ||
          event.clientX >= window.innerWidth ||
          event.clientY >= window.innerHeight
        ) {
          setIsInside(false);
        }
      });

      setEventListener(true);
    }
    if (idleTimeout > TIMEOUT && !showedAlert) {
      setShowedAlert(true);
      setTimeout(() => {
        window.location.href = `/logged_out`;
      }, 1000);
      signOut();
    }
  }, [idleTimeout, eventListener, showedAlert]);

  const disconnectText =
    playerScreen || isInside ? 'התנתק' : 'יש להתנתק לפני סגירת הלשונית';
  let backgroundClass = 'transparent_background';
  if (!playerScreen) {
    if (idleTimeout > TIMEOUT_WARNING || !isInside) {
      backgroundClass = 'red_blinking_background';
    } else {
      backgroundClass = 'regular_background';
    }
  }

  return (
    <div>
      <button
        onClick={() => {
          setShowConfirmation(true);
        }}
        className={
          playerScreen
            ? ''
            : `rtl ${backgroundClass}  flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md  p-3  font-mediummd:flex-none md:justify-start md:p-2 md:px-3`
        }
        style={{ marginTop: playerScreen ? 5 : 0 }}
      >
        <ArrowUpRightIcon className={`logout-color ${playerScreen ? 'w-10' : 'w-6'}`} />
        {!playerScreen && (
          <div className=" md:block logout-color">{disconnectText}</div>
        )}
        {!playerScreen && idleTimeout > TIMEOUT_WARNING && idleTimeout > 0 && (
          <div className="hidden md:block" style={{ margin: '0 20px' }}>
            ({TIMEOUT - idleTimeout > 0 ? TIMEOUT - idleTimeout : ''})
          </div>
        )}
      </button>
      {showConfirmation && (
        <AreYouSure
          onConfirm={() => {
            setShowConfirmation(false);
            signOut();
          }}
          onCancel={() => setShowConfirmation(false)}
          action="התנתקות"
          question="האם אתה בטוח?"
        />
      )}
    </div>
  );
}
