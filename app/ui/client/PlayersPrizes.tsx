import {
  fetchPlayersPrizes,
  fetchTodaysPlayersPhoneNumbers,
  fetchUserById,
} from '@/app/lib/data';
import Card from '@/app/ui/client/Card';
import { getPlayersPrizesContent } from '@/app/ui/client/helpers';

export default async function PlayersPrizes({
  title,
  showOnlyToday,
  params,
}: {
  title: string;
  showOnlyToday?: boolean;
  params: { userId: string };
}) {
  const user = await fetchUserById(params.userId);
  const userPhoneNumber = user.phone_number;
  const isRegularPlayer = !user.is_admin && !user.is_worker;
  const todayPlayersPhoneNumbers = showOnlyToday
    ? await fetchTodaysPlayersPhoneNumbers()
    : [];
  const { undeliveredPrizes } = await fetchPlayersPrizes(
    isRegularPlayer ? userPhoneNumber : undefined,
  );

  const playersPrizes = undeliveredPrizes.filter(
    (p) =>
      isRegularPlayer ||
      !showOnlyToday ||
      todayPlayersPhoneNumbers.includes(p.phone_number),
  );

  const content = (await getPlayersPrizesContent(
    playersPrizes,
    isRegularPlayer,
    params.userId,
  )) as JSX.Element;
  if (!content) return null;

  return (
    <div
      className="full-width grid gap-1 sm:grid-cols-1 lg:grid-cols-1"
      style={{ marginBottom: 10, marginTop: -20 }}
    >
      <Card title={title} value={content} type="prize" />
    </div>
  );
}
