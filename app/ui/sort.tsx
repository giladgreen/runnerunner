'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Tooltip } from 'flowbite-react';

export default function Sort({
  text,
  sortTerm,
}: {
  text: string;
  sortTerm: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSort = () => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sortTerm);
    params.delete('page');
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Tooltip content={`מיון על פי ${text}`} color="primary">
      <div
        className="sort-cursor"
        onClick={(e) => {
          handleSort();
        }}
      >
        {text}
      </div>
    </Tooltip>
  );
}
