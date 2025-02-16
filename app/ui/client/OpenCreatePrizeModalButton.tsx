'use client';

import React from 'react';
import { Button } from 'primereact/button';
import { usePathname, useSearchParams } from 'next/navigation';
import { Tooltip } from 'flowbite-react';
import { CreatePrizeForm } from '@/app/ui/client/CreatePrizeForm';
import { PrizeInfoDB } from '@/app/lib/definitions';

export default function OpenCreatePrizeModalButton({

                                                     prizes
                                                        }: {
  prizes: PrizeInfoDB[];
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
    <Tooltip content="צור פרס" color="primary">

      <Button className="my-button">צור פרס חדש</Button>

    </Tooltip>
  </button>
  if (show) {
    return (
      <div>
        {button}
        <div className="CreatePrizeFormWrapper">
          <CreatePrizeForm
            prevPage={prevPage}
            prizes={prizes}
            hide={close}
          />
        </div>
      </div>
    );
  }
  return button;
}
