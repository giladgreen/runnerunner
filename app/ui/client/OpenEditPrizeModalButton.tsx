'use client';

import React from 'react';
import { Button } from 'primereact/button';
import { usePathname, useSearchParams } from 'next/navigation';
import { Tooltip } from 'flowbite-react';
import { CreatePrizeForm } from '@/app/ui/client/CreatePrizeForm';
import { PrizeInfoDB } from '@/app/lib/definitions';
import EditPrizeInfoForm from '@/app/ui/client/EditPrizeInfoForm';

export default function OpenEditPrizeModalButton({
                                                     prizes,
                                                   prize,
                                                   userId
                                                        }: {
  userId:string,
  prize: PrizeInfoDB;
  prizes: PrizeInfoDB[];
}) {
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;
  const [show, setShow] = React.useState(false);

  const hide = () => {
    setShow(false);
  };
  const button = <button
    className="pointer rounded-md  p-2 edit_prize_button"
    onClick={() => {
      setShow(true);
    }}
  >
    <Tooltip content="ערוך" color="primary">

      <Button className="my-button">עריכת פרס</Button>

    </Tooltip>
  </button>
  if (show) {
    return (
      <div>
        {button}
        <div className="CreatePrizeFormWrapper">
          <EditPrizeInfoForm prize={prize} prizes={prizes} prevPage={prevPage} userId={userId} hide={hide}/>
        </div>
      </div>
    );
  }
  return button;
}
