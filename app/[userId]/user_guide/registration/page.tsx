import {  fetchUserById } from '@/app/lib/data';
import React from "react";
import NoPermissionsPage from "@/app/ui/client/NoPermissionsPage";
import Image from "next/image";

export default async function UserGuideRegistrationPage({
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
                    <u> רישום שחקנים לטורניר
                    </u>
                </b>
            </h1>
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            יש מספר אפשרויות לרישום שחקנים לטורניר:
        </div>
        <div className="flex w-full items-center justify-between ">
            1. השחקן נכנס בעצמו ונרשם. במקרה כזה הוא יכול להירשם רק לטורניר של אותו היום
        </div>

        <div className="flex w-full items-center justify-between ">
            2. רישום על ידי עובד. במקרה כזה עובד יכול לרשום את השחקן גם לטורנירים של ימים אחרים
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            על מנת לרשום את השחקן לטורניר של היום, עליך למצוא את השחקן ברשימת השחקנים
        </div>
        <div className="flex w-full items-center justify-between ">
            *או בדף השחקנים או בדף הטורניר הנוכחי
        </div>
        <div className="flex w-full items-center justify-between ">
            **אם השחקן לא קיים במערכת יש ליצור אותו קודם
        </div>

        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/registration/1.png"
                width={1200}
                height={1}
                alt="registration1"
                style={{border: "1px solid black"}}
            />
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            ואז לסמן בעמודה המתאימה (ירוק אומר שהוא כבר רשום)
        </div>

        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            שימו לב: אם יש יותר מטורניר אחד באותו היום, בעמוד השחקנים צריך לסמן את העמודה המתאימה
        </div>

        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/registration/2.png"
                width={1200}
                height={1}
                alt="registration2"
                style={{border: "1px solid black"}}
            />
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            ובעמוד הטורניר הנוכחי יש לבחור בטורניר הנכון
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/registration/3.png"
                width={300}
                height={1}
                alt="registration3"
                style={{border: "1px solid black"}}
            />
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
בטורניר שאין בו חובת רישום גם לא ניתן לרשום שחקנים
        </div>

    </div>
}