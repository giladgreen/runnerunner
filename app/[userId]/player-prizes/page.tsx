import {
    fetchPlayerByUserId, fetchPlayersPrizes, fetchPrizesInfo
} from '@/app/lib/data';
import React from "react";
import NoPlayerPage from "@/app/ui/client/NoPlayerPage";
import PlayerPagePlayerPrizes from "@/app/ui/client/PlayerPagePlayerPrizes";
import {getPlayersPrizesContents} from "@/app/ui/client/helpers";

export default async function PlayerPrizesPage({
  params,
}: {
  params: { userId: string };
}) {
    const player = await fetchPlayerByUserId(params.userId);
    if (!player) {
        return <NoPlayerPage/>
    }
    const playerPrizes = await fetchPlayersPrizes(player?.phone_number);
    const prizesInformation = await fetchPrizesInfo();
    const { chosenPrizes, deliveredPrizes, readyToBeDeliveredPrizes } = playerPrizes;
    const prizesContents = await getPlayersPrizesContents(
        chosenPrizes,
        deliveredPrizes,
        readyToBeDeliveredPrizes,
        prizesInformation,
        null,
        true,
    );

    return (
      <PlayerPagePlayerPrizes
          prizesContents={prizesContents}
          playerPrizes={playerPrizes}
      />
    );
}
