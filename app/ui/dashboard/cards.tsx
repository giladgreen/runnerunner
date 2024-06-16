import {
  BanknotesIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import {
  WalletIcon,
  CreditCardIcon,
    ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/solid';
import { lusitana } from '@/app/ui/fonts';
import {fetchFinalTablePlayers, fetchGeneralPlayersCardData, fetchRSVPAndArrivalData} from '@/app/lib/data';
import {formatCurrency} from "@/app/lib/utils";
import {DoubleTicksIcon, TickIcon} from "@/app/ui/icons";
import {CSSProperties, Suspense, useState} from "react";
import {CardsSkeleton} from "@/app/ui/skeletons";
import Image from "next/image";

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
  empty: DoubleTicksIcon
};

export async function GeneralPlayersCardWrapper() {
    const {
        totalNumberOfPlayers,
        numberOfPlayersWithDebt,
        totalRunnerDebt,
        totalPlayersDebt,
    } = await fetchGeneralPlayersCardData();
    return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" style={{width: '100%'}}>
        <Suspense fallback={<CardsSkeleton count={4}/>}>
            <Card title="Total players" value={totalNumberOfPlayers} type="players"/>
            <Card title="Our Obligations" value={formatCurrency(totalRunnerDebt)} type="money"/>
            <Card title="Players with debt" value={numberOfPlayersWithDebt} type="debt"/>
            <Card title="Players debt" value={formatCurrency(totalPlayersDebt)} type="money"/>
        </Suspense>
    </div>
}

export async function RSVPAndArrivalCardWrapper() {

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
        <div  style={{width:'100%' }} className="card-table">
            <table  style={{fontSize: 15, width:'100%'}} cellSpacing="0" cellPadding="0">
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

    const oneLinerStyle = {padding: 50, fontSize: 40}
    return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" style={{marginBottom: 20, width: '100%'}} >
        <Suspense fallback={<CardsSkeleton count={4}/>}>
            <Card title={`RSVP`} value={<div style={oneLinerStyle}>{rsvpForTodayText}</div>} type="rsvp"/>
            <Card title={`Players`} value={<div  style={oneLinerStyle}>{arrivedToday}</div>} type="arrived"/>
            <Card title={'Re Entries'} value={<div  style={oneLinerStyle}>{reEntriesCount}</div>} type="money"/>
            <Card title={`Income`} value={todayIncome} type="money"/>
        </Suspense>
    </div>
}


export async function TodayTournamentNameCardWrapper() {

    const {
        todayTournament
    } = await fetchRSVPAndArrivalData();

    return <div className="grid gap-1 sm:grid-cols-1 lg:grid-cols-1" style={{marginBottom: 20, width: '100%'}} >
        <Suspense fallback={<CardsSkeleton count={1}/>}>

            <Card title={`Current Tournament`} value={`${
                // @ts-ignore
                translation[todayTournament.day]} -  ${todayTournament.name}`} />
        </Suspense>
    </div>
}


export async function getFinalTablePlayersContent(date:string, revenuePage:boolean) {
    const finalTablePlayers = await fetchFinalTablePlayers(date);

    if (!finalTablePlayers || finalTablePlayers.length === 0) return null;

    const textStyle = revenuePage ? {
        color: '#555555',
        fontSize: 11,
    } :{
        background: '#6666CCAA',
        color: 'white',
        width: 30,
        height: 30,
        borderRadius: 50,
        textAlign: 'center',
        marginRight: 10
    }

    return <div style={{marginBottom: 30, width: '100%'}}>
        <div style={{ width: '100%'}}>
            {finalTablePlayers.map((finalTablePlayer: any) => {
                return <div
                    key={finalTablePlayer.id}
                    className="w-full rounded-md bg-white" style={{width: '100%'}}
                >
                    <div className={`flex items-center border-b ${revenuePage ? '':'pb-4'}`}>
                        <div  style={textStyle as CSSProperties}>#{finalTablePlayer.position}</div>
                        {!revenuePage && <Image
                            src={finalTablePlayer.image_url}
                            className="zoom-on-hover"
                            style={{
                                marginLeft: 10,
                                marginRight: 20
                            }}
                            width={40}
                            height={40}
                            alt={`${finalTablePlayer.name}'s profile picture`}
                        />}
                        {revenuePage && <span style={{marginLeft:10}}></span>}
                        <div className="text-gray-500"  style={{ fontSize: revenuePage ? 11: 20, }}>{finalTablePlayer.phone_number}</div>
                        <div style={{ fontSize: revenuePage ? 11: 20, marginLeft: 20}} >
                            {finalTablePlayer.name}
                        </div>

                    </div>
                </div>


            })}
        </div>
    </div>
}
export async function FinalTablePlayers({ title}:{title: string}) {
    const date = (new Date()).toISOString().slice(0,10);
    const content = await getFinalTablePlayersContent(date, false) as JSX.Element;
    if (!content) return null;

    return <div className="grid gap-1 sm:grid-cols-1 lg:grid-cols-1" style={{marginBottom: 10, marginTop: -20, width: '100%'}} >
        <Card title={title} value={content} type="players"/>
    </div>
}


export function Card({
                         title,
                         value,
                         type,
                         spend,
                         empty
                     }: {
    title: string | JSX.Element;
    value: number | string | JSX.Element;
    type?: 'players' | 'debt' | 'money' | 'rsvp' | 'arrived' | 'empty';
    spend?: boolean
    empty?: boolean
}) {
    if (empty) return (<div className={`rounded-xl  p-2 shadow-sm`}></div>);

    const Icon = type && !empty ? iconMap[type] : undefined;

    return (
        <div className={`rounded-xl bg-blue-200 p-2 shadow-sm `}>
            <div className="flex p-4 text-center">
                {Icon ? <Icon className="h-5 w-5 text-gray-700" size={18}/> : null}
                <h3 className={`ml-2 text-sm font-medium text-center ${spend ? 'center-text' : ''}`}>{title}</h3>
            </div>
            <div
                className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-4 text-center text-2xl`}
            >
                {value}
            </div>
        </div>
    );
}
