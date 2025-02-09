'use client';

export function TickIcon({ size }: { size: number }) {

  return (<span style={{ color: 'var(--white)', margin:'0 2px' }}>✔</span>);
}

export function DoubleTicksIcon({ size }: { size: number }) {
  return (<div style={{ color: 'var(--grey-lighter)', margin: '0 2px' }}>
    <span style={{ marginLeft: -9, color: 'var(--white)' }}>✔</span>
    <span>✔</span>
  </div>);
}
