'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { signUp } from '@/app/lib/actions';
import {
  KeyIcon,
  ExclamationCircleIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import Button from '@/app/ui/client/Button';
import { useSearchParams } from 'next/navigation';
import { Checkbox } from 'primereact/checkbox';
import React, { useState } from 'react';

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const user_json_url = searchParams.get('user_json_url');
  const redirected = Boolean(user_json_url);
  const signUpWithJsonUrl = signUp.bind(null, user_json_url as string);
  const [errorMessage, dispatch] = useFormState(signUpWithJsonUrl, undefined);
  const [password, setPasword] = useState('');
  const [regulationsApprove, setRegulationsApprove] = useState(false);
  const [marketingApprove, setMarketingApprove] = useState(false);
  const { pending } = useFormStatus();
  return (
    <form
      action={dispatch}
      className="rtl space-y-3"
      style={{ textAlign: 'right' }}
    >
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <div>
          <b>צור חשבון</b>
        </div>
        <div className="w-full">
          {!redirected && (
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="phone_number"
              >
                מספר טלפון
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="phone_number"
                  type="text"
                  name="phone_number"
                  placeholder="מספר טלפון"
                  required
                />
              </div>
            </div>
          )}
          <div className="mt-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              שם מלא
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                minLength={5}
                placeholder="הכנס שם מלא"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
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
                placeholder="בחר סיסמא"
                value={password}
                onChange={(e) => setPasword(e.target.value)}
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="regulations_approve mt-4" style={{ display: 'flex' }}>
            <Checkbox
              inputId="regulations_approve"
              name="regulations_approve"
              value="regulations_approve"
              checked={regulationsApprove}
              onChange={(e) => setRegulationsApprove(!!e.checked)}
            />
            <label
              className="mb-3 mt-1 block text-xs font-medium text-gray-900"
              htmlFor="regulations_approve"
              style={{ marginRight: 7 }}
            >
              <span> מאשר</span>
              <u>
                <a href="/terms" style={{ color: 'blue', margin: '0 4px' }}>
                  תקנון
                </a>
              </u>
              <span> מועדון לקוחות</span>
              {/* Approve customer club regulations */}
            </label>
          </div>
          <div className="marketing_approve mt-4" style={{ display: 'flex' }}>
            <Checkbox
              inputId="marketing_approve"
              name="marketing_approve"
              value="marketing_approve"
              checked={marketingApprove}
              onChange={(e) => setMarketingApprove(!!e.checked)}
            />
            <label
              className="mb-3 mt-1 block text-xs font-medium text-gray-900"
              htmlFor="regulations_approve"
              style={{ marginRight: 7 }}
            >
              מאשר לקבל תוכן שיווקי
            </label>
          </div>
        </div>
        <Button
          className="mt-4 w-full"
          aria-disabled={pending || !regulationsApprove || password.length < 1}
        >
          {pending ? 'המתן..' : 'הירשם'}
          <ArrowLeftIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
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
