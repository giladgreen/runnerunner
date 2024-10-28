'use client';

import React from 'react';
import Image from 'next/image';

export default function UserGuideCurrentTournamentPage() {
  return (
    <div className="rtl w-full" style={{ zoom: 1.3 }}>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">
          <b>
            <u>עמוד הטורניר הנוכחי</u>
          </b>
        </h1>
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        כאשר מקלידים שם או מספר בשורת החיפוש, יציג את תוצאות החיפוש,
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        כאשר שורת החיפוש ריקה, יציג את השחקנים שאישרו הגעה ו\או נכנסו לטורניר
        ואת השחקנים שעודכנו בדקות האחרונות
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        <Image
          src="/user_guide/current_tournament/1.png"
          width={1000}
          height={1}
          alt="general"
          style={{ border: '1px solid black' }}
        />
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 3 }}
      >
        כאשר מחפשים שחקן ולא מוצאים אותו, לחיצה על יצירת שחקן חדש תפתח את עמוד
        יצירת השחקן עם השם\טלפון שהוקלד בחיפוש
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        כאשר אתם בעמוד זה, לחיצה על ״שמור״ (ctrl+S) תוריד למחשב קובץ של נתוני
        הקרדיט העדכניים
      </div>

      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 7 }}
      >
        מומלץ מדי פעם לשמור
      </div>

      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 40 }}
      >
        בנוסף, ניתן ללחוץ על פירוט ההכנסות:
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        <Image
          src="/user_guide/current_tournament/2.png"
          width={400}
          height={1}
          alt="general"
          style={{ border: '1px solid black' }}
        />
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        שיפתח עמוד מפורט יותר, ובו ניתן לעשות תיקונים במידת הצורך:
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        <Image
          src="/user_guide/current_tournament/3.png"
          width={400}
          height={1}
          alt="general"
          style={{ border: '1px solid black' }}
        />
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        <Image
          src="/user_guide/current_tournament/4.png"
          width={400}
          height={1}
          alt="general"
          style={{ border: '1px solid black' }}
        />
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        <Image
          src="/user_guide/current_tournament/5.png"
          width={400}
          height={1}
          alt="general"
          style={{ border: '1px solid black' }}
        />
      </div>
    </div>
  );
}
