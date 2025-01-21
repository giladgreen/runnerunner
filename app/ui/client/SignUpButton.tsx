'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function SignUpButton({
  usePhoneValidation,
}: {
  usePhoneValidation: boolean;
}) {
  if (usePhoneValidation) {
    return (
      <div
        className="red-button"
      >
        <a href="/phone_validation" >
         ליצירת חשבון
        </a>
        <span className="left-arrow" >   &larr;</span>
      </div>
    );
  }


  return (
    <div
      style={{
        color: 'white',
        borderRadius: 8,
        backgroundColor: 'var(--red-dark)',
        width: '100%',
        textAlign: 'center',
        padding: '12px 25px 12px 25px',
      }}
    >
      <a href="/signup">
        <b>צור חשבון</b>
      </a>
    </div>
  );
}
