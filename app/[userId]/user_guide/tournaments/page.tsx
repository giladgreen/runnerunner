'use client';
import React from 'react';
import Image from 'next/image';

export default function UserGuideTournamentsPage() {
  return (
    <div className="rtl w-full" style={{ zoom: 1.3 }}>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">
          <b>
            <u>הגדרות טורנירים</u>
          </b>
        </h1>
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        על מנת לערוך טורנירים יש להיכנס לעמוד העריכה דרך עמוד ההגדרות:
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        <Image
          src="/user_guide/tournaments/1.png"
          width={700}
          height={10}
          alt="tournaments1"
          className="image-border"
        />
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        בעמוד זה ניתן לראות את כל הטורנירים הקיימים,לערוך אותם, למחוק* אותם
        וליצור חדשים
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        <Image
          src="/user_guide/tournaments/2.png"
          width={900}
          height={10}
          alt="tournaments2"
          className="image-border"
        />
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        *שימו לב שניתן למחוק טורניר רק אם יש יותר מטורניר אחד באותו יום
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        **על מנת לסמן טורניר קיים כלא פעיל יש לסמן שנדרש אישור הגעה ומספר
        השחקנים המקסימאלי הוא אפס
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 40 }}
      >
        עמוד יצירת טורניר חדש
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        <Image
          src="/user_guide/tournaments/3.png"
          width={900}
          height={10}
          alt="tournaments3"
          className="image-border"
        />
      </div>
    </div>
  );
}
