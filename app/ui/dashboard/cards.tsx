import {
  BanknotesIcon,
  UserGroupIcon,
  UserIcon,
    GiftIcon,
} from '@heroicons/react/24/outline';
import {
  WalletIcon,
  CreditCardIcon,
    ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/solid';
import { lusitana } from '@/app/ui/fonts';
import {
    fetchFeatureFlags,
    fetchFinalTablePlayers,
    fetchGeneralPlayersCardData,
    fetchPlayersPrizes,
    fetchRSVPAndArrivalData,
    fetchTodaysPlayersPhoneNumbers, fetchTournamentsData
} from '@/app/lib/data';
import {formatCurrency, formatDateToLocal} from "@/app/lib/utils";
import {DoubleTicksIcon, TickIcon} from "@/app/ui/icons";
import { Suspense} from "react";
import {CardsSkeleton} from "@/app/ui/skeletons";
import Image from "next/image";
import {PlayerDB, PrizeDB} from "@/app/lib/definitions";
import { DeletePrize} from "@/app/ui/players/client-buttons";
import OpenGiveCreditModalButton from "@/app/ui/players/open-give-credit-modal-button";
import OpenSetPrizesCreditModalButton from "@/app/ui/players/open-set-prizes-credit-modal-button";
import OpenConvertPrizeToCreditButton from "@/app/ui/players/convert-prize-to-credit-modal-form";

const translation = {
    Sunday: 'יום ראשון',
    Monday: 'יום שני',
    Tuesday: 'יום שלישי',
    Wednesday: 'יום רביעי',
    Thursday: 'יום חמישי',
    Friday: 'יום שישי',
    Saturday: 'יום שבת',
}
const iconMap = {
  money: BanknotesIcon,
  players: UserGroupIcon,
  debt: UserIcon,
  rsvp: TickIcon,
  arrived: DoubleTicksIcon,
  empty: DoubleTicksIcon,
  prize: GiftIcon
};

export async function GeneralPlayersCardWrapper() {
    const {
        totalNumberOfPlayers,
        numberOfPlayersWithDebt,
        totalRunnerDebt,
        totalPlayersDebt,
    } = await fetchGeneralPlayersCardData();
    return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 full-width">
        <Suspense fallback={<CardsSkeleton count={4}/>}>
            <Card title="Total players" value={totalNumberOfPlayers} type="players" oneLine/>
            <Card title="Our Obligations" value={formatCurrency(totalRunnerDebt)} type="money" oneLine/>
            <Card title="Players with debt" value={numberOfPlayersWithDebt} type="debt" oneLine/>
            <Card title="Players debt" value={formatCurrency(totalPlayersDebt)} type="money" oneLine/>
        </Suspense>
    </div>
}

export async function RSVPAndArrivalCardWrapper() {
    const { rsvpEnabled } = await fetchFeatureFlags();

    const {
        rsvpForToday,
        todayTournamentMaxPlayers,
        arrivedToday,
        todayCreditIncome,
        todayCashIncome,
        todayTransferIncome,
        reEntriesCount,
        todayTournament
    } = await fetchRSVPAndArrivalData();
    const { rsvp_required } = todayTournament;
    const rsvpForTodayText = rsvp_required ? (`${rsvpForToday}${todayTournamentMaxPlayers ?` / ${todayTournamentMaxPlayers}`:''}`) : 'ללא'
    const todayIncome = <div>
        <div style={{fontSize: 20, marginBottom:10}}>
            <b>{formatCurrency(todayCreditIncome + todayCashIncome + todayTransferIncome)}</b>
        </div>
        <div  className="card-table full-width">
            <table  style={{fontSize: 15}} className="full-width" cellSpacing="0" cellPadding="0">
                <thead>
                <tr>
                      <th scope="col" className="table-text-item" data-tooltip="Credit" title="Credit">
                        <b>{formatCurrency(todayCreditIncome)}</b>
                    </th>
                    <th scope="col" className="table-text-item" data-tooltip="Cash" title="Cash">
                        <b>{formatCurrency(todayCashIncome)}</b>
                    </th>
                    <th scope="col" className="table-text-item" data-tooltip="Wire transfer" title="Wire transfer">
                        <b>{formatCurrency(todayTransferIncome)}</b>
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

    // const oneLinerStyle = {padding: 50, fontSize: 40}
    return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 full-width" style={{marginBottom: 20}} >
        <Suspense fallback={<CardsSkeleton count={4}/>}>
            {rsvpEnabled && <Card title="RSVP" value={<div >{rsvpForTodayText}</div>} type="rsvp" oneLine/>}
            <Card title="Arrived" value={<div >{arrivedToday}</div>} type="arrived" oneLine/>
            <Card title="Re Entries" value={<div >{reEntriesCount}</div>} type="money" oneLine/>
            <Card title="Income" value={todayIncome} type="money"/>
        </Suspense>
    </div>
}


export async function TodayTournamentNameCardWrapper() {

    const {
        todayTournament
    } = await fetchRSVPAndArrivalData();

    return <div className="grid gap-1 sm:grid-cols-1 lg:grid-cols-1 full-width" style={{marginBottom: 20}} >
        <Suspense fallback={<CardsSkeleton count={1}/>}>

            <Card oneLine title="Current Tournament" value={`${
                // @ts-ignore
                translation[todayTournament.day]} -  ${todayTournament.max_players === 0 && todayTournament.rsvp_required ? 'אין טורניר היום' : todayTournament.name}`} />
        </Suspense>
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

function getDayIncome(dateItem: { total: number,credit: number,cash: number, wire: number }){
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

export async function FinalTablePlayers({title, userId}: { title: string, userId?:string }) {
    const date = (new Date()).toISOString().slice(0, 10);
    const content = await getFinalTablePlayersContent(date, false, userId) as JSX.Element;
    if (!content) return null;

    return <div className="grid gap-1 sm:grid-cols-1 lg:grid-cols-1 full-width"
                style={{marginBottom: 10, marginTop: -20}}>
        <Card title={title} value={content} type="players"/>
    </div>
}


export async function PlayersPrizes({title, showOnlyToday, playerPhoneNumber, personal, workerPage, userId}: { title: string,showOnlyToday?:boolean, playerPhoneNumber?: string, personal?:boolean, workerPage?:boolean, userId?:string }) {
    const todayPlayersPhoneNumbers = showOnlyToday ? (await fetchTodaysPlayersPhoneNumbers()) : [];
    console.log('## title',title)
    console.log('## playerPhoneNumber',playerPhoneNumber)
    console.log('## personal',personal)
    console.log('## workerPage',workerPage)
    console.log('## userId',userId)
    console.log('## todayPlayersPhoneNumbers',todayPlayersPhoneNumbers)
    const { undeliveredPrizes} = await fetchPlayersPrizes(playerPhoneNumber);
    console.log('## undeliveredPrizes',undeliveredPrizes)

    const playersPrizes = undeliveredPrizes.filter(p => personal || !showOnlyToday || todayPlayersPhoneNumbers.includes(p.phone_number));
    console.log('## playersPrizes ',playersPrizes)

    const content = await getPlayersPrizesContent(playersPrizes,  personal, userId) as JSX.Element;
    if (!content) return null;

    return <div className="grid gap-1 sm:grid-cols-1 lg:grid-cols-1 full-width"
                style={{marginBottom: 10, marginTop: -20}}>
        <Card title={title} value={content} type="prize"/>
    </div>
}


export async function TournamentsDataPage({ userId }: {userId?:string}) {
    const {  placesEnabled} = await fetchFeatureFlags();

    const tournaments = await fetchTournamentsData();

    const tournamentsData =  Object.keys(tournaments);


    return (
        <div className="w-full tournaments-data-table">
            {tournamentsData.length === 0 && <div className="text-center">No Data yet</div>}
            {tournamentsData.length > 0 && <table className="min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                    <th className="px-4 py-5 font-medium">
                        <b>Date</b>
                    </th>
                    <th className="px-3 py-5 font-medium">
                        <b>Income</b>
                    </th>
                    <th className="px-3 py-5 font-medium">
                        <b>Players Count</b>
                    </th>
                    <th className="px-3 py-5 font-medium">
                        <b>Buyins</b>
                    </th>
                    {placesEnabled && <th className="px-3 py-5 font-medium">
                        <b>Places</b>
                    </th>}
                </tr>
                </thead>
                <tbody className="bg-white">
                {  // @ts-ignore
                    tournamentsData.map(key => tournaments[key]).map(async (dateItem) => {
                        const dayIncome = getDayIncome(dateItem);

                        const date = (new Date(dateItem.date)).toISOString().slice(0,10);

                        const finalTableData = await getFinalTablePlayersContent(date, true, userId);

                        return <tr
                            key={dateItem.date}
                            className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                        >
                            <th className="px-4 py-5 font-medium">
                                <div style={{ marginBottom:20}}>
                                    {formatDateToLocal(dateItem.date)}
                                </div>
                                <div>
                                    {dateItem.tournamentName}
                                </div>
                            </th>
                            <th className="px-3 py-5 font-medium">
                                {dayIncome}
                            </th>
                            <th className="px-3 py-5 font-medium">
                                {dateItem.players} players
                            </th>
                            <th className="px-3 py-5 font-medium">
                                {dateItem.entries - dateItem.reentries} buyins {dateItem.reentries > 0 ? `(+ ${dateItem.reentries} rebuys)` : ``}
                            </th>
                            {placesEnabled && <th className="px-3 py-5 font-medium">
                                { finalTableData }
                            </th>}
                        </tr>
                    })}
                </tbody>
            </table>}
        </div>
    );
}



export function Card({
                         title,
                         value,
                         type,
                         spend,
                         empty,
    oneLine
                     }: {
    title: string | JSX.Element;
    value: number | string | JSX.Element;
    type?: 'players' | 'debt' | 'money' | 'rsvp' | 'arrived' | 'empty' | 'prize';
    spend?: boolean
    empty?: boolean
    oneLine?: boolean
}) {
    if (empty) return (<div className={`rounded-xl  p-2 shadow-sm`}></div>);

    const Icon = type && !empty ? iconMap[type] : undefined;

    return (
        <div className={`rounded-xl bg-blue-200 p-2 shadow-sm card`}>
            <div className="flex p-4 text-center card-header" >
                {Icon ? <Icon className="h-5 w-5 text-gray-700" size={18}/> : null}
                <h3 className={`ml-2 text-sm font-medium text-center ${spend ? 'center-text' : ''}`}>{title}</h3>
            </div>
            <div
                className={`${lusitana.className} truncate rounded-xl bg-white px-4 py-4 text-center text-2xl ${oneLine ? 'card-body-one-line':''}`}>
                {value}
            </div>
        </div>
    );
}
