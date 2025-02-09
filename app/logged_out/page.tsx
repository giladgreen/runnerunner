import Link from 'next/link';
import React from 'react';

export default async function LoggedOutPage({
  params,
}: {
  params: { userId: string };
}) {
  return (
    <div
      style={{ padding: 20, textAlign: 'center', fontSize: 40, marginTop: 50 }}
    >
      <div>התנתקת מהמערכת בשל חוסר פעילות</div>
      <div style={{ marginTop: 30, textDecoration: 'underline' }}>
        <Link href="/">התחבר שוב</Link>
      </div>
    </div>
  );
}
