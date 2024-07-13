import { fetchPlayersPrizes } from '@/app/lib/data';
import Card from '@/app/ui/client/Card';
import { getPlayersPrizesContent } from '@/app/ui/client/helpers';

export default async function PlayersPrizesPage({
  playerPhone,
}: {
  playerPhone?: string;
}) {
  const { undeliveredPrizes, deliveredPrizes } =
    await fetchPlayersPrizes(playerPhone);

  const undeliveredPrizesContent = (await getPlayersPrizesContent(
    undeliveredPrizes,
    false,
  )) as JSX.Element;
  const deliveredPrizesContent = (await getPlayersPrizesContent(
    deliveredPrizes,
    false,
  )) as JSX.Element;
  if (!undeliveredPrizesContent && !deliveredPrizesContent) {
    return null;
  }

  return (
    <div
      className="full-width grid gap-1 sm:grid-cols-1 lg:grid-cols-1"
      style={{ marginBottom: 10, marginTop: -20 }}
    >
      {undeliveredPrizesContent && (
        <Card
          title="Players Undelivered Prizes"
          value={undeliveredPrizesContent}
          type="prize"
        />
      )}
      {deliveredPrizesContent && (
        <Card
          title="Players Prizes History (Delivered)"
          value={deliveredPrizesContent}
          type="prize"
        />
      )}
    </div>
  );
}
