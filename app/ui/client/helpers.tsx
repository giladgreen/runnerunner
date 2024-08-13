import {fetchFinalTablePlayers, fetchPrizesInfo, fetchTournamentByTournamentId} from '@/app/lib/data';
import { PlayerDB, PrizeDB, PrizeInfoDB } from '@/app/lib/definitions';
import OpenGiveCreditModalButton from '@/app/ui/client/OpenGiveCreditModalButton';
import Image from 'next/image';
import OpenSetPrizesCreditModalButton from '@/app/ui/client/OpenSetPrizesCreditModalButton';
import SetPrizeAsDelivered from '@/app/ui/client/SetPrizeAsDelivered';
import OpenConvertPrizeToCreditButton from '@/app/ui/client/OpenConvertPrizeToCreditButton';
import { lusitana } from '@/app/ui/fonts';
import { formatCurrency } from '@/app/lib/utils';
import {
  ArrowLeftOnRectangleIcon,
  CreditCardIcon,
  WalletIcon,
} from '@heroicons/react/24/solid';
import SetPrizeAsReadyToBeDelivered from '@/app/ui/client/SetPrizeAsReadyToBeDelivered';
import SetPrizeAsNotReadyToBeDelivered from '@/app/ui/client/SetPrizeAsNotReadyToBeDelivered';
import ResetPlayersPositionsButton from "@/app/ui/client/ResetPlayersPositionsButton";

export async function getFinalTablePlayersContent(
  date: string,
  tournamentId: string,
  isTournamentsDataPage: boolean,
  userId?: string,
) {

  const tournament = await fetchTournamentByTournamentId(tournamentId);
  if (!tournament) return null;
  const tournamentName = tournament.name;
  const finalTablePlayers = await fetchFinalTablePlayers(tournamentId, date);
  const prizesInformation = await fetchPrizesInfo();

  const showSetPrizesCreditModalButton =
    isTournamentsDataPage && finalTablePlayers.find((p) => !p.hasReceived);
  if (!finalTablePlayers || finalTablePlayers.length === 0) return null;
  const textClass = isTournamentsDataPage
    ? 'text-tournaments-data-page'
    : 'text-on-card';

  return (
    <div
      className="rtl full-width"
      style={{ marginBottom: 30, display: 'flex', marginRight: 0 }}
    >
      <div>
        { !isTournamentsDataPage && <ResetPlayersPositionsButton
            tournamentId={tournamentId}
            tournamentName={tournamentName}
            date={date}
        />}

        {finalTablePlayers.map((finalTablePlayer: PlayerDB) => {
          return (
            <div
              key={finalTablePlayer.id}
              className="highlight-on-hover flex items-center rounded-md border-b bg-white"
              style={{ padding: '4px 0' }}
            >
              <OpenGiveCreditModalButton
                player={finalTablePlayer}
                hasReceived={finalTablePlayer.hasReceived}
                stringDate={date}
                userId={userId}
                tournamentId={tournamentId}
                prizesInformation={prizesInformation}
              />
              <div className={textClass} style={{ margin: '0 2px 0 4px' }}>
                #{finalTablePlayer.position}
              </div>

              {!isTournamentsDataPage && (
                <Image
                  src={finalTablePlayer.image_url}
                  className="zoom-on-hover wide-screen"
                  style={{
                    marginLeft: 10,
                    marginRight: 20,
                    marginTop: 5,
                  }}
                  width={40}
                  height={50}
                  alt={`${finalTablePlayer.name}'s profile picture`}
                />
              )}
              {isTournamentsDataPage && (
                <span className="wide-screen" style={{ marginLeft: 6 }}></span>
              )}

              <div
                className="wide-screen"
                style={{
                  fontSize: isTournamentsDataPage ? 11 : 20,
                  marginLeft: 20,
                }}
              >
                {finalTablePlayer.name}
              </div>

              <div
                className="wide-screen"
                style={{
                  fontSize: isTournamentsDataPage ? 11 : 20,
                  marginRight: 20,
                }}
              >
                {finalTablePlayer.phone_number}
              </div>

              <div
                className="cellular-block rtl"
                style={{ textAlign: 'right', marginRight: 4, marginLeft: 7 }}
              >
                <div>{finalTablePlayer.name}</div>
                <div>{finalTablePlayer.phone_number}</div>
              </div>
            </div>
          );
        })}

        {showSetPrizesCreditModalButton && (
          <OpenSetPrizesCreditModalButton
            date={date}
            tournamentId={tournamentId}
            players={finalTablePlayers}
            tournamentName={tournamentName}
          />
        )}
      </div>
      {isTournamentsDataPage && (
        <div
          className="wide-screen"
          style={{ width: '40%', textAlign: 'center', margin: '0 20px' }}
        >
          <div style={{ textAlign: 'right' }}>
            <Image
              src={finalTablePlayers[0].image_url}
              className="zoom-on-hover"
              style={{
                marginTop: 20,
                marginLeft: 20,
                marginRight: 0,
                border: '3px solid black',
              }}
              width={100}
              height={120}
              alt={`${finalTablePlayers[0].name}'s profile picture`}
            />
            <b style={{ textAlign: 'right' }}>{finalTablePlayers[0].name}</b>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getPlayersPrizesContent(
  playersPrizes: PrizeDB[],
  prizesInformation: PrizeInfoDB[],
  tournamentId: string | null,
  personal?: boolean,
  userId?: string,
  currentTournament?: boolean,
) {
  if (!playersPrizes || playersPrizes.length === 0) {
    if (currentTournament) {
      return null;
    }
    return <span style={{ margin: '0 5px' }}> אין פרסים </span>;
  }

  return (
    <div className="full-width" style={{ marginBottom: 30 }}>
      {playersPrizes.map((playersPrize: PrizeDB) => {
        return (
          <div key={playersPrize.id}>
            <div
              className="wide-screen prize-row border-b"
              style={{ padding: 5 }}
            >
              <div className="rtl flex w-full items-center rounded-md ">
                <span style={{ marginLeft: 25, textAlign: 'right' }}>
                  {playersPrize!.tournament}
                </span>
                {!personal && (
                  <span style={{ marginLeft: 25, textAlign: 'right' }}>
                    {playersPrize!.player!.name}
                  </span>
                )}
                {!personal && (
                  <span style={{ marginLeft: 25, textAlign: 'right' }}>
                    {playersPrize!.player!.phone_number}
                  </span>
                )}
                <span style={{ marginLeft: 25, textAlign: 'right' }}>
                  {playersPrize!.prize}
                </span>
              </div>

              {!personal &&
                !currentTournament &&
                !playersPrize.delivered &&
                playersPrize.ready_to_be_delivered && (
                  <SetPrizeAsDelivered id={playersPrize.id} />
                )}
              {!personal &&
                !currentTournament &&
                !playersPrize.delivered &&
                !playersPrize.ready_to_be_delivered && (
                  <SetPrizeAsReadyToBeDelivered id={playersPrize.id} />
                )}
              {!personal &&
                !currentTournament &&
                !playersPrize.delivered &&
                playersPrize.ready_to_be_delivered && (
                  <SetPrizeAsNotReadyToBeDelivered id={playersPrize.id} />
                )}
              {!personal && (
                <div style={{ margin: 0 }}>
                  <OpenConvertPrizeToCreditButton
                    prizeId={playersPrize.id}
                    prizeName={playersPrize.prize}
                    userId={userId}
                    prizesInformation={prizesInformation}
                    tournamentId={tournamentId}
                  />
                </div>
              )}
            </div>
            <div className="cellular prize-row border-b">
              <div>
                <div>
                  <span style={{ marginLeft: 1 }}>
                    {playersPrize!.tournament}
                  </span>
                </div>
                {!personal && (
                  <div className="flex">
                    <span>{playersPrize!.player!.phone_number}</span>
                    <span style={{ marginLeft: 5 }}>
                      {playersPrize!.player!.name}
                    </span>
                  </div>
                )}
              </div>
              <div>{playersPrize!.prize}</div>

              {!personal &&
                !currentTournament &&
                !playersPrize.delivered &&
                playersPrize.ready_to_be_delivered && (
                  <SetPrizeAsDelivered id={playersPrize.id} />
                )}
              {!personal &&
                !currentTournament &&
                !playersPrize.delivered &&
                !playersPrize.ready_to_be_delivered && (
                  <SetPrizeAsReadyToBeDelivered id={playersPrize.id} />
                )}
              {!personal &&
                !currentTournament &&
                !playersPrize.delivered &&
                playersPrize.ready_to_be_delivered && (
                  <SetPrizeAsNotReadyToBeDelivered id={playersPrize.id} />
                )}
              {!personal && (
                <div style={{ margin: 0 }}>
                  <OpenConvertPrizeToCreditButton
                    prizeId={playersPrize.id}
                    prizeName={playersPrize.prize}
                    userId={userId}
                    prizesInformation={prizesInformation}
                    tournamentId={tournamentId}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export async function getPlayersPrizesContents(
    chosenPrizes: PrizeDB[],
    deliveredPrizes: PrizeDB[],
    readyToBeDeliveredPrizes: PrizeDB[],
    prizesInformation: PrizeInfoDB[],
    tournamentId: string | null,
    personal?: boolean,
    userId?: string,
    currentTournament?: boolean,
) {
  const chosenPrizesContent = (await getPlayersPrizesContent(
      chosenPrizes,
      prizesInformation,
      tournamentId,
      personal,
      userId,
      currentTournament
  )) as JSX.Element;
  const deliveredPrizesContent = (await getPlayersPrizesContent(
      deliveredPrizes,
      prizesInformation,
      tournamentId,
      personal,
      userId,
      currentTournament
  )) as JSX.Element;
  const readyToBeDeliveredPrizesContent = (await getPlayersPrizesContent(
      readyToBeDeliveredPrizes,
      prizesInformation,
      tournamentId,
      personal,
      userId,
      currentTournament
  )) as JSX.Element;

  return {chosenPrizesContent, deliveredPrizesContent, readyToBeDeliveredPrizesContent}
}


export function getDayIncome(dateItem: {
  total: number;
  credit: number;
  cash: number;
  wire: number;
}) {
  return (
    <div
      className={`${lusitana.className} truncate  bg-white  text-center text-2xl`}
    >
      <div>
        <div
          className="tournaments-total-income-font"
          style={{ marginBottom: 10 }}
        >
          <b>{formatCurrency(dateItem.total)}</b>
        </div>
        <div className="cellular-block tournaments-data-table-income-cell">
          <div>
            מזומן:
            {formatCurrency(dateItem.cash)}
          </div>
          <div>
            העברה:
            {formatCurrency(dateItem.wire)}
          </div>
          <div>
            קרדיט:
            {formatCurrency(dateItem.credit)}
          </div>
        </div>

        <div className="wide-screen card-table tournaments-data-table-income-cell full-width">
          <table
            style={{ fontSize: 15 }}
            className="full-width"
            cellSpacing="0"
            cellPadding="0"
          >
            <thead>
              <tr>
                <th
                  scope="col"
                  className="table-text-item"
                  data-tooltip="קרדיט"
                  title="קרדיט"
                >
                  <b>{formatCurrency(dateItem.credit)}</b>
                </th>
                <th
                  scope="col"
                  className="table-text-item"
                  data-tooltip="מזומן"
                  title="מזומן"
                >
                  <b>{formatCurrency(dateItem.cash)}</b>
                </th>
                <th
                  scope="col"
                  className="table-text-item"
                  data-tooltip="העברה"
                  title="העברה"
                >
                  <b>{formatCurrency(dateItem.wire)}</b>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="col">
                  <div
                    className="table-item"
                    data-tooltip="קרדיט"
                    title="קרדיט"
                  >
                    <CreditCardIcon className="h-6 w-9 text-gray-700" />
                  </div>
                </th>
                <th scope="col">
                  <div
                    className="table-item"
                    data-tooltip="מזומן"
                    title="מזומן"
                  >
                    <WalletIcon className="h-6 w-9 text-gray-700" />
                  </div>
                </th>
                <th scope="col">
                  <div
                    className="table-item"
                    data-tooltip="העברה"
                    title="העברה"
                  >
                    <ArrowLeftOnRectangleIcon className="h-6 w-9 text-gray-700" />
                  </div>
                </th>
              </tr>
              <tr>
                <th scope="col" style={{ marginTop: -5 }}>
                  <div
                    className="table-item smaller-test"
                    data-tooltip="קרדיט"
                    title="קרדיט"
                  >
                    קרדיט
                  </div>
                </th>
                <th scope="col">
                  <div
                    className="table-item smaller-test"
                    data-tooltip="מזומן"
                    title="מזומן"
                  >
                    מזומן
                  </div>
                </th>
                <th scope="col">
                  <div
                    className="table-item smaller-test"
                    data-tooltip="העברה"
                    title="העברה"
                  >
                    העברה
                  </div>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
