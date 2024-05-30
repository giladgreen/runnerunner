// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Revenue = {
  month: string;
  revenue: number;
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
};



export type PlayerForm = {
  id: string;
  name: string;
  phone_number: string;
  image_url: string;
  updated_at: string;
  balance: number;
};
