'use client';

import { useEffect } from 'react';
const myDataClientId = '17886847141747406972';
export default function SignUpButton({
  usePhoneValidation,
}: {
  usePhoneValidation: boolean;
}) {
  const dataClientId = myDataClientId;
  const goTo = (jsonLocation: string) => {
    window.location.href = `/signup?user_json_url=${jsonLocation}`;
  };
  useEffect(() => {
    // Load the external script
    const script = document.createElement('script');
    script.src = 'https://www.phone.email/sign_in_button_v1.js';
    script.async = true;
    // @ts-ignore
    const button = document.querySelector('.pe_signin_button');
    if (button) {
      button.appendChild(script);
      // @ts-ignore
      window.phoneEmailListener = function (userObj) {
        goTo(userObj.user_json_url);
      };

      return () => {
        // @ts-ignore
        window.phoneEmailListener = null;
      };
    }
  }, []);
  if (usePhoneValidation) {
    return (
      <div
        data-client-id={dataClientId}
        className="pe_signin_button"
        style={{ borderRadius: 8, backgroundColor: 'rgb(37, 137, 254)' }}
      ></div>
    );
  }

  return (
    <div
      style={{
        color: 'white',
        borderRadius: 8,
        backgroundColor: 'rgb(37, 137, 254)',
        width: '100%',
        padding: '12px 0 12px 25px',
      }}
    >
      <a href="/signup">
        <b>Sign-Up</b>
      </a>
    </div>
  );
}
