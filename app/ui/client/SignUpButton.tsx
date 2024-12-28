'use client';

export default function SignUpButton({
  usePhoneValidation,
}: {
  usePhoneValidation: boolean;
}) {
  if (usePhoneValidation) {
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
        <a href="/phone_validation" target="_blank">
          <b>צור חשבון</b>
        </a>
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
