import { fetchUserById } from '@/app/lib/data';
import React from "react";
import NoPermissionsPage from "@/app/ui/client/NoPermissionsPage";

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

    return <div className="rtl w-full" style={{ zoom: 1.3}}>
        <div className="flex w-full items-center justify-between">
            <h1 className="text-2xl">
                <b>
                    <u>                     דירוג שחקנים בסוף טורניר
                    </u>
                </b>
            </h1>
        </div>
        <div className="flex w-full items-center justify-between " style={{marginTop: 20}}>
            TBD
        </div>

    </div>
}
