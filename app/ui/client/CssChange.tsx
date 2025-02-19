'use client';
import { usePathname } from 'next/navigation';

export default function CssChange() {
  const pathname = usePathname();
  if (pathname.includes('6febff9d-d2de-4519-88ff-cfdf60f36426') || pathname.includes('0211489f-d2c9-4b35-b968-60fc61b9aafb')) {
    console.log('### changing colors')
    // @ts-ignore
    import('@/app/gilad.css');
  }
  return (
    <div></div>
  );
}
