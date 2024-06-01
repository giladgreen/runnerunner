'use client';
import {State, updateTemplate} from '@/app/lib/actions';

import { TemplateForm} from '@/app/lib/definitions';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import {useFormState} from "react-dom";
import {PencilIcon} from "@heroicons/react/24/outline";

export default function EditTemplateForm({
    template,
}: {
    template: TemplateForm;
}) {
  const initialState = { message: null, errors: {} };
  console.log(' template.id', template.id)
  const updateTemplateWithId = updateTemplate.bind(null, template.id);
  const updateTemplateWithIdAndLocalStorageChanges = (prevState: State, formData: FormData)=>{
      localStorage.setItem('use-balance-note-text', formData.get('template') as string);
      localStorage.setItem('use-balance-amount', `${formData.get('amount') as string}`);
      return updateTemplateWithId(prevState, formData);
  }

  const [state, dispatch] = useFormState(updateTemplateWithIdAndLocalStorageChanges, initialState);

  return (
      <form action={dispatch}>
          <div className="rounded-md bg-gray-50 p-4 md:p-6">
              {/* Day */}
              <div className="mb-4">
                  <label htmlFor="day" className="mb-2 block text-sm font-medium">
                      Day
                  </label>
                  <div className="relative mt-2 rounded-md">
                      {template.day}
                  </div>
              </div>

              {/* template */}
              <div className="mb-4">
                  <label htmlFor="template" className="mb-2 block text-sm font-medium">
                      Name
                  </label>
                  <div className="relative mt-2 rounded-md">
                      <div className="relative">
                          <input
                              id="template"
                              name="template"
                              defaultValue={template.template}
                              placeholder="Enter template"
                              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                              aria-describedby="template-error"
                          />
                      </div>
                      <PencilIcon
                          className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
                      <div id="template-error" aria-live="polite" aria-atomic="true">
                          {state.errors?.template &&
                              state.errors.template.map((error: string) => (
                                  <p className="mt-2 text-sm text-red-500" key={error}>
                                      {error}
                                  </p>
                              ))}
                      </div>
                  </div>
              </div>

              {/* amount */}
              <div className="mb-4">
                  <label htmlFor="notes" className="mb-2 block text-sm font-medium">
                      Amount
                  </label>
                  <div className="relative mt-2 rounded-md">
                      <div className="relative">
                          <input
                              id="amount"
                              name="amount"
                              defaultValue={template.amount}
                              placeholder="Enter amount"
                              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                              aria-describedby="amount-error"
                          />
                      </div>
                      <PencilIcon
                          className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
                      <div id="amount-error" aria-live="polite" aria-atomic="true">
                          {state.errors?.amount &&
                              state.errors.amount.map((error: string) => (
                                  <p className="mt-2 text-sm text-red-500" key={error}>
                                      {error}
                                  </p>
                              ))}
                      </div>
                  </div>
              </div>

          </div>

          <div className="mt-6 flex justify-end gap-4">
              <Link
                  href="/dashboard/configurations"
                  className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                  Cancel
              </Link>
              <Button type="submit">Update template</Button>
          </div>
      </form>
  );
}
