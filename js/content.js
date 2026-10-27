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
    'A hundred Roman feet of marble with one long story carved around it, from the bottom all the way to the top.',
};

/** The opening section: a lead paragraph, two short ones, and the facts panel. */
export const overview = {
  lead:
    'In AD 113 the Senate and People of Rome put up a column for the emperor Trajan in the middle of his new forum. A band of carving winds around it twenty-three times, and it tells the story of how he conquered Dacia.',
  body: [
    'Dacia was a kingdom north of the Danube, roughly where Romania is today. Trajan fought two wars against its king, Decebalus, in 101–102 and again in 105–106, and the gold he brought home paid for the forum and everything in it. The column stood in a small courtyard between two libraries, one for Greek books and one for Latin, behind a huge hall called the Basilica Ulpia. Its architect was probably Apollodorus of Damascus, the same man who designed the forum and Trajan’s bridge over the Danube.',
    'You read the story from the bottom up, left to right, and it runs for about 190 metres. Trajan himself shows up around sixty times. He gives speeches, makes sacrifices, meets envoys and checks on his forts. What surprises most people is how little of it is fighting. Most of the frieze shows soldiers marching, building camps and clearing roads, which is how the army wanted to be remembered.',
    'Trajan died in 117. His ashes were put in a golden urn in a room inside the base, and the historian Eutropius says he was the only emperor ever buried inside the city. A bronze statue of him once stood on top. It disappeared in the Middle Ages, and in 1588 Pope Sixtus V replaced it with the St Peter you can see there now.',
  ],
  facts: [
    ['Height', 'The shaft is 100 Roman feet, about 30 m. With the base it’s about 35 m.'],
    ['Frieze', 'About 190 m long, winding 23 times, with 155 scenes and around 2,600 figures'],
    ['Material', 'Roughly 20 blocks of Luna marble, each over 30 tonnes'],
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
      'It’s spring, AD 101, and the legions are marching into Dacia over two bridges made of boats. The river god Danuvius rises out of the water with a long beard and seems to steady the crossing with his arm. This is where the first war begins.',
  },
  {
    scene: 37,
    image: 'assets/scenes/05-sarmatians.jpg',
    title: 'Cavalry against the Sarmatians',
    latin: 'Sarmatae',
    text:
      'That winter Decebalus and his Sarmatian allies hit back across the river into Roman land. The Sarmatian riders are covered in scale armour from head to toe, and so are their horses. Here the Roman cavalry chases them down and knocks them out of the saddle.',
  },
  {
    scene: 71,
    image: 'assets/scenes/02-testudo.jpg',
    title: 'Storming a Dacian fortress',
    latin: 'Testudo',
    text:
      'Legionaries hold their shields over their heads to make a testudo, a “tortoise”, and push up against the walls while the defenders throw stones down on them. The Dacians built their forts high in the Carpathian mountains, and the Romans had to take them one at a time.',
  },
  {
    scene: 78,
    image: 'assets/scenes/03-victory.jpg',
    title: 'Victory writes on a shield',
    latin: 'Victoria',
    text:
      'Decebalus surrenders in AD 102 and the first war is over. To mark it, a winged Victory stands between two piles of captured armour and writes on a shield. She splits the frieze in half, and everything above her belongs to the second war.',
  },
  {
    scene: 99,
    image: 'assets/scenes/04-bridge.jpg',
    title: 'Sacrifice at the Danube bridge',
    latin: 'Pons Traiani',
    text:
      'Three years later, in AD 105, Trajan is back. He pours an offering at an altar while a bull is led up to be sacrificed. Behind them you can see his new bridge over the Danube at Drobeta, with stone piers and wooden arches, built so the army could cross whatever the weather.',
  },
  {
    scene: 145,
    image: 'assets/scenes/06-decebalus.jpg',
    title: 'The death of Decebalus',
    latin: 'Decebalus',
    text:
      'By AD 106 the Dacian king has lost. Roman cavalry are closing in, so he kneels under a tree and cuts his own throat rather than be paraded through Rome. The rider reaching for him might be Tiberius Claudius Maximus. His gravestone turned up in Greece in 1965, and it boasts that he was the one who caught Decebalus and brought his head to Trajan.',
  },
  {
    scene: 155,
    image: 'assets/scenes/07-departure.jpg',
    title: 'Dacia emptied',
    latin: 'Finis',
    text:
      'The last scene shows Dacian families walking away with their cattle and goats. Historians still argue about whether they’re refugees leaving or people being forced off their land. Either way, Dacia now belonged to Rome.',
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
    'Back at the bottom of the column, over the door to Trajan’s tomb, two winged Victories hold up the dedication. People have admired these letters for two thousand years. They were probably painted on with a flat brush first, then cut in a V shape so they catch the light, and the typeface called Trajan is copied straight from them.',
  note:
    'The last line has puzzled readers since ancient times. Cassius Dio took it literally and said the column is as tall as the hill that was dug away to build the forum. Excavations suggest the ground here was never that high, so nobody is quite sure what was cleared away, or how much.',
  lines: [
    {
      carved: 'SENATVS·POPVLVSQVE·ROMANVS',
      expanded: 'Senatus populusque Romanus',
      english: 'The Senate and People of Rome',
      gloss: [['-que', 'means “and”, stuck onto the end of the word: populus + que, “and the people”']],
    },
    {
      carved: 'IMP·CAESARI·DIVI·NERVAE·F·NERVAE',
      expanded: 'Imp(eratori) Caesari divi Nervae f(ilio) Nervae',
      english: 'to the Emperor Caesar Nerva, son of the deified Nerva,',
      gloss: [['IMP', 'imperator, “commander” or “emperor”, in the dative: “to the emperor”'], ['DIVI', 'divus, “deified”, since Nerva was made a god when he died'], ['F', 'filius, “son”. Trajan was Nerva’s adopted son']],
    },
    {
      carved: 'TRAIANO·AVG·GERM·DACICO·PONTIF',
      expanded: 'Traiano Aug(usto) Germ(anico) Dacico pontif(ici)',
      english: 'Trajan Augustus, conqueror of the Germans and the Dacians, chief',
      gloss: [['AVG', 'Augustus, a title every emperor had'], ['GERM', 'Germanicus, a victory title he took in AD 97'], ['DACICO', 'Dacicus, a victory title he took in AD 102']],
    },
    {
      carved: 'MAXIMO·TRIB·POT·XVII·IMP·VI·COS·VI·P·P',
      expanded: 'maximo trib(unicia) pot(estate) XVII imp(eratori) VI co(n)s(uli) VI p(atri) p(atriae)',
      english: 'priest, holding the power of a tribune for the seventeenth year, hailed as imperator six times, consul six times, father of his country,',
      gloss: [['PONTIF MAXIMO', 'pontifex maximus, “chief priest”, split over two lines'], ['TRIB POT XVII', 'the tribune’s power was renewed every year, so the seventeenth one dates the stone to AD 113'], ['P P', 'pater patriae, “father of the fatherland”']],
    },
    {
      carved: 'AD·DECLARANDVM·QVANTAE·ALTITVDINIS',
      expanded: 'ad declarandum quantae altitudinis',
      english: 'to show how high',
      gloss: [['ad declarandum', 'ad with a gerund shows purpose: “for showing”'], ['quantae altitudinis', 'a genitive of description, “of how great a height”']],
    },
    {
      carved: 'MONS·ET·LOCVS·TANT[IS·OPER]IBVS·SIT·EGESTVS',
      expanded: 'mons et locus tant[is oper]ibus sit egestus',
      english: 'a hill and the ground were cleared away for such great works.',
      gloss: [['sit egestus', 'perfect passive subjunctive of egero, “carry out” or “remove”, inside an indirect question'], ['[ ]', 'the stone is broken here, so editors fill in the missing letters']],
    },
  ],
};

/** The coins exhibit. */
export const coinsIntro = {
  title: 'Coins of the Optimus Princeps',
  text:
    'The same shortened Latin shows up on Trajan’s coins. For most Romans a coin was the only picture of the emperor they would ever see, and the writing around the edge was meant to be read at a glance.',
};

export const coins = [
  {
    id: 'column',
    name: 'Denarius with the Column',
    date: 'AD 114–117',
    ref: 'RIC II 307',
    metal: 'Silver',
    about: 'This one shows the column itself. You can make out the base with its two eagles and Trajan’s statue on top, holding a spear and a globe.',
    obverse: {
      legend: 'IMP TRAIANO OPTIMO AVG GER DAC P M TR P',
      expanded: 'Imp(eratori) Traiano Optimo Aug(usto) Ger(manico) Dac(ico) p(ontifici) m(aximo) tr(ibunicia) p(otestate)',
      english: 'To the Emperor Trajan the Best, Augustus, conqueror of the Germans and Dacians, chief priest, holding the power of a tribune',
      gloss: [['OPTIMO', 'Optimus, “the Best”, which became part of his official name in AD 114'], ['TR P', 'tribunicia potestate']],
    },
    reverse: {
      legend: 'COS VI P P S P Q R',
      expanded: 'co(n)s(uli) VI p(atri) p(atriae) S(enatus) P(opulus)q(ue) R(omanus)',
      english: 'consul six times, father of his country, from the Senate and People of Rome',
      gloss: [['S P Q R', 'the Senate’s dedication, the same words that open the inscription']],
    },
  },
  {
    id: 'dacia',
    name: 'Denarius, Dacia defeated',
    date: 'c. AD 107',
    ref: 'RIC II 219',
    metal: 'Silver',
    about: 'A Dacian in his pointed cap sits on a pile of weapons with his head down, and his curved sword lies underneath him.',
    obverse: {
      legend: 'IMP TRAIANO AVG GER DAC P M TR P COS V P P',
      expanded: 'Imp(eratori) Traiano Aug(usto) Ger(manico) Dac(ico) p(ontifici) m(aximo) tr(ibunicia) p(otestate) co(n)s(uli) V p(atri) p(atriae)',
      english: 'To the Emperor Trajan Augustus, conqueror of the Germans and Dacians, chief priest, holding the power of a tribune, consul five times, father of his country',
    },
    reverse: {
      legend: 'S P Q R OPTIMO PRINCIPI',
      expanded: 'S(enatus) P(opulus)q(ue) R(omanus) optimo principi',
      english: 'The Senate and People of Rome, to the best of leaders',
      gloss: [['OPTIMO PRINCIPI', 'this is dative, “to the best leader”, so the whole coin is a gift addressed to Trajan']],
    },
  },
  {
    id: 'bridge',
    name: 'Sestertius, the Danube bridge',
    date: 'c. AD 107–109',
    ref: 'RIC II 569',
    metal: 'Bronze',
    about: 'Here is the bridge over the Danube, squeezed into one big arch with a tower at each end and a boat going underneath.',
    obverse: {
      legend: 'IMP CAES NERVAE TRAIANO AVG GER DAC P M TR P COS V P P',
      expanded: 'Imp(eratori) Caes(ari) Nervae Traiano Aug(usto) Ger(manico) Dac(ico) p(ontifici) m(aximo) tr(ibunicia) p(otestate) co(n)s(uli) V p(atri) p(atriae)',
      english: 'To the Emperor Caesar Nerva Trajan Augustus, conqueror of the Germans and Dacians, chief priest, holding the power of a tribune, consul five times, father of his country',
    },
    reverse: {
      legend: 'S P Q R OPTIMO PRINCIPI · S C',
      expanded: 'S(enatus) P(opulus)q(ue) R(omanus) optimo principi · s(enatus) c(onsulto)',
      english: 'The Senate and People of Rome, to the best of leaders, by order of the Senate',
      gloss: [['S C', 'senatus consulto. Bronze coins were issued on the Senate’s authority']],
    },
  },
  {
    id: 'vicdac',
    name: 'Sestertius, Dacian victory',
    date: 'c. AD 103',
    ref: 'RIC II 528',
    metal: 'Bronze',
    about: 'Victory rests one foot on a helmet and hangs a shield marked VIC DAC on a palm tree. It’s the same picture that splits the two wars on the column.',
    obverse: {
      legend: 'IMP CAES NERVAE TRAIANO AVG GER DAC P M TR P COS V P P',
      expanded: 'Imp(eratori) Caes(ari) Nervae Traiano Aug(usto) Ger(manico) Dac(ico) p(ontifici) m(aximo) tr(ibunicia) p(otestate) co(n)s(uli) V p(atri) p(atriae)',
      english: 'To the Emperor Caesar Nerva Trajan Augustus, conqueror of the Germans and Dacians, chief priest, holding the power of a tribune, consul five times, father of his country',
    },
    reverse: {
      legend: 'S P Q R OPTIMO PRINCIPI · S C · VIC DAC',
      expanded: 'S(enatus) P(opulus)q(ue) R(omanus) optimo principi · s(enatus) c(onsulto) · Vic(toria) Dac(ica)',
      english: 'The Senate and People of Rome, to the best of leaders, by order of the Senate. “Victory over Dacia”',
      gloss: [['VIC DAC', 'Victoria Dacica, written on the shield']],
    },
  },
  {
    id: 'arabia',
    name: 'Sestertius, Arabia acquired',
    date: 'AD 106–111',
    metal: 'Orichalcum',
    about: 'Arabia stands holding a branch with a camel at her feet. The kingdom around Petra became the Roman province of Arabia in AD 106.',
    obverse: {
      legend: 'IMP CAES NERVAE TRAIANO AVG GER DAC P M TR P COS V P P',
      expanded: 'Imp(eratori) Caes(ari) Nervae Traiano Aug(usto) Ger(manico) Dac(ico) p(ontifici) m(aximo) tr(ibunicia) p(otestate) co(n)s(uli) V p(atri) p(atriae)',
      english: 'To the Emperor Caesar Nerva Trajan Augustus, conqueror of the Germans and Dacians, chief priest, holding the power of a tribune, consul five times, father of his country',
      gloss: [['Note', 'this coin is worn, so the legend given is the usual one for this type']],
    },
    reverse: {
      legend: 'S P Q R OPTIMO PRINCIPI · ARAB ADQVIS · S C',
      expanded: 'S(enatus) P(opulus)q(ue) R(omanus) optimo principi · Arab(ia) adquis(ita) · s(enatus) c(onsulto)',
      english: 'The Senate and People of Rome, to the best of leaders. Arabia acquired. By order of the Senate',
      gloss: [['ARAB ADQVIS', 'Arabia adquisita. It says “acquired”, not “conquered”, because the kingdom was taken over without a war']],
    },
  },
  {
    id: 'forum',
    name: 'Aureus, Trajan’s Forum',
    date: 'AD 112–113',
    ref: 'RIC II 257',
    metal: 'Gold',
    about: 'This gold coin shows the main gateway into Trajan’s Forum, with six columns and a chariot pulled by six horses on the roof.',
    obverse: {
      legend: 'IMP TRAIANVS AVG GER DAC P M TR P COS VI P P',
      expanded: 'Imp(erator) Traianus Aug(ustus) Ger(manicus) Dac(icus) p(ontifex) m(aximus) tr(ibunicia) p(otestate) co(n)s(ul) VI p(ater) p(atriae)',
      english: 'The Emperor Trajan Augustus, conqueror of the Germans and Dacians, chief priest, holding the power of a tribune, consul six times, father of his country',
      gloss: [['TRAIANVS', 'this is nominative, not dative, so this coin just names him instead of dedicating itself to him']],
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
    ['Emperor', '28 January 98 to August 117'],
    ['Died', 'August 117, at Selinus in Cilicia, aged 63'],
    ['Successor', 'Hadrian, his cousin’s son, whom he had raised'],
  ],
  text: [
    'So who was the man on all these coins? Trajan was the first emperor born outside Italy. His family were Romans who had settled in Spain, and his father had already made it to consul. Trajan himself was a soldier first. In 97 he was governing part of Germany when the old emperor Nerva, under pressure from the army, adopted him as his son and heir. Three months later Nerva died. Trajan got the news at Cologne and was in no hurry to come to Rome.',
    'When he did arrive, he treated the Senate with respect, and they loved him for it. They gave him a title no emperor had had before, Optimus Princeps, “the best of leaders”. The gold from Dacia paid for the forum, the markets, new baths, harbours, roads and aqueducts. His letters to his friend Pliny, who was governing a province in what is now Turkey, show him answering questions about fire brigades, water supplies and Christians in a few short, practical lines.',
    'In 114 he turned east against Parthia. He took Armenia and Mesopotamia, captured the Parthian capital at Ctesiphon and made it all the way to the Persian Gulf. Then the new provinces rebelled behind him. Trajan fell ill, started for home, and died on the way. Two hundred and fifty years later, Eutropius says, the Senate still greeted each new emperor by wishing that he would be felicior Augusto, melior Traiano, “luckier than Augustus, better than Trajan”.',
  ],
};

/**
 * His official name, growing title by title. Used by the name builder.
 * `from` is the year a title was first used.
 */
export const titles = [
  { abbr: 'GERM', full: 'Germanicus', english: 'conqueror of the Germans', from: 97 },
  { abbr: 'DAC', full: 'Dacicus', english: 'conqueror of the Dacians', from: 102 },
  { abbr: 'OPTIMVS', full: 'Optimus', english: 'the Best', from: 114 },
  { abbr: 'PARTH', full: 'Parthicus', english: 'conqueror of the Parthians', from: 116 },
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
    'Before the second war, Trajan needed a way into Dacia that didn’t depend on boats or on the river freezing over. So Apollodorus of Damascus built him the longest bridge in the Roman world.',
  body: [
    'It crossed the Danube between Drobeta, now Drobeta-Turnu Severin in Romania, and Pontes on the Serbian side, just downstream of the gorge called the Iron Gates. Stone piers held up a wooden road on wooden arches, and the whole thing was a little over a kilometre long. It was finished in AD 105, just in time for the war, and it shows up on the column behind Trajan’s sacrifice in scene XCIX, and on his coins too.',
    'It didn’t last long. Hadrian worried that Rome’s enemies could use it just as easily as the Roman army, so he had the wooden part taken down. The stumps of the piers are still there on both banks.',
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
    { src: 'assets/misc/bridge-relief.jpg', caption: 'The bridge on the column, behind Trajan’s sacrifice in scene XCIX' },
    { src: 'assets/misc/bridge-reconstruction.jpg', caption: 'How the bridge might have looked' },
    { src: 'assets/misc/bridge-ruins.jpg', caption: 'What’s left today: the piers on the Serbian bank' },
  ],
};

/** Abbreviations for the drill. */
export const abbreviations = [
  ['SPQR', 'Senatus Populusque Romanus', 'the Senate and People of Rome'],
  ['IMP', 'Imperator', 'commander, emperor'],
  ['CAES', 'Caesar', 'Caesar, a family name that became a title'],
  ['AVG', 'Augustus', 'the revered one, the emperor'],
  ['F', 'filius', 'son'],
  ['DIVI F', 'divi filius', 'son of the deified'],
  ['GERM', 'Germanicus', 'conqueror of the Germans'],
  ['DAC', 'Dacicus', 'conqueror of the Dacians'],
  ['P M', 'Pontifex Maximus', 'chief priest'],
  ['TR P', 'Tribunicia Potestate', 'with the power of a tribune'],
  ['COS', 'Consul', 'consul'],
  ['P P', 'Pater Patriae', 'father of the fatherland'],
  ['S C', 'Senatus Consulto', 'by order of the Senate'],
  ['OPT PRINC', 'Optimo Principi', 'to the best of leaders'],
  ['ARAB ADQ', 'Arabia Adquisita', 'Arabia acquired'],
  ['VIC DAC', 'Victoria Dacica', 'victory over Dacia'],
];

/**
 * The sources, in their own words. `latin` texts get a parallel translation and
 * hover glosses for the words in `vocab`.
 */
export const readings = [
  {
    id: 'eutropius-8-2',
    title: 'The empire spread far and wide',
    source: 'Eutropius, Breviarium 8.2 (written around AD 369)',
    latin: [
      'Successit ei Ulpius Crinitus Traianus, natus Italicae in Hispania, familia antiqua magis quam clara. Nam pater eius primum consul fuit. Imperator autem apud Agrippinam in Galliis factus est.',
      'Romani imperii, quod post Augustum defensum magis fuerat quam nobiliter ampliatum, fines longe lateque diffudit. Daciam Decibalo victo subegit, provincia trans Danubium facta.',
    ],
    english: [
      'After Nerva came Ulpius Crinitus Trajan, who was born at Italica in Spain. His family was old rather than famous, since his father was the first of them to become consul. He was made emperor at Agrippina, which is Cologne, in Gaul.',
      'Since Augustus, the Roman empire had mostly been defended rather than grown in any glorious way. Trajan pushed its borders out far and wide. He beat Decebalus, conquered Dacia, and made it a province on the far side of the Danube.',
    ],
    vocab: {
      successit: 'succedo, succedere, successi: to follow, succeed (+ dative)',
      natus: 'nascor, nasci, natus sum: to be born',
      clara: 'clarus, -a, -um: famous',
      defensum: 'defendo, defendere, defendi, defensus: to defend (perfect passive participle)',
      ampliatum: 'amplio, ampliare: to enlarge',
      fines: 'finis, finis m.: boundary; in the plural, territory',
      diffudit: 'diffundo, diffundere, diffudi: to spread out',
      subegit: 'subigo, subigere, subegi: to subdue',
      victo: 'vinco, vincere, vici, victus: to conquer (ablative absolute, “with Decebalus conquered”)',
    },
  },
  {
    id: 'eutropius-8-5',
    title: 'Buried under the column',
    source: 'Eutropius, Breviarium 8.5',
    latin: [
      'Inter Divos relatus est solusque omnium intra urbem sepultus est. Ossa conlata in urnam auream in foro, quod aedificavit, sub columna posita sunt, cuius altitudo CXLIV pedes habet.',
      'Huius tantum memoriae delatum est, ut usque ad nostram aetatem non aliter in senatu principibus adclametur, nisi “Felicior Augusto, melior Traiano”.',
    ],
    english: [
      'He was made a god, and he was the only one of them all to be buried inside the city. His bones were gathered into a golden urn and placed in the forum he built, under the column, which is 144 feet tall.',
      'His memory was honoured so much that even in our own day the Senate greets every emperor the same way: “Luckier than Augustus, better than Trajan.”',
    ],
    vocab: {
      relatus: 'refero, referre, rettuli, relatus: to enrol, place among',
      sepultus: 'sepelio, sepelire, sepelivi, sepultus: to bury',
      ossa: 'os, ossis n.: bone',
      urnam: 'urna, -ae f.: urn',
      auream: 'aureus, -a, -um: golden',
      columna: 'columna, -ae f.: column',
      altitudo: 'altitudo, altitudinis f.: height',
      pedes: 'pes, pedis m.: foot, here the measurement',
      adclametur: 'acclamo, acclamare: to hail, cheer (subjunctive in a result clause)',
      felicior: 'felix, felicis: lucky (comparative, “luckier”)',
      melior: 'bonus, melior, optimus: good, better, best',
    },
  },
  {
    id: 'ammianus-16-10',
    title: 'An emperor lost for words',
    source: 'Ammianus Marcellinus 16.10.15, on Constantius II visiting Rome in AD 357',
    latin: [
      'Verum cum ad Traiani forum venisset, singularem sub omni caelo structuram, ut opinamur, etiam numinum adsensione mirabilem, haerebat adtonitus per giganteos contextus circumferens mentem nec relatu effabiles nec rursus mortalibus adpetendos.',
    ],
    english: [
      'But when he came to the Forum of Trajan, which I think is unlike anything else under the sky and amazing even to the gods, he stopped in his tracks. He just stood there, stunned, trying to take in buildings so gigantic that words can’t describe them and no human being could ever try to build them again.',
    ],
    vocab: {
      singularem: 'singularis, -e: unique, one of a kind',
      structuram: 'structura, -ae f.: building, structure',
      opinamur: 'opinor, opinari: to think, believe',
      numinum: 'numen, numinis n.: divine power, god',
      mirabilem: 'mirabilis, -e: wonderful',
      haerebat: 'haereo, haerere: to stick, be stuck',
      adtonitus: 'attonitus, -a, -um: thunderstruck, amazed',
      giganteos: 'giganteus, -a, -um: gigantic, fit for Giants',
      effabiles: 'effabilis, -e: able to be put into words',
    },
  },
  {
    id: 'pliny-10-97',
    title: 'Trajan writes back to Pliny',
    source: 'Pliny the Younger, Letters 10.97 (around AD 112)',
    latin: [
      'Actum quem debuisti, mi Secunde, in excutiendis causis eorum, qui Christiani ad te delati fuerant, secutus es. Neque enim in universum aliquid, quod quasi certam formam habeat, constitui potest.',
      'Conquirendi non sunt; si deferantur et arguantur, puniendi sunt, ita tamen ut, qui negaverit se Christianum esse idque re ipsa manifestum fecerit, id est supplicando dis nostris, quamvis suspectus in praeteritum, veniam ex paenitentia impetret.',
      'Sine auctore vero propositi libelli in nullo crimine locum habere debent. Nam et pessimi exempli nec nostri saeculi est.',
    ],
    english: [
      'You did the right thing, my dear Secundus, in looking into the cases of people reported to you as Christians. There isn’t one rule that can be set down for every case.',
      'Don’t go hunting for them. If they’re reported and found guilty, they have to be punished. But if someone says he isn’t a Christian and proves it by actually praying to our gods, then he should be let off because he changed his mind, however suspicious his past.',
      'Anonymous accusations shouldn’t count in any case at all. They set a terrible example and don’t belong in our times.',
    ],
    vocab: {
      debuisti: 'debeo, debere: to owe; ought',
      excutiendis: 'excutio, excutere: to examine closely (gerundive)',
      delati: 'defero, deferre, detuli, delatus: to report, inform against',
      conquirendi: 'conquiro, conquirere: to hunt out (gerundive, “are to be”)',
      puniendi: 'punio, punire: to punish (gerundive)',
      supplicando: 'supplico, supplicare: to pray to (gerund, “by praying”)',
      veniam: 'venia, -ae f.: pardon',
      libelli: 'libellus, -i m.: pamphlet, written accusation',
      saeculi: 'saeculum, -i n.: age, generation',
    },
  },
];

/** Cassius Dio (he wrote in Greek, around AD 230), quoted in English. */
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
