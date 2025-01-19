'use client';
import { deleteUser } from '@/app/lib/actions';
import React, { useState } from 'react';
import AreYouSure from '@/app/ui/client/AreYouSure';
import { UserDB } from '@/app/lib/definitions';

export default function DeleteUserButton({ user, userId }: { user: UserDB; userId: string }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const deleteUserWithId = deleteUser.bind(null, {
    id: user.id,
    prevPage: `/${userId}/configurations/users`,
  });

  if (user.is_admin || user.is_worker) {
    return null;
  }

  return (
    <div>
      <div
        className="pointer"
        onClick={() => {
          setShowConfirmation(true);
        }}
      >
        <button
          style={{
            border: '1px solid black',
            background: 'var(--red)',
            borderRadius: 5,
            padding: '2px 6px',
          }}
        >
          מחק משתמש
        </button>
      </div>
      {showConfirmation && (
        <AreYouSure
          onConfirm={() => {
            setShowConfirmation(false);
            deleteUserWithId();
          }}
          onCancel={() => setShowConfirmation(false)}
          action="מחיקת משתמש"
          question="האם אתה בטוח?"
        />
      )}
    </div>
  );
}
