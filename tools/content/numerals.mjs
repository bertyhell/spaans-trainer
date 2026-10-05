/* Getallen, het uur, data en prijzen — berekend, niet opgeschreven.
 *
 * Een numeral-atoom is een soort getal, geen vast getal: js/numerals.js maakt
 * bij elke vraag een nieuw voorbeeld uit het bereik hieronder. De Leitner-doos
 * hoort bij de soort. Zo kan je eindeloos oefenen op wat in het echt het
 * lastigst is: getallen die je hoort aan de kassa of aan de telefoon.
 *
 *   numeral { gen, label, min?, max?, minutes? }
 *     gen      number | year | time | date | price
 *     label    hoe de soort in het overzicht heet
 *     min/max  bereik (number, year, price)
 *     minutes  welke minuten (time) */

const SRC = 'Berekend: elke vraag een ander voorbeeld';

const numeral = (id, theme, gen, label, extra = {}) =>
  ({ id: `n.${id}`, kind: 'numeral', theme, gen, label, srcLabel: SRC, ...extra });

export default {
  atoms: [
    numeral('0-15', 'getallen', 'number', 'Getallen 0 – 15', { min: 0, max: 15, grammarRef: 'gr.getallen' }),
    numeral('16-30', 'getallen', 'number', 'Getallen 16 – 30', { min: 16, max: 30, grammarRef: 'gr.getallen' }),
    numeral('31-99', 'getallen', 'number', 'Getallen 31 – 99', { min: 31, max: 99, grammarRef: 'gr.getallen' }),
    numeral('100-999', 'getallen', 'number', 'Honderdtallen', { min: 100, max: 999, grammarRef: 'gr.getallen' }),
    numeral('1000-plus', 'getallen', 'number', 'Duizendtallen', { min: 1000, max: 99999, grammarRef: 'gr.getallen' }),
    numeral('jaartal', 'getallen', 'year', 'Jaartallen', { min: 1900, max: 2035, grammarRef: 'gr.getallen' }),
    numeral('uur-heel-half', 'tijd-en-uur', 'time', 'Het uur: heel en half', { minutes: [0, 30], grammarRef: 'gr.uur' }),
    numeral('uur-kwartier', 'tijd-en-uur', 'time', 'Het uur: kwart over en kwart voor', { minutes: [15, 45], grammarRef: 'gr.uur' }),
    numeral('uur-minuten', 'tijd-en-uur', 'time', 'Het uur: minuten', { minutes: [5, 10, 20, 25, 35, 40, 50, 55], grammarRef: 'gr.uur' }),
    numeral('datum', 'dagen-en-maanden', 'date', 'De datum', { grammarRef: 'gr.datum' }),
    numeral('prijs', 'winkelen', 'price', 'Prijzen', { min: 1, max: 99, grammarRef: 'gr.prijs' }),
  ],

  grammar: {
    'gr.getallen': {
      title: 'De getallen',
      body: 'Tot 30 schrijf je aan elkaar: dieciséis, veintiuno, veintidós. Vanaf 31 met y: treinta y uno, cuarenta y cinco.\n'
        + '• 100 is cien, 101 ciento uno; 500 quinientos, 700 setecientos, 900 novecientos.\n'
        + '• mil is 1000, dos mil 2000 — nooit "un mil".\n'
        + '• Vóór een zelfstandig naamwoord: un euro, veintiún años.\n'
        + '• Let op: sesenta (60) en setenta (70) lijken op elkaar; quinientos (500) en cincuenta (50) ook.',
    },
    'gr.uur': {
      title: 'Hoe laat is het?',
      body: '¿Qué hora es? — Es la una (1 uur), son las dos, son las tres …\n'
        + '• y cuarto = kwart over, y media = en een half uur, menos cuarto = kwart voor.\n'
        + '• Tot het halfuur tel je bij: son las siete y diez (7:10). Daarna tel je af van het volgende uur: son las ocho menos diez (7:50).\n'
        + '• Let op: y media is het halfuur ná het uur. Son las siete y media = half acht.',
    },
    'gr.datum': {
      title: 'De datum',
      body: 'el + dag + de + maand: el quince de marzo. De maand zonder hoofdletter.\n'
        + '• De eerste: el uno de mayo, of el primero de mayo.\n'
        + '• ¿Qué fecha es hoy? — Hoy es el doce de octubre.',
    },
    'gr.prijs': {
      title: 'Prijzen',
      body: '¿Cuánto cuesta? — Cuesta doce euros con cincuenta (12,50 €).\n'
        + '• un euro, veintiún euros, treinta y un euros: uno wordt un vóór euros.\n'
        + '• Aan de kassa hoor je vaak de kortste vorm: doce con cincuenta, of doce cincuenta.',
    },
  },
};
