import Form from '@/app/ui/players/create-form';
import SideNav from "@/app/ui/dashboard/sidenav";
import SideNavUser from "@/app/ui/dashboard/sidenav-user";

export default async function Page({ params }: { params: { id: string }}) {
const prevPage = `/worker/${params.id}`;
    return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
            <SideNavUser/>
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
            <Form prevPage={prevPage}/>
        </div>
    </div>
)
    ;
}
