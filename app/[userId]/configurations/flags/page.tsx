import { fetchFeatureFlags, fetchUserById } from '@/app/lib/data';
import React from 'react';
import { updateFFValue } from '@/app/lib/actions';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';

export default async function FlagsPage({
  params,
}: {
  params: { userId: string };
}) {
  const { rsvpEnabled, playerRsvpEnabled, usePhoneValidation, prizesEnabled, playersSeeCreditEnabled } =
    await fetchFeatureFlags();
  const user = await fetchUserById(params.userId);
  const isAdmin = user.is_admin;

  if (!isAdmin) return null;
  return (
    <div className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: '.', href: `/${params.userId}` },
          {
            label: 'הגדרות',
            href: `/${params.userId}/configurations`,
          },
          {
            label: 'דגלים',
            href: `/${params.userId}/configurations/flags`,
            active: true,
          },
        ]}
      />

      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>
          <b>
            <u>Toggle Feature Flags</u>
          </b>
        </h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <table className="md:table">
          <thead className="rounded-lg text-left  font-normal">
            <tr>
              <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                Feature
              </th>
              <th
                scope="col"
                className="thin-column px-4 py-5 font-medium sm:pl-6"
              >
                status
              </th>
            </tr>
          </thead>
          <tbody >
            <tr
              key={'PhoneEnabled'}
              className="w-full border-b py-3  last-of-type:border-none  "
            >
              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <b>Phone Validation</b>
              </td>
              <td className="thin-column whitespace-nowrap py-3 pl-6 pr-3">
                <UpdateFeatureFlag
                  featureName={'use_phone_validation'}
                  currentValue={Boolean(usePhoneValidation)}
                  userId={params.userId}
                />
              </td>
            </tr>
            <tr
              key={'prizesEnabled'}
              className="w-full border-b py-3  last-of-type:border-none  "
            >
              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <b>Prizes</b>
              </td>
              <td className="thin-column whitespace-nowrap py-3 pl-6 pr-3">
                <UpdateFeatureFlag
                  featureName={'prizes'}
                  currentValue={Boolean(prizesEnabled)}
                  userId={params.userId}
                />
              </td>
            </tr>
            <tr
              key={'PlayersSeeCreditEnabled'}
              className="w-full border-b py-3  last-of-type:border-none  "
            >
              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <b>Players can See his Credit</b>
              </td>
              <td className="thin-column whitespace-nowrap py-3 pl-6 pr-3">
                <UpdateFeatureFlag
                  featureName={'players_can_see_credit'}
                  currentValue={Boolean(playersSeeCreditEnabled)}
                  userId={params.userId}
                />
              </td>
            </tr>
            <tr
              key={'RSVPEnabled'}
              className="w-full border-b py-3  last-of-type:border-none  "
            >
              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <b>RSVP</b>
              </td>
              <td className="thin-column whitespace-nowrap py-3 pl-6 pr-3">
                <UpdateFeatureFlag
                  featureName={'rsvp'}
                  currentValue={Boolean(rsvpEnabled)}
                  userId={params.userId}
                />
              </td>
            </tr>
            {rsvpEnabled && (
              <tr
                key={'userRSVPEnabled'}
                className="w-full border-b py-3  last-of-type:border-none  "
              >
                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                  <b>User RSVP</b>
                </td>
                <td className="thin-column whitespace-nowrap py-3 pl-6 pr-3">
                  <UpdateFeatureFlag
                    featureName={'player_can_rsvp'}
                    currentValue={Boolean(playerRsvpEnabled)}
                    userId={params.userId}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UpdateFeatureFlag({
  featureName,
  currentValue,
  userId,
}: {
  featureName: string;
  currentValue: boolean;
  userId: string;
}) {
  const onSubmit = async (_formData: FormData) => {
    'use server';

    await updateFFValue(
      featureName,
      !currentValue,
      `/${userId}/configurations/flags`,
    );
    if (currentValue && featureName === 'rsvp') {
      await updateFFValue(
        'player_can_rsvp',
        false,
        `/${userId}/configurations/flags`,
      );
    }
  };

  return (
    <form action={onSubmit}>
      <button className="">{currentValue ? '✅' : '☑️'}</button>
    </form>
  );
}
