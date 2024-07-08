'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Sort({ text, sortTerm }: { text: string, sortTerm:string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const handleSort =() => {
        const params = new URLSearchParams(searchParams);
        params.set('sort', sortTerm);
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

  return (
    <div className="sort-cursor" title={`Sort by ${text}`}  onClick={(e) => {
        handleSort();
    }}>
          {text}
    </div>
  );
}
