import EditPlayerForm from '@/app/ui/client/EditPlayerForm';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';
import {
  fetchFeatureFlags,
  fetchPlayerById,
  fetchPlayersPrizes,
  fetchPrizesInfo,
  fetchTournaments,
  fetchUserById,
} from '@/app/lib/data';
import { formatCurrency, formatCurrencyColor } from '@/app/lib/utils';
import CreateLogForm from '@/app/ui/client/CreateLogForm';
import HistoryTable from '@/app/ui/client/HistoryTable';
import TournamentsHistoryTable from '@/app/ui/client/TournamentsHistoryTable';
import PlayersPrizesPage from '@/app/[userId]/prizes/PlayersPrizesPage';
import NotFound from '@/app/[userId]/players/[playerId]/edit/NotFound';
import React from 'react';
import { getPlayersPrizesContents } from '@/app/ui/client/helpers';
import NoPermissionsPage from '@/app/ui/client/NoPermissionsPage';

export default async function EditPlayerPage({
  params,
}: {
  params: { userId: string; playerId: string };
}) {
  const user = await fetchUserById(params.userId);
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;
  if (!isAdmin && !isWorker) {
    return <NoPermissionsPage />;
  }

  const playerId = params.playerId;
  const { rsvpEnabled, prizesEnabled } = await fetchFeatureFlags();
  const tournaments = await fetchTournaments();
  const player = await fetchPlayerById(playerId, true);
  const prizesInformation = await fetchPrizesInfo();

  if (!player) {
    return <NotFound params={params} />;
  }
  const playerPrizes = await fetchPlayersPrizes(player?.phone_number);
  const { chosenPrizes, deliveredPrizes, readyToBeDeliveredPrizes } =
    playerPrizes;
  const prizesContents = await getPlayersPrizesContents(
    chosenPrizes,
    deliveredPrizes,
    readyToBeDeliveredPrizes,
    prizesInformation,
    null,
    false,
  );
  player.id = playerId;
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'שחקנים', href: `/${params.userId}/players` },
          {
            label: 'עריכת שחקן',
            href: `/${params.userId}/players/${playerId}/edit`,
            active: true,
          },
          {
            label: player.name,
            img: player.image_url,
            active: true,
          },
        ]}
      />
      <EditPlayerForm
        player={player}
        tournaments={tournaments}
        rsvpEnabled={Boolean(rsvpEnabled)}
        userId={params.userId}
        isAdmin={isAdmin}
      />
      <div className="ltr">
        <div style={{ textAlign: 'right', zoom: 1.6 }}>
          טלפון: {player.phone_number}{' '}
        </div>
        <div style={{ textAlign: 'right', zoom: 1.1 }}> {player.notes} </div>
        <div style={{ zoom: 2, textAlign: 'right' }}>
          <h1>
            <b
              style={{
                textAlign: 'right',
                color: formatCurrencyColor(player.balance),
              }}
            >
              קרדיט נוכחי: {formatCurrency(player.balance)}
            </b>
          </h1>
        </div>

        <hr style={{ marginTop: 10, marginBottom: 20 }} />
        <CreateLogForm
          player={player}
          prevPage={`/${params.userId}/players/${player.id}/edit`}
          userId={params.userId}
          isAdmin={isAdmin}
        />

        <hr style={{ marginTop: 20, marginBottom: 20 }} />

        <HistoryTable player={player} isRestrictedData={false} />

        <TournamentsHistoryTable player={player} />

        {prizesEnabled && (
          <div style={{ marginTop: 50 }}>
            <PlayersPrizesPage
              playerPrizes={playerPrizes}
              prizesContents={prizesContents}
            />
          </div>
        )}
      </div>
    </main>
  );
}
