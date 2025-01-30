'use client';
import React from 'react';

export default function ExitButton({
                                     signout,
                                   }: {
  signout: () => void;
}) {

  return (
    <div
      onClick={() => {
        signout();
      }}
      className="ExitButton left"
    >
      התנתק
    </div>
  );
}




