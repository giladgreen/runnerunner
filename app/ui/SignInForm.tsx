'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';
import {
  PhoneIcon,
  KeyIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/ui/client/Button';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Spinner from '@/app/ui/client/Spinner';

export default function SignInForm() {
  const searchParams = useSearchParams();
  const phone_number = searchParams.get('phone_number') ?? '';
  const callbackUrl = searchParams.get('callbackUrl') ?? '';

  const [phoneNumber, setPhoneNumber] = useState(phone_number);
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  if (callbackUrl && callbackUrl.length) {
    window.location.href = '/';
  }
  return (
    <form
      action={dispatch}
      className="rtl space-y-3"
      style={{ textAlign: 'right' }}
    >
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="phone_number"
            >
              מספר טלפון
            </label>
            <div className="relative">
              <input
                className="rtl peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
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
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              סיסמא
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="הכנס סיסמא"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <SignInButton />
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <div className="text-sm text-red-500">{errorMessage}</div>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

function SignInButton() {
  const { pending } = useFormStatus();

  if (pending) {
    return <Spinner size={24} />;
  }
  return (
    <Button className="mt-4 w-full">
      התחבר
      <ArrowLeftIcon
        className="ml-auto h-5 w-5 text-gray-50"
        style={{ margin: '0 10px' }}
      />
    </Button>
  );
}
