'use client';
import Card from '@/app/ui/client/Card';
import {PrizeDB} from "@/app/lib/definitions";

export default function PlayersPrizesPage({
  playerPage,
  playerPrizes,
  prizesContents
}: {
  playerPage?: boolean;
  playerPrizes:{ chosenPrizes: PrizeDB[], deliveredPrizes: PrizeDB[], readyToBeDeliveredPrizes: PrizeDB[] }
  prizesContents:{ chosenPrizesContent: JSX.Element, deliveredPrizesContent: JSX.Element, readyToBeDeliveredPrizesContent: JSX.Element }
}) {
  const { chosenPrizes, deliveredPrizes, readyToBeDeliveredPrizes } =playerPrizes;

  if (
    playerPage &&
    !chosenPrizes?.length &&
    !deliveredPrizes?.length &&
    !readyToBeDeliveredPrizes?.length
  ) {
    return <div>אין מידע להצגה</div>
  }
const {chosenPrizesContent, deliveredPrizesContent,readyToBeDeliveredPrizesContent } = prizesContents;

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
        <Card title="פרסים שנבחרו" value={chosenPrizesContent} type="prize" />
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
