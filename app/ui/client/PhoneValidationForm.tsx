'use client';
import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { validatePhone } from '@/app/lib/actions';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { RedButton } from '@/app/ui/client/Button';
import { useSearchParams } from 'next/navigation';

export default function PhoneValidationForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  console.log('error', error);
  // @ts-ignore
  const [errorMessage, dispatch] = useFormState(
    validatePhone.bind(null),
    undefined,
  );
  const { pending } = useFormStatus();
  return (
    <div className="login-form">
      <form
        action={dispatch}
        className="rtl space-y-3 "

      >
        <div className="flex-1">
          <label
            className="login-form-label mb-3 mt-5 block text-xs font-medium"
            htmlFor="phone_number"
          >
            <b>אימות מספר טלפון</b>
          </label>
          {error === 'wrong_code' && (
            <div style={{ color: 'red' }}>האימות נכשל, נסה שנית</div>
          )}
          {error === 'sms_failed' && (
            <div style={{ color: 'red' }}>
              לא ניתן היה לשלוח את sms, בדקו שנית את המספר
            </div>
          )}
          <div className="w-full">
            <div className="mt-4">
              <div className="relative">
                <input
                  className="login-input peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2 "
                  id="phone_number"
                  type="text"
                  name="phone_number"
                  placeholder="מספר טלפון"
                  required
                />
              </div>
            </div>
          </div>
          <RedButton className="mt-4 w-full" aria-disabled={pending}>
            {pending ? 'המתן..' : 'אימות'}
          </RedButton>

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
    </div>
  );
}
