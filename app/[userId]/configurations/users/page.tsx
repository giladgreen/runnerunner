import { lusitana } from '@/app/ui/fonts';
import { Tooltip } from 'flowbite-react';
import { fetchAllUsers, fetchUserById } from '@/app/lib/data';
import React from 'react';
import { UserDB } from '@/app/lib/definitions';
import {
  updateIsUserAdmin,
  updateIsUserAdminRefreshEnabled,
  updateIsUserWorker
} from '@/app/lib/actions';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';
import { formatDateToLocalWithTime, formatTimePassedSince } from '@/app/lib/serverDateUtils';
import DeleteUserButton from '@/app/ui/client/DeleteUserButton';

const confidNumbers = ['0542609910', '0524447990']
export default async function UsersPage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await fetchUserById(params.userId);
  const isAdmin = user.is_admin;

  const users = await fetchAllUsers();
  if (!isAdmin) {
    return (
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl`}>
            <b>
              <u>Non admin has no permissions to see this page</u>
            </b>
          </h1>
        </div>
      </div>
    );
  }

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
            label: 'משתמשים',
            href: `/${params.userId}/configurations/users`,
            active: true,
          },
        ]}
      />
      <div>
        <UpdateAdminRefreshUser user={user} userId={params.userId} />
      </div>
      <div className="rtl flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          <b>
            <u>{users.length} משתמשים</u>
          </b>
        </h1>
      </div>

      <div className="rtl users-config mt-4  flex justify-between gap-2 md:mt-8">
        <table className="md:table">
          <thead className="rounded-lg text-left  font-normal">
            <tr>
              <th
                scope="col"
                className="user-name-column px-4 py-5 font-medium sm:pl-6"
              >
                שם
              </th>
              <th
                scope="col"
                className="thin-column px-4 py-5 font-medium sm:pl-6  "
              >
                מספר טלפון
              </th>

              <th scope="col" className="px-4 py-5 font-medium  ">
                אדמין
              </th>
              <th scope="col" className="px-4 py-5 font-medium  ">
                מתפעל
              </th>

              <th
                scope="col"
                className="thin-column hide-on-mobile px-3 py-5 font-medium"
              ></th>
              <th
                scope="col"
                className="thin-column hide-on-mobile px-4 py-5 font-medium  sm:pl-6"
              >
                נראה לאחרונה
              </th>
              <th
                scope="col"
                className="thin-column hide-on-mobile px-4 py-5 font-medium  sm:pl-6"
              ></th>
            </tr>
          </thead>
          <tbody className="rtl ">
            {users?.map((user) => (
              <>
                <tr
                  key={user.id}
                  className="  w-full border-b py-3  last-of-type:border-none  "
                >
                  <td className="user-name-column whitespace-nowrap py-3 pl-6 pr-3 ">
                    {user.name}
                  </td>
                  <td className="thin-column whitespace-nowrap py-3 pl-6 pr-3">
                    {confidNumbers.find((num) => num === user.phone_number)
                      ? '************'
                      : user.phone_number}
                  </td>

                  <td className="thin-column whitespace-nowrap px-4 py-3 pl-6 pr-3  ">
                    <UpdateAdminUser user={user} userId={params.userId} />
                  </td>
                  <td className="thin-column whitespace-nowrap px-4 py-3 pl-6 pr-3  ">
                    <UpdateWorkerUser user={user} userId={params.userId} />
                  </td>

                  <td className="thin-column hide-on-mobile whitespace-nowrap py-3 pl-6  pr-3">
                    <DeleteUserButton user={user} userId={params.userId} />
                  </td>
                  <td
                    className="thin-column hide-on-mobile whitespace-nowrap py-3 pl-6 pr-3 "
                    style={{ minWidth: '350px' }}
                  >
                    <Tooltip
                      placement={'left'}
                      content={formatDateToLocalWithTime(
                        user.last_logged_in_at,
                      )}
                      color="primary"
                    >
                      {formatTimePassedSince(user.last_logged_in_at)}
                    </Tooltip>
                  </td>
                  <td className="thin-column hide-on-mobile whitespace-nowrap py-3 pl-6  pr-3">
                    <Tooltip
                      placement={'left'}
                      content={user.logged_in_count}
                      color="primary"
                    >
                     <span style={{ color: 'var(--black)', padding: '0 15px 0 0'}}> {user.logged_in_count > 0 ? user.logged_in_count : ''}</span>
                    </Tooltip>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UpdateAdminUser({ user, userId }: { user: UserDB; userId: string }) {
  const updateIsUserAdminWithId = updateIsUserAdmin.bind(null, {
    id: user.id,
    prevPage: `/${userId}/configurations/users`,
  });

  const onSubmit = async (_formData: FormData) => {
    'use server';
    await updateIsUserAdminWithId();
  };

  return (
    <form action={onSubmit}>
      <button className="">{user.is_admin ? '✅' : '☑️'}</button>
    </form>
  );
}

function UpdateAdminRefreshUser({
  user,
  userId,
}: {
  user: UserDB;
  userId: string;
}) {
  const updateIsUserAdminWithId = updateIsUserAdminRefreshEnabled.bind(null, {
    id: user.id,
    prevPage: `/${userId}/configurations/users`,
  });

  const onSubmit = async (_formData: FormData) => {
    'use server';
    await updateIsUserAdminWithId();
  };

  if (user.is_admin) {
    return (
      <form
        action={onSubmit}
        style={{ direction: 'rtl', marginTop: 20, marginBottom: 20 }}
      >
        <button style={{ margin: '0 20px' }}>
          {user.is_admin && user.refresh_enabled ? '✅' : '☑️'}
        </button>
        רפרוש עמוד הטורניר הנוכחי כל חצי דקה
      </form>
    );
  }
  return <div />;
}

function UpdateWorkerUser({ user, userId }: { user: UserDB; userId: string }) {
  const updateIsUserWorkerWithId = updateIsUserWorker.bind(null, {
    id: user.id,
    prevPage: `/${userId}/configurations/users`,
  });

  const onSubmit = async (_formData: FormData) => {
    'use server';
    await updateIsUserWorkerWithId();
  };

  return (
    <form action={onSubmit}>
      <button className="">{user.is_worker ? '✅' : '☑️'}</button>
    </form>
  );
}

