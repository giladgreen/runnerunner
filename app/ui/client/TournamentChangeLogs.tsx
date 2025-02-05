'use client';

import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { ChangeLogDB } from '@/app/lib/definitions';
import { formatDateToLocal, formatDateToLocalWithTime } from '@/app/lib/serverDateUtils';


export default function TournamentChangeLogs({
                                               tournamentsDeletedLogs,
                                               tournamentsChangedLogs,
}: {
  tournamentsDeletedLogs: ChangeLogDB[];
  tournamentsChangedLogs: ChangeLogDB[];
}) {
  return (
    <Tabs>
      <TabList>
        <Tab key="playersChangedLogs"> שינויים בטורנירים</Tab>
        <Tab key="playersDeletedLogs"> טורנירים שנמחקו</Tab>

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
            {tournamentsChangedLogs?.map((changeLog, index) => (
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

                  {changeLog.before.description !== changeLog.after.description && (<div style={{ marginBottom: 15 }}>
                    <div>
                      <u>תיאור לפני:</u>
                    </div>
                    <div>{changeLog.before.description}</div>
                    <div>
                      <u>תיאור אחרי:</u>
                    </div>
                    <div>{changeLog.after.description}</div>
                  </div>)}

                  {changeLog.before.start_time !== changeLog.after.start_time && (<div style={{ marginBottom: 15 }}>
                    <div>
                      <u>שעת התחלה לפני:</u>
                    </div>
                    <div>{changeLog.before.start_time}</div>
                    <div>
                      <u>שעת התחלה אחרי:</u>
                    </div>
                    <div>{changeLog.after.start_time}</div>
                  </div>)}

                  {changeLog.before.buy_in !== changeLog.after.buy_in && (<div style={{ marginBottom: 15 }}>
                    <div>
                      <u>כניסה ראשונה לפני:</u>
                    </div>
                    <div>{changeLog.before.buy_in}</div>
                    <div>
                      <u>כניסה ראשונה אחרי:</u>
                    </div>
                    <div>{changeLog.after.buy_in}</div>
                  </div>)}

                  {changeLog.before.re_buy !== changeLog.after.re_buy && (<div style={{ marginBottom: 15 }}>
                    <div>
                      <u>כניסה שנייה לפני:</u>
                    </div>
                    <div>{changeLog.before.re_buy}</div>
                    <div>
                      <u>כניסה שנייה אחרי:</u>
                    </div>
                    <div>{changeLog.after.re_buy}</div>
                  </div>)}


                  {changeLog.before.max_players !== changeLog.after.max_players && (<div style={{ marginBottom: 15 }}>
                    <div>
                      <u>הגבלת שחקנים לפני:</u>
                    </div>
                    <div>{changeLog.before.max_players}</div>
                    <div>
                      <u>הגבלת שחקנים אחרי:</u>
                    </div>
                    <div>{changeLog.after.max_players}</div>
                  </div>)}


                  {changeLog.before.initial_stack !== changeLog.after.initial_stack && (<div style={{ marginBottom: 15 }}>
                    <div>
                      <u>ערימה ראשונית לפני:</u>
                    </div>
                    <div>{changeLog.before.initial_stack}</div>
                    <div>
                      <u>ערימה ראשונית אחרי:</u>
                    </div>
                    <div>{changeLog.after.initial_stack}</div>
                  </div>)}


                  {changeLog.before.rsvp_required !== changeLog.after.rsvp_required && (<div style={{ marginBottom: 15 }}>
                    <div>
                      <u>חייב ברישום לפני:</u>
                    </div>
                    <div>{changeLog.before.rsvp_required}</div>
                    <div>
                      <u>חייב ברישום אחרי:</u>
                    </div>
                    <div>{changeLog.after.rsvp_required}</div>
                  </div>)}


                  {changeLog.before.phase_length !== changeLog.after.phase_length && (<div style={{ marginBottom: 15 }}>
                    <div>
                      <u>אורך שלב לפני:</u>
                    </div>
                    <div>{changeLog.before.phase_length}</div>
                    <div>
                      <u>אורך שלב אחרי:</u>
                    </div>
                    <div>{changeLog.after.phase_length}</div>
                  </div>)}


                  {changeLog.before.last_phase_for_rebuy !== changeLog.after.last_phase_for_rebuy && (<div style={{ marginBottom: 15 }}>
                    <div>
                      <u>שלב אחרון לכניסות לפני:</u>
                    </div>
                    <div>{changeLog.before.last_phase_for_rebuy}</div>
                    <div>
                      <u>שלב אחרון לכניסות אחרי:</u>
                    </div>
                    <div>{changeLog.after.last_phase_for_rebuy}</div>
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
                יום
              </th>
              <th
                scope="col"
                className=" align-text-right px-2 py-5 font-medium"
              >
                פרטים
              </th>
            </tr>
            </thead>
            <tbody>
            {tournamentsDeletedLogs?.map((changeLog, index) => (
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
                  <div>{changeLog.before.day}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <div>description</div>
                  <div>{changeLog.before.description ?? '.'}</div>
                  <div>start_time</div>
                  <div>{changeLog.before.start_time ?? '.'}</div>
                  <div>buy_in</div>
                  <div>{changeLog.before.buy_in ?? '.'}</div>
                  <div>re_buy</div>
                  <div>{changeLog.before.re_buy ?? '.'}</div>
                  <div>max_players</div>
                  <div>{changeLog.before.max_players ?? '.'}</div>
                  <div>initial_stack</div>
                  <div>{changeLog.before.initial_stack ?? '.'}</div>
                  <div>rsvp_required</div>
                  <div>{changeLog.before.rsvp_required ?? '.'}</div>
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
