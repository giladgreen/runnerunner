'use client';

import React from 'react';
import Image from 'next/image';

export default function UserGuideCreatePlayerPage() {
  return (
    <div className="rtl w-full" style={{ zoom: 1.3 }}>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">
          <b>
            <u>יצירת שחקן חדש</u>
          </b>
        </h1>
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        אם שחקן לא נמצא כבר במערכת וצריך ליצור אותו,
      </div>

      <div className="flex w-full items-center justify-between ">
        אפשר או מעמוד השחקנים:
      </div>

      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        <Image
          src="/user_guide/create_player/1.png"
          width={1000}
          height={1}
          alt="create_player1"
          className="image-border"
        />
      </div>

      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        או מעמוד הטורניר הנוכחי:
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        <Image
          src="/user_guide/create_player/2.png"
          width={300}
          height={1}
          alt="create_player2"
          className="image-border"
        />
      </div>

      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        ואז למלא את פרטי השחקן בטופס ולשלוח
      </div>

      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        <Image
          src="/user_guide/create_player/3.png"
          width={1000}
          height={1}
          alt="create_player3"
          className="image-border"
        />
      </div>
    </div>
  );
}
