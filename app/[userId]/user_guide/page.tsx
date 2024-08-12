import MVPPlayers from '@/app/ui/client/MVPPlayers';
import DebtPlayers from '@/app/ui/client/DebtPlayers';
import { fetchRSVPAndArrivalData, fetchUserById } from '@/app/lib/data';
import GeneralPlayersCardWrapper from '@/app/ui/client/GeneralPlayersCardWrapper';
import PlayerPage from '@/app/ui/client/PlayerPage';
import { TournamentDB } from '@/app/lib/definitions';
import AdminHomePage from '@/app/ui/client/AdminHomePage';
import { getFinalTablePlayersContent } from '@/app/ui/client/helpers';
import React from "react";
import NoPermissionsPage from "@/app/ui/client/NoPermissionsPage";
import Link from "next/link";
import {Button} from "primereact/button";
import Image from "next/image";

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
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            עמוד טורניר נוכחי:
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
          כאשר מקלידים שם או מספר בשורת החיפוש, יציג את תוצאות החיפוש,
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
          כאשר שורת החיפוש ריקה, יציג את השחקנים שאישרו הגעה ו\או נכנסו לטורניר
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/1.png"
                width={1000}
                height={1}
                alt="general"
                style={{border: "1px solid black"}}
            />
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
