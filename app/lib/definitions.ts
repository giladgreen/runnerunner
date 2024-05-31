// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  is_admin: string;
};

export type MVPPlayer = {
  id: string;
  name: string;
  phone_number: string;
  image_url: string;
  updated_at: string;
  balance: number;
};

export type DebtPlayer = {
  id: string;
  name: string;
  phone_number: string;
  image_url: string;
  updated_at: string;
  balance: number;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type MVPPlayerRaw = Omit<MVPPlayer, 'balance'> & {
  balance: number;
};
export type DebtPlayerRaw = Omit<DebtPlayer, 'balance'> & {
  balance: number;
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
};


export type Counts = {
  phone_number: string;
  count: number;
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
};


export type LogDB = {
  id: string;
  phone_number: string;
  change: number;
  note: string;
  updated_at: string;
  updated_by: string;
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
  historyLog: LogDB[]
};

export type BugDB = {
  id: string;
  description: string;
  updated_at: string;
};
