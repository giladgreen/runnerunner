'use client';
import React from 'react';
import Image from 'next/image';
export default function UserGuideRegistrationPage() {
  return (
    <div className="rtl w-full" style={{ zoom: 1.3 }}>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">
          <b>
            <u> רישום שחקנים לטורניר</u>
          </b>
        </h1>
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        יש מספר אפשרויות לרישום שחקנים לטורניר:
      </div>
      <div className="flex w-full items-center justify-between ">
        1. השחקן נכנס בעצמו ונרשם.
      </div>

      <div className="flex w-full items-center justify-between ">
        2. רישום על ידי עובד.
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        על מנת לרשום את השחקן לטורניר של היום, עליך למצוא את השחקן ברשימת
        השחקנים
      </div>
      <div className="flex w-full items-center justify-between ">
        *או בדף השחקנים או בדף הטורניר הנוכחי
      </div>
      <div className="flex w-full items-center justify-between ">
        **אם השחקן לא קיים במערכת יש ליצור אותו קודם
      </div>

      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        <Image
          src="/user_guide/registration/1.png"
          width={1200}
          height={1}
          alt="registration1"
          className="image-border"
        />
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        ואז לסמן בעמודה המתאימה
      </div>

      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        שימו לב: אם יש יותר מטורניר אחד באותו היום, בעמוד השחקנים צריך לסמן את
        העמודה המתאימה
      </div>

      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        <Image
          src="/user_guide/registration/2.png"
          width={1200}
          height={1}
          alt="registration2"
          className="image-border"
        />
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        ובעמוד הטורניר הנוכחי יש לבחור בטורניר הנכון
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        <Image
          src="/user_guide/registration/3.png"
          width={300}
          height={1}
          alt="registration3"
          className="image-border"
        />
      </div>

      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        על מנת לרשום שחקן לטורניר בהמשך השבוע, יש להיכנס לעמוד השחקן, ובו ניתן
        לסמן
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        <Image
          src="/user_guide/registration/4.png"
          width={400}
          height={1}
          alt="registration4"
          className="image-border"
        />
      </div>

      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        בטורניר שאין בו חובת רישום גם לא יהיה ניתן לרשום שחקנים
      </div>
    </div>
  );
}
