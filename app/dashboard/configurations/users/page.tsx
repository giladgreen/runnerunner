import { lusitana } from '@/app/ui/fonts';
import { fetchAllUsers } from '@/app/lib/data';
import React from "react";
import {User} from "@/app/lib/definitions";
import {deleteUser, updateIsUserAdmin, updateIsUserWorker} from "@/app/lib/actions";

export default async function Page() {
    const users = await fetchAllUsers();

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}><b><u>{users.length} Users</u></b></h1>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <table className="hidden  text-gray-900 md:table">
                    <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>
                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6 thin-column">

                        </th>
                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6 thin-column">
                            phone number
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium thin-column">
                            is admin
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium thin-column">
                            is operator
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium thin-column">

                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white">
                    {users?.map((user) => (
                        <tr
                            key={user.id}
                            className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                        >
                            <td className="whitespace-nowrap py-3 pl-6 pr-3 thin-column">
                                {user.name}
                            </td>
                            <td className="whitespace-nowrap py-3 pl-6 pr-3 thin-column">
                                {user.phone_number}
                            </td>
                            <td className="whitespace-nowrap py-3 pl-6 pr-3 thin-column">
                                <UpdateAdminUser user={user}/>
                            </td>
                            <td className="whitespace-nowrap py-3 pl-6 pr-3 thin-column">
                                <UpdateWorkerUser user={user}/>
                            </td>
                            <td className="whitespace-nowrap py-3 pl-6 pr-3 thin-column">
                                <DeleteUser user={user}/>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function UpdateAdminUser({user}: { user: User }) {
    const updateIsUserAdminWithId = updateIsUserAdmin.bind(null, user.id);

    const onSubmit = async (_formData: FormData) => {
        'use server'
        await updateIsUserAdminWithId();
    };


    return (
        <form action={onSubmit}>
            <button className="">
                {user.is_admin ? '✅' : '☑️'}
            </button>
        </form>
    );
}

function UpdateWorkerUser({user}: { user: User }) {
    const updateIsUserWorkerWithId = updateIsUserWorker.bind(null, user.id);

    const onSubmit = async (_formData: FormData) => {
        'use server'
        await updateIsUserWorkerWithId();
    };


    return (
        <form action={onSubmit}>
            <button className="">
                {user.is_worker ? '✅' : '☑️'}
            </button>
        </form>
    );
}

function DeleteUser({user}: { user: User }) {
    const deleteUserWithId = deleteUser.bind(null, user.id);

    const onSubmit = async (_formData: FormData) => {
        'use server'
        await deleteUserWithId();
    };

    if (user.is_admin){
        return null;
    }
    return (
        <form action={onSubmit}>
            <button style={{ border: '1px solid black', background: 'orange', borderRadius: 5, padding: '2px 6px' }}>
                Delete user
            </button>
        </form>
    );
}
