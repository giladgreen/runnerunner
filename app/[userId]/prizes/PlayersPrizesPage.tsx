import { fetchPlayersPrizes, fetchPrizesInfo } from '@/app/lib/data';
import Card from '@/app/ui/client/Card';
import { getPlayersPrizesContent } from '@/app/ui/client/helpers';

export default async function PlayersPrizesPage({
  playerPhone,
}: {
  playerPhone?: string;
}) {
  const { chosenPrizes, deliveredPrizes, readyToBeDeliveredPrizes } =
    await fetchPlayersPrizes(playerPhone);
  const prizesInformation = await fetchPrizesInfo();
  const chosenPrizesContent = (await getPlayersPrizesContent(
    chosenPrizes,
    prizesInformation,
    false,
  )) as JSX.Element;
  const deliveredPrizesContent = (await getPlayersPrizesContent(
    deliveredPrizes,
    [],
    false,
  )) as JSX.Element;
  const readyToBeDeliveredPrizesContent = (await getPlayersPrizesContent(
    readyToBeDeliveredPrizes,
    [],
    false,
  )) as JSX.Element;
  if (
    !chosenPrizesContent &&
    !deliveredPrizesContent &&
    !readyToBeDeliveredPrizesContent
  ) {
    return null;
  }

  return (
    <div
      className="full-width grid gap-1 sm:grid-cols-1 lg:grid-cols-1"
      style={{ marginBottom: 10, marginTop: -20 }}
    >
      {chosenPrizesContent && (
        <Card
          title="פרסים שנבחרו"
          value={chosenPrizesContent}
          type="prize"
        />
      )}
      {readyToBeDeliveredPrizesContent && (
        <Card
          title="פרסים שמוכנים למסירה"
          value={readyToBeDeliveredPrizesContent}
          type="prize"
        />
      )}
      {deliveredPrizesContent && (
        <Card
          title="הסטוריית פרסים (נמסרו)"
          value={deliveredPrizesContent}
          type="prize"
        />
      )}
    </div>
  );
}
