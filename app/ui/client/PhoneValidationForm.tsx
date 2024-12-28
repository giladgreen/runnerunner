'use client';
import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { validatePhone } from '@/app/lib/actions';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import Button from '@/app/ui/client/Button';
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
    <form
      action={dispatch}
      className="rtl space-y-3"
      style={{ textAlign: 'right' }}
    >
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <div>
          <b>אימות מספר טלפון</b>
        </div>
        {error === 'wrong_code' && (
          <div style={{ color: 'red' }}>האימות נכשל, נסה שנית</div>
        )}
        {error === 'sms_failed' && (
          <div style={{ color: 'red' }}>לא ניתן היה לשלוח את sms, בדקו שנית את המספר</div>
        )}
        <div className="w-full">
          <div className="mt-4">
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
        </div>
        <Button className="mt-4 w-full" aria-disabled={pending}>
          {pending ? 'המתן..' : 'שלח'}
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
