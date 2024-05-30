import {
  BanknotesIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';
import {formatCurrency} from "@/app/lib/utils";

const iconMap = {
  money: BanknotesIcon,
  players: UserGroupIcon,
  debt: UserIcon,
};

export default async function CardWrapper() {
  const {
      totalNumberOfPlayers,
      numberOfPlayersWithDebt,
      totalRunnerDebt,
      totalPlayersDebt
  } = await fetchCardData();
  return (
    <>
        <Card title="Total players" value={totalNumberOfPlayers} type="players" />
        <Card title="Our Obligations" value={formatCurrency(totalRunnerDebt)} type="money" />
        <Card title="Players with debt" value={numberOfPlayersWithDebt} type="debt" />
        <Card title="Players debt" value={formatCurrency(totalPlayersDebt)} type="money" />


    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'players' | 'debt' | 'money';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
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
