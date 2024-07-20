'use client';
import Button from '@/app/ui/client/Button';
import { useFormStatus } from 'react-dom';
import React from 'react';
import Spinner from '@/app/ui/client/Spinner';

export default function SpinnerButton({
  text,
  onClick,
}: {
  text: string;
  onClick?: () => void;
}) {
  const { pending } = useFormStatus();

  if (pending) {
    return <Spinner size={33} />;
  }
  return (
    <Button type="submit" onClick={onClick}>
      {text}
    </Button>
  );
}
