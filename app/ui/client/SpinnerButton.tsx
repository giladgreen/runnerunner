'use client';
// @ts-ignore
import { Circle as SpinningChip } from 'react-awesome-spinners'
import Button, { RedButton } from '@/app/ui/client/Button';
import { useFormStatus } from 'react-dom';
import React from 'react';

export default function SpinnerButton({
  text,
  onClick,
  id,
}: {
  id?: string;
  text: string;
  onClick?: () => void;
}) {
  const { pending } = useFormStatus();

  if (pending) {
    return <Button disabled={true} id={id}>
              <SpinningChip color="var(--white)"  size={20}/>
       </Button>
  }

  return (
    <Button type="submit" onClick={onClick} id={id}>
      {text}
    </Button>
  );
}

export function RedSpinnerButton({
  text,
  onClick,
}: {
  text: string;
  onClick?: () => void;
}) {
  const { pending } = useFormStatus();

  if (pending) {
    return  <RedButton type="submit" onClick={onClick}>
      <SpinningChip color="var(--red)"  size={20}/>
    </RedButton>

  }

  return (
    <RedButton type="submit" onClick={onClick}>
      {text}
    </RedButton>
  );
}
