import { lusitana } from '@/app/ui/fonts';
import {
  ArrowDownOnSquareIcon,
  BanknotesIcon,
  GiftIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { DoubleTicksIcon, TickIcon } from '@/app/ui/icons';
const iconMap = {
  money: BanknotesIcon,
  players: UserGroupIcon,
  debt: UserIcon,
  rsvp: TickIcon,
  arrived: DoubleTicksIcon,
  empty: DoubleTicksIcon,
  prize: GiftIcon,
  today: ArrowDownOnSquareIcon,
  export: ArrowDownOnSquareIcon,
};

export default function Card({
  title,
  value,
  type,
  spend,
  empty,
  oneLine,
  green,
  orange,
}: {
  title: string | JSX.Element;
  value: number | string | JSX.Element;
  type?: 'players' | 'debt' | 'money' | 'rsvp' | 'arrived' | 'empty' | 'prize' | 'today' | 'export';
  spend?: boolean;
  empty?: boolean;
  oneLine?: boolean;
  green?: boolean;
  orange?: boolean;
}) {
  if (empty) return <div className={`rounded-xl  p-2 shadow-sm`}></div>;

  const Icon = type && !empty ? iconMap[type] : undefined;

  return (
    <div
      className={`card rounded-xl p-2 shadow-sm ${
        green ? 'bg-green-200' : orange ? 'bg-red-300' : 'bg-blue-200'
      }`}
    >
      <div className="rtl card-header flex p-4 text-center">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" size={18} style={{ marginLeft: 4}}/> : null}
        <h3
          className={`ml-2 text-center text-sm font-medium ${
            spend ? 'center-text' : ''
          }`}
        >
          {title}
        </h3>
      </div>
      <div
        className={`${
          lusitana.className
        } truncate rounded-xl bg-white px-4 py-4 text-center text-2xl ${
          oneLine ? 'card-body-one-line' : 'card-body'
        }`}
      >
        {value}
      </div>
    </div>
  );
}
