'use client';
import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { validateCode } from '@/app/lib/actions';
import Button from '@/app/ui/client/Button';
import { useSearchParams } from 'next/navigation';

export default function CodeValidationForm() {
  const searchParams = useSearchParams();
  const phone_number = searchParams.get('phone_number') as string;
  const [_errorMessage, dispatch] = useFormState(
    validateCode.bind(null),
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
          <b>אימות קוד</b>
        </div>
        <div className="w-full">
          <div className="mt-4">
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="code"
                type="text"
                name="code"
                placeholder="הכנס קוד בעל 4 ספרות"
                required
                autoComplete="one-time-code"
              />
            </div>
          </div>
          <input
            style={{ visibility: 'hidden', display: 'none' }}
            id="phone_number"
            type="text"
            name="phone_number"
            value={phone_number}
          />
        </div>
        <Button className="mt-4 w-full" aria-disabled={pending}>
          {pending ? 'המתן..' : 'שלח'}
        </Button>
      </div>
    </form>
  );
}
