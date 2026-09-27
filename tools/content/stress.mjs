/* Klemtoon: tik de beklemtoonde lettergreep aan.
 *
 * Woorden uit de uitspraakoefeningen van het werkboek (Pronunciar con gusto:
 * "marque la sílaba tónica", de b/v/d- en c/qu/z/j/g-oefeningen, ¿con o sin
 * acento?), de voorbeelden uit de cursus over el acento, en aangevuld met
 * woordenschat van de cursus: woorden op -n/-s/klinker en op een andere
 * medeklinker, met en zonder accentteken, en een paar woordparen waar het
 * accent de betekenis verandert.
 *
 * Elk woord staat als 'lettergrepen-met-streepjes'; es is die lettergrepen
 * aan elkaar. De uitleg (note) volgt uit de klemtoonregels, tenzij het woord
 * een eigen uitleg heeft. */

const PRON_28 = { src: 'spanish-md/IMG_20260918_202539589_AE.md' }; // 28 acentuaciones 'con trampa'
const PRON_27 = { src: 'spanish-md/IMG_20260918_202704929_AE.md' }; // 27 b, v, d
const PRON_23 = { src: 'spanish-md/IMG_20260918_202909296_AE.md' }; // 23 pronunciación y ortografía
const ACENTO_20 = { src: 'spanish-md/IMG_20260918_202524765_AE.md' }; // 20b ¿con o sin acento?
const CURSUS = { src: 'course-md/IMG_20260918_191144257_AE.md' }; // cursus: el acento
const VOCAB = { srcLabel: 'Woordenschat van de cursus' };

const NOTE = {
  llana: 'Eindigt op een klinker, n of s en heeft geen accent: klemtoon op de voorlaatste lettergreep.',
  aguda: 'Eindigt op een medeklinker (niet n of s) en heeft geen accent: klemtoon op de laatste lettergreep.',
  accentLaatste: 'Het accentteken toont de klemtoon: op de laatste lettergreep, hoewel het woord op een klinker, n of s eindigt.',
  accentVoorlaatste: 'Het accentteken toont de klemtoon: op de voorlaatste lettergreep, hoewel het woord op een medeklinker (niet n of s) eindigt.',
  esdrujula: 'Klemtoon op de derde lettergreep van achteren: zo’n woord krijgt altijd een accentteken.',
  hiaat: 'Het accent op de i of u toont de klemtoon en splitst de klinkers in twee lettergrepen.',
};

const ACCENT = /[áéíóú]/;
const VOWEL = /[aeiouáéíóú]/;

/** De uitleg volgens de klemtoonregels. */
function ruleNote(syllables, stressed) {
  const n = syllables.length;
  const syl = syllables[stressed];
  if (!ACCENT.test(syl)) return /[aeiouns]$/.test(syllables[n - 1]) ? NOTE.llana : NOTE.aguda;
  const before = syllables[stressed - 1] ?? '';
  const after = syllables[stressed + 1] ?? '';
  if ((/[íú]$/.test(syl) && VOWEL.test(after[0] ?? '')) || (/^[íú]/.test(syl) && VOWEL.test(before.at(-1) ?? ''))) return NOTE.hiaat;
  if (stressed === n - 1) return NOTE.accentLaatste;
  if (stressed === n - 2) return NOTE.accentVoorlaatste;
  return NOTE.esdrujula;
}

const slug = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/** w('te-lé-fo-no', 1, 'de telefoon', PRON_28) — optioneel een eigen note of id. */
const w = (split, stressed, nl, source, { note, id } = {}) => {
  const syllables = split.split('-');
  const es = syllables.join('');
  return {
    id: `st.${id ?? slug(es)}`, kind: 'stress', theme: 'klemtoon', grammarRef: 'gr.klemtoon',
    es, syllables, stressed, nl, note: note ?? ruleNote(syllables, stressed), ...source,
  };
};

export default {
  atoms: [
    // Werkboek, Pronunciar con gusto 28: klemtoon anders dan in andere talen.
    w('so-fá', 1, 'de zetel, de sofa', PRON_28),
    w('te-lé-fo-no', 1, 'de telefoon', PRON_28),
    w('far-ma-cia', 1, 'de apotheek', PRON_28),
    w('fo-to-co-pia', 2, 'de fotokopie', PRON_28),
    w('ma-te-má-ti-cas', 2, 'wiskunde', PRON_28),
    w('fí-si-ca', 0, 'fysica', PRON_28),
    w('pro-fe-sor', 2, 'de leraar', PRON_28),
    w('te-ra-pia', 1, 'de therapie', PRON_28),
    w('at-mós-fe-ra', 1, 'de atmosfeer', PRON_28),

    // Werkboek 20b: met of zonder accent verandert de betekenis.
    w('lle-go', 0, 'ik kom aan', ACENTO_20, { note: 'Geen accent: klemtoon op de voorlaatste lettergreep. Llego = ik kom aan; llegó = hij/zij kwam aan.' }),
    w('lle-gó', 1, 'hij/zij kwam aan', ACENTO_20, { id: 'llego-indefinido', note: 'Het accentteken toont de klemtoon op de laatste lettergreep: llegó = hij/zij kwam aan (indefinido); llego = ik kom aan.' }),
    w('tra-ba-jo', 1, 'ik werk; het werk', ACENTO_20, { note: 'Geen accent: klemtoon op de voorlaatste lettergreep. Trabajo = ik werk; trabajó = hij/zij werkte.' }),
    w('tra-ba-jó', 2, 'hij/zij werkte', ACENTO_20, { id: 'trabajo-indefinido', note: 'Het accentteken toont de klemtoon op de laatste lettergreep: trabajó = hij/zij werkte (indefinido); trabajo = ik werk.' }),

    // Werkboek, Pronunciar con gusto 27: b, v, d.
    w('bue-no', 0, 'goed', PRON_27),
    w('a-bu-rrir', 2, 'vervelen', PRON_27),
    w('bo-lí-gra-fo', 1, 'de balpen', PRON_27),
    w('a-bue-lo', 1, 'de grootvader', PRON_27),
    w('va-lor', 1, 'de waarde', PRON_27),
    w('ma-ra-vi-llo-so', 3, 'prachtig', PRON_27),
    w('ve-ci-no', 1, 'de buurman', PRON_27),
    w('mo-vi-mien-to', 2, 'de beweging', PRON_27),
    w('di-fí-cil', 1, 'moeilijk', PRON_27),
    w('ma-de-ra', 1, 'het hout', PRON_27),
    w('ciu-dad', 1, 'de stad', PRON_27),

    // Werkboek, Pronunciar con gusto 23: c/qu, z/c, j/g, g/gu.
    w('ca-rác-ter', 1, 'het karakter', PRON_23),
    w('que-so', 0, 'de kaas', PRON_23),
    w('quios-co', 0, 'de kiosk', PRON_23),
    w('có-mo-do', 0, 'comfortabel', PRON_23),
    w('cua-der-no', 1, 'het schrift', PRON_23),
    w('za-pa-tos', 1, 'de schoenen', PRON_23),
    w('cen-tro', 0, 'het centrum', PRON_23),
    w('cin-co', 0, 'vijf', PRON_23),
    w('zu-mo', 0, 'het sap', PRON_23),
    w('jar-dín', 1, 'de tuin', PRON_23),
    w('je-fe', 0, 'de baas', PRON_23),
    w('gen-te', 0, 'de mensen', PRON_23),
    w('ji-ra-fa', 1, 'de giraf', PRON_23),
    w('gim-na-sia', 1, 'de gymnastiek', PRON_23),
    w('jo-ven', 0, 'jong', PRON_23),
    w('ju-gar', 1, 'spelen', PRON_23),
    w('gui-ta-rra', 1, 'de gitaar', PRON_23),
    w('gus-to', 0, 'de smaak', PRON_23),

    // Cursus, el acento: de voorbeelden bij de drie regels.
    w('a-mi-ga', 1, 'de vriendin', CURSUS),
    w('se-ño-res', 1, 'de heren', CURSUS),
    w('ha-blar', 1, 'spreken', CURSUS),
    w('mé-di-co', 0, 'de dokter', CURSUS),
    w('ha-bi-ta-ción', 3, 'de kamer', CURSUS),
    w('ha-bi-ta-cio-nes', 3, 'de kamers', CURSUS, { note: 'Eindigt op -s: klemtoon op de voorlaatste lettergreep, dus geen accent meer (enkelvoud: habitación).' }),

    // Woordenschat: eindigt op klinker, n of s, zonder accent.
    w('ca-mi-sa', 1, 'het hemd', VOCAB),
    w('ca-mi-se-ta', 2, 'het T-shirt', VOCAB),
    w('cha-que-ta', 1, 'de jas, het jasje', VOCAB),
    w('pa-ra-guas', 1, 'de paraplu', VOCAB),
    w('co-ci-na', 1, 'de keuken', VOCAB),
    w('es-pe-jo', 1, 'de spiegel', VOCAB),
    w('dor-mi-to-rio', 2, 'de slaapkamer', VOCAB),
    w('mi-cro-on-das', 2, 'de microgolfoven', VOCAB),
    w('cho-co-la-te', 2, 'de chocolade', VOCAB),
    w('pa-e-lla', 1, 'de paella', VOCAB),
    w('mu-se-o', 1, 'het museum', VOCAB),
    w('i-gle-sia', 1, 'de kerk', VOCAB),
    w('mon-ta-ña', 1, 'de berg', VOCAB),
    w('jue-ves', 0, 'donderdag', VOCAB),
    w('e-xa-men', 1, 'het examen', VOCAB),
    w('in-te-li-gen-te', 3, 'intelligent', VOCAB),
    w('in-te-re-san-te', 3, 'interessant', VOCAB),
    w('pan-ta-lo-nes', 2, 'de broek', VOCAB, { note: 'Eindigt op -s: klemtoon op de voorlaatste lettergreep, dus geen accent (enkelvoud: pantalón).' }),
    w('can-cio-nes', 1, 'de liedjes', VOCAB, { note: 'Eindigt op -s: klemtoon op de voorlaatste lettergreep, dus geen accent (enkelvoud: canción).' }),

    // Woordenschat: eindigt op een andere medeklinker, zonder accent.
    w('es-pa-ñol', 2, 'Spaans', VOCAB),
    w('ver-dad', 1, 'de waarheid', VOCAB),
    w('u-ni-ver-si-dad', 4, 'de universiteit', VOCAB),
    w('fe-liz', 1, 'gelukkig', VOCAB),
    w('re-loj', 1, 'het horloge, de klok', VOCAB),
    w('tra-ba-ja-dor', 3, 'hardwerkend', VOCAB),
    w('te-le-vi-sor', 3, 'het televisietoestel', VOCAB),
    w('hos-pi-tal', 2, 'het ziekenhuis', VOCAB),

    // Woordenschat: accent op de laatste lettergreep.
    w('ca-fé', 1, 'de koffie; het café', VOCAB),
    w('es-ta-ción', 2, 'het station; het seizoen', VOCAB),
    w('pan-ta-lón', 2, 'de broek', VOCAB),
    w('can-ción', 1, 'het liedje', VOCAB),
    w('a-vión', 1, 'het vliegtuig', VOCAB),
    w('au-to-bús', 2, 'de bus', VOCAB),
    w('sa-lón', 1, 'de woonkamer', VOCAB),
    w('bal-cón', 1, 'het balkon', VOCAB),
    w('ja-món', 1, 'de ham', VOCAB),
    w('al-go-dón', 2, 'het katoen', VOCAB),
    w('a-le-mán', 2, 'Duits', VOCAB),
    w('in-glés', 1, 'Engels', VOCAB),
    w('fran-cés', 1, 'Frans', VOCAB),
    w('tam-bién', 1, 'ook', VOCAB),
    w('des-pués', 1, 'daarna', VOCAB),
    w('ha-bló', 1, 'hij/zij sprak', VOCAB, { note: 'Het accentteken toont de klemtoon op de laatste lettergreep: habló = hij/zij sprak (indefinido); hablo = ik spreek.' }),
    w('pa-pá', 1, 'de papa', VOCAB, { note: 'Het accentteken toont de klemtoon op de laatste lettergreep: papá = de papa; zonder accent is la papa de aardappel.' }),
    w('es-tá', 1, 'hij/zij is (estar)', VOCAB, { note: 'Het accentteken toont de klemtoon op de laatste lettergreep: está = hij/zij is; esta (zonder accent) = deze.' }),

    // Woordenschat: accent op de voorlaatste lettergreep.
    w('lá-piz', 0, 'het potlood', VOCAB),
    w('ár-bol', 0, 'de boom', VOCAB),
    w('fá-cil', 0, 'makkelijk', VOCAB),
    w('a-zú-car', 1, 'de suiker', VOCAB),
    w('fút-bol', 0, 'het voetbal', VOCAB),

    // Woordenschat: klemtoon op de derde lettergreep van achteren.
    w('mú-si-ca', 0, 'de muziek', VOCAB),
    w('miér-co-les', 0, 'woensdag', VOCAB, { note: 'Klemtoon op de derde lettergreep van achteren (ie is één lettergreep): daarom een accentteken.' }),
    w('sá-ba-do', 0, 'zaterdag', VOCAB),
    w('plá-ta-no', 0, 'de banaan', VOCAB),
    w('lám-pa-ra', 0, 'de lamp', VOCAB),
    w('pe-lí-cu-la', 1, 'de film', VOCAB),
    w('nú-me-ro', 0, 'het nummer, het getal', VOCAB),
    w('rá-pi-do', 0, 'snel', VOCAB),
    w('tí-mi-do', 0, 'verlegen', VOCAB),
    w('sim-pá-ti-co', 1, 'sympathiek', VOCAB),
    w('lá-pi-ces', 0, 'de potloden', VOCAB, { note: 'Klemtoon op de derde lettergreep van achteren: het meervoud van lápiz houdt dus zijn accent.' }),
    w('ár-bo-les', 0, 'de bomen', VOCAB, { note: 'Klemtoon op de derde lettergreep van achteren: het meervoud van árbol houdt dus zijn accent.' }),
    w('e-xá-me-nes', 1, 'de examens', VOCAB, { note: 'De klemtoon blijft op xa, maar dat is in het meervoud de derde lettergreep van achteren: daarom een accent (enkelvoud: examen).' }),
    w('jó-ve-nes', 0, 'de jongeren', VOCAB, { note: 'De klemtoon blijft op jo, maar dat is in het meervoud de derde lettergreep van achteren: daarom een accent (enkelvoud: joven).' }),

    // Woordenschat: accent op i of u naast een andere klinker (twee lettergrepen).
    w('dí-a', 0, 'de dag', VOCAB),
    w('pa-ís', 1, 'het land', VOCAB),
    w('tí-o', 0, 'de oom', VOCAB),
    w('frí-o', 0, 'koud', VOCAB),
    w('po-li-cí-a', 2, 'de politie', VOCAB),
    w('ca-fe-te-rí-a', 3, 'de cafetaria, het café', VOCAB),
    w('pa-na-de-rí-a', 3, 'de bakkerij', VOCAB),
    w('za-pa-te-rí-a', 3, 'de schoenwinkel', VOCAB),
  ],
};
