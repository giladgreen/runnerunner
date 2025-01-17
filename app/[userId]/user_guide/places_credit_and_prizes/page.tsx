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
          className="image-border"
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
          className="image-border"
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
          className="image-border"
        />
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        תפתח טופס בו ניתן לבחור בין מתן קרדיט, ובין בחירת פרס:
      </div>

      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        בחירת קרדיט (אוטומטית תיקח את הערך שהוגדר בשלבים הקודמים אך ניתן גם
        לדרוס עם ערך חדש)
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        <Image
          src="/user_guide/places_credit/4.png"
          width={400}
          height={10}
          alt="places_credit4"
          className="image-border"
        />
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 20 }}
      >
        בחירת פרס, במקרה כזה אם הפרס שווה יותר מהקרדיט או הקרדיט שווה יותר משווי
        הפרס, תוצג הודעה מתאימה, ויהיה ניתן לעדכן את קרדיט השחקן בהתאם
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        <Image
          src="/user_guide/places_credit/5.png"
          width={400}
          height={10}
          alt="places_credit5"
          className="image-border"
        />
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        * בדוגמא הזאת, השחקן זכה במקום ראשון, ערך הקרדיט שהוגדר עבור מקום זה הוא
        1200 שקלים, והפרס שנבחר הוא איר פודס בשווי 600 שקלים, לכן אוטומטית
        יתווספו לשחקן 600 שקלים לקרדיט
      </div>
      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 10 }}
      >
        **דוגמא הפוכה תהיה אם השחקן לדוגמא זכה במקום החמישי בפרס בשווי 300 שקלים
        ובחר איר פודס בשווי 600 שקלים, אז ירדו לו מהקרדיט 300 שקלים (גם אם זה
        יכניס אותו למינוס)
      </div>

      <div
        className="flex w-full items-center justify-between "
        style={{ marginTop: 30 }}
      >
        שימו לב שיש לסמן את הריבוע על מנת שהקרדיט ישתנה בהתאם..
      </div>
    </div>
  );
}
