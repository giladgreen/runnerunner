'use client';
import React from 'react';
import Image from 'next/image';

export default function UserGuidePlacesCreditPage() {
  return (
    <div className="rtl w-full" style={{ zoom: 1.3 }}>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">
          <b>
            <u> קביעת שווי פרסים בקרדיט</u>
          </b>
        </h1>
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        בעמוד הטורנירים הקודמים, עבור כל טורניר ניתן לראות את טבלת השחקנים
        שהגיעו לפרסים
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        <Image
          src="/user_guide/places_credit/1.png"
          width={900}
          height={10}
          alt="places_credit1"
          style={{ border: '1px solid black' }}
        />
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        בטבלה זו ניתן ללחוץ על ה ״הגדר שווי פרסים״ והטופס הבא ייפתח:
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        <Image
          src="/user_guide/places_credit/2.png"
          width={400}
          height={10}
          alt="places_credit2"
          style={{ border: '1px solid black' }}
        />
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        בטופס זה ניתן לקבוע כמה שווה בקרדיט כל מיקום
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        מידע זה יוכל לשמש אחר כך אם השחקן יבחר בקרדיט
      </div>

      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        לחיצה על כפתור האשראי אחר כך:
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        <Image
          src="/user_guide/places_credit/3.png"
          width={400}
          height={10}
          alt="places_credit3"
          style={{ border: '1px solid black' }}
        />
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        תפתח טופס בו ניתן לתת לשחקן קרדיט
      </div>

      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        (אוטומטית תיקח את הערך שהוגדר בשלבים הקודמים אך ניתן גם לדרוס עם ערך
        חדש)
      </div>
    </div>
  );
}
