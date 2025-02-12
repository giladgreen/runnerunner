'use client';
import React from 'react';
import { UserPlusIcon } from '@heroicons/react/20/solid';
import { Tooltip } from 'flowbite-react';
import CreatePlayerForm from '@/app/ui/client/CreatePlayerForm';

export default function CreateNewPlayerButton({ currentPage }: { currentPage:string }) {
  const [showModal, setShowModal] = React.useState(false);

  if (!showModal) {
    return (<div  className="pointer rounded-md border p-2 ">
      <Tooltip content="צור שחקן חדש" color="primary">
        <UserPlusIcon className="h-5 md:ml-4" onClick={()=>setShowModal(true)}/>
      </Tooltip></div>
    );
  }

  return (
    <div
      className="CreatePlayerFormWrapper"
    >
     <CreatePlayerForm close={()=>setShowModal(false)} prevPage={currentPage} />
    </div>
  );
}
