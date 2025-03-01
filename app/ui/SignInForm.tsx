'use client';
// @ts-ignore
import { Circle as SpinningChip } from 'react-awesome-spinners'
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';
import {
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { RedButton } from '@/app/ui/client/Button';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import SignUpButton from '@/app/ui/client/SignUpButton';
import KeyIcon from '@/app/ui/client/KeyIcon';
import PhoneIcon from '@/app/ui/client/PhoneIcon';

export default function SignInForm({
  usePhoneValidation,
}: {
  usePhoneValidation: boolean;
}) {
  const searchParams = useSearchParams();
  const phone_number = searchParams.get('phone_number') ?? '';
  const callbackUrl = searchParams.get('callbackUrl') ?? '';

  const [phoneNumber, setPhoneNumber] = useState(phone_number);
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  if (callbackUrl && callbackUrl.length) {
    window.location.href = '/';
  }
  return (
    <div className="login-form">
      <form action={dispatch} className="rtl space-y-3">
        <div className="flex-1  ">
          <div className="w-full">
            <div>
              <label
                className="login-form-label mb-3 mt-5 block text-xs font-medium"
                htmlFor="phone_number"
              >
                מספר טלפון
              </label>
              <div className="relative">
                <input
                  className="rtl login-input peer block w-full rounded-md border py-[9px] pl-10  outline-2 signin-input"
                  id="phone_number"
                  type="tel"
                  name="email"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                  placeholder="הכנס מספר טלפון"
                  required
                />
                <PhoneIcon />
              </div>
            </div>
            <div className="mt-4">
              <label
                className="login-form-label mb-3 mt-5 block text-xs font-medium"
                htmlFor="password"
              >
                סיסמא
              </label>
              <div className="relative">
                <input
                  className="rtl login-input peer block w-full rounded-md border py-[9px] pl-10  outline-2"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="הכנס סיסמא"
                  required
                  minLength={6}
                />
                <KeyIcon  />
              </div>
            </div>
          </div>
          {errorMessage && (
            <div
              className="login-error-msg flex h-8 items-end space-x-1"
              aria-live="polite"
              aria-atomic="true"
            >
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <div className=" text-red-500">{errorMessage}</div>
            </div>
          )}
          <SignInButton />
        </div>
      </form>
      {usePhoneValidation &&<div className="forgot-password">
        <a href="/phone_validation" >
          שכחת סיסמא?
        </a>
      </div>}
      <div className="do-not-have-account-yet">עוד אין לכם חשבון?</div>
      <SignUpButton usePhoneValidation={usePhoneValidation} />
    </div>
  );
}

function SignInButton() {
  const { pending } = useFormStatus();
  return (
    <RedButton className="sign-in-button mt-4 w-full">
      {pending ? ( <SpinningChip color="var(--white)" size={30}/>) : 'התחבר'}
      {pending ? '' : <span className="left-arrow">   &larr;</span>}
    </RedButton>
  );
}
