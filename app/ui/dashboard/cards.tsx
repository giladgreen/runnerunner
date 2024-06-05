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
import { fetchGeneralPlayersCardData, fetchRSVPAndArrivalData} from '@/app/lib/data';
import {formatCurrency} from "@/app/lib/utils";
import {DoubleTicksIcon, TickIcon} from "@/app/ui/icons";
import {Suspense} from "react";
import {CardsSkeleton} from "@/app/ui/skeletons";

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
    return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        arrivedToday,
        todayCreditIncome,
        todayCashIncome,
        todayTransferIncome
    } = await fetchRSVPAndArrivalData();

    const todayIncome = <div>
        <div style={{fontSize: 20, marginBottom:10}}>
            <b>{formatCurrency(todayCreditIncome + todayCashIncome + todayTransferIncome)}</b>
        </div>
        <div  style={{width:'100%' }} className="card-table">
            <table  style={{fontSize: 15, width:'100%'}}>
                <thead>
                <tr>
                      <th scope="col" className="table-text-item">
                        <b>{formatCurrency(todayCreditIncome)}</b>
                    </th>
                    <th scope="col" className="table-text-item">
                        <b>{formatCurrency(todayCashIncome)}</b>
                    </th>
                    <th scope="col" className="table-text-item">
                        <b>{formatCurrency(todayTransferIncome)}</b>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th scope="col" >
                        <div className="table-item">
                            <CreditCardIcon className="h-6 w-6 text-gray-700"/>
                        </div>
                    </th>
                    <th scope="col" >
                        <div className="table-item">
                            <WalletIcon className="h-6 w-6 text-gray-700"/>
                        </div>
                    </th>
                    <th scope="col" >
                        <div className="table-item">
                            <ArrowLeftOnRectangleIcon className="h-6 w-6 text-gray-700"/>
                        </div>
                    </th>
                </tr>
                </tbody>
            </table>
        </div>

    </div>

    return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" style={{marginBottom: 20}}>
        <Suspense fallback={<CardsSkeleton count={2}/>}>
            <Card title={'RSVP for Today'} value={rsvpForToday} type="rsvp"/>
            <Card title={'Arrived Today'} value={arrivedToday} type="arrived"/>
            <Card title={"Today's income"} value={todayIncome} type="money"/>
            {/*<Card title="" value={0} type="empty" empty/>*/}


        </Suspense>
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
    <div className={`rounded-xl bg-blue-200 p-2 shadow-sm `}  >
      <div className="flex p-4 text-center">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" size={18} /> : null}
        <h3 className={`ml-2 text-sm font-medium text-center ${spend ? 'center-text' :'' }`}>{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-4 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
