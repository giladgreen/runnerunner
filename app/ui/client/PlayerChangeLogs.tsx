'use client';

import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { ChangeLogDB } from '@/app/lib/definitions';
import { formatDateToLocal, formatDateToLocalWithTime } from '@/app/lib/serverDateUtils';


export default function PlayerChangeLogs({
                                           playersDeletedLogs,
                                           playersChangedLogs,
}: {
  playersDeletedLogs: ChangeLogDB[];
  playersChangedLogs: ChangeLogDB[];
}) {
  return (
    <Tabs>
      <TabList>
        <Tab key="playersChangedLogs"> שינויים בשחקנים</Tab>
        <Tab key="playersDeletedLogs"> שחקנים שנמחקו</Tab>

      </TabList>
      <TabPanel key="playersChangedLogs">
        <div className="table-with-borders">
          <table className="rtl align-text-right  hide-on-mobile min-w-full md:table ">
            <thead className="align-text-right rounded-lg  text-left font-normal">
            <tr>
              <th
                scope="col"
                className=" align-text-right px-3 py-5 font-medium"
              >
                תאריך שינוי
              </th>
              <th
                scope="col"
                className=" align-text-right px-3 py-5 font-medium"
              >
                שונה על ידי
              </th>
              <th
                scope="col"
                className=" align-text-right px-2 py-5 font-medium"
              >
                שם
              </th>
              <th
                scope="col"
                className=" align-text-right px-2 py-5 font-medium"
              >
                טלפון
              </th>
              <th
                scope="col"
                className=" align-text-right px-2 py-5 font-medium"
              >
                הערות
              </th>
              <th
                scope="col"
                className=" align-text-right px-2 py-5 font-medium"
              >
                תמונה לפני
              </th>
              <th
                scope="col"
                className=" align-text-right px-2 py-5 font-medium"
              >
                תמונה אחרי
              </th>
            </tr>
            </thead>
            <tbody>
            {playersChangedLogs?.map((changeLog, index) => (
              <tr
                key={changeLog.id}
                className={`table-row-background-color${(index % 2) + 1}. w-full border-b py-3  last-of-type:border-none `}
              >
                <td className="whitespace-nowrap px-3 py-3">
                  {formatDateToLocalWithTime(changeLog.changed_at)}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {changeLog.changed_by_name}
                </td>

                <td className="whitespace-nowrap px-3 py-3">
                  {changeLog.before.name !== changeLog.after.name && (
                    <div>
                      <div>
                        <u>לפני:</u>
                      </div>

                      <div>{changeLog.before.name}</div>

                      <div>
                        <u>אחרי:</u>
                      </div>

                      <div>{changeLog.after.name}</div>
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {changeLog.before.phone_number !==
                    changeLog.after.phone_number && (
                      <div>
                        <div>
                          <u>לפני:</u>
                        </div>

                        <div>{changeLog.before.phone_number}</div>

                        <div>
                          <u>אחרי:</u>
                        </div>

                        <div>{changeLog.after.phone_number}</div>
                      </div>
                    )}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {changeLog.before.note !== changeLog.after.note && (
                    <div>
                      <div>
                        <u>לפני:</u>
                      </div>
                      <div>{changeLog.before.note ?? '-'}</div>
                      <div>
                        <u>אחרי:</u>
                      </div>
                      <div>{changeLog.after.note}</div>
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <img
                    src={changeLog.before.image_url}
                    width={130}
                    height={100}
                  />
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {changeLog.before.image_url !==
                    changeLog.after.image_url && (
                      <img
                        src={changeLog.after.image_url}
                        width={130}
                        height={100}
                      />
                    )}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </TabPanel>
      <TabPanel key="playersDeletedLogs">
        <div className="table-with-borders">
          <table className="rtl align-text-right  hide-on-mobile min-w-full md:table ">
            <thead className="align-text-right rounded-lg  text-left font-normal">
            <tr>
              <th
                scope="col"
                className=" align-text-right px-3 py-5 font-medium"
              >
                תאריך שינוי
              </th>
              <th
                scope="col"
                className=" align-text-right px-3 py-5 font-medium"
              >
                נמחק על ידי
              </th>
              <th
                scope="col"
                className=" align-text-right px-2 py-5 font-medium"
              >
                שם
              </th>
              <th
                scope="col"
                className=" align-text-right px-2 py-5 font-medium"
              >
                טלפון
              </th>
              <th
                scope="col"
                className=" align-text-right px-2 py-5 font-medium"
              >
                הערות
              </th>
              <th
                scope="col"
                className=" align-text-right px-2 py-5 font-medium"
              >
                תמונה
              </th>
            </tr>
            </thead>
            <tbody>
            {playersDeletedLogs?.map((changeLog, index) => (
              <tr
                key={changeLog.id}
                className={`table-row-background-color${(index % 2) + 1}. w-full border-b py-3  last-of-type:border-none `}
              >
                <td className="whitespace-nowrap px-3 py-3">
                  {formatDateToLocal(changeLog.changed_at)}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {changeLog.changed_by_name}
                </td>

                <td className="whitespace-nowrap px-3 py-3">
                  <div>{changeLog.before.name}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <div>{changeLog.before.phone_number}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <div>{changeLog.before.note ?? '.'}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <img
                    src={changeLog.before.image_url}
                    width={130}
                    height={100}
                  />
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </TabPanel>
    </Tabs>
  );
}
