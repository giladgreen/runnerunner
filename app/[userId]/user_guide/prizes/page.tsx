import {  fetchUserById } from '@/app/lib/data';
import React from "react";
import NoPermissionsPage from "@/app/ui/client/NoPermissionsPage";
import Image from "next/image";
import Link from "next/link";

export default async function UserGuidePrizesPage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await fetchUserById(params.userId);
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;

    if (!isAdmin && !isWorker) {
        return <NoPermissionsPage />
    }

    return <div className="rtl w-full" style={{zoom: 1.3}}>
        <div className="flex w-full items-center justify-between">
            <h1 className="text-2xl">
                <b>
                    <u> מתן פרס לשחקן והמרת פרס קיים לקרדיט
                    </u>
                </b>
            </h1>
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            אם שחקן זוכה בפרס (נניח בטורניר באונטי)
        </div>
        <div className="flex w-full items-center justify-between ">
            ניתן לסמן זאת על ידי מציאת השחקן ולחיצה על הכפתור:
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/prizes/1.png"
                width={200}
                height={1}
                alt="prizes1"
                style={{border: "1px solid black"}}
            />
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            ייפתח טופס בחירה שבו ניתן לבחור מבין פרסים קיימים או להקליד שם של פרס שלא ברשימה
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/prizes/2.png"
                width={500}
                height={1}
                alt="prizes2"
                style={{border: "1px solid black"}}
            />
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            בעמוד הטורניר הנוכחי, יופיעו כל ההשחקנים שנרשמו לטורניר ויש להם פרסים שעוד לא נמסרו:
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/prizes/3.png"
                width={900}
                height={1}
                alt="prizes3"
                style={{border: "1px solid black"}}
            />
        </div>

        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            על ידי לחיצה על הכפתור בשורה של הפרס ניתן לפתוח את הטופס הבא
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/prizes/4.png"
                width={300}
                height={1}
                alt="prizes4"
                style={{border: "1px solid black"}}
            />
        </div>

        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            ובטופס ניתן להמיר את הפרס בקרדיט עבור השחקן
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            אם לא מוזן כבר ערך או אם רוצים - ניתן גם להזין ערך אחר
        </div>


        <div className="flex w-full items-center justify-between " style={{marginTop: 40}}>
            בעמוד הפרסים, ניתן לראות את כל הפרסים של כל השחקנים בכל הסטטוסים
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/prizes/5.png"
                width={1000}
                height={1}
                alt="prizes5"
                style={{border: "1px solid black"}}
            />
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            בעמוד זה ניתן
        </div>
        <div className="flex w-full items-center justify-between ">
            א. להמיר פרס של שחקן לקרדיט עבור אותו שחקן
        </div>
        <div className="flex w-full items-center justify-between ">
            ב. להזיז פרס בין סטטוסים
        </div>

        <div className="rtl flex " style={{marginTop: 20}}>
            על מנת ליצור ולערוך את הפרסים ושוויים, הסתכלו ב
            <Link href={`/${params.userId}/user_guide/edit_prizes`}>
               <u style={{ color: 'blue'}}> יצירה ועריכת פרסים</u>
            </Link>
        </div>


    </div>
}
