// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  phone_number: string;
  password: string;
  name?: string;
  is_admin: boolean;
};


export type rsvp = {
  sunday_rsvp: boolean;
  monday_rsvp: boolean;
  tuesday_rsvp: boolean;
  wednesday_rsvp: boolean;
  thursday_rsvp: boolean;
  saturday_rsvp: boolean;
}
export type MVPPlayer = {
  id: string;
  name: string;
  phone_number: string;
  image_url: string;
  updated_at: string;
  balance: number;
} & rsvp;

export type DebtPlayer = {
  id: string;
  name: string;
  phone_number: string;
  image_url: string;
  updated_at: string;
  balance: number;
} & rsvp;;

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type MVPPlayerRaw = Omit<MVPPlayer, 'balance'> & {
  balance: number;
  arrived: boolean;
};
export type DebtPlayerRaw = Omit<DebtPlayer, 'balance'> & {
  balance: number;
  arrived: boolean;
};

export type PlayersTable = {
  id: string;
  name: string;
  phone_number: string;
  image_url: string;
  updated_at: string;
  balance: number;
  historyCount: number;
  notes: string;
  sunday_rsvp: boolean;
  monday_rsvp: boolean;
  tuesday_rsvp: boolean;
  wednesday_rsvp: boolean;
  thursday_rsvp: boolean;
  saturday_rsvp: boolean;
  arrived: boolean;
  entries: number;
};


export type Counts = {
  phone_number: string;
  count: number;
};

export type TemplateForm = {
  id: string;
  template: string;
  day: string;
  amount: number;
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
  sunday_rsvp?: boolean;
  monday_rsvp?: boolean;
  tuesday_rsvp?: boolean;
  wednesday_rsvp?: boolean;
  thursday_rsvp?: boolean;
  saturday_rsvp?: boolean;
};


export type LogDB = {
  id: string;
  phone_number: string;
  change: number;
  note: string;
  updated_at: string;
  updated_by: string;
  type: string;
//updated by
};
export type PlayerDB = {
  id: string;
  name: string;
  phone_number: string;
  image_url: string;
  updated_at: string;
  balance: number;
  note: string;
  notes: string;
  historyLog: LogDB[],
  arrived: boolean;
};
export type TemplateDB = {
  id: string;
  template: string;
  day: string;
  amount: number;
};
export type BugDB = {
  id: string;
  description: string;
  updated_at: string;
};
