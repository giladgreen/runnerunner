import { fetchUserById } from '@/app/lib/data';

import React from "react";
import NoPermissionsPage from "@/app/ui/client/NoPermissionsPage";
import Link from "next/link";


export default async function UserGuidePage({
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
                    <u>מדריך למשתמש</u>
                </b>
            </h1>
        </div>
        <div className="flex w-full items-center justify-between guide-link" style={{marginTop: 30}}>
            <Link href={`/${params.userId}/user_guide/current_tournament`}>
                עמוד הטורניר הנוכחי
            </Link>
        </div>
        <div className="flex w-full items-center justify-between guide-link" style={{marginTop: 20}}>
            <Link href={`/${params.userId}/user_guide/create_player`}>
                יצירת שחקן חדש
            </Link>
        </div>
        <div className="flex w-full items-center justify-between guide-link" style={{marginTop: 20}}>
            <Link href={`/${params.userId}/user_guide/registration`}>
                רישום שחקנים לטורניר
            </Link>
        </div>
        <div className="flex w-full items-center justify-between guide-link" style={{marginTop: 20}}>
            <Link href={`/${params.userId}/user_guide/entries`}>

                הכנסת שחקן לטורניר נוכחי

            </Link>
        </div>
        <div className="flex w-full items-center justify-between guide-link" style={{marginTop: 20}}>
            <Link href={`/${params.userId}/user_guide/prizes`}>

                מתן פרס לשחקן והמרת פרס קיים לקרדיט

            </Link>
        </div>
        <div className="flex w-full items-center justify-between guide-link" style={{marginTop: 20}}>
            <Link href={`/${params.userId}/user_guide/places`}>

                דירוג שחקנים בסוף טורניר

            </Link>
        </div>
        <div className="flex w-full items-center justify-between guide-link" style={{marginTop: 20}}>
            <Link href={`/${params.userId}/user_guide/places_credit`}>

                קביעת שווי פרסים בקרדיט

            </Link>
        </div>
        <div className="flex w-full items-center justify-between guide-link" style={{marginTop: 20}}>
            <Link href={`/${params.userId}/user_guide/edit_prizes`}>

                יצירה ועריכת פרסים

            </Link>
        </div>
        <div className="flex w-full items-center justify-between guide-link" style={{marginTop: 20}}>
            <Link href={`/${params.userId}/user_guide/tournaments`}>

                הגדרות טורנירים

            </Link>
        </div>
    </div>
}
