import {fetchFinalTablePlayers} from "@/app/lib/data";
import {PlayerDB, PrizeDB} from "@/app/lib/definitions";
import OpenGiveCreditModalButton from "@/app/ui/client/OpenGiveCreditModalButton";
import Image from "next/image";
import OpenSetPrizesCreditModalButton from "@/app/ui/client/OpenSetPrizesCreditModalButton";
import {DeletePrize} from "@/app/ui/players/client-buttons";
import OpenConvertPrizeToCreditButton from "@/app/ui/players/convert-prize-to-credit-modal-form";
import {lusitana} from "@/app/ui/fonts";
import {formatCurrency} from "@/app/lib/utils";
import {ArrowLeftOnRectangleIcon, CreditCardIcon, WalletIcon} from "@heroicons/react/24/solid";

export async function getFinalTablePlayersContent(date: string, isTournamentsDataPage: boolean, userId?:string) {
    const finalTablePlayers = await fetchFinalTablePlayers(date);
    const showSetPrizesCreditModalButton = isTournamentsDataPage && finalTablePlayers.find(p => !p.hasReceived) && !userId;
    if (!finalTablePlayers || finalTablePlayers.length === 0) return null;
    const textClass = isTournamentsDataPage ? 'text-tournaments-data-page' : 'text-on-card'

    return <div className="full-width" style={{marginBottom: 30,  display: 'flex'}}>
        <div style={{width: '60%'}}>
            {finalTablePlayers.map((finalTablePlayer: PlayerDB) => {
                return <div
                    key={finalTablePlayer.id}
                    className="w-full rounded-md bg-white full-width"
                >

                    <div className={`flex items-center border-b ${isTournamentsDataPage ? '' : 'pb-4'} highlight-on-hover`}>
                        <OpenGiveCreditModalButton player={finalTablePlayer} hasReceived={finalTablePlayer.hasReceived} stringDate={date} userId={userId}/>
                        <div className={textClass}>#{finalTablePlayer.position}</div>

                        {!isTournamentsDataPage && <Image
                            src={finalTablePlayer.image_url}
                            className="zoom-on-hover"
                            style={{
                                marginLeft: 10,
                                marginRight: 20,
                                marginTop:5
                            }}
                            width={40}
                            height={50}
                            alt={`${finalTablePlayer.name}'s profile picture`}
                        />}
                        {isTournamentsDataPage && <span style={{marginLeft: 10}}></span>}

                        <div className="wide-screen" style={{fontSize: isTournamentsDataPage ? 11 : 20,}}>
                            {finalTablePlayer.phone_number}
                        </div>

                        <div className="wide-screen" style={{fontSize: isTournamentsDataPage ? 11 : 20, marginLeft: 20}}>
                            {finalTablePlayer.name}
                        </div>

                        <div className="cellular">
                            <div style={{display: "block"}}>
                                <div>{finalTablePlayer.name}</div>
                                <div>{finalTablePlayer.phone_number}</div>
                            </div>
                        </div>

                    </div>
                </div>


            })}

            {showSetPrizesCreditModalButton &&  <OpenSetPrizesCreditModalButton date={date} players={finalTablePlayers}/>}
        </div>
        {isTournamentsDataPage && <div className="wide-screen" style={{width: '40%', textAlign: 'center'}}>
            <div style={{textAlign:'center'}}>
                <Image
                    src={finalTablePlayers[0].image_url}
                    className="zoom-on-hover"
                    style={{
                        marginTop: 20,
                        marginLeft: 20,
                        marginRight: 0,
                        border: '3px solid black',
                    }}
                    width={100}
                    height={120}
                    alt={`${finalTablePlayers[0].name}'s profile picture`}
                />
                <b>{finalTablePlayers[0].name}</b>
            </div>
        </div>

        }
    </div>
}

export async function getPlayersPrizesContent(playersPrizes: PrizeDB[], personal?:boolean, userId?:string) {
    if (!playersPrizes || playersPrizes.length === 0) return null;


    return <div className="full-width" style={{marginBottom: 30}}>

        {playersPrizes.map((playersPrize: PrizeDB) => {
            console.log('## playersPrize', playersPrize)

            return <div key={playersPrize.id}>

                <div className="wide-screen border-b prize-row ">
                    <div className="w-full rounded-md flex items-center  ">
                        <span style={{marginLeft: 25}}>{playersPrize!.tournament}</span>
                        {!personal && <span style={{marginLeft: 25}}>{playersPrize!.player!.name}</span>}
                        {!personal && <span style={{marginLeft: 25}}>{playersPrize!.player!.phone_number}</span>}
                        <span style={{marginLeft: 25}}>{playersPrize!.prize}</span>
                    </div>

                    {!personal  && !playersPrize.delivered && <DeletePrize id={playersPrize.id}/>}
                    {!personal  && !playersPrize.delivered && <OpenConvertPrizeToCreditButton prizeId={playersPrize.id} prizeName={playersPrize.prize} userId={userId}/>}
                </div>
                <div className="cellular border-b prize-row">
                    <div >
                        <div >
                            <span style={{marginLeft: 1}}>{playersPrize!.tournament}</span>
                        </div>
                        {!personal && <div className="flex">
                            <span>{playersPrize!.player!.phone_number}</span>
                            <span style={{marginLeft: 5}}>{playersPrize!.player!.name}</span>
                        </div>}
                    </div>
                    <div >
                        {playersPrize!.prize}
                    </div>

                    {!personal && !playersPrize.delivered && <div>
                        <DeletePrize id={playersPrize.id}/>
                    </div>}


                    {!personal  && !playersPrize.delivered && <div>
                        <OpenConvertPrizeToCreditButton prizeId={playersPrize.id} prizeName={playersPrize.prize} userId={userId}/>
                    </div>}
                </div>

            </div>
        })}
    </div>
}

export function getDayIncome(dateItem: { total: number,credit: number,cash: number, wire: number }){
    return  (<div className={`${lusitana.className} truncate  bg-white  text-center text-2xl`}>
        <div>
            <div style={{fontSize: 20, marginBottom:10}}>
                <b>{formatCurrency(dateItem.total)}</b>
            </div>
            <div className="wide-screen card-table tournaments-data-table-income-cell full-width">
                <table style={{fontSize: 15}} className="full-width" cellSpacing="0" cellPadding="0">
                    <thead>
                    <tr>
                        <th scope="col" className="table-text-item" data-tooltip="Credit" title="Credit">
                            <b>{formatCurrency(dateItem.credit)}</b>
                        </th>
                        <th scope="col" className="table-text-item" data-tooltip="Cash" title="Cash">
                            <b>{formatCurrency(dateItem.cash)}</b>
                        </th>
                        <th scope="col" className="table-text-item" data-tooltip="Wire transfer" title="Wire transfer">
                            <b>{formatCurrency(dateItem.wire)}</b>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="col" >
                            <div className="table-item" data-tooltip="Credit" title="Credit">
                                <CreditCardIcon className="h-6 w-9 text-gray-700"/>
                            </div>
                        </th>
                        <th scope="col" >
                            <div className="table-item" data-tooltip="Cash" title="Cash">
                                <WalletIcon className="h-6 w-9 text-gray-700"/>
                            </div>
                        </th>
                        <th scope="col" >
                            <div className="table-item" data-tooltip="Wire transfer" title="Wire transfer">
                                <ArrowLeftOnRectangleIcon className="h-6 w-9 text-gray-700"/>
                            </div>
                        </th>
                    </tr>
                    <tr>
                        <th scope="col"  style={{ marginTop:-5}}>
                            <div className="table-item smaller-test" data-tooltip="Credit" title="Credit">
                                credit
                            </div>
                        </th>
                        <th scope="col" >
                            <div className="table-item smaller-test" data-tooltip="Cash" title="Cash">
                                cash
                            </div>
                        </th>
                        <th scope="col" >
                            <div className="table-item smaller-test" data-tooltip="Wire transfer" title="Wire transfer">
                                money wire
                            </div>
                        </th>
                    </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </div>)
}