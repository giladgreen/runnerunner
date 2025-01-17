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
        <ArrowLeftIcon
          className="ml-auto h-5 w-5 "
          style={{ margin: '0 10px' }}
        />
      </div>
    );
  }


  return (
    <div
      style={{
        color: 'white',
        borderRadius: 8,
        backgroundColor: 'rgb(37, 137, 254)',
        width: '100%',
        padding: '12px 25px 12px 25px',
      }}
    >
      <a href="/signup">
        <b>צור חשבון</b>
      </a>
    </div>
  );
}
