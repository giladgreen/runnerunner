import { fetchFeatureFlags} from '@/app/lib/data';
import React from "react";
import {updateFFValue} from "@/app/lib/actions";

export default async function FlagsPage({ params }: { params: { userId: string } }) {
    const { prizesEnabled, placesEnabled, rsvpEnabled, playerRsvpEnabled, usePhoneValidation, importEnabled} = await fetchFeatureFlags();

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`text-2xl`}><b><u>Toggle Feature Flags</u></b></h1>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <table className="hidden  text-gray-900 md:table">
                    <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>
                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                            Feature
                        </th>
                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6 thin-column">
                            status
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white">
                    <tr
                        key={'importEnabled'}
                        className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                            <b>Import</b>
                        </td>
                        <td className="whitespace-nowrap py-3 pl-6 pr-3 thin-column">
                            <UpdateFeatureFlag featureName={'import'} currentValue={Boolean(importEnabled)} userId={params.userId}/>
                        </td>
                    </tr>
                    <tr
                        key={'prizesEnabled'}
                        className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                            <b>Prizes</b>
                        </td>
                        <td className="whitespace-nowrap py-3 pl-6 pr-3 thin-column">
                            <UpdateFeatureFlag featureName={'prizes'} currentValue={Boolean(prizesEnabled)} userId={params.userId}/>
                        </td>
                    </tr>
                    <tr
                        key={'prizesEnabled'}
                        className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                            <b>Phone Validation</b>
                        </td>
                        <td className="whitespace-nowrap py-3 pl-6 pr-3 thin-column">
                            <UpdateFeatureFlag featureName={'use_phone_validation'} currentValue={Boolean(usePhoneValidation)} userId={params.userId}/>
                        </td>
                    </tr>
                    <tr
                        key={'prizesEnabled'}
                        className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                            <b>Places</b>
                        </td>
                        <td className="whitespace-nowrap py-3 pl-6 pr-3 thin-column">
                            <UpdateFeatureFlag featureName={'places'} currentValue={Boolean(placesEnabled)} userId={params.userId}/>
                        </td>
                    </tr>
                    <tr
                        key={'prizesEnabled'}
                        className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                            <b>RSVP</b>
                        </td>
                        <td className="whitespace-nowrap py-3 pl-6 pr-3 thin-column">
                            <UpdateFeatureFlag featureName={'rsvp'} currentValue={Boolean(rsvpEnabled)} userId={params.userId}/>
                        </td>
                    </tr>
                    {rsvpEnabled && <tr
                        key={'prizesEnabled'}
                        className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                            <b>User RSVP</b>
                        </td>
                        <td className="whitespace-nowrap py-3 pl-6 pr-3 thin-column">
                            <UpdateFeatureFlag featureName={'player_can_rsvp'} currentValue={Boolean(playerRsvpEnabled)} userId={params.userId}/>
                        </td>
                    </tr>}

                    </tbody>
                </table>
            </div>
        </div>
    );
}

function UpdateFeatureFlag({featureName, currentValue, userId}: { featureName: string, currentValue: boolean, userId:string }) {

    const onSubmit = async (_formData: FormData) => {
        'use server'
        await updateFFValue(featureName, !currentValue, `/${userId}/configurations/flags`);
    };

    return (
        <form action={onSubmit}>
            <button className="">
                {currentValue ? '✅' : '☑️'}
            </button>
        </form>
    );
}

