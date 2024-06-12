import { fetchUserByPhoneNumber} from "@/app/lib/data";
import {notFound} from "next/navigation";

import SideNavUser from "@/app/ui/dashboard/sidenav-user";
export default async function Page({ params }: { params: { id: string } }) {
    const user = await fetchUserByPhoneNumber(params.id);
    if (!user) {
        notFound();
    }

    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNavUser/>
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
                Welcome {user.name}
            </div>
        </div>
    );
}
