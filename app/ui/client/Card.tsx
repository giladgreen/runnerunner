import {lusitana} from "@/app/ui/fonts";
import {BanknotesIcon, GiftIcon, UserGroupIcon, UserIcon} from "@heroicons/react/24/outline";
import {DoubleTicksIcon, TickIcon} from "@/app/ui/icons";
const iconMap = {
    money: BanknotesIcon,
    players: UserGroupIcon,
    debt: UserIcon,
    rsvp: TickIcon,
    arrived: DoubleTicksIcon,
    empty: DoubleTicksIcon,
    prize: GiftIcon
};

export default function Card({
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
                className={`${lusitana.className} truncate rounded-xl bg-white px-4 py-4 text-center text-2xl ${oneLine ? 'card-body-one-line':'card-body'}`}>
                {value}
            </div>
        </div>
    );
}
