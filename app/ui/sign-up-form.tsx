'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { signUp} from '@/app/lib/actions';
import {
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import {useSearchParams} from "next/navigation";

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const user_json_url = searchParams.get('user_json_url');
  const redirected = Boolean(user_json_url);
  const signUpWithJsonUrl = signUp.bind(null, user_json_url as string);
  const [errorMessage, dispatch] = useFormState(signUpWithJsonUrl, undefined);
  return (
      <form action={dispatch} className="space-y-3">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <div><b>Sign up:</b></div>
          <div className="w-full">
            { !redirected && <div className="mt-4">
              <label
                  className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                  htmlFor="password"
              >
                phone number
              </label>
              <div className="relative">
                <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="phone_number"
                    type="text"
                    name="phone_number"
                    placeholder="Enter phone number"
                    required
                />
              </div>
            </div>}
            <div className="mt-4">
              <label
                  className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                  htmlFor="password"
              >
                password
              </label>
              <div className="relative">
                <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="choose password"
                    required
                    minLength={6}
                />
                <KeyIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
            </div>
          </div>
          <SignUpButton/>
          <div
              className="flex h-8 items-end space-x-1"
              aria-live="polite"
              aria-atomic="true"
          >
            {errorMessage && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500"/>
                  <div className="text-sm text-red-500">{errorMessage}</div>
                </>
            )}
          </div>
        </div>
      </form>
  );
}

function SignUpButton() {
  const { pending } = useFormStatus();

  return (
      <Button className="mt-4 w-full" aria-disabled={pending}>
        Sign Up
        <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50"/>
      </Button>
  );
}
