import { fetchUserById } from '@/app/lib/data';
import React from "react";
import NoPermissionsPage from "@/app/ui/client/NoPermissionsPage";
import Image from "next/image";

export default async function UserGuidePlacesPage({
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
                    <u> דירוג שחקנים בסוף טורניר
                    </u>
                </b>
            </h1>
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            בכדי לסמן לאיזה מקום בטורניר שחקן הגיע, יש ללחוץ על כפתור הסולמית בשורה של השחקן
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/places/1.png"
                width={300}
                height={1}
                alt="places1"
                style={{border: "1px solid black"}}
            />
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
           יש להכניס את המקום בחלון שנפתח (או אפס לאפס את הבחירה)
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/places/2.png"
                width={500}
                height={1}
                alt="places2"
                style={{border: "1px solid black"}}
            />
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
          לאחר הבחירה הנתונים יופיעו גם בטבלת השחקנים:
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/places/3.png"
                width={900}
                height={1}
                alt="places3"
                style={{border: "1px solid black"}}
            />
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
          וגם בטבלה ייעודית לתוצאות
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/places/4.png"
                width={500}
                height={1}
                alt="places4"
                style={{border: "1px solid black"}}
            />
        </div>
    </div>
}
