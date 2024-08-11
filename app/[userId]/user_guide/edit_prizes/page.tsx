import {  fetchUserById } from '@/app/lib/data';
import React from "react";
import NoPermissionsPage from "@/app/ui/client/NoPermissionsPage";
import Image from "next/image";

export default async function UserGuideEditPrizesPage({
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
                    <u>
                        יצירה ועריכת פרסים
                    </u>
                </b>
            </h1>
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            לשימוש בשאר המקומות באתר שמאפשרים בחירה מרשימת הפרסים או המרת פרס בשוויו בקרדיט
        </div>

        <div className="flex w-full items-center justify-between ">
            ניתן בעמוד ההגדרות להיכנס לעמוד עריכת הפרסים:
        </div>

        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/edit_prizes/1.png"
                width={800}
                height={1}
                alt="edit_prizes1"
                style={{ border: "1px solid black" }}
            />
        </div>

        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            בעמוד זה ניתן ליצור, למחוק ולערוך פרסים ולקבוע מה שוויים בקרדיט:
        </div>

        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/edit_prizes/2.png"
                width={800}
                height={1}
                alt="edit_prizes2"
                style={{ border: "1px solid black" }}
            />
        </div>


        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
היצירה והעריכה היא דיי ברורה ואין הרבה מה להוסיף:
        </div>

        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/edit_prizes/3.png"
                width={500}
                height={1}
                alt="edit_prizes3"
                style={{ border: "1px solid black" }}
            />
        </div>


    </div>
}
