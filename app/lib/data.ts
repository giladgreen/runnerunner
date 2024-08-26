import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

import {
  BugDB,
  Counts,
  FeatureFlagDB,
  ImageDB,
  LogDB,
  PlayerDB,
  PrizeDB,
  PrizeInfoDB,
  RSVPDB,
  TournamentDB,
  UserDB,
  WinnerDB,
} from './definitions';
import {
  sumArrayByProp,
  positionComparator,
  phoneNumberComparator,
} from './utils';
import { redirect } from 'next/navigation';
import {
  getCurrentDate,
  getDayOfTheWeek,
  getTodayShortDate,
} from './serverDateUtils';

const ITEMS_PER_PAGE = 30;
const TOP_COUNT = 8;

let start = 0;
function methodStart() {
  start = getCurrentDate().getTime();
}
function methodEnd(methodName: string) {
  const now = getCurrentDate().getTime();
  const diff = now - start;
  if (diff > 600) {
    console.warn('Method End', methodName, '      ', diff, 'milli');
  }
}

async function getAllFlags() {
  const data = await sql<FeatureFlagDB>`SELECT * FROM feature_flags`;
  return data.rows;
}
async function getAllBugs() {
  const data = await sql<BugDB>`SELECT * FROM bugs`;
  return data.rows;
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
  const usersResult =
    await sql<UserDB>`SELECT * FROM users WHERE id = ${userId};`;
  return usersResult.rows[0] ?? null;
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

export async function getAllImages() {
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

export async function getAllPlayers() {
  const todayDate = getTodayShortDate();

  const playersPromise = sql<PlayerDB>`SELECT * FROM players AS P 
 JOIN (SELECT phone_number, sum(change) AS balance FROM history WHERE type = 'credit_to_other' OR type ='credit' OR type ='prize' GROUP BY phone_number) AS H
    ON P.phone_number = H.phone_number`;

  const [
    allPlayersResult,
    rsvpResults,
    todayHistoryUnfiltered,
    winnersRecords,
  ] = await Promise.all([
    playersPromise,
    sql<RSVPDB>`SELECT * FROM rsvp;`,
    getTodayHistory(),
    getTournamentWinnersRecordsByDate(todayDate),
  ]);
  const allPlayers = allPlayersResult.rows;

  const allRsvps = rsvpResults.rows;

  const todayHistory = todayHistoryUnfiltered.filter(
    ({ type }) => type != 'prize' && type != 'credit_to_other',
  );

  const winnersObjects = winnersRecords.map((winnersRecord) =>
    winnersRecord ? JSON.parse(winnersRecord.winners) : {},
  );

  allPlayers.forEach((player) => {
    player.balance = Number(player.balance);
    const rsvps = allRsvps.filter(
      ({ phone_number }) => phone_number === player.phone_number,
    );
    player.rsvps = rsvps.map(({ date, tournament_id }) => ({
      date,
      tournamentId: tournament_id,
    }));

    player.rsvpForToday = rsvps.find(({ date }) => date === todayDate)
      ?.tournament_id;

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

    player.name = player.name.trim();
    player.historyLog = playerItems;
  });

  return allPlayers;
}

async function getAllUsers() {
  const usersResult = await sql<UserDB>`SELECT * FROM users`;
  return usersResult.rows;
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

      player.rsvpForToday = rsvps.find(({ date }) => date === todayDate)
        ?.tournament_id;
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
  const [players, todayHistoryUnfiltered, rsvp] = await Promise.all([
    getXPlayers(),
    getTodayHistory(),
    getAllRsvps(),
  ]);
  const todayHistory = todayHistoryUnfiltered.filter(
    ({ type }) => type != 'prize' && type != 'credit_to_other',
  );

  const result = await fetchTopPlayers(players, rsvp, todayHistory);
  methodEnd(x);
  return result;
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
async function fetchSortedPlayers(
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
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////

export async function fetchPrizesInfo() {
  const prizes =
    await sql<PrizeInfoDB>`SELECT * FROM prizes_info ORDER BY name`;

  return prizes.rows;
}

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
    console.error('Database Error:', error);
    methodEnd('fetchGeneralPlayersCardData with error');
    throw new Error('Failed to fetch card data.');
  }
}

export async function fetchRSVPAndArrivalData(dayOfTheWeek: string) {
  methodStart();
  noStore();
  try {
    const [allPlayers, todayHistoryWithZero, allTournaments] =
      await Promise.all([
        getAllPlayers(),
        getTodayHistory(),
        getAllTournaments(),
      ]);

    methodEnd('fetchRSVPAndArrivalData');
    const todayTournaments = allTournaments.filter(
      (t) => t.day === dayOfTheWeek,
    );

    return {
      todayTournaments: todayTournaments.map((t) => {
        const rsvpForToday = allPlayers.filter(
          (player) => t.id === player.rsvpForToday,
        ).length;

        const todayHistory = todayHistoryWithZero.filter(
          (item) =>
            (item.change < 0 || item.type === 'credit_by_other') &&
            item.tournament_id === t.id,
        );
        const reEntriesCount =
          todayHistory.length -
          Array.from(
            new Set(todayHistory.map(({ phone_number }) => phone_number)),
          ).length;

        const todayCreditIncome = sumArrayByProp(
          todayHistory.filter(
            ({ type }) => type === 'credit' || type === 'credit_to_other',
          ),
          'change',
        );
        const todayCashIncome = sumArrayByProp(
          todayHistory.filter(({ type }) => type === 'cash'),
          'change',
        );
        const todayTransferIncome = sumArrayByProp(
          todayHistory.filter(({ type }) => type === 'wire'),
          'change',
        );

        const arrivedToday = Array.from(
          new Set(todayHistory.map(({ phone_number }) => phone_number)),
        ).length;

        return {
          ...t,
          rsvpForToday,
          arrivedToday,
          todayCreditIncome:
            todayCreditIncome < 0 ? -1 * todayCreditIncome : todayCreditIncome,
          todayCashIncome:
            todayCashIncome < 0 ? -1 * todayCashIncome : todayCashIncome,
          todayTransferIncome:
            todayTransferIncome < 0
              ? -1 * todayTransferIncome
              : todayTransferIncome,
          reEntriesCount,
          todayTournamentMaxPlayers: t.rsvp_required ? t.max_players : null,
        } as TournamentDB;
      }),
    };
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchRSVPAndArrivalData with error');

    throw new Error('Failed to fetch card data.');
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
    console.error('Database Error:', error);
    methodEnd('fetchFinalTablePlayers with error');
    throw new Error('Failed to fetch final table players data.');
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
        console.warn('>>> prize is missing player', prize);
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
    console.error('Database Error:', error);
    methodEnd('fetchPlayersPrizes with error');
    throw new Error('Failed to fetch final table players data.');
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
    const playersResultPromise = fetchSortedPlayers(query, sortBy, currentPage);

    const playersHistoryCountResultPromise = sql<Counts>`
      SELECT
       phone_number, 
       count(phone_number) 
        FROM history 
         GROUP BY phone_number
    `;

    const [playersHistoryCountResult, players, allRsvps] = await Promise.all([
      playersHistoryCountResultPromise,
      playersResultPromise,
      getAllRsvps(),
    ]);
    const playersHistoryCount = playersHistoryCountResult.rows;

    const todayDate = getTodayShortDate();
    players.forEach((player) => {
      player.balance = Number(player.balance);

      const historyCount = playersHistoryCount.find(
        ({ phone_number }) => phone_number === player.phone_number,
      );
      player.historyCount = historyCount?.count ?? 0;
      const rsvps = allRsvps.filter(
        ({ phone_number }) => phone_number === player.phone_number,
      );
      player.rsvps = rsvps.map(({ date, tournament_id }) => ({
        date,
        tournamentId: tournament_id,
      }));

      player.rsvpForToday = rsvps.find(({ date }) => date === todayDate)
        ?.tournament_id;
    });
    methodEnd('fetchFilteredPlayers');
    return players;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchFilteredPlayers with error');
    throw new Error('Failed to fetch FilteredPlayers.');
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
    console.error('Database Error:', error);
    methodEnd('fetchPlayersPagesCount with error');
    throw new Error('Failed to fetch total number of players.');
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
    console.error('Database Error:', error);
    methodEnd('fetchTournamentsData with error');
    throw new Error('Failed to fetch the fetch incomes.');
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

    const result = users.sort(phoneNumberComparator);
    methodEnd('fetchAllUsers');
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchAllUsers with error');
    throw new Error('Failed to fetch total number of users.');
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
    console.error('Database Error:', error);
    methodEnd('fetchAllBugs with error');
    throw new Error('Failed to fetch bugs.');
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
    console.error('Database Error:', error);
    methodEnd('fetchAllPlayersForExport with error');
    throw new Error('Failed to fetch bugs.');
  }
}
export async function fetchTournaments() {
  methodStart();
  noStore();
  try {
    const results = await getAllTournaments();

    results.forEach((tournament) => {
      tournament.rsvpForToday = 0;
      tournament.todayTournamentMaxPlayers = 0;
      tournament.arrivedToday = 0;
      tournament.todayCreditIncome = 0;
      tournament.todayCashIncome = 0;
      tournament.todayTransferIncome = 0;
      tournament.reEntriesCount = 0;

      if (
        results.find((t) => t.day === tournament.day && t.id !== tournament.id)
      ) {
        tournament.day_has_more_then_one = true;
      }
    });

    methodEnd('fetchTournaments');
    return results;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchTournaments with error');
    throw new Error('Failed to fetch tournaments.');
  }
}
export async function fetchFeatureFlags() {
  methodStart();
  noStore();
  try {
    const flagsResult = await getAllFlags();

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
    methodEnd('fetchFeatureFlags');
    return {
      rsvpEnabled,
      playerRsvpEnabled,
      usePhoneValidation,
      importEnabled,
    };
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
    console.error('Database Error:', error);
    methodEnd('fetchPlayerById with error');
    throw new Error('Failed to fetchPlayerById.');
  }
}

export async function fetchPlayerCurrentTournamentHistory(phoneNumber: string) {
  methodStart();
  noStore();
  try {
    const todayHistory = await getTodayHistory();
    const results = todayHistory.filter(
      ({ phone_number }) => phone_number === phoneNumber,
    );
    methodEnd('fetchPlayerCurrentTournamentHistory');
    return results;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchPlayerCurrentTournamentHistory with error');
    throw new Error('Failed to fetchPlayerCurrentTournamentHistory.');
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
    console.error('Database Error:', error);
    methodEnd('fetchTournamentByTournamentId with error');
    throw new Error('Failed to fetchTournamentByTournamentId.');
  }
}
export async function fetchTournamentsByDay(day?: string) {
  methodStart();
  noStore();
  try {
    //TODO: might need to adjust date to israel time
    const dayName = day ?? getDayOfTheWeek();

    const results = await getTodayTournaments(dayName);
    methodEnd('fetchTournamentsByDay');
    return results;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchTournamentsByDay with error');
    throw new Error('Failed to fetchTournamentsById.');
  }
}

export async function fetchRsvpCountForTodayTournament(tournamentId: string) {
  methodStart();
  noStore();
  try {
    const todayDate = getTodayShortDate();
    const rsvps = await getAllRsvps();
    const result = rsvps.filter(
      (rsvp) => rsvp.tournament_id === tournamentId && rsvp.date === todayDate,
    ).length;
    methodEnd('fetchRsvpCountForTodayTournament');
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchRsvpCountForTodayTournament with error');
    throw new Error('Failed to fetchTournamentById.');
  }
}

export async function fetchPlayerByUserId(userId: string) {
  methodStart();
  noStore();
  try {
    const user = await getUserById(userId);
    if (!user) {
      return null;
    }

    const playerPhoneNumber = user.phone_number;
    const player = await getPlayerByPhoneNumber(playerPhoneNumber);

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
    console.error('Database Error:', error);
    methodEnd('fetchPlayerByUserId with error');
    throw new Error('Failed to fetchPlayerByUserId.');
  }
}

export async function fetchUserById(id: string) {
  if (!id || id === 'undefined') {
    return redirect(`/`);
  }
  methodStart();
  noStore();
  try {
    const result = await getUserById(id);
    methodEnd('fetchUserById');
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchUserById with error');
    redirect(`/`);
  }
}
