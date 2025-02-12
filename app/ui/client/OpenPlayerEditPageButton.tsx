'use client';
import React from 'react';
import {
  UserIcon,
} from '@heroicons/react/24/outline';
import { Tooltip, Button } from 'flowbite-react';
export default function OpenPlayerEditPageButton({
  playerId,userId
}: {
  userId: string;
  playerId: string;
}) {
  return (
    <a href={`/${userId}/players/${playerId}/edit`}>
      <Tooltip content="עבור לעמוד שחקן" color="primary">
        <Button
          color="light"
          style={{
            width: 40,
          }}
        >
          <UserIcon className=" h-5 w-5" />
        </Button>
      </Tooltip>
    </a>
  );
}
