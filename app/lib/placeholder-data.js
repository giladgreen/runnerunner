// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const DEMO_USER_PHONE = '0542609910';
const AVI_PHONE = '0524803571';
const OZ_PHONE = '0524803577';
const DEMO_USERS_PHONES = [DEMO_USER_PHONE,AVI_PHONE,OZ_PHONE];

const users = [
  {
    phone_number: '0587869910',
    password: 'kush1984',
    is_admin: true
  },
  {
    phone_number: '0524803571',
    password: '123456',
    is_admin: true
  },
  {
    phone_number: '0524803577',
    password: '123456',
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
const players_backup = [
  {
    name: 'ישראל ישראלי',
    balance: 9550,
    phone_number: DEMO_USER_PHONE,
    notes: '',
  },
  {
    name: '  אבי אסרף',
    balance: 9550,
    phone_number: AVI_PHONE,
    image_url: '/players/avi-asraf.png',
    notes: 'admin',
  },
  {
    name: ' עוז שנלינג',
    balance: 9550,
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
    name: 'רמי צרנגה ',
    balance: 5600,
    phone_number: '0567869911',
    image_url: '/players/rami-charanga.png',
  },
  {
    name: 'דוד טקאלה',
    balance: 4700,
    phone_number: '0557869912',
    image_url: '/players/david-takala.png',
  },
  {
    name: 'יניב מליכי ',
    balance: 9200,
    phone_number: '0537869914',
    image_url: '/players/yaniv-malichi.png',
  },
  {
    name: 'יעקב כהן ',
    balance: 4250,
    phone_number: '0587869916',
    image_url: '/players/yaacob-cohen.png',

  },
  {
    name: 'שמוליק מיזרחי ',
    balance: 7800,
    phone_number: '0587869917',
    image_url: '/players/shmulik-mizrahi.png',
  },
  {
    name: 'רועי אברמוביץ ',
    balance: 2500,
    phone_number: '0587869918',
    image_url: '/players/roei-abramobich.png',
  },

  {
    name: 'בר ביטון ',
    balance: 8200,
    phone_number: '0587869921',
    image_url: '/players/bar-biton.png',
  },
  {
    name: 'דמיטרי בקון ',
    balance: 6250,
    phone_number: '0587869922',
    image_url: '/players/dimitri-bekon.png',
  }
,
  {
    name: 'מלור מלאדזה ',
    balance: 2650,
    phone_number: '0587869923',
    image_url: '/players/melor-maladaza.png',

  }
,
  {
    name: 'אלי זיו ',
    balance: 2950,
    phone_number: '0587869924',
    image_url: '/players/eli-ziv.png',

  }
,
  {
    name: 'קובי סולימני ',
    balance: 3450,
    phone_number: '0587869925',
    image_url: '/players/koby-sulimani.png',

  }
,
  {
    name: 'ירון חמאבי ',
    balance: 7200,
    phone_number: '0587869926',
    image_url: '/players/yaron-hamabi.png',

  },
  {
    name: 'רועי ברטמן ',
    balance: 2450,
    phone_number: '0587869927',
    image_url: '/players/roei-bertman.png',

  },
  {
    name: 'תומר בראופמן ',
    balance: 8850,
    phone_number: '0587869928',
    image_url: '/players/tomer-braufman.png',

  },
  {
    name: 'מיכאל לון ',
    balance: 7400,
    phone_number: '0587869929',
    image_url: '/players/michael-lon.png',

  }
,
  {
    name: 'איתן מלא',
    balance: 2400,
    phone_number: '0587869931',
    image_url: '/players/eitan-male.png',
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

const templates = [
    {
  day: 'Sunday',
  template: 'טורניר קיסריה - כניסה',
  amount: 300
},
  {
    day: 'Monday',
    template: 'טורניר תל אביב - כניסה',
    amount: 300
  },
  {
    day: 'Tuesday',
    template: 'טורניר רעננה - כניסה',
    amount: 300
  },
  {
    day: 'Wednesday',
    template: 'טורניר כפר סבא - כניסה',
    amount: 250
  },
  {
    day: 'Thursday',
    template: 'טורניר ראשל״צ - כניסה',
    amount: 400
  },
  {
    day: 'Friday',
    template: '',
    amount: 0
  },
  {
    day: 'Saturday',
    template: 'טורניר ראשל״צ - כניסה',
    amount: 250
  }]

module.exports = {
  users,
  players,
  logs,
  templates,
  DEMO_USERS_PHONES
};
