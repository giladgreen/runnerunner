'use client';
import React, { Suspense } from 'react';
import Image from 'next/image';

// @ts-ignore
export default function GeneralFormWrapper({ children }) {
return (
  <Suspense>
    <main className="rtl flex min-h-screen flex-col p-6 general-page">
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div
          className="flex flex-col justify-center gap-6 px-6 py-10 md:w-2/5 md:px-20 general-form-wrapper"
        >
          <Image
            src="/logo.png"
            width={400}
            height={400}
            className="block md:hidden general-form-logo"
            alt="runner"
          />
          <div>
            {children}
          </div>
        </div>
        <div className="flex items-center justify-center  md:w-3/5 md:px-28 md:py-12 hide-on-mobile"
             style={{ marginTop: -90 }}>
          <Image
            src="/logo.png"
            width={600}
            height={600}
            alt="runner"
          />
        </div>
      </div>
    </main>
  </Suspense>)
}
