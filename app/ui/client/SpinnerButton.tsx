'use client';
import Button, { RedButton } from '@/app/ui/client/Button';
import { useFormStatus } from 'react-dom';
import React from 'react';
import { RingLoader } from "react-spinners";

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
              <RingLoader color="var(--white)" loading={true} size={35}/>
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
    return <RingLoader color="var(--red)" loading={true} size={35}/>;
  }

  return (
    <RedButton type="submit" onClick={onClick}>
      {text}
    </RedButton>
  );
}
