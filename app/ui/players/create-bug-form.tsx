'use client';

import {
  PencilIcon,

} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createReport } from '@/app/lib/actions';

export default function CreateBugForm() {
    return (
      <form action={createReport}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* bug description */}
          <div className="mb-4">
            <label htmlFor="description" className="mb-2 block text-sm font-medium">
              Description
            </label>
            <div className="relative">
                <textarea
                    id="description"
                    name="description"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby="description-error"
                    required
                    // @ts-ignore
                    cols="40" rows="5"
                />

              <PencilIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
            </div>
              * add reproduce steps if possible
          </div>
        </div>


        <div className="mt-6 flex justify-end gap-4">
          <Button type="submit">Send</Button>
        </div>
      </form>
  );
}
