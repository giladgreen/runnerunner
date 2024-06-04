import {
  BanknotesIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchGeneralPlayersCardData, fetchRSVPAndArrivalData} from '@/app/lib/data';
import {formatCurrency} from "@/app/lib/utils";
import {DoubleTicksIcon, TickIcon} from "@/app/ui/icons";

const iconMap = {
  money: BanknotesIcon,
  players: UserGroupIcon,
  debt: UserIcon,
  rsvp: TickIcon,
  arrived: DoubleTicksIcon
};

export async function GeneralPlayersCardWrapper() {
  const {
      totalNumberOfPlayers,
      numberOfPlayersWithDebt,
      totalRunnerDebt,
      totalPlayersDebt,
  } = await fetchGeneralPlayersCardData();
  return (
    <>
        <Card title="Total players" value={totalNumberOfPlayers} type="players" />
        <Card title="Our Obligations" value={formatCurrency(totalRunnerDebt)} type="money" />
        <Card title="Players with debt" value={numberOfPlayersWithDebt} type="debt" />
        <Card title="Players debt" value={formatCurrency(totalPlayersDebt)} type="money" />
    </>
  );
}

export async function RSVPAndArrivalCardWrapper() {
    const {
        rsvpForToday,
        arrivedToday
    } = await fetchRSVPAndArrivalData();


    return (
    <>
    <Card title={'RSVP for Today'} value={rsvpForToday} type="rsvp"/>
        <Card title={'Arrived Today'} value={arrivedToday} type="arrived"/>

    </>
  );
}


export function Card({
  title,
  value,
  type,
  spend
}: {
  title: string | JSX.Element;
  value: number | string | JSX.Element;
  type?: 'players' | 'debt' | 'money' |'rsvp'|'arrived';
  spend?:boolean
}) {
  const Icon = type ? iconMap[type] : undefined;

  return (
    <div className={`rounded-xl bg-blue-200 p-2 shadow-sm ${spend ? 'spend':''}`}>
      <div className="flex p-4 text-center">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" size={18} /> : null}
        <h3 className={`ml-2 text-sm font-medium text-center ${spend ? 'center-text' :'' }`}>{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
