// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'Gilad Green',
    email: 'green.gilad@gmail.com',
    password: 'kush1984',
  },
];


const players = [
  {
    name: 'Rami Charanga (🥸)',
    balance: 5600,
    phone_number: '05424567890',
    image_url: '/players/rami-charanga.png',
  },
  {
    name: 'David Takala (🥸)',
    balance: 4700,
    phone_number: '05654167777',
    image_url: '/players/david-takala.png',
  },
  {
    name: 'Gilad Green ✔️',
    balance: 5300,
    phone_number: '0587869910',
    image_url: '/players/default.png',
    notes: 'admin',
  },
{
    name: 'Yoel Nagrin (🥸)',
    balance: 4700,
    phone_number: '05654561256',
    image_url: '/players/yoel-nagrin.png',
  },
  {
    name: 'Yaniv Malichi (🥸)',
    balance: 9200,
    phone_number: '05654556891',
    image_url: '/players/yaniv-malichi.png',
  },
  {
    name: 'Guillermo Rauch',
    balance: -100,
    phone_number: '05611567890',
    image_url: '/players/guillermo-rauch.png',
  },
{
    name: 'hector simpson',
    balance: 1250,
    phone_number: '05504567890',
    image_url: '/players/hector-simpson.png',

  },
  {
    name: 'jared palmer',
    balance: 7800,
    phone_number: '05834567777',
    image_url: '/players/jared-palmer.png',
  },
  {
    name: 'lee-robinson',
    balance: 2500,
    phone_number: '05864567123',
    image_url: '/players/lee-robinson.png',
  },
{
    name: 'michael novotny',
    balance: 0,
  phone_number: '05874567256',
    image_url: '/players/michael-novotny.png',

  },
  {
    name: 'steph dietz',
    balance: -150,
    phone_number: '05872567890',
    image_url: '/players/steph-dietz.png',
  },


  {
    name: 'Avi asraf',
    balance: 20000,
    phone_number: '144',
    image_url: '/players/default.png',
    notes: 'admin',
  },

];

const revenue = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 4800 },
];

module.exports = {
  users,
  customers:[],
  players,
  revenue,
};
