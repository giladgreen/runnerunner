'use server';
import * as cache from './cache';
import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import fetch from 'node-fetch';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import {
  PlayerDB,
  UserDB,
  TournamentDB,
  WinnerDB,
  RSVPDB,
  ImageDB,
  LogDB,
  PrizeDB,
  PrizeInfoDB,
  BugDB,
  TournamentsAdjustmentsDB,
  FeatureFlagDB,
  ChangeLogDB,
  PhoneConfirmationCodeData
} from './definitions';

import { signIn } from '../../auth';
import { unstable_noStore as noStore } from 'next/dist/server/web/spec-extension/unstable-no-store';
import {
  getCurrentDate,
  getTodayShortDate,
  getUpdatedAtFormat,
} from './serverDateUtils';
const senderPhone = '0587869910'; // TODO
const SMS_API_KEY = process.env.SMS_API_KEY;
const SMS_PASS = process.env.SMS_PASS;
const TARGET_MAIL = 'green.gilad+runner@gmail.com';
let clearOldRsvpLastRun = getCurrentDate('2024-06-15T10:00:00.000Z').getTime();
const TWO_HOURS = 1000 * 60 * 60 * 2;
const SUPER_ADMINS = ['0587869910', '0524803571', '0543138583'];
const ADMINS = [
  '0587869910',
  '0524803571',
  '0524803577',
  '0508874068',
  '0509108188',
  '0526218302',
  '0524447990',
  '0543138583',
  '0547403396',
  '0549170324',
];
const WORKERS = ['0526841902', '0523457654', '0528359470'];
const MOCK_UUID = '5d4d2a2a-fe47-4a63-a4db-13eeebd83054';
const POSITIONS = {
  1: 'ראשון',
  2: 'שני',
  3: 'שלישי',
  4: 'רביעי',
  5: 'חמישי',
  6: 'שישי',
  7: 'שביעי',
  8: 'שמיני',
  9: 'תשיעי',
  10: 'עשירי',
  11: 'אחד עשר',
  12: 'שני עשר',
  13: 'שלושה עשר',
  14: 'ארבעה עשר',
  15: 'חמישה עשר',
  16: 'שישה עשר',
  17: 'שבעה עשר',
  18: 'שמונה עשר',
  19: 'תשעה עשר',
};
const phoneToName = {
  '0587869910': 'גלעד גרין',
  '0524803571': 'אבי אסרף',
  '0524803577': 'עוז',
  '0508874068': 'מירי',
  '0526841902': 'דניאל',
};
export type State = {
  errors?: {
    start_time?: string[];
    name?: string[];
    extra?: string[];
    credit?: string[];
    balance?: string[];
    change?: string[];
    change2?: string[];
    phone_number?: string[];
    new_phone_number?: string[];
    note?: string[];
    note2?: string[];
    notes?: string[];
    description?: string[];
    amount?: string[];
    position?: string[];
    prize?: string[];
    initial_stack?: string[];
    buy_in?: string[];
    re_buy?: string[];
    max_players?: string[];
    rsvp_required?: string[];
    phase_length?: string[];
    last_phase_for_rebuy?: string[];
  };
  message?: string | null;
};

async function getAllFlags(): Promise<FeatureFlagDB[]> {
  const data = await sql<FeatureFlagDB>`SELECT * FROM feature_flags`;
  return data.rows;
}

async function fetchFeatureFlags() {
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

  return {
    prizesEnabled,
    rsvpEnabled,
    playerRsvpEnabled,
    usePhoneValidation,
    importEnabled,
    playersSeeCreditEnabled
  };
}

async function getUserById(userId: string) {
  const resultFromCache = await cache.getUserById(userId);
  if (resultFromCache) {
    return resultFromCache;
  }

  const user = (await sql<UserDB>`SELECT * FROM users WHERE id = ${userId}`)
    .rows[0];

  await cache.saveUser(user);
  return user;
}
////////////
//  sync function
////////////
function sendEmail(to: string, subject: string, body: string) {
  const auth = {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.GMAIL_APP_PASSWORD,
  };
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth,
  });
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to,
    subject,
    text: body,
  };
  console.log('>> sending email to:', to);
  console.log('>> subject:', subject);
  console.log('>> body:', body);
  if (process.env.LOCAL === 'true') {
    console.log('>> skipping sending email locally');
    return;
  }
  transporter.sendMail(
    mailOptions,
    function (error: any, info: { response: string }) {
      if (error) {
        console.error('>> error sending mail:', error.message);
      } else {
        console.log('>> Email sent: ' + info.response);
      }
    },
  );
}

function startTransaction() {
  return sql`BEGIN;`;
}

function commitTransaction() {
  return sql`COMMIT;`;
}

function cancelTransaction() {
  return sql`ROLLBACK;`;
}

function insertIntoBugs(description: string) {
  return sql`INSERT INTO bugs (description) VALUES (${description})`;
}

function insertIntoImages(phoneNumber: string, imageUrls: string) {
  return sql`INSERT INTO images (phone_number, image_url) VALUES (${phoneNumber}, ${imageUrls})`;
}

function insertChangeLog(changeLog: ChangeLogDB){
  return sql`INSERT INTO change_log 
(changed_entity, changed_entity_id, changed_entity_before, changed_entity_after, changed_by, changed_by_name) 
VALUES 
(${changeLog.changed_entity}, ${changeLog.changed_entity_id}, ${changeLog.changed_entity_before}, ${changeLog.changed_entity_after}, ${changeLog.changed_by}, ${changeLog.changed_by_name})`;
}

function insertIntoHistory(
  phoneNumber: string,
  tournamentId: string | null,
  balance: number,
  note = '',
  type = 'credit',
) {
  return sql`
      INSERT INTO history (phone_number, change, note, type, tournament_id)
      VALUES (${phoneNumber}, ${balance}, ${note}, ${type}, ${tournamentId})
    `;
}

////////////
//  async function
////////////

async function touchPlayer(phoneNumber: string) {
  return sql`UPDATE players SET updated_at=${getUpdatedAtFormat()} WHERE phone_number = ${phoneNumber}`;
}

async function insertIntoPlayers(
  name: string,
  balance: number,
  phoneNumber: string,
  imageUrl: string,
  note: string,
  notes?: string,
) {
  try {
    await startTransaction();
    await sql`
          INSERT INTO players (name, phone_number, image_url, notes)
          VALUES (${name}, ${phoneNumber}, ${imageUrl} , ${notes ?? ''})
        `;

    await insertIntoHistory(phoneNumber, null, balance, note, 'credit');
    await commitTransaction();
  } catch (e) {
    await cancelTransaction();
    throw e;
  }
}

async function insertIntoPhoneConfirmations(phoneNumber: string, code: string) {
  await sql`
          INSERT INTO phone_confirmations (phone_number, confirmation_code)
          VALUES (${phoneNumber}, ${code})
        `;
}

async function getPhoneConfirmationCode(phoneNumber: string) {
  const results = await sql<PhoneConfirmationCodeData>`
          SELECT * FROM phone_confirmations WHERE phone_number = ${phoneNumber} ORDER BY created_at DESC LIMIT 1`;

  return results.rows[0];
}


async function getPlayerByPhoneNumber(phoneNumber: string) {
  const playersResult = await sql<PlayerDB>`SELECT * FROM players AS P 
JOIN (SELECT phone_number, sum(change) AS balance FROM history WHERE phone_number = ${phoneNumber} AND (type = 'credit_to_other' OR type ='credit' OR type ='prize') GROUP BY phone_number) AS H
ON P.phone_number = H.phone_number
WHERE P.phone_number = ${phoneNumber};`;

  const player = playersResult.rows[0] ?? null;
  if (player) {
    player.balance = Number(player.balance);
  }
  return player;
}

async function getPlayerById(playerId: string) {
  const playerResult = await sql<PlayerDB>`SELECT * FROM players AS P 
JOIN (SELECT phone_number, sum(change) AS balance FROM history WHERE type = 'credit_to_other' OR type ='credit' OR type ='prize' GROUP BY phone_number) AS H
ON P.phone_number = H.phone_number
WHERE P.id = ${playerId};`;

  const player = playerResult?.rows[0] ?? null;
  if (player) {
    player.balance = Number(player.balance);
  }
  return player;
}

async function handleCreditByOther(
  type: string,
  otherPlayerPhoneNumber: string,
  note: string,
  player: PlayerDB,
  amount: number,
) {
  noStore();
  let otherPlayer;
  let useOtherPlayerCredit;
  let historyNote;
  let otherHistoryNote;

  if (type === 'credit_by_other') {
    if (!otherPlayerPhoneNumber) {
      console.error('### did not get other person data');
      return {
        message: 'חסר מספר הטלפון של השחקן האחר',
      };
    }
    otherPlayer = await getPlayerByPhoneNumber(
      otherPlayerPhoneNumber as string,
    );
    if (!otherPlayer) {
      console.error('### did not find other person data');
      return {
        message: 'לא נמצא מידע על שחקן',
      };
    }
    useOtherPlayerCredit = true;
    historyNote = `${note}
(${-1 * amount}₪ על חשבון ${otherPlayer.name} ${otherPlayer.phone_number} ) `;

    otherHistoryNote = `${note}
(לטובת ${player.name} ${player.phone_number} ) `;
  }

  return {
    otherPlayer: otherPlayer as unknown as PlayerDB,
    useOtherPlayerCredit,
    historyNote,
    otherHistoryNote,
  };
}

async function createTournamentAdjustmentLog(
  formData: FormData,
  prevPage: string,
  userId: string,
  tournamentId: string,
) {
  const change = formData.get('change') as string;
  const type = formData.get('type') as string;
  const note = formData.get('note') as string;

  const user = await getUserById(userId);
  const username = user?.name ?? user?.phone_number ?? 'unknown';

  try {
    await sql`INSERT INTO tournaments_adjustments (tournament_id,type,change,reason,updated_by)
              VALUES 
              (${tournamentId}, ${type},${change}, ${note}, ${username})`;
  } catch (error) {
    console.error('### create TournamentAdjustment log error', error);
    return {
      message: 'איראה שגיאה',
    };
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

async function deleteTournamentAdjustmentLog(
  adjustmentId: string,
  userId: string,
  prevPage: string,
) {
  const user = await getUserById(userId);
  const username = user?.name ?? user?.phone_number ?? 'unknown';

  try {
    const adjustment = (
      await sql<TournamentsAdjustmentsDB>`SELECT * FROM tournaments_adjustments WHERE id = ${adjustmentId}`
    ).rows[0];
    if (!adjustment) {
      return;
    }
    await startTransaction();

    await sql`INSERT INTO deleted_tournaments_adjustments 
          (id, tournament_id, type, change, reason, updated_by, deleted_by) 
          VALUES
           (${adjustment.id},${adjustment.tournament_id},${adjustment.type},${adjustment.change},${adjustment.reason},${adjustment.updated_by},${username})`;

    await sql`DELETE FROM tournaments_adjustments WHERE id = ${adjustmentId}`;

    await commitTransaction();
  } catch (error) {
    console.error('>> deleteTournamentAdjustmentLog Error:', error);
    await cancelTransaction();
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

async function createPlayerLog(
  player: PlayerDB,
  formData: FormData,
  prevPage: string,
  usage: boolean,
  userId: string,
  tournamentId: string | null,
) {
  noStore();

  const CreateUsageLog = z.object({
    type: z.coerce.string(),
    type2: z.coerce.string().optional().nullable(),
    change: z.coerce.number(),
    change2: z.coerce.number().optional().nullable(),
    split: z.coerce.string(),
    note: z.string().min(1, 'change note can not be left empty'),
    note2: z
      .string()
      .min(0, 'change note can not be left empty')
      .optional()
      .nullable(),
  });

  const validatedFields = CreateUsageLog.safeParse({
    type: formData.get('type'),
    type2: formData.get('type2'),
    change: formData.get('change'),
    change2: formData.get('change2'),
    note: formData.get('note'),
    note2: formData.get('note2'),
    split: formData.get('split'),
  });

  if (!validatedFields.success) {
    console.log(
      '## createPlayerLog. errors',
      validatedFields.error.flatten().fieldErrors,
    );

    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'שדה חסר, אין אפשרות לסיים את הפעולה',
    };
  }


  const isSplit = validatedFields.data.split === 'true';
  const user = await getUserById(userId);
  const username = user?.name ?? user?.phone_number ?? 'unknown';
  const change = validatedFields.data.change * (usage ? -1 : 1);
  const change2 = validatedFields.data.change2 ?? 0;
  const note = validatedFields.data.note;
  const note2 = validatedFields.data.note2;

  const type = usage ? ((formData.get('type') as string) ?? 'prize') : 'credit';
  const type2 = isSplit ? (formData.get('type2') as string) : '';

  const otherPlayerPhoneNumber = formData.get('other_player') as string;
  const {
    otherPlayer,
    useOtherPlayerCredit,
    historyNote,
    otherHistoryNote,
    message,
  } = await handleCreditByOther(
    type,
    otherPlayerPhoneNumber,
    note,
    player,
    change,
  );
  if (message) {
    return {
      message,
    };
  }

  try {
    await startTransaction();
    if (useOtherPlayerCredit) {
      await sql`
              INSERT INTO history (phone_number, change, note, type, updated_by, other_player_phone_number, tournament_id)
              VALUES 
              (${
                player.phone_number
              }, ${0}, ${historyNote}, ${'credit_by_other'}, ${username}, ${
                otherPlayerPhoneNumber as string
              }, ${tournamentId}),
              (${
                otherPlayerPhoneNumber as string
              }, ${change}, ${otherHistoryNote}, ${'credit_to_other'}, ${username}, '', ${tournamentId})
            `;
    } else {

      await sql`
              INSERT INTO history (phone_number, change, note, type, updated_by, tournament_id)
              VALUES (${player.phone_number}, ${change}, ${note}, ${type}, ${username}, ${tournamentId})
            `;
    }
    if (isSplit) {

      const results =
        await sql`SELECT * FROM history WHERE phone_number = ${player.phone_number} ORDER BY updated_at DESC LIMIT 1`;
      const historyLogId = results.rows[0].id;
      await sql`INSERT INTO tournaments_adjustments (tournament_id,type,change,reason,history_log_id, updated_by)
              VALUES 
              (${tournamentId}, ${type2},${change2}, ${note2}, ${historyLogId}, ${username})`;
    }
    const playerPhoneToUpdate =
      useOtherPlayerCredit && otherPlayer
        ? otherPlayer.phone_number
        : player.phone_number;
    await touchPlayer(playerPhoneToUpdate);

    await commitTransaction();
  } catch (error) {
    await cancelTransaction();
    console.error('### create log error', error);
    return {
      message: 'איראה שגיאה',
    };
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

async function getDateWinnersRecord(date: string, tournamentId: string) {
  const winnersResult =
    await sql<WinnerDB>`SELECT * FROM winners WHERE date = ${date} AND tournament_id = ${tournamentId}`;
  return winnersResult.rows[0];
}

////////////
//  exported function
////////////
export async function createReport(prevPage: string, formData: FormData) {
  noStore();
  const description = formData.get('description') as string;
  try {
    await insertIntoBugs(description);
    sendEmail(TARGET_MAIL, 'New bug report', description);
  } catch (error) {
    console.error('## createReport error', error);
    return {
      message: 'איראה שגיאה ביצירת הבאג',
    };
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

export async function createPlayer(
  prevPage: string,
  _prevState: State,
  formData: FormData,
) {
  noStore();
  const name = formData.get('name') as string;
  const balance = formData.get('balance') as string;
  const note = (formData.get('note') as string) ?? '';
  const phone_number = formData.get('phone_number') as string;
  const notes = (formData.get('notes') as string) ?? '';
  let image_url =
    (formData.get('image_url') as string) ?? '/players/default.png';
  const phoneNumber = phone_number.replaceAll('-', '');

  const existingPlayer = await getPlayerByPhoneNumber(phoneNumber);
  if (existingPlayer) {
    return {
      errors: {
        phone_number: ['שחקן עם מספר זה כבר קיים'],
      },
    };
  }
  if (!name || name.trim().length < 1) {
    return {
      errors: {
        name: ['חסר שם'],
      },
    };
  }
  if (!phoneNumber || phoneNumber.trim().length < 3) {
    return {
      errors: {
        phone_number: ['חסר מספר טלפון'],
      },
    };
  }
  if (isNaN(Number(balance))) {
    return {
      errors: {
        balance: ['קרדיט לא חוקי'],
      },
    };
  }
  if (!image_url || image_url.trim().length < 7) {
    image_url = '/players/default.png';
  }
  try {
    if (image_url !== '/players/default.png') {
      await insertIntoImages(phoneNumber, image_url);
    }
  } catch (error) {
    console.error('## failed to add image', error);
  }
  try {
    await insertIntoPlayers(
      name,
      Number(balance),
      phoneNumber,
      image_url,
      note,
      notes,
    );
    sendEmail(
      TARGET_MAIL,
      'New player created',
      `player name: ${name}
phone: ${phone_number}`,
    );
  } catch (error) {
    console.error('## createPlayer error', error);
    return {
      message: 'איראה שגיאה ביצירת שחקן חדש',
    };
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

export async function removeOldRsvp() {
  try {
    await startTransaction();
    console.log(
      '>> remove Old Rsvp, clearOldRsvpLastRun:',
      clearOldRsvpLastRun,
    );
    const rsvpItemsResult =
      await sql<RSVPDB>`SELECT * FROM rsvp WHERE created_at < now() - interval '48 hour'`;
    const rsvpItems = rsvpItemsResult.rows;
    await Promise.all(
      rsvpItems.map((item) => {
        return sql`INSERT INTO deleted_rsvp (id, date, phone_number, tournament_id) VALUES (${item.id},${item.date},${item.phone_number},${item.tournament_id})`;
      }),
    );
    await sql`DELETE FROM rsvp WHERE created_at < now() - interval '48 hour'`;
    await commitTransaction();
    clearOldRsvpLastRun = getCurrentDate().getTime();
  } catch (error) {
    await cancelTransaction();
    console.error('rsvpPlayerForDay Error:', error);
  }
}

export async function createPlayerUsageLog(
  data: {
    player: PlayerDB;
    prevPage: string;
    userId: string;
    tournamentId: string | null;
  },
  _prevState: State,
  formData: FormData,
) {
  noStore();
  return createPlayerLog(
    data.player,
    formData,
    data.prevPage,
    true,
    data.userId,
    data.tournamentId,
  );
}

export async function TournamentAdjustmentLog(
  data: {
    prevPage: string;
    userId: string;
    tournamentId: string;
  },
  _prevState: State,
  formData: FormData,
) {
  noStore();
  return createTournamentAdjustmentLog(
    formData,
    data.prevPage,
    data.userId,
    data.tournamentId,
  );
}

export async function DeleteTournamentAdjustmentLog(
  data: {
    adjustmentId: string;
    userId: string;
    prevPage: string;
  },
  _prevState: State,
  formData: FormData,
) {
  noStore();

  return deleteTournamentAdjustmentLog(
    data.adjustmentId,
    data.userId,
    data.prevPage,
  );
}

export async function createPlayerNewCreditLog(
  data: {
    player: PlayerDB;
    prevPage: string;
    userId: string;
    tournamentId: string | null;
  },
  _prevState: State,
  formData: FormData,
) {
  noStore();
  return createPlayerLog(
    data.player,
    formData,
    data.prevPage,
    false,
    data.userId,
    data.tournamentId,
  );
}

export async function setPlayerPosition(
  {
    playerId,
    prevPage,
    tournamentId,
  }: { playerId: string; prevPage: string; tournamentId: string },
  formData: FormData,
) {
  noStore();
  const newPosition = Number(formData.get('position') as string);

  if (isNaN(newPosition) || newPosition < 0) {
    return {
      message: 'איראה שגיאה',
    };
  }
  try {
    const date = getTodayShortDate();

    const player = await getPlayerById(playerId);
    if (!player) {
      console.error('# setPlayerPosition.  cant find player', playerId);
      return {
        message: 'איראה שגיאה',
      };
    }

    const [todayTournamentResult, winnersResult] = await Promise.all([
      sql<TournamentDB>`SELECT * FROM tournaments WHERE id = ${tournamentId};`,
      sql<WinnerDB>`SELECT * FROM winners WHERE date = ${date} AND tournament_id = ${tournamentId}`,
    ]);

    const todayTournament = todayTournamentResult.rows[0];
    let winnersObject: WinnerDB | undefined = winnersResult.rows[0];
    if (!winnersObject) {
      const allWinners = await sql<WinnerDB>`SELECT * FROM winners`;
      winnersObject = allWinners.rows.find(
        (item) => item.date === date && item.tournament_id === tournamentId,
      );
      if (winnersObject) {
        console.warn('# This code is not redundant - we actually get here..');
      }
    }

    if (winnersObject) {
      const newWinnersObject = {
        ...JSON.parse(winnersObject.winners),
        [player.phone_number]: {
          position: newPosition,
          hasReceived: false,
          creditWorth: -1,
        },
      };
      if (newPosition == 0) {
        delete newWinnersObject[player.phone_number];
      }

      await sql`UPDATE winners SET winners=${JSON.stringify(
        newWinnersObject,
      )} WHERE id = ${winnersObject.id}`;
    } else {
      const newWinnersObject = {
        [player.phone_number]: {
          position: newPosition,
          hasReceived: false,
          creditWorth: -1,
        },
      };

      await sql`INSERT INTO winners (date, tournament_name, tournament_id, winners) VALUES (${date}, ${
        todayTournament.name
      },${tournamentId}, ${JSON.stringify(newWinnersObject)})`;
    }
  } catch (error) {
    console.error('## create log error', error);
    return {
      message: 'איראה שגיאה',
    };
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

export async function setPrizesCreditWorth(
  {
    date,
    tournamentId,
    prevPage,
  }: { date: string; prevPage: string; tournamentId: string },
  _prevState: State,
  formData: FormData,
) {
  noStore();

  try {
    await startTransaction();
    const winnersObject = await getDateWinnersRecord(date, tournamentId);

    if (!winnersObject) {
      console.error('## setPrizesCreditWorth Failed to find winnersObject');
      return {
        message: 'איראה שגיאה',
      };
    }
    const currentWinnersObject = JSON.parse(winnersObject!.winners);

    let credits = [] as number[];
    for (let index = 1; index < 20; index++) {
      const credit = Number(formData.get(`#${index}`) as string);
      credits[index] = credit;
    }

    Object.keys(currentWinnersObject).forEach((key) => {
      const playerData = currentWinnersObject[key];
      playerData.creditWorth = credits[playerData.position];
    });

    await sql`UPDATE winners SET winners=${JSON.stringify(
      currentWinnersObject,
    )} WHERE id = ${winnersObject.id}`;

    await commitTransaction();
  } catch (error) {
    console.error('## setPrizesCreditWorth error', error);
    await cancelTransaction();
    return {
      message: 'איראה שגיאה',
    };
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}
export async function givePlayerPrizeOrCredit(
  {
    stringDate,
    playerId,
    userId,
    prevPage,
    tournamentId,
  }: {
    stringDate?: string;
    userId: string;
    playerId: string;
    prevPage: string;
    tournamentId: string | null;
  },
  _prevState: State,
  formData: FormData,
) {
  noStore();
  try {
    await startTransaction();
    const player = await getPlayerById(playerId);
    if (!player) {
      console.error('## givePlayerPrizeOrCredit Failed to find player');
      return {
        message: 'איראה שגיאה',
      };
    }

    const type = formData.get('type') as string;
    const credit = formData.get('credit') as string;
    const prize = formData.get('prize') as string;
    const prizeWorth = Number(formData.get('prize_worth') as string) as number;
    const creditWorth = Number(
      formData.get('credit_worth') as string,
    ) as number;
    const updatePlayerCredit =
      (formData.get('update_player_credit') as string) === 'on';

    const date = stringDate ?? getTodayShortDate();

    const [tournamentResult, winnersResult] = await Promise.all([
      sql<TournamentDB>`SELECT * FROM tournaments WHERE id = ${tournamentId};`,
      sql<WinnerDB>`SELECT * FROM winners WHERE date = ${date} AND tournament_id = ${tournamentId}`,
    ]);

    const winners = winnersResult.rows[0];
    if (!winners) {
      console.error('## givePlayerPrizeOrCredit Failed to find winners in DB');
      return {
        message: 'איראה שגיאה',
      };
    }
    const winnersObject = JSON.parse(winners.winners);
    const newWinnersObject = { ...winnersObject };
    const playerObject = winnersObject[player.phone_number];
    if (!playerObject) {
      console.error(
        '## givePlayerPrizeOrCredit Failed to find player in winners object',
      );
      return {
        message: 'איראה שגיאה',
      };
    }
    const position = playerObject.position;
    const hasReceived = playerObject.hasReceived;

    if (hasReceived) {
      console.error(
        '## givePlayerPrizeOrCredit Player has already received prize',
      );
      return {
        message: 'איראה שגיאה',
      };
    }
    const tournament = tournamentResult.rows[0];
    const tournamentName = tournament.name;

    // @ts-ignore
    const place = POSITIONS[position];
    let note = ` ${tournamentName}, מקום ${place}`;

    if (type === 'credit') {
      const amount = Number(credit);
      if (isNaN(amount) || amount < 1) {
        console.error(
          '## givePlayerPrizeOrCredit Invalid credit amount:',
          credit,
        );
        return {
          message: 'איראה שגיאה',
        };
      }

      await touchPlayer(player.phone_number);
      const userResult = await getUserById(userId);
      await sql`
          INSERT INTO history (phone_number, change, note, type, updated_by, tournament_id)
          VALUES (${player.phone_number}, ${amount}, ${note}, 'credit', ${
            userResult?.name ?? 'unknown'
          }, ${tournamentId})
        `;
    } else if (type === 'prize') {
      const todayTournamentData = `${tournamentName} ${date}`;
      await sql`INSERT INTO prizes (tournament, phone_number, prize) VALUES (${todayTournamentData}, ${player.phone_number}, ${prize})`;

      if (prizeWorth !== creditWorth && updatePlayerCredit) {
        await touchPlayer(player.phone_number);
        //player
        // add history
        const userResult = await getUserById(userId);

        const amount = creditWorth - prizeWorth;
        note += ` - `;
        note += ` לקח פרס בשווי `;
        note += `${prizeWorth}`;

        await sql`INSERT INTO history (phone_number, change, note, type, updated_by, tournament_id)
        VALUES (${player.phone_number}, ${amount}, ${note}, 'credit', ${
          userResult?.name ?? 'unknown'
        }, ${tournamentId})`;
      }
    }

    newWinnersObject[player.phone_number] = {
      ...playerObject,
      hasReceived: true,
    };

    await sql`UPDATE winners SET winners=${JSON.stringify(
      newWinnersObject,
    )} WHERE id = ${winners.id}`;

    await commitTransaction();
  } catch (error) {
    console.error('## givePlayerPrizeOrCredit error', error);
    await cancelTransaction();
    return {
      message: 'איראה שגיאה',
    };
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}
export async function setPlayerPrize(
  {
    playerId,
    prevPage,
    tournamentId,
  }: { playerId: string; prevPage: string; tournamentId: string },
  _prevState: State,
  formData: FormData,
) {
  noStore();
  const newPrize = formData.get('prize') as string;

  if (!newPrize) {
    return {
      message: 'איראה שגיאה',
    };
  }
  try {
    const player = await getPlayerById(playerId);
    if (!player) {
      return {
        message: 'איראה שגיאה',
      };
    }

    const todayTournamentResult =
      await sql<TournamentDB>`SELECT * FROM tournaments WHERE id = ${tournamentId};`;
    const todayTournament = todayTournamentResult.rows[0];
    const date = getTodayShortDate();
    const todayTournamentData = `${todayTournament.name} ${date}`;
    await sql`INSERT INTO prizes (tournament, phone_number, prize) VALUES (${todayTournamentData}, ${player.phone_number}, ${newPrize})`;
  } catch (error) {
    console.error('## create log error', error);
    return {
      message: 'איראה שגיאה',
    };
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

export async function updatePlayer(
  { id, prevPage, userId }: { id: string; prevPage: string, userId: string },
  _prevState: State,
  formData: FormData,
) {
  noStore();

  const player = await getPlayerById(id);
  if (!player) {
    console.error('## updatePlayer: player not found');
    return {
      message: 'לא נמצא שחקן עם מזהה זה',
    };
  }

  const UpdatePlayer = z.object({
    name: z.string().min(1, 'name can not be left empty'),
    notes: z.string(),
    new_phone_number: z.string().optional(),
  });

  const validatedFields = UpdatePlayer.safeParse({
    name: formData.get('name'),
    notes: formData.get('notes'),
  });

  if (!validatedFields.success) {
    console.error(
      '## updatePlayer error',
      validatedFields.error.flatten().fieldErrors,
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'איראה שגיאה',
    };
  }
  const image_url = formData.get('image_url') as string;
  const oldPhoneNumber = player.phone_number;
  let newPhoneNumber = (
    (formData.get('new_phone_number') ?? oldPhoneNumber) as string
  ).replaceAll('-', '');
  newPhoneNumber = `${newPhoneNumber.startsWith('0') ? '' : '0'}${newPhoneNumber}`;

  const { name, notes } = validatedFields.data;
  const user = await getUserById(userId);
  const changeLog = {
    changed_entity: 'player:change',
    changed_entity_id: id,
    changed_entity_before: JSON.stringify({
      name: player.name,
      notes: player.notes,
      image_url: player.image_url,
      phone_number: player.phone_number
    }),
    changed_entity_after: JSON.stringify({
      name,
      notes,
      image_url,
      phone_number: newPhoneNumber
    }),
    changed_by: userId,
    changed_by_name: user ? user.name : 'unknown',
  } as ChangeLogDB;

  let imageHasChanged = false;

  try {
    if (
      image_url &&
      image_url.length > 2 &&
      image_url !== '/players/default.png'
    ) {
      imageHasChanged = true;

      if (player && player.image_url !== image_url) {
        await sql`INSERT INTO images (phone_number, image_url) VALUES (${player.phone_number}, ${image_url})`;
      }
    }
  } catch (error) {
    console.error('## add image error', error);
  }

  const date = getUpdatedAtFormat();

  try {
    if (imageHasChanged) {
      await startTransaction();
      await sql`
      UPDATE players
      SET name = ${name},
      image_url = ${image_url},
      notes = ${notes}, 
      updated_at=${date}
      WHERE id = ${id} `;
    } else {
      await sql`
      UPDATE players
      SET name = ${name},
      notes = ${notes}, 
      updated_at=${date}
      WHERE id = ${id} `;
    }


    if (newPhoneNumber && newPhoneNumber !== oldPhoneNumber) {
      await sql`UPDATE players SET phone_number = ${newPhoneNumber} WHERE phone_number = ${oldPhoneNumber} `;
      await sql`UPDATE history SET phone_number = ${newPhoneNumber} WHERE phone_number = ${oldPhoneNumber} `;
      await sql`UPDATE rsvp SET phone_number = ${newPhoneNumber} WHERE phone_number = ${oldPhoneNumber} `;
      await sql`UPDATE prizes SET phone_number = ${newPhoneNumber} WHERE phone_number = ${oldPhoneNumber} `;
      await sql`UPDATE images SET phone_number = ${newPhoneNumber} WHERE phone_number = ${oldPhoneNumber} `;
    }


    await insertChangeLog(changeLog);
    await commitTransaction();

  } catch (error) {
    await cancelTransaction();
    console.error('## updatePlayer error', error);
    return { message: 'איראה שגיאה' };
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

export async function deleteTournament(
  tournamentId: string,
  prevPage: string,
  userId: string,
) {
  noStore();
  try {
    const user = await getUserById(userId);
    const tournamentToDelete = (
      await sql`SELECT * FROM tournaments WHERE id = ${tournamentId}`
    ).rows[0];
    if (tournamentToDelete) {
      const changeLog = {
        changed_entity: 'tournament:deleted',
        changed_entity_id: tournamentId,
        changed_entity_before: JSON.stringify(tournamentToDelete),
        changed_by: userId,
        changed_by_name: user ? user.name : 'unknown',
      } as ChangeLogDB;
      await startTransaction();
      await sql`INSERT INTO deleted_tournaments (id,day,name, i, buy_in,re_buy,max_players, rsvp_required, deleted_by ) 
        VALUES (${tournamentToDelete.id},${tournamentToDelete.day},${
          tournamentToDelete.name
        },${tournamentToDelete.i},${tournamentToDelete.buy_in},${
          tournamentToDelete.re_buy
        },${tournamentToDelete.max_players},${
          tournamentToDelete.rsvp_required
        },${user ? (user.name ?? user.phone_number ?? userId) : userId})`;

      await sql`DELETE FROM tournaments WHERE id = ${tournamentId}`;

      await insertChangeLog(changeLog);
      await commitTransaction();
      sendEmail(
        TARGET_MAIL,
        'tournaments deleted',
        `day: ${tournamentToDelete.day} name: ${tournamentToDelete.name}, buy_in: ${tournamentToDelete.buy_in}, re_buy: ${tournamentToDelete.re_buy}, max_players: ${tournamentToDelete.max_players}, rsvp_required: ${tournamentToDelete.rsvp_required}`,
      );
    }
  } catch (error) {
    await cancelTransaction();
    console.error('## deleteTournament error', error);
    return { message: 'איראה שגיאה' };
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

export async function updateTournament(
  { id, prevPage, userId }: { id: string; prevPage: string, userId: string },
  _prevState: State,
  formData: FormData,
) {
  noStore();
  const UpdateTournament = z.object({
    buy_in: z.coerce.number(),
    re_buy: z.coerce.number(),
    max_players: z.coerce.number(),
    initial_stack: z.coerce.number(),
    phase_length: z.coerce.number(),
    last_phase_for_rebuy: z.coerce.number(),
    rsvp_required: z.coerce.boolean(),
    name: z.string(),
    description: z.string(),
    start_time: z.string(),
  });

  const validatedFields = UpdateTournament.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    buy_in: formData.get('buy_in'),
    re_buy: formData.get('re_buy'),
    max_players: formData.get('max_players'),
    rsvp_required: formData.get('rsvp_required'),
    initial_stack: formData.get('initial_stack'),
    start_time: formData.get('start_time'),
    phase_length: formData.get('phase_length'),
    last_phase_for_rebuy: formData.get('last_phase_for_rebuy'),
  });

  if (!validatedFields.success) {
    console.error(
      '## updateTournament error',
      validatedFields.error.flatten().fieldErrors,
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'איראה שגיאה',
    };
  }

  const {
    name,
    description,
    buy_in,
    re_buy,
    max_players,
    rsvp_required,
    start_time,
    initial_stack,
    last_phase_for_rebuy,
    phase_length,
  } = validatedFields.data;
  const date = getUpdatedAtFormat();
  await startTransaction();
  try {
    const tournamentToUpdate = (
      await sql`SELECT * FROM tournaments WHERE id = ${id}`
    ).rows[0];
    if (tournamentToUpdate) {
      const user = await getUserById(userId);
      const changeLog = {
        changed_entity: 'tournament:change',
        changed_entity_id: id,
        changed_entity_before: JSON.stringify(tournamentToUpdate),
        changed_entity_after: JSON.stringify({
          ...tournamentToUpdate,
          name,
          description,
          buy_in,
          re_buy,
          max_players,
          rsvp_required,
          start_time,
          initial_stack,
          last_phase_for_rebuy,
          phase_length,
        }),
        changed_by: userId,
        changed_by_name: user ? user.name : 'unknown',
      } as ChangeLogDB;

      await sql`
      UPDATE tournaments
      SET name = ${name},description = ${description}, buy_in = ${buy_in},re_buy = ${re_buy},last_phase_for_rebuy = ${last_phase_for_rebuy},phase_length = ${phase_length},initial_stack=${initial_stack},start_time=${start_time}, max_players = ${max_players},rsvp_required=${rsvp_required}, updated_at=${date}
      WHERE id = ${id}
    `;
      await insertChangeLog(changeLog);
      await commitTransaction()
      sendEmail(
        TARGET_MAIL,
        'tournaments update',
        `day:${tournamentToUpdate.day}, name: ${name},description: ${description}, buy_in: ${buy_in}, re_buy: ${re_buy}, max_players: ${max_players}, rsvp_required: ${rsvp_required}, start_time: ${start_time}, initial_stack: ${initial_stack}, last_phase_for_rebuy: ${last_phase_for_rebuy}, phase_length: ${phase_length} `,
      );
    }
  } catch (error) {
    await cancelTransaction();
    console.error('## updateTournament error', error);
    return { message: 'איראה שגיאה' };
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

export async function createTournament(
  { prevPage }: { prevPage: string },
  _prevState: State,
  formData: FormData,
) {
  noStore();
  const CreateTournament = z.object({
    day: z.string(),
    buy_in: z.coerce.number(),
    re_buy: z.coerce.number(),
    initial_stack: z.coerce.number(),
    max_players: z.coerce.number(),
    rsvp_required: z.coerce.boolean(),
    name: z.string(),
    description: z.string(),
    start_time: z.string(),
    phase_length: z.coerce.number(),
    last_phase_for_rebuy: z.coerce.number(),
  });

  const validatedFields = CreateTournament.safeParse({
    day: formData.get('day'),
    name: formData.get('name'),
    description: formData.get('description'),
    buy_in: formData.get('buy_in'),
    re_buy: formData.get('re_buy'),
    max_players: formData.get('max_players'),
    rsvp_required: formData.get('rsvp_required'),
    initial_stack: formData.get('initial_stack'),
    start_time: formData.get('start_time'),
    phase_length: formData.get('phase_length'),
    last_phase_for_rebuy: formData.get('last_phase_for_rebuy'),
  });

  if (!validatedFields.success) {
    console.error(
      '## createTournament error',
      validatedFields.error.flatten().fieldErrors,
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'איראה שגיאה',
    };
  }

  const {
    day,
    name,
    description,
    buy_in,
    re_buy,
    max_players,
    rsvp_required,
    initial_stack,
    start_time,
    last_phase_for_rebuy,
    phase_length,
  } = validatedFields.data;

  try {
    const i =
      [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ].indexOf(day) + 1;

    await sql`INSERT INTO tournaments (day,name,description, i, buy_in,re_buy,max_players, rsvp_required, initial_stack, start_time, last_phase_for_rebuy, phase_length  ) 
        VALUES (${day},${name},${description},${i},${buy_in},${re_buy},${max_players},${rsvp_required}, ${initial_stack}, ${start_time}, ${last_phase_for_rebuy}, ${phase_length})`;

    sendEmail(
      TARGET_MAIL,
      'new tournaments created',
      `day:${day}, name: ${name}, buy_in: ${buy_in}, re_buy: ${re_buy}, max_players: ${max_players}, rsvp_required: ${rsvp_required},  start_time: ${start_time}, initial_stack: ${initial_stack}, last_phase_for_rebuy: ${last_phase_for_rebuy}, phase_length: ${phase_length}`,
    );
  } catch (error) {
    console.error('## updateTournament error', error);
    return { message: 'איראה שגיאה' };
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

export async function createPrizeInfo(
  { prevPage }: { prevPage: string },
  _prevState: State,
  formData: FormData,
) {
  noStore();
  const name = (formData.get('name') as string) ?? '';
  const extra = (formData.get('extra') as string) ?? '';
  const credit = (formData.get('credit') as string) ?? '';

  if (!name || name.trim().length < 1) {
    return {
      errors: {
        name: ['missing name'],
      },
    };
  }

  if (!credit || credit.trim().length < 1 || isNaN(Number(credit))) {
    return {
      errors: {
        credit: ['illegal credit'],
      },
    };
  }

  try {
    await sql`INSERT INTO prizes_info (name, extra,credit) VALUES (${name},${extra},${credit})`;
  } catch (error) {
    return { message: 'איראה שגיאה' };
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

export async function updatePrizeInfo(
  { prizeId, prevPage, userId }: { prizeId: string; prevPage: string ; userId: string },
  _prevState: State,
  formData: FormData,
) {
  noStore();
  const user = await getUserById(userId);

  const name = (formData.get('name') as string) ?? '';
  const extra = (formData.get('extra') as string) ?? '';
  const credit = (formData.get('credit') as string) ?? '';

  if (!name || name.trim().length < 1) {
    return {
      errors: {
        name: ['missing name'],
      },
    };
  }

  if (!credit || credit.trim().length < 1 || isNaN(Number(credit))) {
    return {
      errors: {
        credit: ['illegal credit'],
      },
    };
  }

  try {
    const existingPrize = (await sql`SELECT * FROM prizes_info WHERE id = ${prizeId}`).rows[0];
    if (existingPrize) {
      await startTransaction();
      const changeLog = {
        changed_entity: 'prize:change',
        changed_entity_id: prizeId,
        changed_entity_before: JSON.stringify(existingPrize),
        changed_entity_after: JSON.stringify({
          ...existingPrize,
          name,
          extra,
          credit,
        }),
        changed_by: userId,
        changed_by_name: user ? user.name : 'unknown',
      } as ChangeLogDB;


      await sql`UPDATE prizes_info SET name = ${name}, extra = ${extra}, credit = ${credit}, created_at = ${getUpdatedAtFormat()} WHERE id = ${prizeId}`;
      await insertChangeLog(changeLog);
      await commitTransaction();
    }
  } catch (error) {
    await cancelTransaction();
    return { message: 'איראה שגיאה' };
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

export async function deletePrizeInfo({
  prizeId,
  prevPage,
  userId
}: {
  prizeId: string;
  prevPage: string;
  userId: string;
}) {
  noStore();
  try {
    const prizeInfo = (
      await sql<PrizeInfoDB>`select * FROM prizes_info WHERE id = ${prizeId}`
    ).rows[0];

    if (prizeInfo) {
      const user = await getUserById(userId);
      const changeLog = {
        changed_entity: 'prize:deleted',
        changed_entity_id: prizeId,
        changed_entity_before: JSON.stringify(prizeInfo),
        changed_by: userId,
        changed_by_name: user ? user.name : 'unknown',
      } as ChangeLogDB;

      await startTransaction();
      await sql`INSERT INTO deleted_prizes_info (id, name, extra,credit,created_at) VALUES (${prizeInfo.id},${prizeInfo.name},${prizeInfo.extra},${prizeInfo.credit},${prizeInfo.created_at})`;
      await sql`DELETE FROM prizes_info WHERE id = ${prizeId}`;

      await insertChangeLog(changeLog);
      await commitTransaction();
    }

  } catch (error) {
    await cancelTransaction();
    return { message: 'איראה שגיאה' };
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

export async function deletePlayer({
  id,
  prevPage,
  userId,
}: {
  id: string;
  prevPage: string;
  userId: string;
}) {
  noStore();
  try {
    await startTransaction();

    const player = await getPlayerById(id);
    if (!player) {
      return;
    }

    const user = await getUserById(userId);
    const changeLog = {
      changed_entity: 'player:deleted',
      changed_entity_id: id,
      changed_entity_before: JSON.stringify({
        name: player.name,
        notes: player.notes,
        image_url: player.image_url,
        phone_number: player.phone_number
      }),
      changed_by: userId,
      changed_by_name: user ? user.name : 'unknown',
    } as ChangeLogDB;

    const { phone_number } = player;
    const playerHistory = (
      await sql<LogDB>`SELECT * FROM history WHERE phone_number = ${phone_number}`
    ).rows;

    const existingDeletedPlayer = await sql<PlayerDB>`SELECT * FROM deleted_players WHERE phone_number = ${player.phone_number}`;
    if (existingDeletedPlayer?.rows.length < 1) {
      sql`INSERT INTO deleted_players (id, name, phone_number, notes, image_url, allowed_marketing, updated_at) 
        VALUES (${player.id}, ${player.name}, ${player.phone_number}, ${player.notes}, ${player.image_url}, ${player.allowed_marketing}, ${player.updated_at})`;
    }
    await Promise.all(
      playerHistory.map((historyLog) => {
        return sql`INSERT INTO deleted_history (id, phone_number, change , type, note , archive , other_player_phone_number, updated_by, updated_at, tournament_id ) 
      VALUES (${historyLog.id}, ${historyLog.phone_number}, ${historyLog.change}, ${historyLog.type}, ${historyLog.note}, ${historyLog.archive}, ${historyLog.other_player_phone_number}, ${historyLog.updated_by}, ${historyLog.updated_at}, ${historyLog.tournament_id})`;
      }),
    );

    await sql`DELETE FROM history WHERE phone_number = ${phone_number}`;
    await sql`DELETE FROM players WHERE id = ${id}`;

    await insertChangeLog(changeLog);
    await commitTransaction();
    sendEmail(
      TARGET_MAIL,
      'player deleted',
      `name: ${player.name}, phone: ${player}   image: ${player.image_url}  notes: ${player.notes}`,
    );
  } catch (error) {
    await cancelTransaction();
    return { message: 'איראה שגיאה' };
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

export async function deleteBug({
  id,
  prevPage,
}: {
  id: string;
  prevPage: string;
}) {
  noStore();
  try {
    await startTransaction();

    const bug = (await sql<BugDB>`SELECT * FROM bugs WHERE id = ${id}`).rows[0];
    if (!bug) {
      return;
    }

    await sql`INSERT INTO deleted_bugs (id, description, updated_at) VALUES (${bug.id}, ${bug.description}, ${bug.updated_at})`;

    await sql`DELETE FROM bugs WHERE id = ${id}`;
    await commitTransaction();
  } catch (error) {
    await cancelTransaction();
    return { message: 'איראה שגיאה' };
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

export async function setPrizeDelivered({
  id,
  prevPage,
}: {
  id: string;
  prevPage: string;
}) {
  noStore();
  try {
    await sql`UPDATE prizes SET delivered = TRUE WHERE id = ${id}`;
    revalidatePath(prevPage);
  } catch (error) {
    return { message: 'איראה שגיאה' };
  }
}

export async function setPrizeAsReadyToBeDelivered({
  id,
  prevPage,
}: {
  id: string;
  prevPage: string;
}) {
  noStore();
  try {
    await sql`UPDATE prizes SET ready_to_be_delivered = TRUE WHERE id = ${id}`;
    revalidatePath(prevPage);
  } catch (error) {
    return { message: 'איראה שגיאה' };
  }
}

export async function setPrizeAsNotReadyToBeDelivered({
  id,
  prevPage,
}: {
  id: string;
  prevPage: string;
}) {
  noStore();
  try {
    await sql`UPDATE prizes SET ready_to_be_delivered = FALSE WHERE id = ${id}`;
    revalidatePath(prevPage);
  } catch (error) {
    return { message: 'איראה שגיאה' };
  }
}

export async function resetTournamentPositions(
  tournamentId: string,
  date: string,
  prevPage: string,
) {
  noStore();
  await sql<WinnerDB>`DELETE FROM winners WHERE date = ${date} AND tournament_id = ${tournamentId}`;
  revalidatePath(prevPage);
}
export async function convertPrizeToCredit(
  clientData: {
    userId: string;
    prizeId: string;
    prevPage: string;
    tournamentId: string | null;
  },
  _prevState: State,
  formData: FormData,
) {
  noStore();
  try {
    await startTransaction();

    const { prizeId, prevPage, userId, tournamentId } = clientData;

    const amount = Number(formData.get('amount') as string);

    const prize = (
      await sql<PrizeDB>`SELECT * FROM prizes WHERE id = ${prizeId}`
    ).rows[0];

    const userResult = await getUserById(userId);

    const playerPhoneNumber = prize.phone_number;
    let note = ` שחקן המיר פרס בקרדיט: ${prize.prize}`;
    note += `(${prize.tournament})`;
    await sql`
          INSERT INTO history (phone_number, change, note, type, updated_by, tournament_id)
          VALUES (${playerPhoneNumber}, ${amount}, ${note}, 'credit', ${
            userResult?.name ?? 'unknown'
          }, ${tournamentId})
        `;

    await sql`INSERT INTO deleted_prizes (id, tournament, phone_number, prize, ready_to_be_delivered, delivered, created_at)
 VALUES (${prize.id},${prize.tournament},${prize.phone_number},${prize.prize},${prize.ready_to_be_delivered},${prize.delivered},${prize.created_at})`;
    await sql`DELETE FROM prizes WHERE id = ${prizeId}`;

    commitTransaction();
    revalidatePath(prevPage);
  } catch (error) {
    cancelTransaction();
    return { message: 'איראה שגיאה' };
  }
}

export async function authenticate(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  noStore();
  try {
    let phoneNumber = ((formData.get('email') as string) ?? '')
      .trim()
      .replaceAll('-', '');

    if (!isNaN(Number(phoneNumber))) {
      phoneNumber = `${phoneNumber.startsWith('0') ? '' : '0'}${phoneNumber}`;
    }

    formData.set('email', phoneNumber);
    await signIn('credentials', formData);
  } catch (error) {
    console.error('## authenticate error', error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'טלפון או סיסמא שגויים';
        default:
          return 'איראה שגיאה';
      }
    }
    throw error;
  }
}

async function sendSMS(recipient: string, confirmationCode: string) {
  const msg = `קוד האימות שלך הוא: ${confirmationCode}
  
  https://runnerrunner.app/#${confirmationCode}
  `;
  const url = `https://api.sms4free.co.il/ApiSMS/v2/SendSMS`;
  // console.log('### SMS_API_KEY:' + SMS_API_KEY);
  // console.log('### SMS_PASS:' + SMS_PASS);
  // console.log('### senderPhone:' + senderPhone);
  console.log('### about to send sms for number:' + recipient+'. confirmationCode:', confirmationCode);
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      key: SMS_API_KEY,
      user: senderPhone,
      pass: SMS_PASS,
      sender: 'Runner',
      recipient,
      msg,
    }),
  });
  console.log('### res.status', res.status);
  if (res.status === 200) {
    const text = await res.text();
    console.log('### SMS response body', text);
    const body = JSON.parse(text);
    if (body.status === 1) {
      console.log('### SMS sent successfully');
      return true;
    }
  }

  console.log('### sending sms failed for number:' + recipient);
  return false;
}

export async function validatePhone(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  noStore();
  let user_phone_number = formData.get('phone_number') as string;

  const phoneNumber = `${
    user_phone_number.startsWith('0') ? '' : '0'
  }${user_phone_number}`;

  const phoneConfirmationCodeObject = await getPhoneConfirmationCode(phoneNumber);
  if (phoneConfirmationCodeObject) {
    const date = new Date(phoneConfirmationCodeObject.created_at);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    console.log('### diff', diff, 'milli,     or ', diff / 1000, ' seconds ');
    // const diff = now.getTime() - date.getTime() - TWO_HOURS;
    if (diff < 1000 * 15 && diff > 0) {
      console.log('### too many requests', phoneNumber);
      redirect(`/phone_validation?error=try_again_later`);
      return 'יותר מדי בקשות בזמן קצר';
    }
  }

  const confirmationCode = `${Math.floor(1000 + Math.random() * 9000)}`;

  await insertIntoPhoneConfirmations(phoneNumber, confirmationCode);

  //send sms to phone number with code
  const smsSent = await sendSMS(phoneNumber, confirmationCode);

  if (smsSent){
    console.log('### sms sent. phoneNumber: ',phoneNumber, ' confirmationCode', confirmationCode);
    redirect(`/code_validation?phone_number=${phoneNumber}`);
  }else{
    console.error('## sendSMS failed');
    redirect(`/phone_validation?error=sms_failed`);
  }

}

export async function validateCode(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  noStore();
  let user_input_code = formData.get('code') as string;

  console.log('### user_input_code', user_input_code);

  let user_phone_number = formData.get('phone_number') as string;
  const phoneNumber = `${
    user_phone_number.startsWith('0') ? '' : '0'
  }${user_phone_number}`;

  console.log('### user phone number', phoneNumber);
  const codeObject = await getPhoneConfirmationCode(phoneNumber);
  if (!codeObject) {
    console.log('### no codeObject');

    redirect(`/phone_validation?error=wrong_code`);
  } else {
    const code = codeObject.confirmation_code;
    console.log('### codeObject', codeObject);
    console.log('### code', code);

    if (code === user_input_code) {
      redirect(`/signup?phone_number=${phoneNumber}&code=${code}`);
    } else {
      redirect(`/phone_validation?error=wrong_code`);
    }
  }
}

export async function signUp(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  noStore();
  const user_phone_number = formData.get('phone_number') as string;
  const phoneNumber = `${
    user_phone_number.startsWith('0') ? '' : '0'
  }${user_phone_number}`;
  const code = formData.get('code') as string;
  const { usePhoneValidation } = await fetchFeatureFlags();
  if (usePhoneValidation) {
    const codeObject = await getPhoneConfirmationCode(phoneNumber);
    if (!codeObject) {
      console.log('### no codeObject');
      return 'איראה שגיאה';
    }
    const dbCode = codeObject.confirmation_code;
    if (dbCode !== code) {
      return 'איראה שגיאה';
    }
  }

  const password = formData.get('password') as string;
  const username = formData.get('name') as string;

  const marketing_approve = formData.get('marketing_approve') as string;

  const userResult =
    await sql<UserDB>`SELECT * FROM users WHERE phone_number = ${phoneNumber}`;
  const existingUser = userResult.rows[0];
  if (existingUser) {
    await cache.removeUserById(existingUser.id);
    await sql<UserDB>`delete FROM users WHERE id = ${existingUser.id}`;
    sendEmail(
      TARGET_MAIL,
      'Recreating user - user already exist..',
      `phone: ${phoneNumber} 
username: ${username}
new password: ${password}
existingUser:${JSON.stringify(existingUser)}`,
    );
  } else {
    sendEmail(
      TARGET_MAIL,
      `About to Create New user - ${username}`,
      `phone: ${phoneNumber}  
name:${username} 
marketing_approve:${marketing_approve} 
pass:${password}`,
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const isAdmin = ADMINS.includes(phoneNumber);
  const isWorker = WORKERS.includes(phoneNumber);
  const existingPlayer = await getPlayerByPhoneNumber(phoneNumber);
  // @ts-ignore
  const name = phoneToName[phoneNumber]
    ? // @ts-ignore
      (phoneToName[phoneNumber] as string)
    : (existingPlayer?.name ?? username);

  await sql`
      INSERT INTO users (phone_number, password, name, is_admin, is_worker)
      VALUES (${phoneNumber}, ${hashedPassword}, ${name}, ${isAdmin}, ${isWorker})
    `;

  const user = (
    await sql`SELECT * FROM users WHERE phone_number = ${phoneNumber}`
  ).rows[0];
  await cache.saveUser(user as any);
  sendEmail(
    TARGET_MAIL,
    `Creating New user - ${name}`,
    `phone: ${phoneNumber}  
name:${name} 
marketing_approve:${marketing_approve} 
pass:${password}
existingPlayer:${existingPlayer ? JSON.stringify(existingPlayer) : 'none'}`,
  );

  if (existingPlayer) {
    await sql`UPDATE players SET updated_at=${getUpdatedAtFormat()}, allowed_marketing=${
      marketing_approve === 'on'
    } WHERE phone_number = ${phoneNumber}`;
  } else {
    if (!existingUser) {
      await sql`
      INSERT INTO players (name, phone_number, allowed_marketing)
      VALUES (${name},${phoneNumber}, ${marketing_approve === 'on'})
    `;

      await sql`INSERT INTO history (phone_number, change, note, type, archive) VALUES (${phoneNumber},0, 'אתחול','credit', true)`;
    }
  }

  sendEmail(
    TARGET_MAIL,
    'New user created',
    `phone: ${phoneNumber}  
name:${name} 
marketing_approve:${marketing_approve} 
pass:${password}
existingPlayer:${JSON.stringify(existingPlayer)}`,
  );

  const signInFormData = new FormData();
  signInFormData.set('email', phoneNumber);
  signInFormData.set('password', password);
  await signIn('credentials', signInFormData);
  redirect(`/`);
}

export async function updateNewPlayerName(
  playerId: string,
  _prevState: string | undefined,
  formData: FormData,
) {
  noStore();
  const name = formData.get('name') as string;

  try {
    const player = (await sql`SELECT * FROM players WHERE id = ${playerId}`)
      .rows[0];
    if (player) {
      await sql`UPDATE players SET name = ${name} WHERE id = ${playerId}`;
      const user = (
        await sql`SELECT * FROM users WHERE phone_number = ${player.phone_number}`
      ).rows[0];
      if (user) {
        await cache.saveUser({ ...user, name } as any);
        await sql`UPDATE users SET name = ${name} WHERE phone_number = ${player.phone_number}`;
      }
    } else {
      throw new Error('player does not exist');
    }
  } catch (error) {
    console.error('Database updateFFValue Error:', error);
    return false;
  } finally {
    revalidatePath('/');
    redirect('/');
  }
}

export async function updateFFValue( //TODO: only admin can call the APIS?..
  name: string,
  newValue: boolean,
  prevPage: string,
) {
  noStore();
  try {
    const allFlagsFromCache = await cache.getFF();
    if (allFlagsFromCache) {
      allFlagsFromCache.forEach((flag: FeatureFlagDB) => {
        if (flag.flag_name === name) {
          flag.is_open = newValue;
        }
      });

      await cache.saveFF(allFlagsFromCache);
    }

    const existingFlag = (
      await sql`SELECT * FROM feature_flags WHERE flag_name = ${name}`
    ).rows[0];

    if (!existingFlag) {
      await sql`INSERT INTO feature_flags (flag_name, is_open) VALUES (${name}, ${newValue})`;
    } else {
      await sql`UPDATE feature_flags SET is_open = ${newValue} WHERE flag_name = ${name}`;
    }
  } catch (error) {
    console.error('Database updateFFValue Error:', error);
    return false;
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

export async function updateIsUserAdmin({
  id,
  prevPage,
}: {
  id: string;
  prevPage: string;
}) {
  noStore();
  try {
    const user = await getUserById(id);

    if (SUPER_ADMINS.includes(user.phone_number)) {
      return;
    }
    await cache.saveUser({ ...user, is_admin: !user.is_admin } as any);
    await sql`UPDATE users SET is_admin = ${!user.is_admin} WHERE id = ${id}`;
  } catch (error) {
    console.error('Database Error:', error);
    return false;
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

export async function updateIsUserAdminRefreshEnabled({
  id,
  prevPage,
}: {
  id: string;
  prevPage: string;
}) {
  noStore();
  try {
    const user = await getUserById(id);

    if (!user.is_admin) {
      return;
    }

    await cache.saveUser({
      ...user,
      refresh_enabled: !user.refresh_enabled,
    } as any);
    await sql`UPDATE users SET refresh_enabled = ${!user.refresh_enabled} WHERE id = ${id}`;
  } catch (error) {
    console.error('Database Error:', error);
    return false;
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

export async function updateIsUserWorker({
  id,
  prevPage,
}: {
  id: string;
  prevPage: string;
}) {
  noStore();
  try {
    const user = await getUserById(id);
    await cache.saveUser({ ...user, is_worker: !user.is_worker } as any);
    await sql`UPDATE users SET is_worker = ${!user.is_worker} WHERE id = ${id}`;
  } catch (error) {
    console.error('Database Error:', error);
    return false;
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

export async function deleteUser({
  id,
  prevPage,
}: {
  id: string;
  prevPage: string;
}) {
  noStore();
  try {
    await startTransaction();

    const user = await getUserById(id);

    if (user.is_admin || user.is_worker) {
      return;
    }

    const existingDeletedUser = (await sql<UserDB>`SELECT * FROM deleted_users WHERE phone_number = ${user.phone_number}`).rows[0];
    if (!existingDeletedUser){
      await sql`INSERT INTO deleted_users (id, phone_number, password, name, is_admin, is_worker) 
VALUES (${user.id}, ${user.phone_number},  ${user.password}, ${user.name}, ${user.is_admin}, ${user.is_worker})`;
    }

    await cache.removeUserById(id);
    await sql`DELETE FROM users WHERE id = ${id}`;

    await commitTransaction();
  } catch (error) {
    await cancelTransaction();
    console.error('Database Error:', error);
    return false;
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

export async function registerPlayerForDay(
  phone_number: string,
  date: string,
  tournamentId: string,
  val: boolean,
) {
  const rsvpResults =
    await sql<RSVPDB>`SELECT * FROM rsvp WHERE phone_number = ${phone_number} AND date = ${date}`;

  const existingRsvp = rsvpResults.rows.find(
    (r) => r.tournament_id === tournamentId,
  );

  if (val && existingRsvp) {
    //already rsvp
    return;
  }
  if (!val && !existingRsvp) {
    //already not rsvp
    return;
  }
  if (val && !existingRsvp) {
    const otherExistingRsvp = rsvpResults.rows.find(
      (r) => r.tournament_id !== tournamentId,
    );
    try {
      await startTransaction();
      if (otherExistingRsvp) {
        await sql`INSERT INTO deleted_rsvp (id,date,phone_number, tournament_id ) VALUES (${otherExistingRsvp.id}, ${otherExistingRsvp.date}, ${otherExistingRsvp.phone_number},${otherExistingRsvp.tournament_id})`;
        await sql`DELETE FROM rsvp WHERE id = ${otherExistingRsvp.id}`;
      }
      await sql`INSERT INTO rsvp (date, phone_number, tournament_id) VALUES (${date}, ${phone_number}, ${tournamentId})`;

      await commitTransaction();
    } catch (error) {
      await cancelTransaction();
      throw error;
    }
  } else if (existingRsvp && !val) {
    try {
      await startTransaction();
      await sql`INSERT INTO deleted_rsvp (id,date,phone_number, tournament_id ) VALUES (${existingRsvp.id}, ${existingRsvp.date}, ${existingRsvp.phone_number},${existingRsvp.tournament_id})`;
      await sql`DELETE FROM rsvp WHERE id = ${existingRsvp.id}`;
      await commitTransaction();
    } catch (error) {
      await cancelTransaction();
      throw error;
    }
  }
}
export async function rsvpPlayerForDay(
  phone_number: string,
  date: string,
  tournamentId: string,
  val: boolean,
  prevPage: string,
) {
  noStore();
  try {
    console.log(
      '## calling registerPlayerForDay',
      phone_number,
      date,
      tournamentId,
      val,
    );

    await registerPlayerForDay(phone_number, date, tournamentId, val);

  } catch (error) {
    console.error('rsvpPlayerForDay Error:', error);
    return false;
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

export async function undoPlayerLastLog( //TODO::: add tournament_id and make sure you undo from correct tournament
  phone_number: string,
  prevPage: string,
) {
  noStore();
  let otherPlayerPhoneNumber;
  try {
    await startTransaction();
    const logsResult =
      await sql<LogDB>`SELECT * FROM history WHERE phone_number = ${phone_number} AND type != 'credit_to_other' ORDER BY updated_at DESC LIMIT 1`;
    const lastLog = logsResult.rows[0];
    const historyLogId = lastLog.id;
    if (lastLog) {
      const amount = lastLog.change;
      const type = lastLog.type;

      if (amount === 0 && type === 'credit_by_other') {
        otherPlayerPhoneNumber = lastLog.other_player_phone_number;
      }

      if (amount < 0 && lastLog.type === 'credit') {
        await touchPlayer(phone_number);
      }
      await sql`DELETE FROM history where id = ${lastLog.id}`;
      await sql`DELETE FROM tournaments_adjustments where history_log_id = ${lastLog.id}`;
      if (otherPlayerPhoneNumber) {
        const otherPlayerLogsResult =
          await sql<LogDB>`SELECT * FROM history WHERE phone_number = ${otherPlayerPhoneNumber} AND type = 'credit_to_other' ORDER BY updated_at DESC LIMIT 1`;
        const otherPlayerLastLog = otherPlayerLogsResult.rows[0];

        if (otherPlayerLastLog) {
          const otherPlayerAmount = otherPlayerLastLog.change;
          if (otherPlayerAmount < 0) {
            await touchPlayer(otherPlayerPhoneNumber);
          }

          await sql`DELETE FROM history where id = ${otherPlayerLastLog.id}`;
        }
      }
    }
    await commitTransaction();
  } catch (error) {
    await cancelTransaction();
    console.error('undoPlayerLastLog Error:', error);
  } finally {
    revalidatePath(prevPage);
    redirect(prevPage);
  }
}

export async function importPlayers(playersToInsert: PlayerDB[]) {
  try {
    const existingPlayersImages = (await sql<ImageDB>`SELECT * FROM images`)
      .rows;

    await startTransaction();

    await sql`DELETE FROM history;`;
    await sql`DELETE FROM players;`;

    console.log('>> import step: 1 - get existing DB data');

    console.log('>> import step: 2 - insert NEW data');

    const date = '2024-01-01T10:10:00.000Z';
    console.log(`>> playersToInsert ${playersToInsert.length}`);

    let counter = 0;
    playersToInsert.forEach((p) => {
      const existingImage = existingPlayersImages.find(
        (ep) => ep.phone_number === p.phone_number,
      );

      if (existingImage) {
        console.log('>> setting player image:', existingImage.image_url);
        p.image_url = existingImage.image_url;
      } else {
        p.image_url = '/players/default.png';
        if (counter < 10) {
          console.log('>> did not found image:', p.phone_number);
        }
        counter++;
      }
    });

    const arr = playersToInsert.map((player) => ({
      ...player,
      updated_at: date,
    }));

    await sql.query(
      `INSERT INTO players (name, phone_number, notes, updated_at, image_url)
     SELECT name, phone_number, notes, updated_at, image_url FROM json_populate_recordset(NULL::players, $1)`,
      [JSON.stringify(arr)],
    );

    const arr2 = playersToInsert.map((player) => ({
      ...player,
      change: player.balance,
      updated_at: date,
      note: 'ארכיון',
      type: 'credit',
      archive: true,
    }));

    await sql.query(
      `INSERT INTO history (phone_number, change, note, type, updated_at, archive)
     SELECT phone_number, change, note, type, updated_at, archive FROM json_populate_recordset(NULL::history, $1)`,
      [JSON.stringify(arr2)],
    );
    await commitTransaction();

    console.log('>> import Done');
    sendEmail(
      TARGET_MAIL,
      'Import is done',
      `inserted ${playersToInsert.length} players`,
    );
  } catch (error) {
    await cancelTransaction();
    // @ts-ignore
    console.log(`>> import error: ${error.message}`);

    console.log('>> Rollback Done');
    return {
      message: 'איראה שגיאה',
    };
  } finally {
    redirect('/');
  }
}
