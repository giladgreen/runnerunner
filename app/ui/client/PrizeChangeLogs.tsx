'use client';

import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { ChangeLogDB } from '@/app/lib/definitions';
import { formatDateToLocal, formatDateToLocalWithTime } from '@/app/lib/serverDateUtils';


export default function PrizeChangeLogs({
                                               prizesDeletedLogs,
                                               prizesChangedLogs,
}: {
  prizesDeletedLogs: ChangeLogDB[];
  prizesChangedLogs: ChangeLogDB[];
}) {
  return (
    <Tabs>
      <TabList>
        <Tab key="playersChangedLogs"> שינויים בפרסים</Tab>
        <Tab key="playersDeletedLogs"> פרסים שנמחקו</Tab>

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
                שינויים
              </th>
            </tr>
            </thead>
            <tbody>
            {prizesChangedLogs?.map((changeLog, index) => (
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
                  {changeLog.before.name !== changeLog.after.name && (<div style={{ marginBottom: 15 }}>
                    <div>
                      <u>שם לפני:</u>
                    </div>
                    <div>{changeLog.before.name}</div>
                    <div>
                      <u>שם אחרי:</u>
                    </div>
                    <div>{changeLog.after.name}</div>
                  </div>)}

                  {changeLog.before.extra !== changeLog.after.extra && (<div style={{ marginBottom: 15 }}>
                    <div>
                      <u>תיאור לפני:</u>
                    </div>
                    <div>{changeLog.before.extra}</div>
                    <div>
                      <u>תיאור אחרי:</u>
                    </div>
                    <div>{changeLog.after.extra}</div>
                  </div>)}

                  {changeLog.before.credit !== changeLog.after.credit && (<div style={{ marginBottom: 15 }}>
                    <div>
                      <u>קרדיט לפני:</u>
                    </div>
                    <div>{changeLog.before.credit}</div>
                    <div>
                      <u>קרדיט אחרי:</u>
                    </div>
                    <div>{changeLog.after.credit}</div>
                  </div>)}

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
                מידע
              </th>
              <th
                scope="col"
                className=" align-text-right px-2 py-5 font-medium"
              >
                קרדיט
              </th>
            </tr>
            </thead>
            <tbody>
            {prizesDeletedLogs?.map((changeLog, index) => (
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
                  {changeLog.before.name}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {changeLog.before.extra}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {changeLog.before.credit}
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
