/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT THIS FILE to change the words on the site.
 *  Code lives elsewhere; nothing here needs to know about it.
 *
 *  Anything marked TODO is a placeholder waiting for real content.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  title: "Trajan's Column",
  latin: 'Columna Traiani',
  dedicated: 'Rome, AD 113',
  intro:
    'A hundred Roman feet of marble, wrapped from foot to capital in a single carved story: two wars, 155 scenes and some 2,600 figures. Scroll to climb it.',
};

/**
 * The key scenes the climb pauses on, bottom to top.
 *
 * `scene` is the Cichorius scene number (Roman numerals are worked out for
 * you). `image` is a file in assets/scenes/. The climb finds each scene's place
 * on the frieze from its number, so they must stay in order.
 */
export const keyScenes = [
  {
    scene: 4,
    image: 'assets/scenes/01-danube.jpg',
    title: 'The army crosses the Danube',
    latin: 'Danuvius',
    text:
      'The river itself rises out of the water as a bearded god to watch the legions march over a bridge of boats into Dacia. The story of the First Dacian War (AD 101–102) begins here.',
  },
  {
    scene: 37,
    image: 'assets/scenes/05-sarmatians.jpg',
    title: 'Cavalry against the Sarmatians',
    latin: 'Sarmatae',
    text:
      'Dacia’s allies ride in scale armour that covers man and horse alike. The Roman cavalry runs them down. TODO: expand.',
  },
  {
    scene: 71,
    image: 'assets/scenes/02-testudo.jpg',
    title: 'Storming a Dacian fortress',
    latin: 'Testudo',
    text:
      'Legionaries lock their shields over their heads into a “tortoise” and advance on the walls under a rain of missiles. TODO: expand.',
  },
  {
    scene: 78,
    image: 'assets/scenes/03-victory.jpg',
    title: 'Victory writes on a shield',
    latin: 'Victoria',
    text:
      'Between trophies of captured armour, a winged Victory inscribes a shield. She marks the end of the first war and divides the frieze in two.',
  },
  {
    scene: 99,
    image: 'assets/scenes/04-bridge.jpg',
    title: 'Sacrifice at the Danube bridge',
    latin: 'Pons Traiani',
    text:
      'Trajan sacrifices beside the great stone bridge his architect Apollodorus of Damascus threw across the Danube at Drobeta, the road into the second war (AD 105–106). TODO: expand.',
  },
  {
    scene: 145,
    image: 'assets/scenes/06-decebalus.jpg',
    title: 'The death of Decebalus',
    latin: 'Decebalus',
    text:
      'Cornered by Roman cavalry, the Dacian king takes his own life beneath a tree rather than be paraded through Rome. TODO: expand.',
  },
  {
    scene: 155,
    image: 'assets/scenes/07-departure.jpg',
    title: 'Dacia emptied',
    latin: 'Finis',
    text:
      'The last scene: Dacian families drive their animals away from the conquered land, which becomes the province of Dacia. TODO: expand.',
  },
];

/**
 * The dedicatory inscription, CIL VI 960, line by line.
 *
 * `carved` is the text as cut in the stone (· marks a word divider; letters in
 * [square brackets] are lost and restored). `expanded` fills out the
 * abbreviations with the missing letters in (round brackets), as epigraphers
 * write them. `gloss` explains each abbreviation or hard word.
 */
export const inscription = {
  ref: 'CIL VI 960',
  lines: [
    {
      carved: 'SENATVS·POPVLVSQVE·ROMANVS',
      expanded: 'Senatus populusque Romanus',
      english: 'The Senate and People of Rome',
      gloss: [['populusque', 'populus + -que, “and the people”']],
    },
    {
      carved: 'IMP·CAESARI·DIVI·NERVAE·F·NERVAE',
      expanded: 'Imp(eratori) Caesari divi Nervae f(ilio) Nervae',
      english: 'to the Emperor Caesar Nerva, son of the deified Nerva,',
      gloss: [['IMP', 'imperator, “commander, emperor” (dative: to the emperor)'], ['DIVI', 'divus, “deified”: Nerva became a god at death'], ['F', 'filius, “son” (Trajan was adopted)']],
    },
    {
      carved: 'TRAIANO·AVG·GERM·DACICO·PONTIF',
      expanded: 'Traiano Aug(usto) Germ(anico) Dacico pontif(ici)',
      english: 'Trajan Augustus, conqueror of Germany and of Dacia, chief priest,',
      gloss: [['AVG', 'Augustus, the emperor’s title'], ['GERM', 'Germanicus, a victory title (AD 97)'], ['DACICO', 'Dacicus, a victory title (AD 102)']],
    },
    {
      carved: 'MAXIMO·TRIB·POT·XVII·IMP·VI·COS·VI·P·P',
      expanded: 'maximo trib(unicia) pot(estate) XVII imp(eratori) VI co(n)s(uli) VI p(atri) p(atriae)',
      english: 'in his seventeenth year of tribunician power, six times hailed imperator, six times consul, father of his country,',
      gloss: [['TRIB POT', 'tribunicia potestas, renewed every year: XVII dates the stone to AD 113'], ['COS', 'consul'], ['P P', 'pater patriae, “father of the fatherland”']],
    },
    {
      carved: 'AD·DECLARANDVM·QVANTAE·ALTITVDINIS',
      expanded: 'ad declarandum quantae altitudinis',
      english: 'to show how great a height',
      gloss: [['ad declarandum', 'gerundive of purpose: “for showing”']],
    },
    {
      carved: 'MONS·ET·LOCVS·TANT[IS·OPER]IBVS·SIT·EGESTVS',
      expanded: 'mons et locus tant[is oper]ibus sit egestus',
      english: 'of hill and ground was cleared away for such great works.',
      gloss: [['sit egestus', 'perfect passive subjunctive of egero, “was carried out, removed”'], ['[ ]', 'letters lost when a doorway was cut into the base, restored by editors']],
    },
  ],
};

/**
 * Coins for the magnifier. The legends are read by the lens; `expanded` and
 * `english` are shown in the case notes. Filled in from the image sources;
 * TODO where a legend still needs checking against a catalogue.
 */
export const coins = [
  {
    id: 'column',
    name: 'Denarius with the Column',
    date: 'c. AD 114–117',
    ref: 'RIC II 292 type',
    obverse: {
      legend: 'IMP TRAIANO OPTIMO AVG GER DAC P M TR P',
      expanded: 'Imp(eratori) Traiano Optimo Aug(usto) Ger(manico) Dac(ico) p(ontifici) m(aximo) tr(ibunicia) p(otestate)',
      english: 'To the Emperor Trajan the Best, Augustus, conqueror of Germany and Dacia, chief priest, holding tribunician power',
      gloss: [['OPTIMO', 'Optimus, “the Best”: part of his official name from AD 114'], ['TR P', 'tribunicia potestate']],
    },
    reverse: {
      legend: 'COS VI P P S P Q R',
      expanded: 'co(n)s(uli) VI p(atri) p(atriae) S(enatus) P(opulus)q(ue) R(omanus)',
      english: 'consul for the sixth time, father of his country; the Senate and People of Rome. The Column itself stands in the middle, his statue on top.',
      gloss: [['S P Q R', 'the coin is the Senate’s dedication, like the column']],
    },
  },
  {
    id: 'dacia',
    name: 'Denarius, Dacia defeated',
    date: 'c. AD 107',
    ref: 'RIC II 219',
    obverse: {
      legend: 'IMP TRAIANO AVG GER DAC P M TR P COS V P P',
      expanded: 'Imp(eratori) Traiano Aug(usto) Ger(manico) Dac(ico) p(ontifici) m(aximo) tr(ibunicia) p(otestate) co(n)s(uli) V p(atri) p(atriae)',
      english: 'To the Emperor Trajan Augustus, conqueror of Germany and Dacia, chief priest, holding tribunician power, consul five times, father of his country',
    },
    reverse: {
      legend: 'S P Q R OPTIMO PRINCIPI',
      expanded: 'S(enatus) P(opulus)q(ue) R(omanus) optimo principi',
      english: 'The Senate and People of Rome, to the best of rulers. A Dacian sits mourning on his shield.',
      gloss: [['OPTIMO PRINCIPI', 'dative: “to the best leader”. The whole coin is addressed to Trajan']],
    },
  },
  {
    id: 'arabia',
    name: 'Sestertius, Arabia acquired',
    date: 'AD 106–111',
    obverse: {
      legend: 'IMP CAES NERVAE TRAIANO AVG GER DAC P M TR P COS V P P',
      expanded: 'Imp(eratori) Caes(ari) Nervae Traiano Aug(usto) Ger(manico) Dac(ico) p(ontifici) m(aximo) tr(ibunicia) p(otestate) co(n)s(uli) V p(atri) p(atriae)',
      english: 'To the Emperor Caesar Nerva Trajan Augustus, conqueror of Germany and Dacia, chief priest, holding tribunician power, consul five times, father of his country',
      gloss: [['Note', 'this coin is worn; the legend is the standard one for the type']],
    },
    reverse: {
      legend: 'S P Q R OPTIMO PRINCIPI · ARAB ADQVIS · S C',
      expanded: 'S(enatus) P(opulus)q(ue) R(omanus) optimo principi · Arab(ia) adquis(ita) · s(enatus) c(onsulto)',
      english: 'The Senate and People of Rome to the best of rulers. Arabia acquired. By decree of the Senate.',
      gloss: [['ARAB ADQVIS', 'Arabia adquisita: “acquired”, not “conquered”: the kingdom of the Nabataeans was annexed without a war (AD 106)'], ['S C', 'senatus consulto: bronze coins carried the Senate’s authority']],
    },
  },
  {
    id: 'forum',
    name: 'Aureus, Trajan’s Forum',
    date: 'AD 112–113',
    ref: 'RIC II 257',
    obverse: {
      legend: 'IMP TRAIANVS AVG GER DAC P M TR P COS VI P P',
      expanded: 'Imp(erator) Traianus Aug(ustus) Ger(manicus) Dac(icus) p(ontifex) m(aximus) tr(ibunicia) p(otestate) co(n)s(ul) VI p(ater) p(atriae)',
      english: 'The Emperor Trajan Augustus, conqueror of Germany and Dacia, chief priest, holding tribunician power, consul six times, father of his country',
      gloss: [['TRAIANVS', 'nominative, not dative: this coin names him rather than dedicating to him']],
    },
    reverse: {
      legend: 'FORVM TRAIAN',
      expanded: 'Forum Traian(i)',
      english: 'Trajan’s Forum: the great gateway into the square where the Column stands.',
    },
  },
  {
    id: 'bridge',
    name: 'Sestertius, the Danube bridge',
    date: 'c. AD 107–109',
    ref: 'RIC II 569',
    obverse: {
      legend: 'IMP CAES NERVAE TRAIANO AVG GER DAC P M TR P COS V P P',
      expanded: 'Imp(eratori) Caes(ari) Nervae Traiano Aug(usto) Ger(manico) Dac(ico) p(ontifici) m(aximo) tr(ibunicia) p(otestate) co(n)s(uli) V p(atri) p(atriae)',
      english: 'To the Emperor Caesar Nerva Trajan Augustus, conqueror of Germany and Dacia, chief priest, holding tribunician power, consul five times, father of his country',
    },
    reverse: {
      legend: 'S P Q R OPTIMO PRINCIPI · S C',
      expanded: 'S(enatus) P(opulus)q(ue) R(omanus) optimo principi · s(enatus) c(onsulto)',
      english: 'The Senate and People of Rome to the best of rulers; by decree of the Senate. Apollodorus’ bridge spans the Danube, a boat beneath.',
    },
  },
  {
    id: 'vicdac',
    name: 'Sestertius, Dacian victory',
    date: 'c. AD 103',
    ref: 'RIC II 528',
    obverse: {
      legend: 'IMP CAES NERVAE TRAIANO AVG GER DAC P M TR P COS V P P',
      expanded: 'Imp(eratori) Caes(ari) Nervae Traiano Aug(usto) Ger(manico) Dac(ico) p(ontifici) m(aximo) tr(ibunicia) p(otestate) co(n)s(uli) V p(atri) p(atriae)',
      english: 'To the Emperor Caesar Nerva Trajan Augustus, conqueror of Germany and Dacia, chief priest, holding tribunician power, consul five times, father of his country',
    },
    reverse: {
      legend: 'S P Q R OPTIMO PRINCIPI · S C · VIC DAC',
      expanded: 'S(enatus) P(opulus)q(ue) R(omanus) optimo principi · s(enatus) c(onsulto) · Vic(toria) Dac(ica)',
      english: 'The Senate and People of Rome to the best of rulers. Victory hangs a shield on a palm tree: “Dacian victory”, the same image as scene LXXVIII on the column.',
      gloss: [['VIC DAC', 'Victoria Dacica, written on the shield']],
    },
  },
];

/** The emperor, for the bust section. */
export const emperor = {
  name: 'Marcus Ulpius Traianus',
  born: 'Born 18 September AD 53, Italica (near Seville, Spain)',
  reigned: 'Emperor 98–117',
  died: 'Died August 117, Selinus in Cilicia',
  text:
    'The first emperor born outside Italy, a soldier adopted by the elderly Nerva in 97. The Senate called him Optimus Princeps, “the best of rulers”. Under him the empire reached its greatest size. TODO: expand.',
};

/**
 * His official name, growing title by title. Used by the name builder.
 * `from` is the year a title was first used.
 */
export const titles = [
  { abbr: 'GERM', full: 'Germanicus', english: 'conqueror of the Germans', from: 97 },
  { abbr: 'DAC', full: 'Dacicus', english: 'conqueror of the Dacians', from: 102 },
  { abbr: 'OPTIMVS', full: 'Optimus', english: 'the Best (as an official name)', from: 114 },
  { abbr: 'PARTH', full: 'Parthicus', english: 'conqueror of the Parthians', from: 116 },
];

/** Consulships by year, for the name builder (COS II in 98 … COS VI in 112). */
export const consulships = [
  [91, 1], [98, 2], [100, 3], [101, 4], [103, 5], [112, 6],
];

/** Abbreviations for the drill. */
export const abbreviations = [
  ['SPQR', 'Senatus Populusque Romanus', 'the Senate and People of Rome'],
  ['IMP', 'Imperator', 'commander; emperor'],
  ['CAES', 'Caesar', 'Caesar, the family name that became a title'],
  ['AVG', 'Augustus', 'the revered one; the emperor'],
  ['F', 'filius', 'son'],
  ['DIVI F', 'divi filius', 'son of the deified'],
  ['GERM', 'Germanicus', 'conqueror of the Germans'],
  ['DAC', 'Dacicus', 'conqueror of the Dacians'],
  ['P M', 'Pontifex Maximus', 'chief priest'],
  ['TR P', 'Tribunicia Potestate', 'with the power of a tribune'],
  ['COS', 'Consul', 'consul'],
  ['P P', 'Pater Patriae', 'father of the fatherland'],
  ['S C', 'Senatus Consulto', 'by decree of the Senate'],
  ['OPT PRINC', 'Optimo Principi', 'to the best of rulers'],
];

/**
 * Latin texts for the reading room. `latin` and `english` are lists of
 * matching paragraphs. `vocab` words get a hover gloss wherever they appear.
 */
export const readings = [
  {
    id: 'pliny-10-97',
    title: 'Trajan to Pliny, on the Christians',
    source: 'Pliny the Younger, Letters 10.97 (c. AD 112)',
    latin: [
      'Actum quem debuisti, mi Secunde, in excutiendis causis eorum, qui Christiani ad te delati fuerant, secutus es. Neque enim in universum aliquid, quod quasi certam formam habeat, constitui potest.',
      'Conquirendi non sunt; si deferantur et arguantur, puniendi sunt, ita tamen ut, qui negaverit se Christianum esse idque re ipsa manifestum fecerit, id est supplicando dis nostris, quamvis suspectus in praeteritum, veniam ex paenitentia impetret.',
      'Sine auctore vero propositi libelli in nullo crimine locum habere debent. Nam et pessimi exempli nec nostri saeculi est.',
    ],
    english: [
      'You have followed the right course, my Secundus, in examining the cases of those who were reported to you as Christians. No general rule with anything like a fixed form can be laid down.',
      'They are not to be hunted out; if they are reported and proved guilty, they must be punished — but anyone who denies being a Christian and proves it in fact, that is, by praying to our gods, is to be pardoned for his change of heart, however suspect his past.',
      'Anonymous accusations, though, must have no place in any charge. They set the worst precedent and are not in keeping with our age.',
    ],
    vocab: {
      debuisti: 'debeo, debere — to owe; ought',
      excutiendis: 'excutio, excutere — to examine closely (gerundive)',
      delati: 'defero, deferre, detuli, delatus — to report, inform against',
      conquirendi: 'conquiro, conquirere — to hunt out (gerundive: “must be”)',
      puniendi: 'punio, punire — to punish (gerundive)',
      supplicando: 'supplico, supplicare — to pray to (gerund, “by praying”)',
      veniam: 'venia, -ae f. — pardon',
      libelli: 'libellus, -i m. — pamphlet, written accusation',
      saeculi: 'saeculum, -i n. — age, generation',
    },
  },
];

/** Shown in the footer. Image credits are read from assets/credits.json. */
export const footer = {
  note: 'A Latin project. Text and code by Yuzhe (Julian) Chen.',
};
