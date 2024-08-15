import React from 'react';

export default async function NoPermissionsPage() {
  return (
    <div className="rtl w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">
          <b>
            <u>אין לך הרשאות לראות עמוד זה</u>
          </b>
        </h1>
      </div>
    </div>
  );
}
