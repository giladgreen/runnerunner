'use client';
import Image from 'next/image';

export function TickIcon({ size }: { size: number }) {
  return (
    <Image src="/blue_tick.png" width={size} height={size} alt="blue_tick" />
  );
}

export function DoubleTicksIcon({ size }: { size: number }) {
  return (
    <Image
      src="/blue_double_ticks.png"
      width={size}
      height={size}
      alt="blue_double_ticks"
    />
  );
}
