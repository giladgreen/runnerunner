import {  fetchUserById } from '@/app/lib/data';
import React from "react";
import NoPermissionsPage from "@/app/ui/client/NoPermissionsPage";
import Image from "next/image";

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
        <div className="flex w-full items-center justify-between " >
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
    </div>
}
