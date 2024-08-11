import {  fetchUserById } from '@/app/lib/data';
import React from "react";
import NoPermissionsPage from "@/app/ui/client/NoPermissionsPage";
import Image from "next/image";

export default async function UserGuideEntriesPage({
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
                    <u> הכנסת שחקן לטורניר נוכחי
                    </u>
                </b>
            </h1>
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            בשלב ראשון יש למצוא את השחקן בעמוד הטורניר הנוכחי
        </div>
        <div className="flex w-full items-center justify-between ">
            *אם השחקן לא קיים במערכת יש ליצור אותו קודם
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/entries/1.png"
                width={1200}
                height={1}
                alt="entries1"
                style={{border: "1px solid black"}}
            />
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            בשלב זה ניתן לוודא שהשחקן רשום לטורניר
        </div>

        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            בשלב הבא לוחצים על כפתור ה:
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/entries/2.png"
                width={200}
                height={1}
                alt="entries2"
                style={{border: "1px solid black"}}
            />
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            ויפתח לכם הטופס:
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/entries/3.png"
                width={500}
                height={1}
                alt="entries3"
                style={{border: "1px solid black"}}
            />
        </div>

        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            א. הסכום יתמלא אוטומטית (אך ניתן לשנות במידת הצורך)
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 5}}>
            ב. הסיבה גם כן תתמלא בצורה אוטומטית (ושוב, ניתן לשנות אם צריך)
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 5}}>
            ג. אם יש לשחקן מספיק קרדיט, ברירת המחדל תהיה לסמן הורדה של קרדיט
        </div>
        <div className="flex w-full items-center justify-between ">
            ניתן כמובן לשנות לאמצעי תשלום אחר אם השחקן מבקש
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            אם השחקן משלם במזומן - מסמנים מזומן
        </div>
        <div className="flex w-full items-center justify-between ">
            אם השחקן מעביר כסף ומראה אישור - מסמנים העברה
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            ואם שחקן מבקש להיכנס על קרדיט של שחקן אחר, ניתן לסמן את זה ולבחור מאיזה שחקן יירד הקרדיט
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/entries/4.png"
                width={500}
                height={1}
                alt="entries4"
                style={{border: "1px solid black"}}
            />
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            בחלון בחירת שחקן ניתן לחפש והוא ישלים
        </div>

        <div className="flex w-full items-center justify-between " style={{marginTop: 50}}>
            ניתן לראות את מספר הכניסות ששחקן ביצע כבר:
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/entries/5.png"
                width={200}
                height={1}
                alt="entries5"
                style={{border: "1px solid black"}}
            />
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            במידה והשחקן כבר ניצל את כל הכניסות המותרות תופיע הערה כזאת:
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/entries/6.png"
                width={500}
                height={1}
                alt="entries6"
                style={{border: "1px solid black"}}
            />
        </div>

        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            במידה והכנסת את השחקן הלא נכון או שנעשתה טעות כלשהי,
        </div>
        <div className="flex w-full items-center justify-between ">
            ניתן לבטל את ההכנסה האחרונה של שחקן על ידי לחיצה על המספר כניסות
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/entries/7.png"
                width={200}
                height={1}
                alt="entries7"
                style={{border: "1px solid black"}}
            />
        </div>
        <div className="flex w-full items-center justify-between ">
            ותיפתח הודעת אישור
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 10}}>
            <Image
                src="/user_guide/entries/8.png"
                width={800}
                height={1}
                alt="entries8"
                style={{border: "1px solid black"}}
            />
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            כל עוד לשחקן יש כניסות ניתן ללחוץ ולבטל את האחרונה מבינהן
        </div>
    </div>
}
