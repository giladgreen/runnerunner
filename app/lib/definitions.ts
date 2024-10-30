// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type UserDB = {
  id: string;
  phone_number: string;
  password: string;
  name?: string;
  is_admin: boolean;
  refresh_enabled: boolean;
  is_worker: boolean;
  is_player: boolean;
  created_at: string;
};

export type ImageDB = {
  phone_number: string;
  image_url: string;
};
export type TournamentPlayerData = {
  date: string;
  tournament_name: string;
  place: number;
};

export type PlayerDB = {
  id: string;
  name: string;
  phone_number: string;
  image_url: string;
  updated_at: string;
  position: number;
  balance: number;
  hasUser: boolean;
  historyEntriesSum: number;
  historyEntriesCount: number;
  historyCount: number;
  note: string;
  notes: string;
  historyLog: LogDB[];
  arrived?: string;
  entries: number;
  rsvpForToday?: string;
  entriesTooltipText?: string[];
  undoEntriesTooltipText?: string;
  hasReceived: boolean;
  creditWorth: number;
  rsvps: Array<{ date: string; tournamentId: string }>;
  tournamentsData: TournamentPlayerData[];
  allowed_marketing?: boolean;
};
export type PrizeInfoDB = {
  id: string;
  name: string;
  extra: string;
  credit: number;
  created_at: string;
};
export type PrizeDB = {
  id: string;
  tournament: string;
  phone_number: string;
  prize: string;
  player?: PlayerDB;
  delivered: boolean;
  ready_to_be_delivered: boolean;
  created_at: string;
};
export type WinnerDB = {
  id: string;
  date: string;
  tournament_name: string;
  tournament_id: string;
  winners: string;
};
export type RSVPDB = {
  id: string;
  date: string;
  phone_number: string;
  created_at: string;
  tournament_id: string;
};
export type Counts = {
  phone_number: string;
  count: number;
};

export type TournamentForm = {
  id: string;
  name: string;
  day: string;
  buy_in: number;
  re_buy: number;
  max_players: number;
  rsvp_required: boolean;
};

export type LogDB = {
  id: string;
  phone_number: string;
  change: number;
  note: string;
  updated_at: string;
  updated_by: string;
  type: string;
  other_player_phone_number: string;
  archive?: boolean;
  tournament_id?: string;
  //updated by
};

export type BuyInDB = {
  phone_number: string;
  sum: number;
  count: number;
};

export type TournamentDB = {
  id: string;
  i?: number;
  name: string;
  date: string;
  day: string;
  buy_in: number;
  re_buy: number;
  max_players: number;
  rsvp_required: boolean;
  day_has_more_then_one: boolean;

  rsvpForToday: number;
  todayTournamentMaxPlayers: number;
  arrivedToday: number;
  todayCreditIncome: number;
  todayCashIncome: number;
  todayTransferIncome: number;
  reEntriesCount: number;

  playersPlaces: PlayerDB[];
  adjustments: TournamentsAdjustmentsDB[];
};

export type TournamentsAdjustmentsDB = {
  id: string;
  tournament_id: string;
  type: string;
  change: number;
  reason: string;
  history_log_id: string;
  updated_by: string;
  updated_at: string;
};

export type FeatureFlagDB = {
  flag_name: string;
  is_open: boolean;
};

export type BugDB = {
  id: string;
  description: string;
  updated_at: string;
};

export const TRANSLATIONS = {
  Sunday: 'יום ראשון',
  Monday: 'יום שני',
  Tuesday: 'יום שלישי',
  Wednesday: 'יום רביעי',
  Thursday: 'יום חמישי',
  Friday: 'יום שישי',
  Saturday: 'יום שבת',
};
