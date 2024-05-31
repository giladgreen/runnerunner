"use client";

import { TrashIcon } from '@heroicons/react/24/outline';
import { deletePlayer } from '@/app/lib/actions';
import {Button} from "@/app/ui/button";
import React from "react";

export function DeletePlayer({ id }: { id: string }) {
  const deletePlayerWithId = deletePlayer.bind(null, id);

  const onSubmit = (formData: FormData) => {
    if (confirm("Are you sure?")) {
      deletePlayerWithId();
    }
  };


  return (
      <form action={onSubmit}>
        <button className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5"/>
        </button>
      </form>
  );
}

export function ImportPlayers() {
    return (
        <Button
            onClick={()=>{
                alert('TBD');
            }}
        >
            <span className="hidden md:block">import</span>
        </Button>
    );
}
