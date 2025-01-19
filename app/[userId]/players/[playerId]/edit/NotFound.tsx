import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFound({ params }: { params: { userId: string } }) {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <div>Could not find the requested Player.</div>
      <Link
        href={`/${params.userId}/players`}
        className="mt-4 rounded-md  px-4 py-2  text-white transition-colors "
      >
        Go Back
      </Link>
    </main>
  );
}
