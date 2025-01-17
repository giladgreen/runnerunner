import { fetchFeatureFlags, fetchPlayerByUserId } from '@/app/lib/data';

import React from 'react';
import PlayerPagePlayerDetails from '@/app/ui/client/PlayerPagePlayerDetails';
import NoPlayerPage from '@/app/ui/client/NoPlayerPage';
import PlayerRegistrationPage from '@/app/[userId]/player_registration/page';
import PlayerCreditHistoryPage from '@/app/[userId]/player_credit_history/page';
import PlayerPrizesPage from '@/app/[userId]/player_prizes/page';

export default async function PlayerDataPage({
  params,
}: {
  params: { userId: string };
}) {
  const { prizesEnabled } = await fetchFeatureFlags();
  const player = await fetchPlayerByUserId(params.userId);
  if (!player) {
    return <NoPlayerPage />;
  }

  return (
    <div style={{background:'black'}}>
      <div className="rtl" style={{ marginTop: 20 }}>
        <PlayerPagePlayerDetails player={player} showCreditData={false}/>
      </div>
      <div className="rtl" style={{ marginTop: 20 }}>
        <PlayerRegistrationPage params={{ ...params, isAdminPlayer: true }} />
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
