import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore} from 'next/cache';

import {
  BugDB,
  Counts,
  FeatureFlagDB,
  LogDB,
  PlayerDB,
  PrizeDB,
  RSVPDB,
  TournamentDB,
  UserDB,
  WinnerDB
} from './definitions';

const ITEMS_PER_PAGE = 30;
const TOP_COUNT = 8;

let start=0;
function methodStart(){
  start = (new Date()).getTime();
}
function methodEnd(methodName: string){
  const now = (new Date()).getTime();
  const diff = now - start;
  if (diff > 600){
    console.warn('Method End', methodName,'      ',diff, 'milli');
  }
}
function positionComparator(a: PlayerDB,b: PlayerDB) {
  return a.position < b.position ? -1 : 1;
};
function phoneNumberComparator(a: UserDB,b: UserDB) {
  return a.phone_number < b.phone_number ? -1 : 1;
};

function nameComparator(a: PlayerDB,b: PlayerDB) {
  return a.name < b.name ? -1 : 1;
};

function getTodayShortDate(){
  return (new Date()).toISOString().slice(0,10);
}

function getDayOfTheWeek(date?: Date){
  const base = date ?? new Date();
  return base.toLocaleString('en-us', { weekday: 'long' });
}

function sumArrayByProp(array:any[], propName:string){
  return array.reduce((acc, player) => acc + player[propName], 0);
}

async function getAllFlags(){
  const data = await sql<FeatureFlagDB>`SELECT * FROM feature_flags`;
  return data.rows;
}
async function getAllBugs(){
  const data = await sql<BugDB>`SELECT * FROM bugs`;
  return data.rows;
}
async function getAllPrizes(){
  const prizesResult = await sql<PrizeDB>`SELECT * FROM prizes ORDER BY tournament DESC`;
  return prizesResult.rows;
}
async function getAllRsvps() {
  const rsvpResults = await sql<RSVPDB>`SELECT * FROM rsvp;`;
  return rsvpResults.rows;
}

async function getUserById(userId: string){
  const usersResult = await sql<UserDB>`SELECT * FROM users WHERE id = ${userId};`;
  return usersResult.rows[0] ?? null;
}

async function getPlayerTournamentsHistory(phoneNumber: string){
  const data = await sql<WinnerDB>`SELECT * FROM winners WHERE winners LIKE  ${`%${phoneNumber}%`};`;
  const items = data.rows;
  return items.map(item => {
    const winners = JSON.parse(item.winners);
    const place = winners[phoneNumber]?.position;

    return {
      date: item.date,
      tournament_name: item.tournament_name,
      place
    }
  })
}
async function getPlayerById(playerId: string){
  const playerResult = await sql<PlayerDB>`SELECT * FROM players AS P 
JOIN (SELECT phone_number, sum(change) AS balance FROM history WHERE type = 'credit_to_other' OR type ='credit' OR type ='prize' GROUP BY phone_number) AS H
ON P.phone_number = H.phone_number
WHERE P.id = ${playerId};`;

  const player = playerResult.rows[0];
  if (!player){
    return null;
  }
  player.balance = Number(player.balance)
  const [rsvpResults, historyData] = await Promise.all([sql<RSVPDB>`SELECT * FROM rsvp WHERE phone_number = ${player.phone_number}`,
    sql<LogDB>`SELECT * FROM history WHERE phone_number = ${player.phone_number} ORDER BY history.updated_at asc;`]) ;

  player.historyLog = historyData.rows;
  player.rsvps = rsvpResults.rows.map(({ date }) => date);


  return player;
}

async function isPlayerRsvp(playerPhoneNumber:string, date: string){
  const rsvpResults = await sql<RSVPDB>`SELECT * FROM rsvp WHERE date = ${date} AND phone_number = ${playerPhoneNumber};`;
  return rsvpResults.rows.length > 0;
}

async function getPlayerByPhoneNumber(phoneNumber: string){
  const playersResult = await sql<PlayerDB>`SELECT * FROM players AS P 
JOIN (SELECT phone_number, sum(change) AS balance FROM history WHERE phone_number = ${phoneNumber}  AND (type = 'credit_to_other' OR type ='credit' OR type ='prize') GROUP BY phone_number) AS H
ON P.phone_number = H.phone_number
WHERE P.phone_number = ${phoneNumber};`;

  const player =  playersResult.rows[0] ?? null;
  if (player){
    player.balance = Number(player.balance)
  }
  return player;
}

async function getTodayTournament(day?: string){
  const dayOfTheWeek= day ?? getDayOfTheWeek();
  const todayTournamentResult = await sql<TournamentDB>`SELECT * FROM tournaments WHERE day = ${dayOfTheWeek}`;
  return todayTournamentResult.rows[0];
}

async function getAllTournaments(){
  const tournamentsResults = await sql<TournamentDB>`SELECT * FROM tournaments ORDER BY i ASC`;
  return tournamentsResults.rows;
}

async function getDateWinnersRecord(date: string){
  const winnersResult = await sql<WinnerDB>`SELECT * FROM winners WHERE date = ${date}`;
  return winnersResult.rows[0];
}

async function getPlayerHistory(playerPhoneNumber: string){
  const historyData = await sql<LogDB>`
            SELECT * 
            FROM history
            WHERE phone_number = ${playerPhoneNumber}
            ORDER BY updated_at ASC;
          `;

  return historyData.rows;
}
async function getTodayHistory(){
  const todayHistoryResults = await sql<LogDB>`SELECT * FROM history WHERE change <= 0 AND type != 'prize' AND updated_at > now() - interval '12 hour'  ORDER BY updated_at DESC`;
  return todayHistoryResults.rows;
}

async function getAllHistory(){
  const todayHistoryResults = await sql<LogDB>`SELECT * FROM history ORDER BY updated_at DESC`;
  return todayHistoryResults.rows;
}

async function getAllPlayers()  {
  const playersPromise = sql<PlayerDB>`SELECT * FROM players AS P 
 JOIN (SELECT phone_number, sum(change) AS balance FROM history WHERE type = 'credit_to_other' OR type ='credit' OR type ='prize' GROUP BY phone_number) AS H
    ON P.phone_number = H.phone_number`;

  const [allPlayersResult, rsvpResults] = await Promise.all([playersPromise, sql<RSVPDB>`SELECT * FROM rsvp;`])
  const allPlayers = allPlayersResult.rows;

  const rsvp = rsvpResults.rows;
  const todayDate = getTodayShortDate();

  allPlayers.forEach(player => {
    player.balance = Number(player.balance)
    player.rsvps = rsvp.filter(({ phone_number }) => phone_number === player.phone_number).map(({ date }) => date);
    player.rsvpForToday = Boolean(player.rsvps.find(date => date === todayDate));

  })

  return allPlayers;
}

async function getAllUsers()  {
  const usersResult = await sql<UserDB>`SELECT * FROM users`;
  return usersResult.rows;

}

async function getTopMVPPlayers(){
  const players = await sql<PlayerDB>`SELECT * FROM players AS P 
 JOIN (SELECT phone_number, sum(change) AS balance FROM history WHERE type = 'credit_to_other' OR type ='credit' OR type ='prize' GROUP BY phone_number) AS H
    ON P.phone_number = H.phone_number WHERE H.balance > 0 ORDER BY H.balance DESC LIMIT ${TOP_COUNT}`;

  return players.rows;
}

async function getTopDebtPlayers(){
  const players = await sql<PlayerDB>`SELECT * FROM players AS P 
 JOIN (SELECT phone_number, sum(change) AS balance FROM history WHERE type = 'credit_to_other' OR type ='credit' OR type ='prize' GROUP BY phone_number) AS H
    ON P.phone_number = H.phone_number WHERE H.balance < 0 ORDER BY H.balance ASC LIMIT ${TOP_COUNT}`;

  return players.rows;
}

async function fetchTopPlayers(players: PlayerDB[], rsvp: RSVPDB[] = [], todayHistory: LogDB[] = []) {
  try {
    const todayDate = getTodayShortDate();

    players.forEach((player) => {
      player.balance = Number(player.balance)
      player.arrived = Boolean(todayHistory.find(({ phone_number}) => phone_number === player.phone_number));
      player.rsvps = rsvp.filter(({ phone_number }) => phone_number === player.phone_number).map(({ date }) => date);
      player.rsvpForToday = Boolean(player.rsvps.find(date => date === todayDate));

    });
    return players;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetchTopPlayers.');
  }
}

 async function fetchXPlayers(x:string, getXPlayers: ()=> PlayerDB[]){
  methodStart();
  noStore();
  const [players, todayHistoryUnfiltered, rsvp] = await Promise.all([ getXPlayers(), getTodayHistory(), getAllRsvps()]);
  const todayHistory = todayHistoryUnfiltered.filter(({ type }) => type != 'prize' && type != 'credit_to_other');

  const result = await fetchTopPlayers(players, rsvp, todayHistory);
  methodEnd(x);
  return result;
}

async function fetchSortedPlayers(query: string, sortBy: string, currentPage: number){
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const phoneAndBalance = (await sql`SELECT phone_number,sum(change) AS balance FROM history WHERE type = 'credit_to_other' OR type ='credit' OR type ='prize' GROUP BY phone_number`).rows;

  switch (sortBy) {
    case 'name':
      return (await sql<PlayerDB>`
        SELECT * FROM players WHERE name::text ILIKE ${`%${query}%`} OR phone_number::text ILIKE ${`%${query}%`} OR notes::text ILIKE ${`%${query}%`}
        ORDER BY name ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `).rows.map(player => ({...player, balance: Number(phoneAndBalance.find(({ phone_number }) => phone_number === player.phone_number)?.balance) || 0}))

    case 'balance':
      return (await sql<PlayerDB>`
        SELECT * FROM players WHERE name::text ILIKE ${`%${query}%`} OR phone_number::text ILIKE ${`%${query}%`} OR notes::text ILIKE ${`%${query}%`}
      `).rows.map(player => ({...player, balance: Number(phoneAndBalance.find(({ phone_number }) => phone_number === player.phone_number)?.balance) || 0}))
          .sort((a, b) => b.balance - a.balance).slice(offset, offset + ITEMS_PER_PAGE);
    case 'phone':
      return (await sql<PlayerDB>`
        SELECT * FROM players WHERE name::text ILIKE ${`%${query}%`} OR phone_number::text ILIKE ${`%${query}%`} OR notes::text ILIKE ${`%${query}%`}
        ORDER BY phone_number ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
            `).rows.map(player => ({...player, balance: Number(phoneAndBalance.find(({ phone_number }) => phone_number === player.phone_number)?.balance) || 0}))

    case 'notes':
      return (await sql<PlayerDB>`
        SELECT * FROM players WHERE name::text ILIKE ${`%${query}%`} OR phone_number::text ILIKE ${`%${query}%`} OR notes::text ILIKE ${`%${query}%`}
        ORDER BY notes DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
            `).rows.map(player => ({...player, balance: Number(phoneAndBalance.find(({ phone_number }) => phone_number === player.phone_number)?.balance) || 0}))

    default:
      return (await sql<PlayerDB>`
        SELECT * FROM players WHERE name::text ILIKE ${`%${query}%`} OR phone_number::text ILIKE ${`%${query}%`} OR notes::text ILIKE ${`%${query}%`}
        ORDER BY updated_at DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
       `).rows.map(player => ({...player, balance: Number(phoneAndBalance.find(({ phone_number }) => phone_number === player.phone_number)?.balance) || 0}))

  }
}
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////

export async function fetchMVPPlayers() {
  return fetchXPlayers('fetchMVPPlayers', getTopMVPPlayers as unknown as ()=> PlayerDB[]);
}

export async function fetchDebtPlayers() {
  return fetchXPlayers('fetchDebtPlayers', getTopDebtPlayers as unknown as ()=> PlayerDB[]);
}

export async function fetchGeneralPlayersCardData() {
  methodStart();
  noStore();

  try {
    const allPlayers = await getAllPlayers()

    const totalNumberOfPlayers = allPlayers.length;
    const playersWithDebt = allPlayers.filter((player) => player.balance < 0);
    const numberOfPlayersWithDebt = playersWithDebt.length;
    const totalRunnerDebt = sumArrayByProp(allPlayers.filter((player) => player.balance > 0), 'balance')


    const totalPlayersDebt = sumArrayByProp(playersWithDebt,'balance');
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

export async function fetchRSVPAndArrivalData() {
  methodStart();
  noStore();
  try {
    const [allPlayers, todayHistory, todayTournament] = await Promise.all([getAllPlayers(), getTodayHistory(), getTodayTournament()]) ;

    const rsvpForToday = allPlayers.filter(player => player.rsvpForToday).length

    const todayTournamentMaxPlayers = todayTournament.rsvp_required ? todayTournament?.max_players : null;

    if (todayHistory.length === 0){
      return {
        rsvpForToday,
        arrivedToday: 0,
        todayCreditIncome: 0,
        todayCashIncome: 0,
        todayTransferIncome: 0,
        reEntriesCount: 0,
        todayTournamentMaxPlayers,
        todayTournament
      };
    }
    const reEntriesCount = todayHistory.length - (Array.from(new Set(todayHistory.map(({ phone_number }) => phone_number)))).length;

    const todayCreditIncome = sumArrayByProp( todayHistory.filter(({ type }) => type === 'cash'),'change');
    const todayCashIncome = sumArrayByProp( todayHistory.filter(({ type }) => type === 'credit'),'change');
    const todayTransferIncome = sumArrayByProp( todayHistory.filter(({ type }) => type === 'wire'),'change');
    const arrivedToday =  (Array.from(new Set(todayHistory.map(({ phone_number }) => phone_number)))).length;

    methodEnd('fetchRSVPAndArrivalData');
    return {
      rsvpForToday,
      arrivedToday,
      todayCreditIncome: todayCreditIncome < 0 ? -1 * todayCreditIncome : todayCreditIncome,
      todayCashIncome: todayCashIncome < 0 ? -1 * todayCashIncome : todayCashIncome,
      todayTransferIncome: todayTransferIncome < 0 ? -1 * todayTransferIncome : todayTransferIncome,
      reEntriesCount,
      todayTournamentMaxPlayers,
      todayTournament
    };
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchRSVPAndArrivalData with error')

    throw new Error('Failed to fetch card data.');
  }
}


export async function fetchFinalTablePlayers(stringDate?: string) {
  methodStart();
  noStore();
  try {
    const date = stringDate ?? getTodayShortDate();
    const winnersResult = await getDateWinnersRecord(date);
    const winnersObject =  winnersResult ? JSON.parse(winnersResult.winners) : {};
    const winnersPhoneNumbers = Object.keys(winnersObject);
    const allPlayers = (await getAllPlayers()).filter(player => winnersPhoneNumbers.includes(player.phone_number)).map(player => {
      const playerObj = winnersObject[player.phone_number];
      player.position = playerObj?.position || 0;
      player.hasReceived = Boolean(playerObj?.hasReceived);
      return player;
    })

    const result =  allPlayers.filter(player => player.position > 0).sort(positionComparator);
    methodEnd('fetchFinalTablePlayers');
    return result;

  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchFinalTablePlayers with error')
    throw new Error('Failed to fetch final table players data.');
  }
}

export async function fetchPlayersPrizes(playerPhoneNumber?: string) {
  methodStart();
  noStore();
  try {
    const [prizes,players] = await Promise.all([getAllPrizes(), getAllPlayers()])

    prizes.forEach(prize => {
        const player = players.find(p => p.phone_number === prize.phone_number);
        if (player){
            prize.player = player;
        }
    });
    const result =  !playerPhoneNumber ? prizes : prizes.filter(prize => prize.phone_number === playerPhoneNumber);
    methodEnd('fetchPlayersPrizes');
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchPlayersPrizes with error')
    throw new Error('Failed to fetch final table players data.');
  }
}


export async function fetchFilteredPlayers(
  query: string,
  currentPage: number,
  sortBy: string = 'updated_at'
) {
  methodStart();
  noStore();

  try {
    const playersResultPromise = fetchSortedPlayers(query, sortBy, currentPage)

    const playersHistoryCountResultPromise = sql<Counts>`
      SELECT
       phone_number, 
       count(phone_number) 
        FROM history 
         GROUP BY phone_number
    `;

    const [playersHistoryCountResult, players, rsvp] = await Promise.all([playersHistoryCountResultPromise, playersResultPromise, getAllRsvps()]);
    const playersHistoryCount = playersHistoryCountResult.rows;

    const todayDate = getTodayShortDate();
    players.forEach((player) => {
      player.balance = Number(player.balance)

      const historyCount = playersHistoryCount.find(({ phone_number}) => phone_number === player.phone_number);
      player.historyCount = historyCount?.count ?? 0;
      player.rsvps = rsvp.filter(({ phone_number }) => phone_number === player.phone_number).map(({ date }) => date);
      player.rsvpForToday = Boolean(player.rsvps.find(date => date === todayDate));
    });
    methodEnd('fetchFilteredPlayers')
    return players;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchFilteredPlayers with error')
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
export async function fetchTodayPlayers(query?: string) {
  methodStart();
  noStore();
  try {
    const todayDate = getTodayShortDate();

    const [winnersRecord, tournament, players, rsvp, todayHistoryUnfiltered] = await Promise.all([getDateWinnersRecord(todayDate),getTodayTournament(), getAllPlayers(), getAllRsvps(), getTodayHistory()])

    const winnersObject = winnersRecord ? JSON.parse(winnersRecord.winners) : {};
    const rsvp_required = tournament.rsvp_required;
    const todayHistory =  todayHistoryUnfiltered.filter(({ type }) => type != 'prize'  && type != 'credit_to_other' )

    players.forEach((player) => {
      const playerItems = todayHistory.filter(({ phone_number}) => phone_number === player.phone_number) as LogDB[];
      player.arrived = playerItems.length > 0;
      player.entries = playerItems.length;


      player.name = player.name.trim();
      player.historyLog = playerItems;

      // @ts-ignore
      player.position = (winnersObject[player.phone_number])?.position || 0;
      player.balance = Number(player.balance)

      player.rsvps = rsvp.filter(({ phone_number }) => phone_number === player.phone_number).map(({ date }) => date);
      player.rsvpForToday = Boolean(player.rsvps.find(date => date === todayDate));
    });

    // @ts-ignore
    const results = players.filter(p => (!query && p.arrived) ||
        (!query && p.rsvpForToday && rsvp_required) ||
        (query && query.length > 0 && (p.name.includes(query) ||  p.phone_number.includes(query))))

    results.sort(nameComparator);
    methodEnd('fetchTodayPlayers')
    return results;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchTodayPlayers with error')
    throw new Error('Failed to fetch the fetchTodayPlayers.');
  }
}

export async function fetchTournamentsData() {
  methodStart();
  noStore();
  try {
    const [tournaments, history] =  await Promise.all([getAllTournaments(), getAllHistory()]);

    const dateToPlayerMap = {};

    const result =  history.reduce((acc, { phone_number, change, type, updated_at }) => {
      const newAcc = {...acc};
      const dateAsString = typeof updated_at === 'string' ? new Date(updated_at).toISOString() : (updated_at as Date).toISOString();
      const dateObj = new Date(updated_at);
      const tournament = tournaments.find(({ day }) => day === getDayOfTheWeek(dateObj));

      if (dateObj.getTime() < (new Date('2024-06-15T10:00:00.000Z')).getTime()){
        return newAcc;
      }
      const date = dateAsString.slice(0,10);
      // @ts-ignore
      if (!newAcc[date]){
        // @ts-ignore
        newAcc[date] = {
          tournamentName: tournament?.name,
          cash: 0,
          credit: 0,
          wire: 0,
          total: 0,
          players: 0,
          entries: 0,
          reentries: 0,
          date
        }
      }
      const amount = -1 * change;
      // @ts-ignore
      newAcc[date].total += amount;
      // @ts-ignore
      newAcc[date].entries += 1;
      // @ts-ignore
      newAcc[date][type] += amount;

      // @ts-ignore
      const datePlayers = dateToPlayerMap[date];
      if (datePlayers){
        if (!datePlayers.includes(phone_number)){
          datePlayers.push(phone_number);
          // @ts-ignore
          newAcc[date].players += 1;
        }else {
          // @ts-ignore
          newAcc[date].reentries += 1;
        }
      }else{
        // @ts-ignore
        dateToPlayerMap[date] = [phone_number];
        // @ts-ignore
        newAcc[date].players += 1;
      }

      return newAcc;
    }, {});
    methodEnd('fetchTournamentsData')
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchTournamentsData with error')
    throw new Error('Failed to fetch the fetch incomes.');
  }
}

export async function fetchPlayersWithEnoughCredit(){
  methodStart();
  try {
    const result = await getAllPlayers()
    methodEnd('fetchPlayersWithEnoughCredit')
    return result.filter(player => player.balance > -2000).sort(nameComparator);
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchPlayersWithEnoughCredit with error')
    throw new Error('Failed to fetch the fetch incomes.');
  }
}

export async function fetchAllUsers() {
  methodStart();
  noStore();
  try {
    const [users, players] = await Promise.all([getAllUsers(), getAllPlayers()]);

    users.forEach(user => {
      const player = players.find(p => p.phone_number === user.phone_number);
      if (player){
        user.name = player.name;
      }
    });

    const result =  users.sort(phoneNumberComparator);
    methodEnd('fetchAllUsers')
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchAllUsers with error')
    throw new Error('Failed to fetch total number of users.');
  }
}


export async function fetchAllBugs() {
  methodStart();
  noStore();
  try {
    const result =  await getAllBugs();
    methodEnd('fetchAllBugs')
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchAllBugs with error')
    throw new Error('Failed to fetch bugs.');
  }
}
export async function fetchAllPlayersForExport() {
  methodStart();
  noStore();
  try {
    const result =  await getAllPlayers();
    methodEnd('fetchAllPlayersForExport')
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchAllPlayersForExport with error')
    throw new Error('Failed to fetch bugs.');
  }
}
export async function fetchTournaments() {
  methodStart();
  noStore();
  try {
    const result =  getAllTournaments();
    methodEnd('fetchTournaments')
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchTournaments with error')
    throw new Error('Failed to fetch tournaments.');
  }
}
export async function fetchFeatureFlags() {
  methodStart();
  noStore();
  try {
    const flagsResult = await getAllFlags();

    const prizesEnabled = Boolean(flagsResult.find(flag => flag.flag_name === 'prizes')?.is_open);
    const placesEnabled = Boolean(flagsResult.find(flag => flag.flag_name === 'places')?.is_open);
    const rsvpEnabled = Boolean(flagsResult.find(flag => flag.flag_name === 'rsvp')?.is_open);
    const playerRsvpEnabled = Boolean(flagsResult.find(flag => flag.flag_name === 'player_can_rsvp')?.is_open);
    const usePhoneValidation = Boolean(flagsResult.find(flag => flag.flag_name === 'use_phone_validation')?.is_open);
    const importEnabled = Boolean(flagsResult.find(flag => flag.flag_name === 'import')?.is_open);
    methodEnd('fetchFeatureFlags')
    return {
      prizesEnabled,
      placesEnabled,
      rsvpEnabled,
      playerRsvpEnabled,
      usePhoneValidation,
      importEnabled
    }
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchFeatureFlags with error')
    throw new Error('Failed to fetch flagsResult.');
  }
}
export async function fetchPlayerById(id: string, addTournamentsHistoryData = false) {
  methodStart();
  noStore();
  try {
    const player = await getPlayerById(id);
    if (player && addTournamentsHistoryData){
      player.tournamentsData = await getPlayerTournamentsHistory(player!.phone_number);
    }
    methodEnd('fetchPlayerById')
    return player;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchPlayerById with error')
    throw new Error('Failed to fetchPlayerById.');
  }
}

export async function fetchPlayerCurrentTournamentHistory(phoneNumber: string) {
  methodStart();
  noStore();
  try {
    const dayName = (new Date()).toLocaleString('en-us', {weekday: 'long'});

    const todayHistory =  await getTodayHistory();
    const result = todayHistory.filter(({ phone_number})=> phone_number === phoneNumber);
    methodEnd('fetchPlayerCurrentTournamentHistory')
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchTournamentByDay with error')
    throw new Error('Failed to fetchTournamentById.');
  }
}
export async function fetchTournamentByDay(day?: string) {
  methodStart();
  noStore();
  try {
    const dayName = day ?? (new Date()).toLocaleString('en-us', {weekday: 'long'});

    const result =  await getTodayTournament(dayName)
    methodEnd('fetchTournamentByDay')
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchTournamentByDay with error')
    throw new Error('Failed to fetchTournamentById.');
  }
}

export async function fetchRsvpCountForTodayTournament() {
  methodStart();
  noStore();
  try {
    const rsvps = await getAllRsvps();
    const todayDate = getTodayShortDate();
    const result = rsvps.filter(rsvp => rsvp.date === todayDate).length;
    methodEnd('fetchRsvpCountForTodayTournament')
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchRsvpCountForTodayTournament with error')
    throw new Error('Failed to fetchTournamentById.');
  }
}

export async function fetchPlayerByUserId(userId: string) {
  methodStart();
  noStore();
  try {
      const user = await getUserById(userId);
      if (!user){
        return null;
      }
    const playerPhoneNumber = user.phone_number;
      const player = await getPlayerByPhoneNumber(playerPhoneNumber)

      if (player){
        const [historyLog, rsvpForToday, tournamentsData] = await Promise.all([getPlayerHistory(playerPhoneNumber), isPlayerRsvp(playerPhoneNumber, getTodayShortDate()),getPlayerTournamentsHistory(playerPhoneNumber) ])
        player.historyLog = historyLog;
        player.rsvpForToday = rsvpForToday;
        player.tournamentsData =tournamentsData;
      }
      methodEnd('fetchPlayerByUserId')
      return player;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchPlayerByUserId with error')
    throw new Error('Failed to fetchPlayerByUserId.');
  }
}

export async function fetchUserById(id: string) {
  methodStart();
  noStore();
  try {
    const result =  await getUserById(id);
    methodEnd('fetchUserById')
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    methodEnd('fetchUserById with error')
    throw new Error('Failed to fetchPlayerByPhoneNumber.');
  }
}

export async function getLastConnectedUser() {
  methodStart();
  noStore();
  const user = (await sql`SELECT phone_number, name FROM last_connected_user`).rows[0];
  methodEnd('getLastConnectedUser')
  return user;
}
