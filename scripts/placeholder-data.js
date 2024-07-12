// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const SUPERMAN = '0587869910';
const DEMO_USER_PHONE = '0542609910';
const AVI_PHONE = '0524803571';
const OZ_PHONE = '0524803577';
const DEMO_USERS_PHONES = [DEMO_USER_PHONE,AVI_PHONE,OZ_PHONE];

const users = [
  {
    phone_number: SUPERMAN,
    name: 'גלעד גרין',
    password: 'kush1984',
    is_admin: true,
    is_worker: false
  },
  {
    phone_number: DEMO_USER_PHONE,
    name: 'דניאל שפירא גרין',
    password: '123456',
    is_admin: false,
    is_worker: true
  }
];

const players = [
  {
    name: 'ישראל ישראלי',
    balance: 9550,
    phone_number: DEMO_USER_PHONE,
    notes: '',
  },
  {
    name: 'רפאל',
    balance: 8200,
    phone_number: '1800101010',
    image_url: '/players/rafael.png',
    notes: '',
  },
  {
    name: `מיכאל אנג׳לו`,
    balance: 9100,
    phone_number: '1800101020',
    image_url: '/players/michaelangelo.png',
    notes: '',
  },
  {
    name: 'דונטלו',
    balance: 7700,
    phone_number: '1800101030',
    image_url: '/players/donatelo.png',
    notes: '',
  },
  {
    name: 'לאונרדו',
    balance: 6800,
    phone_number: '1800101040',
    image_url: '/players/leonardo.png',
    notes: '',
  },
  {
    name: 'אבי אסרף',
    balance: 5550,
    phone_number: AVI_PHONE,
    image_url: '/players/avi-asraf.png',
    notes: 'admin',
  },
  {
    name: 'עוז שנלינג',
    balance: 5550,
    phone_number: OZ_PHONE,
    image_url: '/players/oz_shneling.png',
    notes: 'admin',
  },
  {
    name: 'גלעד גרין',
    balance: 5300,
    phone_number: '0587869910',
    image_url: '/players/gilad-green.png',
    notes: 'admin',
  },
  {
    name: 'ויקטור חסון',
    balance: -50,
    phone_number: '0587869112',
    image_url: '/players/victor-hason.png',
  },
  {
    name: 'סרג׳ו קונסטנזה',
    balance: -150,
    phone_number: '0587869113',
    image_url: '/players/serjo-kostanza.png',
  },
  {
    name: 'רפאל מוקד',
    balance: -350,
    phone_number: '0587869114',
    image_url: '/players/rafael-moked.png',
  },


  {
    name: 'שרדר',
    balance: -400,
    phone_number: '0587869115',
    image_url: '/players/shreder.png',
  },
  {
    name: 'ספלינטר',
    balance: -250,
    phone_number: '0587869116',
    image_url: '/players/splinter.png',
  },
  {
    name: 'רוקסטדי',
    balance: 200,
    phone_number: '0587869117',
    image_url: '/players/rocksteady.png',
  },
  {
    name: 'ביבופ',
    balance: 550,
    phone_number: '0587869118',
    image_url: '/players/bebop.png',
  },
  {
    name: 'אפריל',
    balance: 1750,
    phone_number: '0587869119',
    image_url: '/players/april.png',
  }



];

const logs = [
  {
    change: 2200,
    note: 'טורניר רעננה - מקום חמישי',
    updated_at: '2024-01-01T10:00:00.000Z',
    updated_by: 'אבי'
  },
  {
    change: 6000,
    note: 'טורניר ראשון לציון - מקום ראשון',
    updated_at: '2024-01-02T10:00:00.000Z',
    updated_by: 'חדווה'
  },
  {
    change: -300,
    note: 'טורניר תל אביב - כניסה',
    updated_at: '2024-01-12T20:00:00.000Z',
    updated_by: 'תרצה',
    type: 'credit'
  },
  {
    change: -200,
    note: 'טורניר תל אביב - כניסה שנייה',
    updated_at: '2024-01-12T20:50:00.000Z',
    updated_by: 'תרצה',
    type: 'credit'
  },
  {
    change: -400,
    note: 'טורניר ראשון לציון - כניסה',
    updated_at: '2024-01-14T20:00:00.000Z',
    updated_by: 'חדווה',
    type: 'credit'
  },
  {
    change: 1000,
    note: 'טורניר ראשון לציון באונטי - מעטפה',
    updated_at: '2024-01-14T21:30:00.000Z',
    updated_by: 'חדווה',
  },
  {
    change: -2000,
    note: 'ניצול קרדיט לפרס - דייסוןי',
    updated_at: '2024-01-15T10:00:00.000Z',
    updated_by: 'חדווה',
    type: 'prize'
  },
  {
    change: -250,
    note: 'טורניר קיסריה - כניסה',
    updated_at: '2024-01-17T20:00:00.000Z',
    updated_by: 'תרצה',
    type: 'credit'
  },
  {
    change: -150,
    note: 'טורניר קיסריה - כניסה שנייה',
    updated_at: '2024-01-17T20:00:00.000Z',
    updated_by: 'תרצה',
    type: 'cash'
  },
  {
    change: -150,
    note: 'טורניר קיסריה - כניסה שלישית ',
    updated_at: '2024-01-17T20:00:00.000Z',
    updated_by: 'תרצה',
    type: 'wire'
  },
  {
    change: 3500,
    note: 'טורניר קיסריה - מקום ראשון',
    updated_at: '2024-01-18T10:00:00.000Z',
    updated_by: 'תרצה'
  },

]

const tournaments = [
    {
  day: 'Sunday',
  name: 'טורניר קיסריה',
  buy_in: 300,
      max_players:100,
      rsvp_required: true
  },
  {
    day: 'Monday',
    name: 'טורניר תל אביב',
    buy_in: 300,
    max_players:100,
    rsvp_required: true
  },
  {
    day: 'Tuesday',
    name: 'טורניר רעננה',
    buy_in: 300,
    max_players:100,
    rsvp_required: true
  },
  {
    day: 'Wednesday',
    name: 'טורניר כפר סבא',
    buy_in: 250,
    max_players:100,
    rsvp_required: true
  },
  {
    day: 'Thursday',
    name: 'טורניר ראשל״צ',
    buy_in: 400,
    max_players:100,
    rsvp_required: true
  },
  {
    day: 'Friday',
    name: '',
    buy_in: 200,
    max_players:0,
    rsvp_required: true
  },
  {
    day: 'Saturday',
    name: 'טורניר ראשל״צ',
    buy_in: 250,
    max_players:100,
    rsvp_required: false
  }]

module.exports = {
  users,
  players,
  logs,
  tournaments,
  DEMO_USERS_PHONES
};
