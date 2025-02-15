'use client';
import React from 'react';
import { Button } from 'primereact/button';


import { usePathname, useSearchParams } from 'next/navigation';
import { Tooltip } from 'flowbite-react';
import CreateTournamentForm from '@/app/ui/client/CreateTournamentForm';

export default function OpenCreateTournamentModalButton({
   userId
}: {
  userId: string;
}) {
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;
  const [show, setShow] = React.useState(false);

  const close = () => {
    setShow(false);
  };
  const button = <button
    className="pointer rounded-md  p-2 "
    onClick={() => {
      setShow(true);
    }}
  >
    <Tooltip content="צור טורניר" color="primary">

      <Button className="my-button">צור טורניר חדש</Button>

    </Tooltip>
  </button>
  if (show) {
    return (
      <div>
        {button}
        <div className="CreateTournamentFormWrapper">
          <CreateTournamentForm
            userId={userId}
            prevPage={prevPage}
            hide={close}
          />
        </div>
      </div>
    );
  }
  return button;
}
