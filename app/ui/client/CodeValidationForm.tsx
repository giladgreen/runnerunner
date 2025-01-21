'use client';
import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { validateCode } from '@/app/lib/actions';
import Button, { RedButton } from '@/app/ui/client/Button';
import { useSearchParams } from 'next/navigation';
import { KeyIcon } from '@heroicons/react/24/outline';

export default function CodeValidationForm() {
  const searchParams = useSearchParams();
  const phone_number = searchParams.get('phone_number') as string;
  const [_errorMessage, dispatch] = useFormState(
    validateCode.bind(null),
    undefined,
  );
  const { pending } = useFormStatus();
  return (
    <div className="login-form">
      <form
        action={dispatch}
        className="rtl space-y-3"
      >
        <div className="flex-1">
          <label
            className="login-form-label mb-3 mt-5 block text-xs font-medium"
            htmlFor="code"
          >
            <b>אימות קוד</b>
          </label>
          <div className="w-full">
            <div className="mt-4">
              <div className="relative">
                <input
                  className="login-input peer block w-full rounded-md border  py-[9px] pl-10  outline-2 "
                  id="code"
                  type="text"
                  name="code"
                  placeholder="הכנס קוד בעל 4 ספרות"
                  required
                  autoComplete="one-time-code"
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 login-input-icon" />

              </div>
            </div>
            <input
              className="hidden"
              id="phone_number"
              type="text"
              name="phone_number"
              value={phone_number}
            />
          </div>
          <RedButton className="mt-4 w-full" aria-disabled={pending}>
            {pending ? 'המתן..' : 'שלח'}
          </RedButton>
        </div>
      </form>
    </div>
      );
      }
