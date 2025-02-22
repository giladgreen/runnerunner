import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import * as cache from './cache';
import {
  BugDB,
  BuyInDB, ChangeLogDB,
  Counts,
  FeatureFlagDB,
  ImageDB,
  LogDB,
  PlayerDB,
  PrizeDB,
  PrizeInfoDB,
  RSVPDB,
  TournamentDB,
  TournamentsAdjustmentsDB,
  UserDB,
  WinnerDB
} from './definitions';
import { sumArrayByProp, positionComparator, usersComparator } from './utils';
import { redirect } from 'next/navigation';
import {
  getCurrentDate,
  getDayOfTheWeek,
  getTodayShortDate,
} from './serverDateUtils';

const DEBUG_MODE = process.env.NODE_ENV !== 'development';

const ITEMS_PER_PAGE = 56;
const TOP_COUNT = 8;
const CASH = 'מזומן';
const CREDIT = 'קרדיט';
const WIRE = 'העברה';
const CREDIT_BY_OTHER = 'קרדיט מאחרים';
let start = 0;
function methodStart() {
  start = getCurrentDate().getTime();
}
function methodEnd(methodName: string, error?: string) {
  const now = getCurrentDate().getTime();
  const diff = now - start;

  if (error) {
    console.error(
      'Method End',
      methodName,
      '      ',
      diff,
      'milli',
      'error:',
      error,
    );
    return;
  }

  if (diff > 1000) {
    console.error('Method End', methodName, '      ', diff, 'milli');
  } else if (diff > 600) {
    DEBUG_MODE && console.warn('Method End', methodName, '      ', diff, 'milli');
  } else {
    DEBUG_MODE && console.info('Method End', methodName, '      ', diff, 'milli');
  }
}

async function updateUserLastLoggedInDate(phone_number: string,){
  await sql<UserDB>`UPDATE users SET last_logged_in_at = now() WHERE phone_number=${phone_number}`;
  const user =  (await sql<UserDB>`SELECT * FROM users WHERE phone_number=${phone_number}`).rows[0];
  cache.saveUser(user);
}

async function getAllFlags(): Promise<FeatureFlagDB[]> {
  const flagsFromCache = await cache.getFF();
  if (flagsFromCache) {
    return flagsFromCache;
  }

  const data = await sql<FeatureFlagDB>`SELECT * FROM feature_flags`;
  await cache.saveFF(data.rows);
  return data.rows;
}
async function getAllBugs() {
  const data = await sql<BugDB>`SELECT * FROM bugs`;
  return data.rows;
}
async function getAllChangeLogs() {
  const data = await sql<ChangeLogDB>`SELECT * FROM change_log ORDER BY changed_at DESC`;
  return data.rows.map((log) => ({
    ...log,
    before: log.changed_entity_before ? JSON.parse(log.changed_entity_before) : {},
    after: log.changed_entity_after ? JSON.parse(log.changed_entity_after) : {}
  }));
}
async function getAllPrizes() {
  const prizesResult =
    await sql<PrizeDB>`SELECT * FROM prizes ORDER BY tournament DESC`;
  return prizesResult.rows;
}
async function getAllRsvps() {
  const rsvpResults = await sql<RSVPDB>`SELECT * FROM rsvp;`;
  return rsvpResults.rows;
}

async function getUserById(userId: string) {
  const resultFromCache = await cache.getUserById(userId);

  if (resultFromCache) {
    updateUserLastLoggedInDate(resultFromCache.phone_number)
    return resultFromCache;
  }

  const user = (await sql<UserDB>`SELECT * FROM users WHERE id = ${userId}`)
    .rows[0];

  updateUserLastLoggedInDate(user.phone_number)

  return user;
}

async function getPlayerTournamentsHistory(phoneNumber: string) {
  const data =
    await sql<WinnerDB>`SELECT * FROM winners WHERE winners LIKE  ${`%${phoneNumber}%`};`;
  const items = data.rows;
  return items.map((item) => {
    const winners = JSON.parse(item.winners);
    const place = winners[phoneNumber]?.position;

    return {
      date: item.date,
      tournament_name: item.tournament_name,
      tournament_id: item.tournament_id,
      place,
    };
  });
}
async function getPlayerById(playerId: string) {
  const playerResult = await sql<PlayerDB>`SELECT * FROM players AS P 
JOIN (SELECT phone_number, sum(change) AS balance FROM history WHERE type = 'credit_to_other' OR type ='credit' OR type ='prize' GROUP BY phone_number) AS H
ON P.phone_number = H.phone_number
WHERE P.id = ${playerId};`;

  const player = playerResult.rows[0];
  if (!player) {
    return null;
  }
  player.balance = Number(player.balance);
  const [rsvpResults, historyData] = await Promise.all([
    sql<RSVPDB>`SELECT * FROM rsvp WHERE phone_number = ${player.phone_number}`,
    sql<LogDB>`SELECT * FROM history WHERE phone_number = ${player.phone_number} ORDER BY history.updated_at asc;`,
  ]);

  player.historyLog = historyData.rows;
  player.rsvps = rsvpResults.rows.map(({ date, tournament_id }) => ({
    date,
    tournamentId: tournament_id,
  }));

  return player;
}

async function getPlayerRsvpsForDate(playerPhoneNumber: string, date: string) {
  const rsvpResults =
    await sql<RSVPDB>`SELECT * FROM rsvp WHERE date = ${date} AND phone_number = ${playerPhoneNumber};`;
  return rsvpResults.rows;
}

async function getPlayerByPhoneNumber(phoneNumber: string) {
  const playersResult = await sql<PlayerDB>`SELECT * FROM players AS P 
JOIN (SELECT phone_number, sum(change) AS balance FROM history WHERE phone_number = ${phoneNumber}  AND (type = 'credit_to_other' OR type ='credit' OR type ='prize') GROUP BY phone_number) AS H
ON P.phone_number = H.phone_number
WHERE P.phone_number = ${phoneNumber};`;

  const player = playersResult.rows[0] ?? null;
  if (player) {
    player.balance = Number(player.balance);
  }
  return player;
}

async function getTodayTournaments(day?: string) {
  const dayOfTheWeek = day ?? getDayOfTheWeek();
  const todayTournamentResult =
    await sql<TournamentDB>`SELECT * FROM tournaments WHERE day = ${dayOfTheWeek}`;

  return todayTournamentResult.rows;
}

async function getAllTournaments(includeDeleted?: boolean) {
  let tournaments = (
    await sql<TournamentDB>`SELECT * FROM tournaments ORDER BY i ASC`
  ).rows;

  if (includeDeleted) {
    const deletedTournamentsResults = (
      await sql<TournamentDB>`SELECT * FROM deleted_tournaments ORDER BY i ASC`
    ).rows;

    tournaments = [...tournaments, ...deletedTournamentsResults].sort((a, b) =>
      (a.i ?? 1) - (b.i ?? 1) ? -1 : 1,
    );
  }

  return tournaments;
}
export async function getTodayTournamentsAdjustments() {
  const todayTournaments = await getTodayTournaments();
  const todayTournamentsIds = todayTournaments.map(({ id }) => id);
  if (todayTournamentsIds.length === 0) {
    return [];
  }
  const todayTournamentsAdjustments =
    await sql<TournamentsAdjustmentsDB>`SELECT * FROM tournaments_adjustments WHERE updated_at > now() - interval '12 hour';`;

  return todayTournamentsAdjustments.rows.filter((tournamentsAdjustment) =>
    todayTournamentsIds.includes(tournamentsAdjustment.tournament_id),
  );
}

async function getTournamentWinnersRecord(tournamentId: string, date: string) {
  const winnersResult =
    await sql<WinnerDB>`SELECT * FROM winners WHERE date=${date} AND tournament_id = ${tournamentId}`;
  return winnersResult.rows[0];
}

async function getTournamentWinnersRecordsByDate(date: string) {
  const winnersResult =
    await sql<WinnerDB>`SELECT * FROM winners WHERE date = ${date}`;
  return winnersResult.rows;
}

export async function _getAllImages() {
  const images = await sql<ImageDB>`
            SELECT * 
            FROM images`;

  return images.rows;
}
export async function getPlayerHistory(playerPhoneNumber: string) {
  const historyData = await sql<LogDB>`
            SELECT * 
            FROM history
            WHERE phone_number = ${playerPhoneNumber}
            ORDER BY updated_at ASC;
          `;

  return historyData.rows;
}
async function getTodayHistory() {
  const todayHistoryResults =
    await sql<LogDB>`SELECT * FROM history WHERE change <= 0 AND type != 'prize' AND updated_at > now() - interval '12 hour'  ORDER BY updated_at DESC`;
  return todayHistoryResults.rows;
}

async function getAllHistory() {
  const todayHistoryResults =
    await sql<LogDB>`SELECT * FROM history ORDER BY updated_at DESC`;
  return todayHistoryResults.rows;
}

async function getBuyInsHistory(limit: number, minSum: number) {
  const todayHistoryResults =
    await sql<BuyInDB>`select * FROM (SELECT phone_number, SUM(change), COUNT(*) FROM history WHERE change < 0 AND type in ('cash','wire') GROUP BY phone_number) as A WHERE A.sum < ${minSum} ORDER BY A.sum LIMIT ${limit}`;
  return todayHistoryResults.rows;
}

export async function getAllPlayers() {
  const todayDate = getTodayShortDate();

  const playersPromise = sql<PlayerDB>`SELECT * FROM players AS P 
 JOIN (SELECT phone_number, sum(change) AS balance FROM history WHERE type = 'credit_to_other' OR type ='credit' OR type ='prize' GROUP BY phone_number) AS H
    ON P.phone_number = H.phone_number`;

  const [
    allPlayersResult,
    rsvpResults,
    tournamentsAdjustmentsLogsResults,
    todayHistoryUnfiltered,
    winnersRecords,
    allUsers,
  ] = await Promise.all([
    playersPromise,
    sql<RSVPDB>`SELECT * FROM rsvp;`,
    sql<TournamentsAdjustmentsDB>`SELECT * FROM tournaments_adjustments WHERE updated_at > now() - interval '12 hour';`,
    getTodayHistory(),
    getTournamentWinnersRecordsByDate(todayDate),
    getAllUsers(),
  ]);
  const allPlayers = allPlayersResult.rows;
  const tournamentsAdjustmentsLogs = tournamentsAdjustmentsLogsResults.rows;
  const allRsvps = rsvpResults.rows;

  const todayHistory = todayHistoryUnfiltered.filter(
    ({ type }) => type != 'prize' && type != 'credit_to_other',
  );

  const winnersObjects = winnersRecords.map((winnersRecord) =>
    winnersRecord ? JSON.parse(winnersRecord.winners) : {},
  );

  allPlayers.forEach((player) => {
    const user = allUsers.find(
      ({ phone_number }) => phone_number === player.phone_number,
    );
    player.hasUser = Boolean(user);
    player.balance = Number(player.balance);
    const rsvps = allRsvps.filter(
      ({ phone_number }) => phone_number === player.phone_number,
    );
    player.rsvps = rsvps.map(({ date, tournament_id }) => ({
      date,
      tournamentId: tournament_id,
    }));

    player.rsvpForToday = rsvps.find(
      ({ date }) => date === todayDate,
    )?.tournament_id;
    //TODO: get all the tournamt adjusment logs for this day, and if any of them had the history log of the current player add them
    const playerItems = todayHistory.filter(
      ({ phone_number, change, type }) =>
        phone_number === player.phone_number &&
        (change < 0 || type === 'credit_by_other'),
    ) as LogDB[];

    const winnersObject = winnersObjects.find(
      (winnersObject) => winnersObject[player.phone_number],
    );
    player.position = winnersObject
      ? winnersObject[player.phone_number]?.position || 0
      : 0;

    player.arrived =
      playerItems.length > 0 ? playerItems[0].tournament_id : undefined;
    player.entries = playerItems.length;
    const lastItem = playerItems[0];
    player.undoEntriesTooltipText = '';

    const map = {
      cash: CASH,
      wire: WIRE,
      credit: CREDIT,
      credit_by_other: CREDIT_BY_OTHER,
    };

    if (lastItem) {
      let number = lastItem.change * -1;
      if (number === 0) {
        try {
          number = Number(lastItem.note.split('₪')[0].replace(/[^\d]+/g, ''));
        } catch (_e) {
          number = 0;
        }
      }
      const adjustment = tournamentsAdjustmentsLogs.find(
        (tournamentsAdjustment) =>
          tournamentsAdjustment.history_log_id === lastItem.id,
      );
      // @ts-ignore
      let type = map[lastItem.type as string] as string;
      if (adjustment) {
        number += adjustment.change;
        // @ts-ignore
        type += `/${map[adjustment.type as string]}`;
      }
      player.undoEntriesTooltipText = `ביטול הכניסה האחרונה של ₪${number}`;
      // @ts-ignore
      player.undoEntriesTooltipText += ` ב${type}`;
    }

    player.entriesTooltipText = playerItems.reverse().map((item) => {
      let number = item.change * -1;
      if (number === 0) {
        try {
          number = Number(item.note.split('₪')[0].replace(/[^\d]+/g, ''));
        } catch (_e) {
          number = 0;
        }
      }
      const adjustment = tournamentsAdjustmentsLogs.find(
        (tournamentsAdjustment) =>
          tournamentsAdjustment.history_log_id === item.id,
      );
      // @ts-ignore
      let type = map[item.type as string] as string;
      if (adjustment) {
        number += adjustment.change;
        // @ts-ignore
        type += `/${map[adjustment.type as string]}`;
      }
      let result = ` ₪${number}`;
      // @ts-ignore
      result += ` ב${type}`;

      return result;
    });

    player.name = player.name.trim();
    player.historyLog = playerItems;
  });

  return allPlayers;
}

async function getAllUsers() {
  const usersResult = await sql<UserDB>`SELECT * FROM users`;

  return usersResult.rows;
}

async function getPlayersByPhoneNumbers(phoneNumbers: string[]) {
  const results = await Promise.all(
    phoneNumbers.map(
      (phoneNumber) =>
        sql<PlayerDB>`SELECT * FROM players WHERE phone_number=${phoneNumber}`,
    ),
  );

  return results.map((res) => res.rows).flat();
}

async function getTopMVPPlayers() {
  const players = await sql<PlayerDB>`SELECT * FROM players AS P 
 JOIN (SELECT phone_number, sum(change) AS balance FROM history WHERE type = 'credit_to_other' OR type ='credit' OR type ='prize' GROUP BY phone_number) AS H
    ON P.phone_number = H.phone_number WHERE H.balance > 0 ORDER BY H.balance DESC LIMIT ${TOP_COUNT}`;

  return players.rows;
}

async function getTopDebtPlayers() {
  const players = await sql<PlayerDB>`SELECT * FROM players AS P 
 JOIN (SELECT phone_number, sum(change) AS balance FROM history WHERE type = 'credit_to_other' OR type ='credit' OR type ='prize' GROUP BY phone_number) AS H
    ON P.phone_number = H.phone_number WHERE H.balance < 0 ORDER BY H.balance ASC LIMIT ${TOP_COUNT}`;

  return players.rows;
}

async function fetchTopPlayers(
  players: PlayerDB[],
  allRsvps: RSVPDB[] = [],
  todayHistory: LogDB[] = [],
) {
  try {
    const todayDate = getTodayShortDate();

    players.forEach((player) => {
      player.balance = Number(player.balance);
      player.arrived = todayHistory.find(
        ({ phone_number, change, type }) =>
          phone_number === player.phone_number &&
          (change < 0 || type === 'credit_by_other'),
      )?.tournament_id;

      const rsvps = allRsvps.filter(
        ({ phone_number }) => phone_number === player.phone_number,
      );

      player.rsvps = rsvps.map(({ date, tournament_id }) => ({
        date,
        tournamentId: tournament_id,
      }));

      player.rsvpForToday = rsvps.find(
        ({ date }) => date === todayDate,
      )?.tournament_id;
    });
    return players;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetchTopPlayers.');
  }
}

async function fetchXPlayers(x: string, getXPlayers: () => PlayerDB[]) {
  methodStart();
  noStore();
  try {
    const [players, todayHistoryUnfiltered, rsvp, allUsers] = await Promise.all([
      getXPlayers(),
      getTodayHistory(),
      getAllRsvps(),
      getAllUsers()
    ]);
    const todayHistory = todayHistoryUnfiltered.filter(
      ({ type }) => type != 'prize' && type != 'credit_to_other',
    );

    const result = await fetchTopPlayers(players, rsvp, todayHistory);
    result.forEach((player) => {
      const user = allUsers.find(
        ({ phone_number }) => phone_number === player.phone_number,
      );
      player.hasUser = Boolean(user);
    });
    methodEnd(x);
    return result;
  } catch (e) {
    // @ts-ignore
    methodEnd(`${x} with error`, error?.message);
    throw new Error(`Failed to ${x}.`);
  }
}

function getPlayerWithExtraData(
  player: PlayerDB,
  phoneAndBalance: { phone_number: string; balance: string }[],
): PlayerDB {
  return {
    ...player,
    balance:
      Number(
        phoneAndBalance.find(
          ({ phone_number }) => phone_number === player.phone_number,
        )?.balance,
      ) || 0,
  };
}
async function getSortedPlayers(
  query: string,
  sortBy: string,
  currentPage: number,
): Promise<PlayerDB[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const phoneAndBalance = (
    await sql`SELECT phone_number,sum(change) AS balance FROM history WHERE type = 'credit_to_other' OR type ='credit' OR type ='prize' GROUP BY phone_number`
  ).rows as { phone_number: string; balance: string }[];

  let results: PlayerDB[];
  switch (sortBy) {
    case 'name':
      results = (
        await sql<PlayerDB>`
        SELECT * FROM players WHERE name::text ILIKE ${`%${query}%`} OR phone_number::text ILIKE ${`%${query}%`} OR notes::text ILIKE ${`%${query}%`}
        ORDER BY name ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`
      ).rows.map((player) => getPlayerWithExtraData(player, phoneAndBalance));
      break;
    case 'balance':
      results = (
        await sql<PlayerDB>`
        SELECT * FROM players WHERE name::text ILIKE ${`%${query}%`} OR phone_number::text ILIKE ${`%${query}%`} OR notes::text ILIKE ${`%${query}%`}`
      ).rows
        .map((player) => getPlayerWithExtraData(player, phoneAndBalance))
        .sort((a, b) => b.balance - a.balance)
        .slice(offset, offset + ITEMS_PER_PAGE);
      break;
    case 'phone':
      results = (
        await sql<PlayerDB>`
        SELECT * FROM players WHERE name::text ILIKE ${`%${query}%`} OR phone_number::text ILIKE ${`%${query}%`} OR notes::text ILIKE ${`%${query}%`}
        ORDER BY phone_number ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`
      ).rows.map((player) => getPlayerWithExtraData(player, phoneAndBalance));
      break;
    case 'notes':
      results = (
        await sql<PlayerDB>`
        SELECT * FROM players WHERE name::text ILIKE ${`%${query}%`} OR phone_number::text ILIKE ${`%${query}%`} OR notes::text ILIKE ${`%${query}%`}
        ORDER BY notes DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`
      ).rows.map((player) => getPlayerWithExtraData(player, phoneAndBalance));
      break;
    default:
      results = (
        await sql<PlayerDB>`
        SELECT * FROM players WHERE name::text ILIKE ${`%${query}%`} OR phone_number::text ILIKE ${`%${query}%`} OR notes::text ILIKE ${`%${query}%`}
        ORDER BY updated_at DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`
      ).rows.map((player) => getPlayerWithExtraData(player, phoneAndBalance));
  }

  return results;
}

export async function fetchPrizesInfo() {
  const prizes =
    await sql<PrizeInfoDB>`SELECT * FROM prizes_info ORDER BY name`;

  return prizes.rows;
}

/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////

export async function fetchMVPPlayers() {
  return fetchXPlayers(
    'fetchMVPPlayers',
    getTopMVPPlayers as unknown as () => PlayerDB[],
  );
}

export async function fetchDebtPlayers() {
  return fetchXPlayers(
    'fetchDebtPlayers',
    getTopDebtPlayers as unknown as () => PlayerDB[],
  );
}

export async function fetchGeneralPlayersCardData() {
  methodStart();
  noStore();

  try {
    const allPlayers = await getAllPlayers();

    const totalNumberOfPlayers = allPlayers.length;
    const playersWithDebt = allPlayers.filter((player) => player.balance < 0);
    const numberOfPlayersWithDebt = playersWithDebt.length;
    const totalRunnerDebt = sumArrayByProp(
      allPlayers.filter((player) => player.balance > 0),
      'balance',
    );

    const totalPlayersDebt = sumArrayByProp(playersWithDebt, 'balance');
    methodEnd('fetchGeneralPlayersCardData');
    return {
      totalNumberOfPlayers,
      numberOfPlayersWithDebt,
      totalRunnerDebt,
      totalPlayersDebt,
    };
  } catch (error) {
    // @ts-ignore
    methodEnd('fetchGeneralPlayersCardData with error', error?.message);
    throw new Error('Failed to fetchGeneralPlayersCardData.');
  }
}

export async function fetchWhalePlayersData(): Promise<PlayerDB[]> {
  const buyInHistory = await getBuyInsHistory(8, -2000);

  const playersPhoneNumbers = buyInHistory.map(
    ({ phone_number }) => phone_number,
  );
  const [players, todayHistory, allRsvps] = await Promise.all([
    getPlayersByPhoneNumbers(playersPhoneNumbers),
    getTodayHistory(),
    getAllRsvps(),
  ]);

  const todayDate = getTodayShortDate();

  players.forEach((player) => {
    player.historyEntriesSum = Number(
      buyInHistory.find((p) => p.phone_number === player.phone_number)?.sum ||
        0,
    );

    player.historyEntriesCount = Number(
      buyInHistory.find((p) => p.phone_number === player.phone_number)?.count ||
        0,
    );

    player.balance = Number(player.balance);
    player.arrived = todayHistory.find(
      ({ phone_number, change, type }) =>
        phone_number === player.phone_number &&
        (change < 0 || type === 'credit_by_other'),
    )?.tournament_id;

    const rsvps = allRsvps.filter(
      ({ phone_number }) => phone_number === player.phone_number,
    );

    player.rsvps = rsvps.map(({ date, tournament_id }) => ({
      date,
      tournamentId: tournament_id,
    }));

    player.rsvpForToday = rsvps.find(
      ({ date }) => date === todayDate,
    )?.tournament_id;
  });

  return players;
}
export async function fetchRSVPAndArrivalData(dayOfTheWeek: string) {
  methodStart();
  noStore();
  try {
    const [
      allPlayers,
      todayHistoryWithZero,
      allTournaments,
      todayTournamentsAdjustments,
    ] = await Promise.all([
      getAllPlayers(),
      getTodayHistory(),
      getAllTournaments(),
      getTodayTournamentsAdjustments(),
    ]);

    methodEnd('fetchRSVPAndArrivalData');
    const todayTournaments = allTournaments.filter(
      (t) => t.day === dayOfTheWeek,
    );

    return {
      todayTournaments: todayTournaments.map((t) => {
        const tournamentAdjustments = todayTournamentsAdjustments.filter(
          (tournamentsAdjustment) =>
            tournamentsAdjustment.tournament_id === t.id,
        );
        const cashAdjustments = tournamentAdjustments.filter(
          (tournamentsAdjustment) => tournamentsAdjustment.type === 'cash',
        );
        const creditAdjustments = tournamentAdjustments.filter(
          (tournamentsAdjustment) => tournamentsAdjustment.type === 'credit',
        );
        const wireAdjustments = tournamentAdjustments.filter(
          (tournamentsAdjustment) => tournamentsAdjustment.type === 'wire',
        );

        const totalCashAdjustments = sumArrayByProp(cashAdjustments, 'change');
        const totalCreditAdjustments = sumArrayByProp(
          creditAdjustments,
          'change',
        );
        const totalWireAdjustments = sumArrayByProp(wireAdjustments, 'change');

        const rsvpForToday = allPlayers.filter(
          (player) => t.id === player.rsvpForToday,
        ).length;

        const todayHistory = todayHistoryWithZero.filter(
          (item) =>
            (item.change < 0 || item.type === 'credit_by_other') &&
            item.tournament_id === t.id,
        );

        const todayHistoryFiltered = todayHistory.filter(
          (item) => item.type !== 'credit_to_other',
        );

        const reEntriesCount =
          todayHistoryFiltered.length -
          Array.from(
            new Set(
              todayHistoryFiltered.map(({ phone_number }) => phone_number),
            ),
          ).length;

        const todayCreditIncome =
          totalCreditAdjustments +
          Math.abs(
            sumArrayByProp(
              todayHistory.filter(
                ({ type }) => type === 'credit' || type === 'credit_to_other',
              ),
              'change',
            ),
          );
        const todayCashIncome =
          totalCashAdjustments +
          Math.abs(
            sumArrayByProp(
              todayHistory.filter(({ type }) => type === 'cash'),
              'change',
            ),
          );
        const todayTransferIncome =
          totalWireAdjustments +
          Math.abs(
            sumArrayByProp(
              todayHistory.filter(({ type }) => type === 'wire'),
              'change',
            ),
          );
        //TODO: take extra data from new table here
        const arrivedToday = Array.from(
          new Set(todayHistoryFiltered.map(({ phone_number }) => phone_number)),
        ).length;

        return {
          ...t,
          rsvpForToday,
          arrivedToday,
          todayCreditIncome,
          todayCashIncome,
          todayTransferIncome,
          reEntriesCount,
          todayTournamentMaxPlayers: t.rsvp_required ? t.max_players : null,
        } as TournamentDB;
      }),
    };
  } catch (error) {
    // @ts-ignore
    methodEnd('fetchRSVPAndArrivalData with error', error?.message);

    throw new Error('Failed to fetchRSVPAndArrivalData.');
  }
}

export async function fetchFinalTablePlayers(
  tournamentId: string,
  date: string,
) {
  methodStart();
  noStore();
  try {
    const winnersResult = await getTournamentWinnersRecord(tournamentId, date);

    const winnersObject = winnersResult
      ? JSON.parse(winnersResult.winners)
      : {};
    const winnersPhoneNumbers = Object.keys(winnersObject);
    const allPlayers = (await getAllPlayers())
      .filter((player) => winnersPhoneNumbers.includes(player.phone_number))
      .map((player) => {
        const playerObj = winnersObject[player.phone_number];
        player.position = playerObj?.position || 0;
        player.hasReceived = Boolean(playerObj?.hasReceived);
        player.creditWorth = Number(playerObj?.creditWorth);
        return player;
      });

    const result = allPlayers
      .filter((player) => player.position > 0)
      .sort(positionComparator);
    methodEnd('fetchFinalTablePlayers');
    return result;
  } catch (error) {
    // @ts-ignore
    methodEnd('fetchFinalTablePlayers with error', error?.message);
    throw new Error('Failed to fetchFinalTablePlayers.');
  }
}

export async function fetchTodayPlayersPhoneNumbers() {
  const todayArrivals = (await getTodayHistory()).map(
    ({ phone_number }) => phone_number,
  );
  const todayRsvps = (await getAllPlayers())
    .filter((p) => p.rsvpForToday)
    .map((p) => p.phone_number);
  return Array.from(new Set([...todayArrivals, ...todayRsvps]));
}

export async function fetchPlayersPrizes(playerPhoneNumber?: string) {
  methodStart();
  noStore();
  try {
    const [prizes, players] = await Promise.all([
      getAllPrizes(),
      getAllPlayers(),
    ]);

    prizes.forEach((prize) => {
      const player = players.find((p) => p.phone_number === prize.phone_number);
      if (player) {
        prize.player = player;
      } else {
        console.error('>>> prize is missing player', prize);
      }
    });
    const result = !playerPhoneNumber
      ? prizes.filter((prize) => Boolean(prize.player))
      : prizes.filter((prize) => prize.phone_number === playerPhoneNumber);
    methodEnd('fetchPlayersPrizes');

    return {
      chosenPrizes: result.filter(
        (p) => !p.delivered && !p.ready_to_be_delivered,
      ),
      readyToBeDeliveredPrizes: result.filter(
        (p) => !p.delivered && p.ready_to_be_delivered,
      ),
      deliveredPrizes: result.filter((p) => p.delivered),
    };
  } catch (error) {
    // @ts-ignore
    methodEnd('fetchPlayersPrizes with error');
    throw new Error('Failed to fetchPlayersPrizes.');
  }
}

export async function fetchFilteredPlayers(
  query: string,
  currentPage: number,
  sortBy: string = 'updated_at',
) {
  methodStart();
  noStore();

  try {
    const playersResultPromise = getSortedPlayers(query, sortBy, currentPage);

    const playersHistoryCountResultPromise = sql<Counts>`
      SELECT
       phone_number, 
       count(phone_number) 
        FROM history 
         GROUP BY phone_number
    `;

    const [playersHistoryCountResult, players, allRsvps, allUsers] =
      await Promise.all([
        playersHistoryCountResultPromise,
        playersResultPromise,
        getAllRsvps(),
        getAllUsers(),
      ]);
    const playersHistoryCount = playersHistoryCountResult.rows;

    const todayDate = getTodayShortDate();
    players.forEach((player) => {
      const user = allUsers.find(
        ({ phone_number }) => phone_number === player.phone_number,
      );
      player.hasUser = Boolean(user);

      player.balance = Number(player.balance);

      const historyCount = playersHistoryCount.find(
        ({ phone_number }) => phone_number === player.phone_number,
      );
      player.historyCount = historyCount?.count ?? 0;

      console.log('#### player:', player)
      console.log('#### allRsvps:', allRsvps)

      const rsvps = allRsvps ? allRsvps.filter(
        ({ phone_number }) => phone_number === player.phone_number,
      ) : [];
      console.log('#### rsvps:', rsvps);

      player.rsvps = rsvps ? rsvps.map(({ date, tournament_id }) => ({
        date,
        tournamentId: tournament_id,
      })) : [];

      player.rsvpForToday = rsvps ? rsvps.find(
        ({ date }) => date === todayDate,
      )?.tournament_id : undefined;
    });
    methodEnd('fetchFilteredPlayers');
    return players;
  } catch (error) {
    // @ts-ignore
    methodEnd('fetchFilteredPlayers with error', error?.message);
    throw new Error('Failed to fetchFilteredPlayers.');
  }
}
export async function fetchPlayersPagesCount(query: string) {
  methodStart();
  noStore();
  try {
    const count = await sql`SELECT COUNT(*) FROM players WHERE
      name ILIKE ${`%${query}%`} OR
      phone_number ILIKE ${`%${query}%`} OR 
      notes::text ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    methodEnd('fetchPlayersPagesCount');
    return totalPages;
  } catch (error) {
    // @ts-ignore
    methodEnd('fetchPlayersPagesCount with error', error?.message);
    throw new Error('Failed to fetchPlayersPagesCount.');
  }
}

export async function fetchTournamentsData() {
  methodStart();
  noStore();
  try {
    const [tournaments, history] = await Promise.all([
      getAllTournaments(true),
      getAllHistory(),
    ]);

    const dateToPlayerMap = {};

    const result = history
      .filter((item) => item.tournament_id && item.change < 0)
      .reduce(
        (acc, { phone_number, change, type, updated_at, tournament_id }) => {
          const newAcc = { ...acc };
          const dateAsString =
            typeof updated_at === 'string'
              ? getCurrentDate(updated_at).toISOString()
              : (updated_at as Date).toISOString();

          const tournament = tournaments.find(({ id }) => id === tournament_id);
          if (!tournament) {
            return newAcc;
          }
          const date = dateAsString.slice(0, 10);
          // @ts-ignore
          if (!newAcc[date]) {
            // @ts-ignore
            newAcc[date] = {};
          }
          // @ts-ignore
          if (!newAcc[date][tournament_id]) {
            // @ts-ignore
            newAcc[date][tournament_id] = {
              tournamentId: tournament_id,
              tournamentName: tournament.name,
              cash: 0,
              credit: 0,
              wire: 0,
              total: 0,
              players: 0,
              entries: 0,
              reentries: 0,
              date,
            };
          }

          const amount = -1 * change;

          // @ts-ignore
          newAcc[date][tournament_id].total += amount;
          // @ts-ignore
          newAcc[date][tournament_id].entries += 1;
          // @ts-ignore
          newAcc[date][tournament_id][type] += amount;

          // @ts-ignore
          if (!dateToPlayerMap[date]) {
            // @ts-ignore
            dateToPlayerMap[date] = {};
          }
          // @ts-ignore
          const datePlayers = dateToPlayerMap[date][tournament_id];
          if (datePlayers) {
            if (!datePlayers.includes(phone_number)) {
              datePlayers.push(phone_number);
              // @ts-ignore
              newAcc[date][tournament_id].players += 1;
            } else {
              // @ts-ignore
              newAcc[date][tournament_id].reentries += 1;
            }
          } else {
            // @ts-ignore
            dateToPlayerMap[date][tournament_id] = [phone_number];
            // @ts-ignore
            newAcc[date][tournament_id].players += 1;
          }

          return newAcc;
        },
        {},
      );
    methodEnd('fetchTournamentsData');

    return result;
  } catch (error) {
    // @ts-ignore
    methodEnd('fetchTournamentsData with error', error?.message);
    throw new Error('Failed to fetchTournamentsData.');
  }
}

export async function fetchAllUsers() {
  methodStart();
  noStore();
  try {
    const [users, players] = await Promise.all([
      getAllUsers(),
      getAllPlayers(),
    ]);

    users.forEach((user) => {
      const player = players.find((p) => p.phone_number === user.phone_number);
      if (player) {
        user.name = player.name;
      }
    });

    const result = users.sort(usersComparator);
    methodEnd('fetchAllUsers');
    return result;
  } catch (error) {
    // @ts-ignore
    methodEnd('fetchAllUsers with error', error?.message);
    throw new Error('Failed to fetchAllUsers.');
  }
}

export async function fetchAllBugs() {
  methodStart();
  noStore();
  try {
    const result = await getAllBugs();
    methodEnd('fetchAllBugs');
    return result;
  } catch (error) {
    // @ts-ignore
    methodEnd('fetchAllBugs with error', error?.message);
    throw new Error('Failed to fetchAllBugs.');
  }
}
export async function fetchAllChangeLogs() {
  methodStart();
  noStore();
  try {
    const result = await getAllChangeLogs();
    methodEnd('fetchAllChangeLogs');
    return result;
  } catch (error) {
    // @ts-ignore
    methodEnd('fetchAllChangeLogs with error', error?.message);
    throw new Error('Failed to fetchAllChangeLogs.');
  }
}
export async function fetchAllPlayersForExport() {
  methodStart();
  noStore();
  try {
    const result = await getAllPlayers();
    methodEnd('fetchAllPlayersForExport');
    return result;
  } catch (error) {
    // @ts-ignore
    methodEnd('fetchAllPlayersForExport with error', error?.message);
    throw new Error('Failed to fetchAllPlayersForExport.');
  }
}
export async function fetchTournaments() {
  methodStart();
  noStore();
  try {
    const results = await getAllTournaments();

    const allRsvps = await getAllRsvps();

    const dayOfTheWeek = getDayOfTheWeek();
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const today = days.indexOf(dayOfTheWeek);

    results.forEach((tournament) => {
      const tournamentDayIndex = days.indexOf(tournament.day);
      const date = getCurrentDate(
        getCurrentDate().getTime() +
          1000 * 60 * 60 * 24 * (tournamentDayIndex - today),
      );

      tournament.todayTournamentMaxPlayers = 0;
      tournament.arrivedToday = 0;
      tournament.todayCreditIncome = 0;
      tournament.todayCashIncome = 0;
      tournament.todayTransferIncome = 0;
      tournament.reEntriesCount = 0;
      tournament.date = date.toISOString().slice(0, 10);

      tournament.rsvpForToday = allRsvps.filter(
        (r) =>
          new Date(r.date).toISOString().slice(0, 10) === tournament.date &&
          r.tournament_id === tournament.id,
      ).length;

      if (
        results.find((t) => t.day === tournament.day && t.id !== tournament.id)
      ) {
        tournament.day_has_more_then_one = true;
      }
    });

    methodEnd('fetchTournaments');
    return results;
  } catch (error) {
    // @ts-ignore
    methodEnd('fetchTournaments with error', error?.message);
    throw new Error('Failed to fetchTournaments.');
  }
}
export async function fetchFeatureFlags() {
  methodStart();
  noStore();
  try {
    const flagsResult = await getAllFlags();

    const prizesEnabled = Boolean(
      flagsResult.find((flag) => flag.flag_name === 'prizes')?.is_open,
    );
    const playersSeeCreditEnabled = Boolean(
      flagsResult.find((flag) => flag.flag_name === 'players_can_see_credit')?.is_open,
    );
    const rsvpEnabled = Boolean(
      flagsResult.find((flag) => flag.flag_name === 'rsvp')?.is_open,
    );
    const playerRsvpEnabled = Boolean(
      flagsResult.find((flag) => flag.flag_name === 'player_can_rsvp')?.is_open,
    );
    const usePhoneValidation = Boolean(
      flagsResult.find((flag) => flag.flag_name === 'use_phone_validation')
        ?.is_open,
    );
    const importEnabled = Boolean(
      flagsResult.find((flag) => flag.flag_name === 'import')?.is_open,
    );
    const result = {
      prizesEnabled,
      rsvpEnabled,
      playerRsvpEnabled,
      usePhoneValidation,
      importEnabled,
      playersSeeCreditEnabled,
    };
    methodEnd('fetchFeatureFlags');
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchFeatureFlags with error');
    throw new Error('Failed to fetch flagsResult.');
  }
}
export async function fetchPlayerById(
  id: string,
  addTournamentsHistoryData = false,
) {
  methodStart();
  noStore();
  try {
    const player = await getPlayerById(id);
    if (player && addTournamentsHistoryData) {
      player.tournamentsData = await getPlayerTournamentsHistory(
        player!.phone_number,
      );
    }
    methodEnd('fetchPlayerById');
    return player;
  } catch (error) {
    // @ts-ignore
    methodEnd('fetchPlayerById with error', error?.message);
    throw new Error('Failed to fetchPlayerById.');
  }
}

export async function fetchTournamentByTournamentId(tournamentId: string) {
  methodStart();
  noStore();
  const allTournaments = (await sql<TournamentDB>`SELECT * FROM tournaments`)
    .rows;
  const allDeletedTournaments = (
    await sql<TournamentDB>`SELECT * FROM deleted_tournaments`
  ).rows;

  try {
    let result = allTournaments.find((t) => t.id === tournamentId);
    if (!result) {
      result = allDeletedTournaments.find((t) => t.id === tournamentId);
    }
    methodEnd('fetchTournamentByTournamentId');
    return result;
  } catch (error) {
    // @ts-ignore
    methodEnd('fetchTournamentByTournamentId with error', error?.message);
    throw new Error('Failed to fetchTournamentByTournamentId.');
  }
}

export async function fetchPlayerByUserId(userId: string) {
  methodStart();
  noStore();
  try {
    const user = await getUserById(userId);
    if (!user) {
      console.log('>>>>> User not found');
      return null;
    }

    const playerPhoneNumber = user.phone_number;
    const player = await getPlayerByPhoneNumber(playerPhoneNumber);
    if (!player){
      console.log('>>>>> player not found');
      return null;
    }
    const rsvps = (await sql<RSVPDB>`SELECT * FROM rsvp;`).rows.filter(
      ({ phone_number }) => phone_number === player.phone_number,
    );

    player.rsvps = rsvps.map(({ date, tournament_id }) => ({
      date,
      tournamentId: tournament_id,
    }));

    if (player) {
      const [historyLog, rsvpsForToday, tournamentsData] = await Promise.all([
        getPlayerHistory(playerPhoneNumber),
        getPlayerRsvpsForDate(playerPhoneNumber, getTodayShortDate()),
        getPlayerTournamentsHistory(playerPhoneNumber),
      ]);
      player.historyLog = historyLog;
      player.rsvpForToday =
        rsvpsForToday.length > 0 ? rsvpsForToday[0].tournament_id : undefined;
      player.tournamentsData = tournamentsData;
    }
    methodEnd('fetchPlayerByUserId');
    return player;
  } catch (error) {
    // @ts-ignore
    methodEnd('fetchPlayerByUserId with error', error?.message);
    throw new Error('Failed to fetchPlayerByUserId.');
  }
}

export async function fetchUserById(id: string) {
  if (!id || id === 'undefined') {
    console.error('no id, redirecting to home url');
    return redirect(`/`);
  }
  methodStart();
  noStore();
  try {
    const result = await getUserById(id);

    result.is_player = false;
    if (result) {
      const player = (
        await sql<PlayerDB>`SELECT * FROM players WHERE phone_number=${result.phone_number}`
      ).rows[0];

      if (player) {
        result.is_player = true;
      }
    }
    methodEnd('fetchUserById');
    return result;
  } catch (error) {
    // @ts-ignore
    methodEnd('fetchUserById with error.', error?.message);
    redirect(`/`);
  }
}
