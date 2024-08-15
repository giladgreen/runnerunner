import React from 'react';

export default function NoPlayerPage() {
  return (
    <div
      className="rtl flex h-screen flex-col md:flex-row md:overflow-hidden"
      style={{ marginTop: 30, textAlign: 'center' }}
    >
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        <div>אין מידע עבור שחקן זה</div>
        <div style={{ marginTop: 120 }}>
          לרישום לטורניר אנא פנה אלינו בוואסאפ
        </div>
        <div
          className="flex flex-grow"
          style={{ marginTop: 5, textAlign: 'center', marginRight: 70 }}
        >
          <div style={{ marginTop: 3 }}>050-8874068</div>
          <img src="/whatsapp.png" width={50} height={50} alt="runner" />
        </div>
      </div>
    </div>
  );
}
