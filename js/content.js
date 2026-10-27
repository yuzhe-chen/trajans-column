/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT THIS FILE to change the words on the site.
 *  Code lives elsewhere; nothing here needs to know about it.
 * ─────────────────────────────────────────────────────────────
 *
 * Sources for the facts below: the inscription itself (CIL VI 960); Cassius
 * Dio, Roman History 68 (tr. E. Cary, 1925); Eutropius, Breviarium 8;
 * Ammianus Marcellinus 16.10; Pliny, Letters 10; Cichorius, Die Reliefs der
 * Traianssäule (1896–1900); R. B. Ulrich, trajans-column.org.
 */

export const site = {
  title: "Trajan's Column",
  latin: 'Columna Traiani',
  dedicated: 'Rome, May AD 113',
  intro:
    'A hundred Roman feet of marble, wrapped from foot to capital in one carved story: two wars, 155 scenes and some 2,600 figures.',
};

/** The opening section: a lead paragraph, two short ones, and the facts panel. */
export const overview = {
  lead:
    'In AD 113 the Senate and People of Rome dedicated a column to the emperor Trajan in the heart of his new forum. Around it, in a band of relief that winds twenty-three times from foot to capital, runs the story of how he conquered Dacia.',
  body: [
    'The column was paid for with the spoils of two wars fought north of the Danube, in AD 101–102 and 105–106, against the Dacian king Decebalus. It stood in a small courtyard between two libraries, one Greek and one Latin, behind the great hall of the Basilica Ulpia. Its architect was very probably Apollodorus of Damascus, who also designed the forum and the bridge over the Danube.',
    'The story reads upward, left to right, in about 190 metres of carving. Trajan appears in it some sixty times: speaking to the army, sacrificing, receiving envoys, inspecting forts. Battles take up surprisingly little of it. Most of the frieze shows soldiers marching, building camps, roads and bridges: the war as the army that fought it wanted to be remembered.',
    'When Trajan died in 117 his ashes were placed in a golden urn in a chamber inside the pedestal. Eutropius says he was the only emperor buried inside the city. His bronze statue on top was lost in the Middle Ages; Pope Sixtus V put up the statue of St Peter that stands there now in 1588.',
  ],
  facts: [
    ['Height', 'Shaft 100 Roman feet (about 30 m); about 35 m with the pedestal'],
    ['Frieze', 'About 190 m long, 23 turns, 155 scenes, some 2,600 figures'],
    ['Material', 'About 20 drums of Luna (Carrara) marble, each over 30 tonnes'],
    ['Inside', 'A spiral staircase of 185 steps, lit by narrow slit windows'],
    ['Dedicated', 'May AD 113, by the Senate and People of Rome'],
  ],
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
      'Spring, AD 101. The legions march out of the province of Moesia over two bridges of boats. Out of the river rises its god, Danuvius, bearded and half-submerged, steadying the crossing with one arm. The First Dacian War has begun.',
  },
  {
    scene: 37,
    image: 'assets/scenes/05-sarmatians.jpg',
    title: 'Cavalry against the Sarmatians',
    latin: 'Sarmatae',
    text:
      'In the winter of 101–102 Decebalus and his Sarmatian allies struck back across the Danube into Roman territory. The Sarmatian cataphracts wear scale armour from head to foot, and so do their horses; here Roman horsemen ride them down, and the armoured riders tumble from their saddles.',
  },
  {
    scene: 71,
    image: 'assets/scenes/02-testudo.jpg',
    title: 'Storming a Dacian fortress',
    latin: 'Testudo',
    text:
      'Legionaries lock their shields over their heads into a testudo, a “tortoise”, and push up to the walls under a hail of stones. The Dacian strongholds sat high in the Carpathian mountains and had to be taken one by one.',
  },
  {
    scene: 78,
    image: 'assets/scenes/03-victory.jpg',
    title: 'Victory writes on a shield',
    latin: 'Victoria',
    text:
      'Between two trophies of captured Dacian armour, a winged Victory writes on a shield. Decebalus has surrendered (AD 102), the first war is over, and the frieze pauses here: everything above her is the second war.',
  },
  {
    scene: 99,
    image: 'assets/scenes/04-bridge.jpg',
    title: 'Sacrifice at the Danube bridge',
    latin: 'Pons Traiani',
    text:
      'AD 105. Trajan pours an offering at an altar while a bull is led to sacrifice. Behind them stands the great bridge over the Danube at Drobeta: stone piers carrying timber arches, built by Apollodorus of Damascus so that the army could cross in any season.',
  },
  {
    scene: 145,
    image: 'assets/scenes/06-decebalus.jpg',
    title: 'The death of Decebalus',
    latin: 'Decebalus',
    text:
      'AD 106. Hunted down by Roman cavalry, the Dacian king kneels under a tree and cuts his own throat rather than be led through Rome in a triumph. The trooper reaching for him may be Tiberius Claudius Maximus, whose tombstone, found in Greece in 1965, boasts that he captured Decebalus and brought his head to Trajan.',
  },
  {
    scene: 155,
    image: 'assets/scenes/07-departure.jpg',
    title: 'Dacia emptied',
    latin: 'Finis',
    text:
      'The last scene. Dacian families walk away with their cattle and goats. Whether they are refugees leaving the new Roman province or people being moved off their land is still argued over; either way, Dacia now belonged to Rome.',
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
  intro:
    'On the pedestal, above the door to Trajan’s tomb, two winged Victories hold up the dedication. Its letters are the most admired capitals of antiquity, cut in V-section so they hold the light, and probably painted on with a flat brush before they were carved. Modern type designers still copy them; the typeface called Trajan is drawn from this stone.',
  note:
    'The last line has puzzled readers since antiquity. Cassius Dio took it literally: the column is as tall as the hill that was dug away to make the forum. Excavation suggests the ground was never that high here, so what was cleared, and how much, is still argued over.',
  lines: [
    {
      carved: 'SENATVS·POPVLVSQVE·ROMANVS',
      expanded: 'Senatus populusque Romanus',
      english: 'The Senate and People of Rome',
      gloss: [['-que', 'enclitic “and”: populus + que, “and the people”']],
    },
    {
      carved: 'IMP·CAESARI·DIVI·NERVAE·F·NERVAE',
      expanded: 'Imp(eratori) Caesari divi Nervae f(ilio) Nervae',
      english: 'to the Emperor Caesar Nerva, son of the deified Nerva,',
      gloss: [['IMP', 'imperator, “commander, emperor”; dative, “to the emperor”'], ['DIVI', 'divus, “deified”: Nerva was made a god at his death'], ['F', 'filius, “son”: Trajan was Nerva’s adopted son']],
    },
    {
      carved: 'TRAIANO·AVG·GERM·DACICO·PONTIF',
      expanded: 'Traiano Aug(usto) Germ(anico) Dacico pontif(ici)',
      english: 'Trajan Augustus, victor over the Germans and the Dacians, chief',
      gloss: [['AVG', 'Augustus, the title every emperor bore'], ['GERM', 'Germanicus, a victory title (AD 97)'], ['DACICO', 'Dacicus, a victory title (AD 102)']],
    },
    {
      carved: 'MAXIMO·TRIB·POT·XVII·IMP·VI·COS·VI·P·P',
      expanded: 'maximo trib(unicia) pot(estate) XVII imp(eratori) VI co(n)s(uli) VI p(atri) p(atriae)',
      english: 'priest, in his seventeenth year of tribunician power, six times hailed imperator, six times consul, father of his country,',
      gloss: [['PONTIF MAXIMO', 'pontifex maximus, “chief priest”, split across two lines'], ['TRIB POT XVII', 'tribunicia potestas, renewed every year: the seventeenth dates the stone to AD 113'], ['P P', 'pater patriae, “father of the fatherland”']],
    },
    {
      carved: 'AD·DECLARANDVM·QVANTAE·ALTITVDINIS',
      expanded: 'ad declarandum quantae altitudinis',
      english: 'to show how great a height',
      gloss: [['ad declarandum', 'ad + gerund, expressing purpose: “for showing”'], ['quantae altitudinis', 'genitive of description: “of how great a height”']],
    },
    {
      carved: 'MONS·ET·LOCVS·TANT[IS·OPER]IBVS·SIT·EGESTVS',
      expanded: 'mons et locus tant[is oper]ibus sit egestus',
      english: 'of hill and ground was cleared away for such great works.',
      gloss: [['sit egestus', 'perfect passive subjunctive of egero, “carry out, remove”, in an indirect question'], ['[ ]', 'the stone is broken here; editors restore the lost letters']],
    },
  ],
};

/** The coins exhibit. */
export const coinsIntro = {
  title: 'Coins of the Optimus Princeps',
  text:
    'Coins were the only pictures of the emperor most Romans ever saw, and their legends were written to be read in a glance. Read them the way the inscription is read: almost every word is cut short.',
};

export const coins = [
  {
    id: 'column',
    name: 'Denarius with the Column',
    date: 'AD 114–117',
    ref: 'RIC II 307',
    metal: 'Silver',
    about: 'The column itself, on the pedestal with its two eagles, with Trajan’s statue on top holding a spear and a globe.',
    obverse: {
      legend: 'IMP TRAIANO OPTIMO AVG GER DAC P M TR P',
      expanded: 'Imp(eratori) Traiano Optimo Aug(usto) Ger(manico) Dac(ico) p(ontifici) m(aximo) tr(ibunicia) p(otestate)',
      english: 'To the Emperor Trajan the Best, Augustus, victor over the Germans and Dacians, chief priest, holding tribunician power',
      gloss: [['OPTIMO', 'Optimus, “the Best”: part of his official name from AD 114'], ['TR P', 'tribunicia potestate']],
    },
    reverse: {
      legend: 'COS VI P P S P Q R',
      expanded: 'co(n)s(uli) VI p(atri) p(atriae) S(enatus) P(opulus)q(ue) R(omanus)',
      english: 'consul six times, father of his country; the Senate and People of Rome',
      gloss: [['S P Q R', 'the Senate’s dedication, exactly like the column’s']],
    },
  },
  {
    id: 'dacia',
    name: 'Denarius, Dacia defeated',
    date: 'c. AD 107',
    ref: 'RIC II 219',
    metal: 'Silver',
    about: 'A Dacian in his peaked cap sits mourning on a pile of arms, a curved Dacian sword below him.',
    obverse: {
      legend: 'IMP TRAIANO AVG GER DAC P M TR P COS V P P',
      expanded: 'Imp(eratori) Traiano Aug(usto) Ger(manico) Dac(ico) p(ontifici) m(aximo) tr(ibunicia) p(otestate) co(n)s(uli) V p(atri) p(atriae)',
      english: 'To the Emperor Trajan Augustus, victor over the Germans and Dacians, chief priest, holding tribunician power, consul five times, father of his country',
    },
    reverse: {
      legend: 'S P Q R OPTIMO PRINCIPI',
      expanded: 'S(enatus) P(opulus)q(ue) R(omanus) optimo principi',
      english: 'The Senate and People of Rome, to the best of rulers',
      gloss: [['OPTIMO PRINCIPI', 'dative, “to the best leader”: the whole coin is addressed to Trajan']],
    },
  },
  {
    id: 'bridge',
    name: 'Sestertius, the Danube bridge',
    date: 'c. AD 107–109',
    ref: 'RIC II 569',
    metal: 'Bronze',
    about: 'Apollodorus’ bridge over the Danube, drawn as a single great arch with towers at each end and a boat passing underneath.',
    obverse: {
      legend: 'IMP CAES NERVAE TRAIANO AVG GER DAC P M TR P COS V P P',
      expanded: 'Imp(eratori) Caes(ari) Nervae Traiano Aug(usto) Ger(manico) Dac(ico) p(ontifici) m(aximo) tr(ibunicia) p(otestate) co(n)s(uli) V p(atri) p(atriae)',
      english: 'To the Emperor Caesar Nerva Trajan Augustus, victor over the Germans and Dacians, chief priest, holding tribunician power, consul five times, father of his country',
    },
    reverse: {
      legend: 'S P Q R OPTIMO PRINCIPI · S C',
      expanded: 'S(enatus) P(opulus)q(ue) R(omanus) optimo principi · s(enatus) c(onsulto)',
      english: 'The Senate and People of Rome, to the best of rulers; by decree of the Senate',
      gloss: [['S C', 'senatus consulto: bronze coins carried the Senate’s authority']],
    },
  },
  {
    id: 'vicdac',
    name: 'Sestertius, Dacian victory',
    date: 'c. AD 103',
    ref: 'RIC II 528',
    metal: 'Bronze',
    about: 'Victory, one foot on a helmet, fixes a shield inscribed VIC DAC to a palm tree: the same image that divides the two wars on the column.',
    obverse: {
      legend: 'IMP CAES NERVAE TRAIANO AVG GER DAC P M TR P COS V P P',
      expanded: 'Imp(eratori) Caes(ari) Nervae Traiano Aug(usto) Ger(manico) Dac(ico) p(ontifici) m(aximo) tr(ibunicia) p(otestate) co(n)s(uli) V p(atri) p(atriae)',
      english: 'To the Emperor Caesar Nerva Trajan Augustus, victor over the Germans and Dacians, chief priest, holding tribunician power, consul five times, father of his country',
    },
    reverse: {
      legend: 'S P Q R OPTIMO PRINCIPI · S C · VIC DAC',
      expanded: 'S(enatus) P(opulus)q(ue) R(omanus) optimo principi · s(enatus) c(onsulto) · Vic(toria) Dac(ica)',
      english: 'The Senate and People of Rome, to the best of rulers; by decree of the Senate. “Dacian Victory”',
      gloss: [['VIC DAC', 'Victoria Dacica, written on the shield']],
    },
  },
  {
    id: 'arabia',
    name: 'Sestertius, Arabia acquired',
    date: 'AD 106–111',
    metal: 'Orichalcum',
    about: 'Arabia stands holding a branch, a camel at her feet. The Nabataean kingdom around Petra became the province of Arabia in AD 106.',
    obverse: {
      legend: 'IMP CAES NERVAE TRAIANO AVG GER DAC P M TR P COS V P P',
      expanded: 'Imp(eratori) Caes(ari) Nervae Traiano Aug(usto) Ger(manico) Dac(ico) p(ontifici) m(aximo) tr(ibunicia) p(otestate) co(n)s(uli) V p(atri) p(atriae)',
      english: 'To the Emperor Caesar Nerva Trajan Augustus, victor over the Germans and Dacians, chief priest, holding tribunician power, consul five times, father of his country',
      gloss: [['Note', 'this coin is worn; the legend given is the standard one for the type']],
    },
    reverse: {
      legend: 'S P Q R OPTIMO PRINCIPI · ARAB ADQVIS · S C',
      expanded: 'S(enatus) P(opulus)q(ue) R(omanus) optimo principi · Arab(ia) adquis(ita) · s(enatus) c(onsulto)',
      english: 'The Senate and People of Rome, to the best of rulers. Arabia acquired. By decree of the Senate',
      gloss: [['ARAB ADQVIS', 'Arabia adquisita, “acquired”, not “conquered”: the kingdom was annexed without a war']],
    },
  },
  {
    id: 'forum',
    name: 'Aureus, Trajan’s Forum',
    date: 'AD 112–113',
    ref: 'RIC II 257',
    metal: 'Gold',
    about: 'The great gateway into Trajan’s Forum, with six columns and a six-horse chariot on its roof.',
    obverse: {
      legend: 'IMP TRAIANVS AVG GER DAC P M TR P COS VI P P',
      expanded: 'Imp(erator) Traianus Aug(ustus) Ger(manicus) Dac(icus) p(ontifex) m(aximus) tr(ibunicia) p(otestate) co(n)s(ul) VI p(ater) p(atriae)',
      english: 'The Emperor Trajan Augustus, victor over the Germans and Dacians, chief priest, holding tribunician power, consul six times, father of his country',
      gloss: [['TRAIANVS', 'nominative, not dative: this coin names him rather than dedicating to him']],
    },
    reverse: {
      legend: 'FORVM TRAIAN',
      expanded: 'Forum Traian(i)',
      english: 'Trajan’s Forum',
    },
  },
];

/** The emperor. */
export const emperor = {
  name: 'Marcus Ulpius Traianus',
  facts: [
    ['Born', '18 September AD 53, at Italica, near Seville in Spain'],
    ['Emperor', '28 January 98 – August 117'],
    ['Died', 'August 117, at Selinus in Cilicia, aged 63'],
    ['Successor', 'Hadrian, his cousin’s son and ward'],
  ],
  text: [
    'Trajan was the first emperor born outside Italy, the son of a Spanish-Roman family that had risen to the consulship. He made his name as a soldier, and was governing Upper Germany in 97 when the elderly emperor Nerva, under pressure from the army, adopted him as his son and heir. Three months later Nerva was dead. Trajan heard the news at Cologne and took his time coming to Rome.',
    'He won the Senate over by treating it with respect, and the Senate gave him a title no emperor had had before: Optimus Princeps, “the best of rulers”. His wars doubled as building programmes, and Dacian gold paid for the forum, the markets, new baths, harbours, roads and aqueducts. His letters to Pliny, governor of Bithynia, show him answering questions about fire brigades, aqueducts and Christians in a few dry lines.',
    'In 114 he turned east against Parthia, took Armenia and Mesopotamia, captured the Parthian capital Ctesiphon, and stood on the shore of the Persian Gulf. Then the new provinces rose in revolt, and Trajan, ill, set out for Rome and died on the way. Two and a half centuries later, Eutropius says, the Senate still hailed each new emperor with the wish that he be felicior Augusto, melior Traiano: “luckier than Augustus, better than Trajan”.',
  ],
};

/**
 * His official name, growing title by title. Used by the name builder.
 * `from` is the year a title was first used.
 */
export const titles = [
  { abbr: 'GERM', full: 'Germanicus', english: 'victor over the Germans', from: 97 },
  { abbr: 'DAC', full: 'Dacicus', english: 'victor over the Dacians', from: 102 },
  { abbr: 'OPTIMVS', full: 'Optimus', english: 'the Best (as an official name)', from: 114 },
  { abbr: 'PARTH', full: 'Parthicus', english: 'victor over the Parthians', from: 116 },
];

/** Consulships by year, for the name builder (COS II in 98 … COS VI in 112). */
export const consulships = [
  [91, 1], [98, 2], [100, 3], [101, 4], [103, 5], [112, 6],
];

/** Trajan's Bridge over the Danube. */
export const bridge = {
  title: 'The bridge over the Danube',
  latin: 'Pons Traiani',
  lead:
    'For the second war Trajan needed a way into Dacia that would not depend on boats or on the river freezing. His architect Apollodorus of Damascus built the longest bridge of the Roman world.',
  body: [
    'It crossed the Danube between Drobeta, now Drobeta-Turnu Severin in Romania, and Pontes on the Serbian bank, at a point where the river runs through a narrow, deep channel below the Iron Gates. Stone piers carried a timber roadway on wooden arches, a little over a kilometre long. It was finished in AD 105, just in time for the second war, and it appears behind Trajan’s sacrifice in scene XCIX of the column and on his coins.',
    'It did not last long as a bridge. Hadrian, fearing the Dacians’ neighbours could use it as easily as the Roman army, had the wooden superstructure taken down. The stumps of the piers still stand at the water’s edge on both banks.',
  ],
  facts: [
    ['Architect', 'Apollodorus of Damascus'],
    ['Built', 'AD 103–105'],
    ['Length', 'A little over 1 km'],
    ['Piers', '20, of squared stone (Dio)'],
  ],
  dio: {
    ref: 'Cassius Dio, Roman History 68.13 (tr. E. Cary, 1925)',
    text: [
      'Trajan constructed over the Ister a stone bridge for which I cannot sufficiently admire him. Brilliant, indeed, as are his other achievements, yet this surpasses them. For it has twenty piers of squared stone one hundred and fifty feet in height above the foundations and sixty in width, and these, standing at a distance of one hundred and seventy feet from one another, are connected by arches.',
      'This, too, then, is one of the achievements that show the magnitude of Trajan’s designs, though the bridge is of no use to us; for merely the piers are standing, affording no means of crossing, as if they had been erected for the sole purpose of demonstrating that there is nothing which human ingenuity cannot accomplish.',
    ],
  },
  images: [
    { src: 'assets/misc/bridge-relief.jpg', caption: 'The bridge behind Trajan’s sacrifice, scene XCIX' },
    { src: 'assets/misc/bridge-reconstruction.jpg', caption: 'A reconstruction of the bridge' },
    { src: 'assets/misc/bridge-ruins.jpg', caption: 'What is left: a pier at Drobeta-Turnu Severin' },
  ],
};

/** Abbreviations for the drill. */
export const abbreviations = [
  ['SPQR', 'Senatus Populusque Romanus', 'the Senate and People of Rome'],
  ['IMP', 'Imperator', 'commander; emperor'],
  ['CAES', 'Caesar', 'Caesar, the family name that became a title'],
  ['AVG', 'Augustus', 'the revered one; the emperor'],
  ['F', 'filius', 'son'],
  ['DIVI F', 'divi filius', 'son of the deified'],
  ['GERM', 'Germanicus', 'victor over the Germans'],
  ['DAC', 'Dacicus', 'victor over the Dacians'],
  ['P M', 'Pontifex Maximus', 'chief priest'],
  ['TR P', 'Tribunicia Potestate', 'with the power of a tribune'],
  ['COS', 'Consul', 'consul'],
  ['P P', 'Pater Patriae', 'father of the fatherland'],
  ['S C', 'Senatus Consulto', 'by decree of the Senate'],
  ['OPT PRINC', 'Optimo Principi', 'to the best of rulers'],
  ['ARAB ADQ', 'Arabia Adquisita', 'Arabia acquired'],
  ['VIC DAC', 'Victoria Dacica', 'Dacian victory'],
];

/**
 * The sources, in their own words. `latin` texts get a parallel translation and
 * hover glosses for the words in `vocab`. `english` only (Cassius Dio wrote in
 * Greek) is shown as a quotation.
 */
export const readings = [
  {
    id: 'eutropius-8-2',
    title: 'The empire spread far and wide',
    source: 'Eutropius, Breviarium 8.2 (c. AD 369)',
    latin: [
      'Successit ei Ulpius Crinitus Traianus, natus Italicae in Hispania, familia antiqua magis quam clara. Nam pater eius primum consul fuit. Imperator autem apud Agrippinam in Galliis factus est.',
      'Romani imperii, quod post Augustum defensum magis fuerat quam nobiliter ampliatum, fines longe lateque diffudit. Daciam Decibalo victo subegit, provincia trans Danubium facta.',
    ],
    english: [
      'Nerva was succeeded by Ulpius Crinitus Trajan, born at Italica in Spain, of a family more ancient than famous; for his father was the first of it to be consul. He was made emperor at Agrippina (Cologne) in Gaul.',
      'The Roman empire, which since Augustus had been defended rather than nobly enlarged, he spread far and wide. He conquered Dacia after defeating Decebalus, and made it a province beyond the Danube.',
    ],
    vocab: {
      successit: 'succedo, succedere, successi — to follow, succeed (+ dative)',
      natus: 'nascor, nasci, natus sum — to be born',
      clara: 'clarus, -a, -um — famous',
      defensum: 'defendo, defendere, defendi, defensus — to defend (perfect passive participle)',
      ampliatum: 'amplio, ampliare — to enlarge',
      fines: 'finis, finis m. — boundary; (plural) territory',
      diffudit: 'diffundo, diffundere, diffudi — to spread out',
      subegit: 'subigo, subigere, subegi — to subdue',
      victo: 'vinco, vincere, vici, victus — to conquer (ablative absolute: “Decebalus having been conquered”)',
    },
  },
  {
    id: 'eutropius-8-5',
    title: 'Buried beneath the column',
    source: 'Eutropius, Breviarium 8.5',
    latin: [
      'Inter Divos relatus est solusque omnium intra urbem sepultus est. Ossa conlata in urnam auream in foro, quod aedificavit, sub columna posita sunt, cuius altitudo CXLIV pedes habet.',
      'Huius tantum memoriae delatum est, ut usque ad nostram aetatem non aliter in senatu principibus adclametur, nisi “Felicior Augusto, melior Traiano”.',
    ],
    english: [
      'He was enrolled among the gods, and he alone of them all was buried inside the city. His bones, gathered into a golden urn, were placed in the forum that he built, beneath the column, whose height is 144 feet.',
      'So much honour has been paid to his memory that, down to our own time, emperors are acclaimed in the Senate in no other way than: “Luckier than Augustus, better than Trajan.”',
    ],
    vocab: {
      relatus: 'refero, referre, rettuli, relatus — to enrol, place among',
      sepultus: 'sepelio, sepelire, sepelivi, sepultus — to bury',
      ossa: 'os, ossis n. — bone',
      urnam: 'urna, -ae f. — urn',
      auream: 'aureus, -a, -um — golden',
      columna: 'columna, -ae f. — column',
      altitudo: 'altitudo, altitudinis f. — height',
      pedes: 'pes, pedis m. — foot (here, the measure)',
      adclametur: 'acclamo, acclamare — to hail, acclaim (subjunctive in a result clause)',
      felicior: 'felix, felicis — lucky, fortunate (comparative)',
      melior: 'bonus, melior, optimus — good, better, best',
    },
  },
  {
    id: 'ammianus-16-10',
    title: 'An emperor struck dumb',
    source: 'Ammianus Marcellinus 16.10.15 (on Constantius II in Rome, AD 357)',
    latin: [
      'Verum cum ad Traiani forum venisset, singularem sub omni caelo structuram, ut opinamur, etiam numinum adsensione mirabilem, haerebat adtonitus per giganteos contextus circumferens mentem nec relatu effabiles nec rursus mortalibus adpetendos.',
    ],
    english: [
      'But when he came to the Forum of Trajan, a structure unique under the whole sky, as we believe, and a marvel even in the opinion of the gods, he stood fixed in amazement, turning his mind over the gigantic complex, which can neither be described in words nor ever again be attempted by mortals.',
    ],
    vocab: {
      singularem: 'singularis, -e — unique, one of a kind',
      structuram: 'structura, -ae f. — building, structure',
      opinamur: 'opinor, opinari — to think, believe',
      numinum: 'numen, numinis n. — divine power, god',
      mirabilem: 'mirabilis, -e — wonderful',
      haerebat: 'haereo, haerere — to stick, stand fixed',
      adtonitus: 'attonitus, -a, -um — thunderstruck, astonished',
      giganteos: 'giganteus, -a, -um — gigantic, of the Giants',
      effabiles: 'effabilis, -e — able to be described',
    },
  },
  {
    id: 'pliny-10-97',
    title: 'Trajan answers Pliny',
    source: 'Pliny the Younger, Letters 10.97 (c. AD 112)',
    latin: [
      'Actum quem debuisti, mi Secunde, in excutiendis causis eorum, qui Christiani ad te delati fuerant, secutus es. Neque enim in universum aliquid, quod quasi certam formam habeat, constitui potest.',
      'Conquirendi non sunt; si deferantur et arguantur, puniendi sunt, ita tamen ut, qui negaverit se Christianum esse idque re ipsa manifestum fecerit, id est supplicando dis nostris, quamvis suspectus in praeteritum, veniam ex paenitentia impetret.',
      'Sine auctore vero propositi libelli in nullo crimine locum habere debent. Nam et pessimi exempli nec nostri saeculi est.',
    ],
    english: [
      'You have followed the right course, my Secundus, in examining the cases of those who were reported to you as Christians. No general rule with anything like a fixed form can be laid down.',
      'They are not to be hunted out; if they are reported and proved guilty, they must be punished, but anyone who denies being a Christian and proves it in fact, that is, by praying to our gods, is to be pardoned for his change of heart, however suspect his past.',
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

/** Cassius Dio (written in Greek, c. AD 230), quoted in English. */
export const dio = [
  {
    ref: 'Roman History 68.16.3',
    title: 'On the column',
    text: 'He also built libraries. And he set up in the Forum an enormous column, to serve at once as a monument to himself and as a memorial of the work in the Forum. For that entire section had been hilly and he had cut it down for a distance equal to the height of the column, thus making the Forum level.',
  },
  {
    ref: 'Roman History 68.14.3',
    title: 'On Decebalus',
    text: 'Decebalus, when his capital and all his territory had been occupied and he was himself in danger of being captured, committed suicide; and his head was brought to Rome. In this way Dacia became subject to the Romans, and Trajan founded cities there.',
  },
  {
    ref: 'Roman History 68.29.1',
    title: 'At the edge of the world',
    text: 'Then he came to the ocean itself, and when he had learned its nature and had seen a ship sailing to India, he said: “I should certainly have crossed over to the Indi, too, if I were still young.” For he began to think about the Indi and was curious about their affairs, and he counted Alexander a lucky man.',
  },
];

/** Shown in the footer. Image credits are read from assets/credits.json. */
export const footer = {
  note: 'A Latin project by Yuzhe (Julian) Chen.',
};
