import { fetchFeatureFlags, fetchPlayerByUserId, fetchTournaments } from '@/app/lib/data';

import React from 'react';
import PlayerPagePlayerDetails from '@/app/ui/client/PlayerPagePlayerDetails';
import NoPlayerPage from '@/app/ui/client/NoPlayerPage';
import PlayerCreditHistoryPage from '@/app/[userId]/player_credit_history/page';
import PlayerPrizesPage from '@/app/[userId]/player_prizes/page';
import PlayerPageRegistrationSection from '@/app/ui/client/PlayerPageRegistrationSection';

export default async function PlayerDataPage({
  params,
}: {
  params: { userId: string };
}) {
  const [ff, player, tournaments, { playerRsvpEnabled }] = await Promise.all([
    fetchFeatureFlags(),
    fetchPlayerByUserId(params.userId),
    fetchTournaments(),
    fetchFeatureFlags(),
  ]);

  if (!player) {
    return <NoPlayerPage />;
  }

  const { prizesEnabled } = ff;
  return (
    <div className="PlayerDataPageBackground" >
      <div className="rtl" style={{ marginTop: 20 }}>
        <PlayerPagePlayerDetails player={player} showCreditData={false}/>
      </div>
      <div className="rtl" style={{ marginTop: 20 }}>
        <PlayerPageRegistrationSection
          player={player}
          playerRsvpEnabled={playerRsvpEnabled}
          thisWeekTournaments={tournaments}
        />
      </div>
      <div className="rtl" style={{ marginTop: 20 }}>
        <PlayerCreditHistoryPage params={params} />
      </div>
      {prizesEnabled && (
        <div className="rtl" style={{ marginTop: 20 }}>
          <PlayerPrizesPage params={params} />
        </div>
      )}
    </div>
  );
}
