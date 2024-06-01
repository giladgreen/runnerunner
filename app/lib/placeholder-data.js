// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const DEMO_USER_PHONE = '0542609910'

const users = [
  {
    phone_number: '0587869910',
    password: 'kush1984',
    is_admin: true
  },
  {
    phone_number: '0542609910',
    password: '123456',
    is_admin: false
  },
];


const players = [
  {
    name: ' (🥸) אבי אסרף',
    balance: 15000,
    phone_number: '144',
    image_url: '/players/avi-asraf.png',
    notes: 'admin',
  },
  {
    name: 'גלעד גרין ✔️',
    balance: 5300,
    phone_number: '0587869910',
    image_url: '/players/gilad-green.png',
    notes: 'admin',
  },
  {
    name: 'ישראל ישראלי',
    balance: 3550,
    phone_number: DEMO_USER_PHONE,
    image_url: '/players/default.png',
    notes: '',
  },
  {
    name: 'רמי צרנגה (🥸)',
    balance: 5600,
    phone_number: '0567869911',
    image_url: '/players/rami-charanga.png',
  },
  {
    name: 'דוד טקאלה(🥸)',
    balance: 4700,
    phone_number: '0557869912',
    image_url: '/players/david-takala.png',
  },

{
    name: 'Yoel Nagrin (🥸)',
    balance: 4700,
    phone_number: '0547869913',
    image_url: '/players/yoel-nagrin.png',
  },
  {
    name: 'יניב מליכי (🥸)',
    balance: 9200,
    phone_number: '0537869914',
    image_url: '/players/yaniv-malichi.png',
  },
  {
    name: 'Guillermo Rauch (🥸)',
    balance: -100,
    phone_number: '0527869915',
    image_url: '/players/guillermo-rauch.png',
  },
{
    name: 'יעקב כהן (🥸)',
    balance: 4250,
    phone_number: '0587869916',
    image_url: '/players/yaacob-cohen.png',

  },
  {
    name: 'שמוליק מיזרחי (🥸)',
    balance: 7800,
    phone_number: '0587869917',
    image_url: '/players/shmulik-mizrahi.png',
  },
  {
    name: 'רועי אברמוביץ (🥸)',
    balance: 2500,
    phone_number: '0587869918',
    image_url: '/players/roei-abramobich.png',
  },
  {
    name: 'Michael Novotny (🥸)',
    balance: -50,
  phone_number: '0587869919',
    image_url: '/players/michael-novotny.png',
  },
  {
    name: 'Steph Dietz (🥸)',
    balance: -150,
    phone_number: '0587869920',
    image_url: '/players/steph-dietz.png',
  },
  {
    name: 'בר ביטון (🥸)',
    balance: 8200,
    phone_number: '0587869921',
    image_url: '/players/bar-biton.png',
  },
  {
    name: 'דמיטרי בקון (🥸)',
    balance: 6250,
    phone_number: '0587869922',
    image_url: '/players/dimitri-bekon.png',
  }
,
  {
    name: 'מלור מלאדזה (🥸)',
    balance: 2650,
    phone_number: '0587869923',
    image_url: '/players/melor-maladaza.png',

  }
,
  {
    name: 'אלי זיו (🥸)',
    balance: 2950,
    phone_number: '0587869924',
    image_url: '/players/eli-ziv.png',

  }

];
const logs = [
  {
    change: 2200,
    note: 'טורניר רעננה - מקום חמישי',
    updated_at: '2024-01-02T10:00:00.000Z',
    updated_by: 'חדווה'
  },
  {
    change: -300,
    note: 'טורניר תל אביב - כניסה',
    updated_at: '2024-01-12T20:00:00.000Z',
    updated_by: 'תרצה'
  },
  {
    change: -200,
    note: 'טורניר תל אביב - כניסה שנייה',
    updated_at: '2024-01-12T20:50:00.000Z',
    updated_by: 'תרצה'
  },
  {
    change: -400,
    note: 'טורניר ראשון לציון - כניסה',
    updated_at: '2024-01-14T20:00:00.000Z',
    updated_by: 'חדווה'
  },
  {
    change: 1000,
    note: 'טורניר ראשון לציון באונטי - מעטפה',
    updated_at: '2024-01-14T21:30:00.000Z',
    updated_by: 'חדווה'
  },
  {
    change: -2000,
    note: 'ניצול קרדיט לפרס - דייסוןי',
    updated_at: '2024-01-15T10:00:00.000Z',
    updated_by: 'חדווה'
  },
  {
    change: -250,
    note: 'טורניר קיסריה - כניסה',
    updated_at: '2024-01-17T20:00:00.000Z',
    updated_by: 'תרצה'
  },
  {
    change: 3500,
    note: 'טורניר קיסריה - מקום ראשון',
    updated_at: '2024-01-18T10:00:00.000Z',
    updated_by: 'תרצה'
  }
]


module.exports = {
  users,
  players,
  logs,
  DEMO_USER_PHONE
};
