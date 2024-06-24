'use client';

import {PlayerDB, PlayerForm} from '@/app/lib/definitions';
import React, {useState} from "react";

import {usePathname, useSearchParams} from "next/navigation";
import {givePlayerPrizeOrCredit} from "@/app/lib/actions";
import {useFormState} from "react-dom";
import {Button} from "@/app/ui/button";
import { TickIcon} from "@/app/ui/icons";

function SetGivePrizeForm({player, hide, prevPage, stringDate} : { stringDate?:string, player: PlayerForm, hide?: ()=>void, prevPage:string}) {
    const initialState = { message: null, errors: {} };
    const setPlayerPrizeWithPlayerId = givePlayerPrizeOrCredit.bind(null,{ playerId: player.id, prevPage, stringDate})
    // @ts-ignore
    const [_state, dispatch] = useFormState(setPlayerPrizeWithPlayerId, initialState);
    const [type, setType] = useState('prize');

    return (<div>
            <form action={dispatch} className="form-control give_user_prize">
                <label className="mb-2 block text-sm font-medium">
                    Give Player Prize/Credit
                </label>
                <div className="rounded-md  p-4 md:p-6 form-inner-control">
                    <div className="relative mt-2 rounded-md">
                        <div className="relative rsvp-section">
                            <div className="flex flex-wrap justify-content-center gap-3 radio">
                                <div className="flex align-items-center">
                                    <input type="radio" value="prize" name="type"
                                           checked={type === 'prize'}
                                           onChange={() => setType('prize')}
                                    />
                                    <label htmlFor="prize" className="ml-2 "><b>prize</b></label>
                                </div>
                                <div className="flex align-items-center">
                                    <input type="radio" value="credit" name="type"
                                           checked={type === 'credit'}
                                           onChange={() => setType('credit')}
                                    />
                                    <label htmlFor="credit" className="ml-2"> <b>credit</b></label>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/*  amount  */}
                    {type === 'credit' ? <div className="mb-4 give_user_credit_amount" >
                        <label htmlFor="credit" className="mb-2 block text-sm font-medium">
                            Amount
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                            <input
                                    id="credit"
                                    name="credit"
                                    type="number"
                                    // aria-valuemin={0}
                                    placeholder="Enter credit amount"
                                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                    aria-describedby="prize-error"
                                />
                            </div>
                        </div>
                    </div> : <div className="mb-4 give_user_credit_amount"></div>}

                </div>
                <div className="mt-6 flex justify-end gap-4">

                    <Button type="submit" onClick={() => hide?.()}>Update</Button>

                </div>
            </form>
            {hide && <Button onClick={hide} style={{marginTop: -52, marginLeft: 20}}>Cancel</Button>}
        </div>
    );
}


export default function OpenGiveCreditModalButton({
                                                      player,
                                                      hasReceived,
                                                      stringDate
                                                  }: {
    player: PlayerDB;
    hasReceived: boolean;
    stringDate?:string;
}) {
    const prevPage = `${usePathname()}?${useSearchParams().toString()}`;
    const [show, setShow] = React.useState(false);

    const close = () => {
        setShow(false);
    }
    return (
        <div style={{marginRight: 10}}>
            {hasReceived && <TickIcon size={20}/>}
            {!hasReceived && <div onClick={() => {
                setShow(true);
            }} className="pointer" style={{fontSize: '24'}}>
                💳
            </div>}
            {!hasReceived && <div className={show ? 'edit-player-modal' : 'hidden'}>
                <SetGivePrizeForm player={player as unknown as PlayerForm} hide={close} prevPage={prevPage} stringDate={stringDate}/>
            </div>}
        </div>
    );
}

