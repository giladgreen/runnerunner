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
  is_worker: boolean;
};

export type PlayerForm = {
  id: string;
  name: string;
  phone_number: string;
  image_url: string;
  updated_at: string;
  balance: number;
  note: string;
  notes: string;
  rsvps:string[];
};
export type ImageDB = {
  phone_number: string;
  image_url: string;
}
export type TournamentPlayerData = {
  date: string,
  tournament_name: string,
  place: number,
}

export type PlayerDB = {
  id: string;
  name: string;
  phone_number: string;
  image_url: string;
  updated_at: string;
  position: number;
  balance: number;
  historyCount: number;
  note: string;
  notes: string;
  historyLog: LogDB[],
  arrived: boolean;
  entries: number;
  rsvpForToday: boolean;
  hasReceived: boolean;
  rsvps: string[];
  tournamentsData: TournamentPlayerData[];
};
export type PrizeDB = {
  id: string,
  tournament: string;
  phone_number: string;
  prize: string;
  player?: PlayerDB;
}
export type WinnerDB = {
  date: string;
  tournament_name: string;
  winners: string;
}
export type RSVPDB = {
  id: string;
  date: string;
  phone_number: string;
}
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
//updated by
};



export type TournamentDB = {
  id: string;
  name: string;
  day: string;
  buy_in: number;
  re_buy: number;
  max_players: number;
  rsvp_required: boolean;
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
