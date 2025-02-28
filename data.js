const songs = [
  {
    name: "OK",
    artist: "Culture Jam",
    otherArtist: ["Bramsito", "Frenna"],
    year: 2022,
    duration: 2.36,
    image: "/img/songs/culture-jam-ok.jpg"
  },
  {
    name: "Favorite Girl",
    artist: "Priceless",
    year: 2021,
    duration: 2.51,
    image: "/img/songs/priceless-favorite-girl.jpg"
  },
  {
    name: "7 Dagen",
    artist: "Architrackz",
    year: 2022,
    duration: 3.15,
    image: "/img/songs/architrackz-7-dagen.jpg"
  },
  {
    name: "Karma",
    artist: "Architrackz",
    otherArtist: "KATNUF",
    year: 2024,
    duration: 2.52,
    image: "/img/songs/architrackz-karma.jpg"
  },
  {
    name: "Lost & Found",
    artist: "Broederliefde",
    year: 2024,
    duration: 3.16,
    image: "/img/songs/broederliefde-lost-and-found.jpg"
  },
  {
    name: "After Six",
    artist: "Broederliefde",
    otherArtist: ["Antoon", "Ronnie Flex"],
    year: 2024,
    duration: 2.46,
    image: "/img/songs/broederliefde-after-six.jpg"
  },
  {
    name: "Guap",
    artist: "Bryan MG",
    otherArtist: "Architrackz",
    year: 2023,
    duration: 2.41,
    image: "/img/songs/bryan-mg-guap.jpg"
  },
  {
    name: "Big 7",
    artist: "Burna Boy",
    year: 2023,
    duration: 2.31,
    image: "/img/songs/burna-boy-big-7.jpg"
  },
  {
    name: "Dumlla Dumlla",
    artist: "Dafina Zeqiri",
    otherArtist: "DYSTINCT",
    year: 2024,
    duration: 3.07,
    image: "/img/songs/dafina-zeqiri-dumlla-dumlla.jpg"
  },
  {
    name: "Geen Reden",
    artist: "Delany",
    otherArtist: "Yxng Le",
    year: 2024,
    duration: 2.56,
    image: "/img/songs/delany-geen-reden.jpg"
  },
  {
    name: "679",
    artist: "Fetty Wap",
    otherArtist: "Monty",
    year: 2015,
    duration: 3.11,
    image: "/img/songs/fetty-wap-679.jpg"
  },
  {
    name: "Girls Wanna Have Fun",
    artist: "Frenna",
    year: 2024,
    duration: 3.29,
    image: "img/songs/frenna-girls-wanna-have-fun.jpg"
  },
  {
    name: "Maradona",
    artist: "Frenna",
    year: 2024,
    duration: 2.26,
    image: "/img/songs/frenna-maradona.jpg"
  },
  {
    name: "Nog Steeds",
    artist: "Jayh",
    year: 2024,
    duration: 3.18,
    image: "/img/songs/jayh-nog-steeds.jpg"
  },
  {
    name: "Tyar En Waka",
    artist: "Jonna Fraser",
    year: 2024,
    duration: 2.41,
    image: "/img/songs/jonna-fraser-tyar-en-waka.jpg"
  },
  {
    name: "I Need Your Love",
    artist: "Jonna Fraser",
    otherArtist: ["Frenna", "Yam"],
    year: 2024,
    duration: 2.44,
    image: "/img/songs/jonna-fraser-i-need-your-love.jpg"
  },
  {
    name: "Berichten",
    artist: "Kleine John",
    year: 2024,
    duration: 2.08,
    image: "/img/songs/kleine-john-berichten.jpg"
  },
  {
    name: "Nog Steeds",
    artist: "KM",
    otherArtist: "Lijpe",
    year: 2023,
    duration: 2.46,
    image: "/img/songs/km-nog-steeds.jpg"
  },
  {
    name: "Camera",
    artist: "Bryan MG",
    otherArtist: ["MB", "Tawsen"],
    year: 2024,
    duration: 2.58,
    image: "/img/songs/bryan-mg-camera.jpg"
  },
  {
    name: "Guatauba",
    artist: "Plan B",
    year: 2002,
    duration: 2.44,
    image: "/img/songs/plan-b-guatauba.jpg"
  },
  {
    name: "Carita de Inocente",
    artist: "Prince Royce",
    year: 2020,
    duration: 3.10,
    image: "/img/songs/prince-royce-carita-de-inocente.jpg"
  },
  {
    name: "Rechazame",
    artist: "Prince Royce",
    year: 2010,
    duration: 3.45,
    image: "/img/songs/prince-royce-rechazame.jpg"
  },
  {
    name: "Xtra Cool",
    artist: "Young John",
    year: 2022,
    duration: 5.14,
    image: "/img/songs/young-john-xtra-cool.jpg"
  },
  {
    name: "Yo Voy",
    artist: "Zion & Lennox",
    otherArtist: "Daddy Yankee",
    year: 2004,
    duration: 3.51,
    image: "/img/songs/zion-lennox-yo-voy.jpg"
  },
  {
    name: "WINE",
    artist: "B Young",
    year: 2020,
    duration: 5.48,
    image: "/img/songs/b-young-wine.jpg"
  },
  {
    name: "Anders Doet",
    artist: "Architrackz",
    otherArtist: "Jayh",
    year: 2022,
    duration: 5.39,
    image: "/img/songs/architrackz-anders-doet.jpg"
  },
  {
    name: "Trop Parler",
    artist: "Franglish",
    year: 2023,
    duration: 3.04,
    image: "/img/songs/franglish-trop-parler.jpg"
  },
  {
    name: "El Clásico",
    artist: "Lijpe",
    otherArtist: "Frenna",
    year: 2022,
    duration: 2.40,
    image: "/img/songs/lijpe-el-clasico.jpg"
  },
  {
    name: "Hurtin me",
    artist: "Stefflon Don",
    otherArtist: "French Montana",
    year: 2017,
    duration: 3.34,
    image: "/img/songs/stefflon-don-hurtin-me.jpg"
  },
  {
    name: "Sans Effet",
    artist: "Tayc",
    year: 2022,
    duration: 5.21,
    image: "/img/songs/tayc-sans-effet.jpg"
  },
  {
    name: "Essence",
    artist: "Wizkid",
    otherArtist: "Tems",
    year: 2020,
    duration: 4.05,
    image: "/img/songs/wizkid-essence.jpg"
  },
  {
    name: "Validée",
    artist: "Booba",
    otherArtist: "Benash",
    year: 2015,
    duration: 3.26,
    image: "/img/songs/booba-validee.jpg"
  },
  {
    name: "African Queen",
    artist: "KM",
    otherArtist: "Bryan MG",
    year: 2020,
    duration: 2.59,
    image: "/img/songs/km-african-queen.jpg"
  },
  {
    name: "Envy Us",
    artist: "Stefflon Don",
    otherArtist: "Abra Cadabra",
    year: 2016,
    duration: 3.48,
    image: "/img/songs/stefflon-don-envy-us.jpg"
  },
  {
    name: "Carlo Colucci",
    artist: "Driess",
    year: 2019,
    duration: 2.20,
    image: "/img/songs/driess-carlo-colucci.jpg"
  },
  {
    name: "Pantat",
    artist: "Kimberlee Ramirez",
    otherArtist: ["BD", "JPB"],
    year: 2021,
    duration: 2.19,
    image: "/img/songs/kimberlee-ramirez-pantat.jpg"
  },
  {
    name: "Leven",
    artist: "Jack",
    otherArtist: "Ashafar",
    year: 2019,
    duration: 2.09,
    image: "/img/songs/jack-leven.jpg"
  }
];

export default songs;