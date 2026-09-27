/* Oefeningen uit het werkboek (cuaderno de ejercicios) van unidad 5, 6 en 7
 * van Sí, claro nuevo 1.2 (blz. 115–144), met de antwoorden uit de
 * Soluciones achteraan het boek (blz. 196–203).
 *
 * Open oefeningen, oefeningen met prenten of audio en oefeningen zonder
 * eenduidig antwoord zijn weggelaten. De leesteksten bij de De fiesta-vragen
 * zijn eigen, korte samenvattingen van de teksten uit het leerboek. */

const P = {
  115: 'spanish-md/IMG_20260918_202626663_AE.md',
  116: 'spanish-md/IMG_20260918_202631541_AE.md',
  117: 'spanish-md/IMG_20260918_202637110_AE.md',
  118: 'spanish-md/IMG_20260918_202642946_AE.md',
  119: 'spanish-md/IMG_20260918_202646103_AE.md',
  120: 'spanish-md/IMG_20260918_202650595_AE.md',
  121: 'spanish-md/IMG_20260918_202653472_AE.md',
  122: 'spanish-md/IMG_20260918_202657531_AE.md',
  123: 'spanish-md/IMG_20260918_202700589_AE.md',
  124: 'spanish-md/IMG_20260918_202704929_AE.md',
  125: 'spanish-md/IMG_20260918_202707873_AE.md',
  126: 'spanish-md/IMG_20260918_202711873_AE.md',
  127: 'spanish-md/IMG_20260918_202721567.md',
  128: 'spanish-md/IMG_20260918_202726119_AE.md',
  129: 'spanish-md/IMG_20260918_202732843.md',
  130: 'spanish-md/IMG_20260918_202741151_AE.md',
  131: 'spanish-md/IMG_20260918_202745147.md',
  132: 'spanish-md/IMG_20260918_202755916_AE.md',
  133: 'spanish-md/IMG_20260918_202800641.md',
  134: 'spanish-md/IMG_20260918_202808726_AE.md',
  135: 'spanish-md/IMG_20260918_202813612.md',
  136: 'spanish-md/IMG_20260918_202823118_AE.md',
  137: 'spanish-md/IMG_20260918_202829185.md',
  138: 'spanish-md/IMG_20260918_202838411_AE.md',
  139: 'spanish-md/IMG_20260918_202842955_AE.md',
  140: 'spanish-md/IMG_20260918_202849879_AE.md',
  141: 'spanish-md/IMG_20260918_202855765.md',
  142: 'spanish-md/IMG_20260918_202904084_AE.md',
  143: 'spanish-md/IMG_20260918_202909296_AE.md',
  144: 'spanish-md/IMG_20260918_202915044_AE.md',
};

/* Kleine bouwstenen: `base` bevat thema, bron en (optioneel) instructie en grammarRef. */
const s = (id, base, es, nl, blank) => ({ id, kind: 'sentence', ...base, es, nl, blanks: [blank] });
const q = (id, base, prompt, options, answer, nl, extra = {}) =>
  ({ id, kind: 'choice', ...base, ...extra, prompt, options, answer, ...(nl ? { nl } : {}) });
const r = (id, base, q, options, answer, nl) => ({ id, kind: 'reading', ...base, q, options, answer, ...(nl ? { nl } : {}) });

/* ------------------------------------------------------------------ */
/* UNIDAD 5 · El gusto de aprender                                     */
/* ------------------------------------------------------------------ */

const U5_1 = { theme: 'gr-woordkeuze', src: P[115], instruction: 'Vul het juiste woord in' };
const U5_2 = { theme: 'gr-woordkeuze', src: P[115], grammarRef: 'gr.gerundio' };
const U5_3 = { theme: 'gr-woordkeuze', src: P[115], grammarRef: 'gr.gerundio' };
const U5_5 = { theme: 'gr-woordkeuze', src: P[116] };
const U5_7 = { theme: 'eigenschappen', src: P[117] };
const U5_9 = { theme: 'gr-desde-hace', src: P[117], grammarRef: 'gr.desde-hace', instruction: 'Vul hace, desde of desde hace in' };
const U5_10 = { theme: 'gr-desde-hace', src: P[118], grammarRef: 'gr.desde-hace' };
const U5_12 = { theme: 'gr-zin-indefinido', src: P[118], grammarRef: 'gr.indefinido', instruction: 'Vul de indefinido in' };
const U5_12i = { ...U5_12, grammarRef: 'gr.indefinido-onregelmatig' };
const U5_14 = { theme: 'gr-perfecto-indefinido', src: P[119], grammarRef: 'gr.perfecto-indefinido' };
const U5_16 = { theme: 'gr-woordkeuze', src: P[120] };
const U5_18 = { theme: 'gr-woordkeuze', src: P[121] };
const U5_21 = { theme: 'gr-perfecto-indefinido', src: P[122], grammarRef: 'gr.perfecto-indefinido' };
const U5_22 = { theme: 'gr-zin-indefinido', src: P[122], grammarRef: 'gr.indefinido', instruction: 'Vul de indefinido in' };
const U5_22i = { ...U5_22, grammarRef: 'gr.indefinido-onregelmatig' };
const U5_23 = { theme: 'gr-woordkeuze', src: P[122] };
const U5_23dh = { theme: 'gr-desde-hace', src: P[122], grammarRef: 'gr.desde-hace' };
const U5_24 = { theme: 'gr-woordkeuze', src: P[122] };
const U5_25 = { theme: 'lezen-u5', src: P[123], text: 't.wb-u5.oferta' };
const U5_25b = { theme: 'gr-woordkeuze', src: P[123], instruction: 'Vul het juiste woord in (sollicitatiebrief)' };
const U5_26 = { theme: 'lezen-u5', src: P[123], text: 't.wb-u5.navidad' };

const PERIFRASIS = ['sigue', 'deja de', 'vuelve a', 'empieza a'];

const unit5 = [
  // 1 · El español en el mundo
  s('s.wb-u5.1-1', U5_1, 'El español ocupa un lugar muy importante como lengua de comunicación internacional.',
    'Het Spaans neemt een heel belangrijke plaats in als internationale communicatietaal.',
    { answer: 'comunicación', options: ['comunicación', 'patrimonio', 'lengua extranjera', 'chino'] }),
  s('s.wb-u5.1-2', U5_1, 'El español es la segunda lengua materna después del chino mandarín.',
    'Het Spaans is de tweede moedertaal ter wereld, na het Mandarijn-Chinees.',
    { answer: 'chino', options: ['chino', 'patrimonio', 'comunicación', 'mayor'] }),
  s('s.wb-u5.1-3', U5_1, 'El país con el mayor número de hispanohablantes es México.',
    'Het land met de meeste Spaanstaligen is Mexico.',
    { answer: 'hispanohablantes', options: ['hispanohablantes', 'comunicación', 'patrimonio', 'chino'] }),
  s('s.wb-u5.1-4', U5_1, 'En la actualidad, unos 22 millones de alumnos estudian español como lengua extranjera.',
    'Vandaag studeren zo’n 22 miljoen leerlingen Spaans als vreemde taal.',
    { answer: 'alumnos', options: ['alumnos', 'hispanohablantes', 'patrimonio', 'comunicación'] }),
  s('s.wb-u5.1-5', U5_1, 'En la actualidad, unos 22 millones de alumnos estudian español como lengua extranjera.',
    'Vandaag studeren zo’n 22 miljoen leerlingen Spaans als vreemde taal.',
    { answer: 'lengua extranjera', options: ['lengua extranjera', 'patrimonio', 'comunicación', 'chino'] }),
  s('s.wb-u5.1-6', U5_1, 'En el resto del mundo el número de estudiantes es cada día mayor.',
    'In de rest van de wereld wordt het aantal studenten elke dag groter.',
    { answer: 'mayor', options: ['mayor', 'chino', 'patrimonio', 'alumnos'] }),
  s('s.wb-u5.1-7', U5_1, 'El español es el medio para llegar al rico patrimonio cultural de España y Latinoamérica.',
    'Het Spaans is de sleutel tot het rijke culturele erfgoed van Spanje en Latijns-Amerika.',
    { answer: 'patrimonio', options: ['patrimonio', 'comunicación', 'alumnos', 'mayor'] }),

  // 2 · Samenvatten met empezar a, dejar de, seguir, volver a
  q('q.wb-u5.2-1', U5_2, 'Hemos ___ ir al cine.', ['dejado de', 'vuelto a', 'empezado a', 'seguido'], 'dejado de',
    'We gaan niet meer naar de bioscoop (dejar de = stoppen met).',
    { context: 'Siempre nos ha gustado ir al cine. Ahora tenemos Netflix y vemos las películas en casa.' }),
  q('q.wb-u5.2-2', U5_2, '___ cantando en un coro.', ['Sigo', 'Dejo de', 'Vuelvo a', 'Empiezo a'], 'Sigo',
    'Ik zing nog altijd in een koor (seguir + gerundio = blijven, nog steeds).',
    { context: 'Yo canto en un coro. Ahora tengo que viajar mucho por el trabajo, pero voy a todos los ensayos.' }),
  q('q.wb-u5.2-3', U5_2, 'El lunes Luis puede ___ tocar la guitarra.', ['volver a', 'dejar de', 'seguir', 'empezar a'], 'volver a',
    'Maandag kan Luis weer gitaar spelen (volver a = opnieuw).',
    { context: 'Luis toca la guitarra todos los días, pero ahora tiene amigos en casa. El lunes se van.' }),
  q('q.wb-u5.2-4', U5_2, 'He ___ comprar libros.', ['dejado de', 'vuelto a', 'empezado a', 'seguido'], 'dejado de',
    'Ik koop geen boeken meer.',
    { context: 'Me encanta leer, pero ahora ya no compro libros: voy a la biblioteca.' }),
  q('q.wb-u5.2-5', U5_2, 'Mi madre ha ___ estudiar francés.', ['dejado de', 'vuelto a', 'empezado a', 'seguido'], 'dejado de',
    'Mijn moeder is gestopt met Frans studeren.',
    { context: 'Mi madre ya no estudia francés. Dice que le aburre.' }),
  q('q.wb-u5.2-6', U5_2, 'Mi padre ___ hacer deporte.', ['empieza a', 'deja de', 'sigue', 'vuelve a'], 'empieza a',
    'Mijn vader begint te sporten.',
    { context: 'Mi padre nunca ha hecho deporte, pero ayer se inscribió en un gimnasio.' }),

  // 3 · De notities van de detective
  q('q.wb-u5.3-1', U5_3, 'A las ocho y media ___ desayunando.', PERIFRASIS, 'sigue',
    'Om half negen zit hij nog altijd te ontbijten.', { context: 'Notas del detective: 8.00 desayuna en el bar Lola. 8.30 desayuna todavía.' }),
  q('q.wb-u5.3-2', U5_3, 'A las nueve ___ desayunar y empieza a llamar por teléfono.', PERIFRASIS, 'deja de',
    'Om negen uur stopt hij met ontbijten en begint hij te telefoneren.', { context: 'Notas del detective: 8.30 desayuna todavía. 9.00 ya no desayuna y llama por teléfono.' }),
  q('q.wb-u5.3-3', U5_3, 'A las nueve deja de desayunar y ___ llamar por teléfono.', PERIFRASIS, 'empieza a',
    'Om negen uur stopt hij met ontbijten en begint hij te telefoneren.', { context: 'Notas del detective: 9.00 ya no desayuna y llama por teléfono.' }),
  q('q.wb-u5.3-4', U5_3, 'A las nueve y cuarto ___ llamar por teléfono.', PERIFRASIS, 'vuelve a',
    'Om kwart over negen belt hij opnieuw.', { context: 'Notas del detective: 9.00 llama por teléfono. 9.15 llama otra vez por teléfono.' }),
  q('q.wb-u5.3-5', U5_3, 'A las nueve y media ___ llamar por teléfono y pide una botella de vino.', PERIFRASIS, 'deja de',
    'Om half tien stopt hij met bellen en bestelt hij een fles wijn.', { context: 'Notas del detective: 9.15 llama por teléfono. 9.30 pide una botella de vino.' }),
  q('q.wb-u5.3-6', U5_3, 'A las diez menos veinte ___ tomar la primera copa.', PERIFRASIS, 'empieza a',
    'Om twintig voor tien begint hij aan het eerste glas.', { context: 'Notas del detective: 9.30 pide una botella de vino. 9.40 toma la primera copa.' }),

  // 5a · Kantoorspullen (kruiswoordraadsel)
  q('q.wb-u5.5-1', U5_5, 'Son de metal y sirven para cortar, por ejemplo, papel. ¿Qué son?',
    ['las tijeras', 'los clips', 'las gomas', 'las carpetas'], 'las tijeras', 'de schaar'),
  q('q.wb-u5.5-2', U5_5, 'Es de metal y sirve para poner juntas algunas hojas de papel. ¿Qué es?',
    ['el clip', 'el llavero', 'el lápiz', 'la goma'], 'el clip', 'de paperclip'),
  q('q.wb-u5.5-3', U5_5, 'Es un objeto que sirve para encontrar rápido las llaves de la casa. ¿Qué es?',
    ['el llavero', 'la carpeta', 'el clip', 'el portátil'], 'el llavero', 'de sleutelhanger'),
  q('q.wb-u5.5-4', U5_5, 'Es de madera y sirve para escribir. En clase siempre necesitas uno. ¿Qué es?',
    ['el lápiz', 'el bolígrafo', 'el clip', 'el llavero'], 'el lápiz', 'het potlood (een balpen is van metaal of plastic)'),
  q('q.wb-u5.5-5', U5_5, 'Es de cartón o de plástico y sirve para guardar papeles. ¿Qué es?',
    ['la carpeta', 'la goma', 'las tijeras', 'el lápiz'], 'la carpeta', 'de map'),
  q('q.wb-u5.5-6', U5_5, 'Si has escrito algo mal con lápiz, puedes corregirlo fácilmente con ella. ¿Qué es?',
    ['la goma', 'la carpeta', 'el clip', 'el llavero'], 'la goma', 'de gom'),
  q('q.wb-u5.5-7', U5_5, 'Es un ordenador pequeño que se puede transportar fácilmente. ¿Qué es?',
    ['el portátil', 'el escritorio', 'el llavero', 'la carpeta'], 'el portátil', 'de laptop'),
  q('q.wb-u5.5-8', U5_5, 'Puede ser de metal o de plástico y sirve para escribir. ¿Qué es?',
    ['el bolígrafo', 'el lápiz', 'la goma', 'la carpeta'], 'el bolígrafo', 'de balpen (een potlood is van hout)'),
  q('q.wb-u5.5-9', U5_5, 'Es una mesa que sirve para escribir y trabajar, y donde normalmente están todos estos objetos. ¿Qué es?',
    ['el escritorio', 'el armario', 'la estantería', 'la carpeta'], 'el escritorio', 'het bureau'),

  // 6 · Zelfstandige en bijvoeglijke naamwoorden
  {
    id: 'g.wb-u5.6-sustantivo', kind: 'grammar', theme: 'eigenschappen', src: P[117],
    rule: 'Geef het zelfstandig naamwoord dat bij het bijvoeglijk naamwoord hoort.',
    examples: [
      { es: 'organizado → la ___', answer: 'organización', nl: 'georganiseerd → de organisatie' },
      { es: 'trabajador → el ___', answer: 'trabajo', nl: 'hardwerkend → het werk' },
      { es: 'tradicional → la ___', answer: 'tradición', nl: 'traditioneel → de traditie' },
      { es: 'comunicativo → la ___', answer: 'comunicación', nl: 'communicatief → de communicatie' },
      { es: 'tranquilo → la ___', answer: 'tranquilidad', nl: 'rustig → de rust' },
    ],
  },
  {
    id: 'g.wb-u5.6-adjetivo', kind: 'grammar', theme: 'eigenschappen', src: P[117],
    rule: 'Geef het bijvoeglijk naamwoord (mannelijke vorm) dat bij het zelfstandig naamwoord hoort.',
    examples: [
      { es: 'el orden → ___', answer: 'ordenado', nl: 'de orde → ordelijk' },
      { es: 'la paciencia → ___', answer: 'paciente', nl: 'het geduld → geduldig' },
      { es: 'el sistema → ___', answer: 'sistemático', nl: 'het systeem → systematisch' },
      { es: 'la perfección → ___', answer: 'perfecto', nl: 'de perfectie → perfect' },
      { es: 'la creatividad → ___', answer: 'creativo', nl: 'de creativiteit → creatief' },
    ],
  },

  // 7 · Karakter
  q('q.wb-u5.7-1', U5_7, 'Pierde fácilmente la paciencia; lo que menos le gusta es esperar. Es…',
    ['impaciente', 'tranquilo', 'perfeccionista', 'creativo'], 'impaciente', 'Hij verliest snel zijn geduld: hij is ongeduldig.'),
  q('q.wb-u5.7-2', U5_7, 'Tiene mucha fantasía. Le encanta pintar y escribir. Es…',
    ['creativo', 'sistemático', 'desordenado', 'impaciente'], 'creativo', 'Hij heeft veel fantasie: hij is creatief.'),
  q('q.wb-u5.7-3', U5_7, 'Le gusta estar ocupada. Se aburre cuando no tiene nada que hacer. Es…',
    ['trabajadora', 'tranquila', 'alegre', 'desordenada'], 'trabajadora', 'Ze houdt ervan bezig te zijn: ze is hardwerkend.'),
  q('q.wb-u5.7-4', U5_7, 'Le cuesta mucho mantener el orden. Es…',
    ['desordenado', 'sistemático', 'perfeccionista', 'comunicativo'], 'desordenado', 'Orde houden valt hem zwaar: hij is slordig.'),
  q('q.wb-u5.7-5', U5_7, 'Está de buen humor, no le cuesta sonreír. Es…',
    ['alegre', 'impaciente', 'sistemático', 'trabajador'], 'alegre', 'Hij is goedgehumeurd: hij is vrolijk.'),
  q('q.wb-u5.7-6', U5_7, 'Le encanta hablar con la gente e intercambiar opiniones. Es…',
    ['comunicativo', 'tranquilo', 'desordenado', 'sistemático'], 'comunicativo', 'Hij praat graag met mensen: hij is communicatief.'),
  q('q.wb-u5.7-7', U5_7, 'No quiere cometer errores y siempre piensa que las cosas pueden hacerse mejor. Es…',
    ['perfeccionista', 'creativo', 'alegre', 'desordenado'], 'perfeccionista', 'Hij wil geen fouten maken: hij is perfectionistisch.'),

  // 9 · Het restaurant van Rafa en Carmen
  s('s.wb-u5.9-1', U5_9, 'Rafa es camarero en Sevilla y desde hace muchos años quiere abrir su propio restaurante.',
    'Rafa is ober in Sevilla en wil al vele jaren een eigen restaurant openen.',
    { answer: 'desde hace', options: ['desde hace', 'hace', 'desde'] }),
  s('s.wb-u5.9-2', U5_9, 'Hace un año conoció a Carmen, una excelente cocinera de Granada.',
    'Een jaar geleden leerde hij Carmen kennen, een uitstekende kokkin uit Granada.',
    { answer: 'Hace', options: ['Hace', 'Desde', 'Desde hace'] }),
  s('s.wb-u5.9-3', U5_9, 'Rafa le habló del proyecto y desde ese momento han trabajado juntos.',
    'Rafa vertelde haar over het project en sinds dat moment werken ze samen.',
    { answer: 'desde', options: ['desde', 'hace', 'desde hace'] }),
  s('s.wb-u5.9-4', U5_9, 'Hace seis meses encontraron un local bonito en Sevilla y el banco les dio un crédito.',
    'Zes maanden geleden vonden ze een mooi pand in Sevilla en kregen ze een lening van de bank.',
    { answer: 'Hace', options: ['Hace', 'Desde', 'Desde hace'] }),
  s('s.wb-u5.9-5', U5_9, 'Carmen dejó su trabajo en Granada y vive en Sevilla desde hace cuatro semanas.',
    'Carmen zei haar job in Granada op en woont sinds vier weken in Sevilla.',
    { answer: 'desde hace', options: ['desde hace', 'hace', 'desde'] }),
  s('s.wb-u5.9-6', U5_9, 'Hace una semana abrieron su restaurante «Casa Carmen».',
    'Een week geleden openden ze hun restaurant ‘Casa Carmen’.',
    { answer: 'Hace', options: ['Hace', 'Desde', 'Desde hace'] }),

  // 10 · Zijn ze (nu) in Buenos Aires?
  q('q.wb-u5.10-1', U5_10, 'Estuvieron en Buenos Aires hace dos semanas. ¿Están ahora en Buenos Aires?', ['sí', 'no'], 'no',
    'Nee: twee weken geleden waren ze er, dat is voorbij.'),
  q('q.wb-u5.10-2', U5_10, 'Estuvieron dos semanas en Buenos Aires. ¿Están ahora en Buenos Aires?', ['sí', 'no'], 'no',
    'Nee: ze waren er twee weken lang, een afgesloten periode.'),
  q('q.wb-u5.10-3', U5_10, 'Desde la semana pasada están en Buenos Aires. ¿Están ahora en Buenos Aires?', ['sí', 'no'], 'sí',
    'Ja: ze zijn er sinds vorige week, en nog steeds.'),
  q('q.wb-u5.10-4', U5_10, 'De junio a septiembre estuvieron en Buenos Aires. ¿Están ahora en Buenos Aires?', ['sí', 'no'], 'no',
    'Nee: van juni tot september, een afgesloten periode.'),
  q('q.wb-u5.10-5', U5_10, 'Desde hace tres días están en Buenos Aires. ¿Están ahora en Buenos Aires?', ['sí', 'no'], 'sí',
    'Ja: ze zijn er al drie dagen, en nog steeds.'),
  q('q.wb-u5.10-6', U5_10, 'Hoy han llegado a Buenos Aires. ¿Están ahora en Buenos Aires?', ['sí', 'no'], 'sí',
    'Ja: ze zijn vandaag aangekomen.'),
  q('q.wb-u5.10-7', U5_10, 'Llegaron a Buenos Aires hace un mes. ¿Están ahora en Buenos Aires?', ['sí', 'no'], 'sí',
    'Ja: ze kwamen een maand geleden aan en zijn er nog.'),

  // 11 · Presente en indefinido
  {
    id: 'g.wb-u5.11-indefinido', kind: 'grammar', theme: 'verleden-tijden', src: P[118], grammarRef: 'gr.indefinido',
    rule: 'Geef de indefinido-vorm voor dezelfde persoon.',
    examples: [
      { es: 'yo empiezo → yo ___', answer: 'empecé', nl: 'ik begin → ik begon' },
      { es: 'él practica → él ___', answer: 'practicó', nl: 'hij oefent → hij oefende' },
      { es: 'vosotros trabajáis → vosotros ___', answer: 'trabajasteis', nl: 'jullie werken → jullie werkten' },
      { es: 'tú escribes → tú ___', answer: 'escribiste', nl: 'jij schrijft → jij schreef' },
      { es: 'nosotros bebemos → nosotros ___', answer: 'bebimos', nl: 'wij drinken → wij dronken' },
      { es: 'ellos viven → ellos ___', answer: 'vivieron', nl: 'zij wonen → zij woonden' },
    ],
  },
  {
    id: 'g.wb-u5.11-presente', kind: 'grammar', theme: 'verleden-tijden', src: P[118], grammarRef: 'gr.presente',
    rule: 'Geef de presente-vorm voor dezelfde persoon.',
    examples: [
      { es: 'ellos compraron → ellos ___', answer: 'compran', nl: 'zij kochten → zij kopen' },
      { es: 'yo aprendí → yo ___', answer: 'aprendo', nl: 'ik leerde → ik leer' },
      { es: 'él comió → él ___', answer: 'come', nl: 'hij at → hij eet' },
      { es: 'vosotros conocisteis → vosotros ___', answer: 'conocéis', nl: 'jullie leerden kennen → jullie kennen' },
      { es: 'nosotros nos duchamos (indefinido) → nosotros ___', answer: 'nos duchamos', nl: 'wij douchten → wij douchen (zelfde vorm)' },
    ],
  },

  // 12 · Wat hebben deze mensen geleerd?
  s('s.wb-u5.12-1', U5_12i, 'Cuando murió mi marido no quise mudarme al centro.',
    'Toen mijn man stierf, wilde ik niet naar het centrum verhuizen.', { answer: 'quise', hint: 'querer' }),
  s('s.wb-u5.12-2', U5_12, 'Decidí ir a una autoescuela y enseguida tomé unas clases.',
    'Ik besloot naar een rijschool te gaan en nam meteen een paar lessen.', { answer: 'Decidí', hint: 'decidir' }),
  s('s.wb-u5.12-3', U5_12, 'Decidí ir a una autoescuela y enseguida tomé unas clases.',
    'Ik besloot naar een rijschool te gaan en nam meteen een paar lessen.', { answer: 'tomé', hint: 'tomar' }),
  s('s.wb-u5.12-4', U5_12, 'Al principio me pareció un poco difícil, pero superé el miedo.',
    'In het begin vond ik het wat moeilijk, maar ik overwon mijn angst.', { answer: 'pareció', hint: 'parecer' }),
  s('s.wb-u5.12-5', U5_12, 'Al principio me pareció un poco difícil, pero superé el miedo.',
    'In het begin vond ik het wat moeilijk, maar ik overwon mijn angst.', { answer: 'superé', hint: 'superar' }),
  s('s.wb-u5.12-6', U5_12, 'El año pasado me compré un coche pequeño.',
    'Vorig jaar kocht ik een kleine auto.', { answer: 'compré', hint: 'comprar' }),
  s('s.wb-u5.12-7', U5_12i, 'En 2015 estuve por primera vez en Italia y después decidí aprender el idioma.',
    'In 2015 was ik voor het eerst in Italië en daarna besloot ik de taal te leren.', { answer: 'estuve', hint: 'estar' }),
  s('s.wb-u5.12-8', U5_12, 'En 2015 estuve por primera vez en Italia y después decidí aprender el idioma.',
    'In 2015 was ik voor het eerst in Italië en daarna besloot ik de taal te leren.', { answer: 'decidí', hint: 'decidir' }),
  s('s.wb-u5.12-9', U5_12, 'Encontré una escuela de idiomas en mi barrio y fui enseguida para informarme.',
    'Ik vond een taalschool in mijn buurt en ging er meteen heen om informatie te vragen.', { answer: 'Encontré', hint: 'encontrar' }),
  s('s.wb-u5.12-10', U5_12i, 'Encontré una escuela de idiomas en mi barrio y fui enseguida para informarme.',
    'Ik vond een taalschool in mijn buurt en ging er meteen heen om informatie te vragen.', { answer: 'fui', hint: 'ir' }),
  s('s.wb-u5.12-11', U5_12, 'Me inscribí en un curso básico y después hice otros dos cursos.',
    'Ik schreef me in voor een basiscursus en volgde daarna nog twee cursussen.', { answer: 'Me inscribí', hint: 'inscribirse' }),
  s('s.wb-u5.12-12', U5_12i, 'Me inscribí en un curso básico y después hice otros dos cursos.',
    'Ik schreef me in voor een basiscursus en volgde daarna nog twee cursussen.', { answer: 'hice', hint: 'hacer' }),
  s('s.wb-u5.12-13', U5_12, 'Mi amigo abrió una escuela muy cerca de mi casa y me invitó a una clase de chachachá.',
    'Mijn vriend opende een school vlak bij mijn huis en nodigde me uit voor een les chachacha.', { answer: 'abrió', hint: 'abrir' }),
  s('s.wb-u5.12-14', U5_12, 'Mi amigo abrió una escuela muy cerca de mi casa y me invitó a una clase de chachachá.',
    'Mijn vriend opende een school vlak bij mijn huis en nodigde me uit voor een les chachacha.', { answer: 'invitó', hint: 'invitar' }),
  s('s.wb-u5.12-15', U5_12i, 'Fui a probar y fue un desastre: no pude aprender ni un poco de chachachá.',
    'Ik ging het proberen en het was een ramp: ik kon helemaal niets van de chachacha leren.', { answer: 'Fui', hint: 'ir' }),
  s('s.wb-u5.12-16', U5_12i, 'Fui a probar y fue un desastre: no pude aprender ni un poco de chachachá.',
    'Ik ging het proberen en het was een ramp: ik kon helemaal niets van de chachacha leren.', { answer: 'fue', hint: 'ser' }),
  s('s.wb-u5.12-17', U5_12i, 'Fui a probar y fue un desastre: no pude aprender ni un poco de chachachá.',
    'Ik ging het proberen en het was een ramp: ik kon helemaal niets van de chachacha leren.', { answer: 'pude', hint: 'poder' }),
  s('s.wb-u5.12-18', U5_12, 'Pero poco a poco los pies empezaron a seguir el ritmo de la música.',
    'Maar beetje bij beetje begonnen mijn voeten het ritme van de muziek te volgen.', { answer: 'empezaron', hint: 'empezar' }),

  // 14 · Perfecto of indefinido?
  q('q.wb-u5.14-1', U5_14, '¿Sabes con quién ___ esta mañana? Con Pepa, mi amiga del instituto.',
    ['me he encontrado', 'me encontré'], 'me he encontrado', 'Weet je wie ik vanochtend tegenkwam? (esta mañana → perfecto)'),
  q('q.wb-u5.14-2', U5_14, 'En febrero Pepa ___ de trabajo.', ['ha cambiado', 'cambió'], 'cambió',
    'In februari veranderde Pepa van job. (en febrero → indefinido)'),
  q('q.wb-u5.14-3', U5_14, 'Hace dos semanas Pepa ___ de piso.', ['se ha mudado', 'se mudó'], 'se mudó',
    'Twee weken geleden verhuisde Pepa. (hace dos semanas → indefinido)'),
  q('q.wb-u5.14-4', U5_14, 'El mes pasado Pepa ___ un anuncio en el periódico.', ['ha puesto', 'puso'], 'puso',
    'Vorige maand zette Pepa een advertentie in de krant. (el mes pasado → indefinido)'),
  q('q.wb-u5.14-5', U5_14, 'Dos días después la ___ de una agencia.', ['han llamado', 'llamaron'], 'llamaron',
    'Twee dagen later belden ze haar van een agentschap. (afgesloten verleden → indefinido)',
    { context: 'El mes pasado Pepa puso un anuncio en el periódico.' }),
  q('q.wb-u5.14-6', U5_14, 'Dos días después la llamaron de una agencia y le ___ un piso precioso.', ['han ofrecido', 'ofrecieron'], 'ofrecieron',
    'Twee dagen later belden ze haar en boden ze haar een prachtig appartement aan.',
    { context: 'El mes pasado Pepa puso un anuncio en el periódico.' }),
  q('q.wb-u5.14-7', U5_14, 'Pepa quiere celebrarlo y ___ una fiesta para el próximo sábado.', ['ha organizado', 'organizó'], 'ha organizado',
    'Pepa wil het vieren en heeft een feest georganiseerd voor volgende zaterdag. (verband met nu → perfecto)',
    { context: '¡Pepa ha tenido mucha suerte!' }),

  // 16 · Lo que, lo más, me parece, me cuesta
  q('q.wb-u5.16-1', U5_16, '___ interesante es ver vídeos en clase.', ['A mí', 'Lo más', 'Que más'], 'Lo más',
    'Het interessantste is video’s kijken in de les.'),
  q('q.wb-u5.16-2', U5_16, '___ me gusta es trabajar en grupo.', ['Lo más', 'Que', 'Lo que más'], 'Lo que más',
    'Wat ik het leukst vind, is in groep werken.'),
  q('q.wb-u5.16-3', U5_16, '___ divertido hablar con un compañero.', ['También es mucho', 'También es muy', 'Tampoco es mucho'], 'También es muy',
    'Met een medestudent praten is ook heel leuk. (muy + bijvoeglijk naamwoord)', { grammarRef: 'gr.muy-mucho' }),
  q('q.wb-u5.16-4', U5_16, '___ difícil entender las audiciones.', ['Es muy', 'Lo', 'Lo que'], 'Es muy',
    'Het is heel moeilijk om de luisterfragmenten te begrijpen.'),
  q('q.wb-u5.16-5', U5_16, '___ me encanta es leer textos.', ['A mí no', 'Que', 'Lo que'], 'Lo que',
    'Wat ik geweldig vind, is teksten lezen.'),
  q('q.wb-u5.16-6', U5_16, '___ aburrido practicar la pronunciación.', ['Me parece', 'Me cuesta', 'No me gusta'], 'Me parece',
    'Ik vind het saai om de uitspraak te oefenen.'),
  q('q.wb-u5.16-7', U5_16, '___ me gusta es el trabajo individual.', ['Que a mí', 'Lo', 'Lo que'], 'Lo que',
    'Wat ik leuk vind, is individueel werken.'),
  q('q.wb-u5.16-8', U5_16, 'Lo que más ___ es la gramática.', ['difícil', 'me cuesta', 'importante'], 'me cuesta',
    'Wat ik het moeilijkst vind, is de grammatica.'),

  // 17 · Onregelmatige indefinido (woordzoeker)
  {
    id: 'g.wb-u5.17-indefinido', kind: 'grammar', theme: 'verleden-tijden', src: P[120], grammarRef: 'gr.indefinido-onregelmatig',
    rule: 'Geef de indefinido-vorm van het werkwoord voor de gegeven persoon.',
    examples: [
      { es: 'conducir (yo) → ___', answer: 'conduje', nl: 'ik reed' },
      { es: 'dar (usted) → ___', answer: 'dio', nl: 'u gaf' },
      { es: 'decir (nosotros) → ___', answer: 'dijimos', nl: 'wij zeiden' },
      { es: 'estar (ustedes) → ___', answer: 'estuvieron', nl: 'u (mv.) was / waren' },
      { es: 'hacer (él) → ___', answer: 'hizo', nl: 'hij deed / maakte' },
      { es: 'ir / ser (nosotros) → ___', answer: 'fuimos', nl: 'wij gingen / wij waren' },
      { es: 'pedir (ella) → ___', answer: 'pidió', nl: 'zij vroeg / bestelde' },
      { es: 'poder (tú) → ___', answer: 'pudiste', nl: 'jij kon' },
      { es: 'poner (nosotros) → ___', answer: 'pusimos', nl: 'wij zetten / legden' },
      { es: 'querer (vosotros) → ___', answer: 'quisisteis', nl: 'jullie wilden' },
      { es: 'tener (yo) → ___', answer: 'tuve', nl: 'ik had' },
      { es: 'traer (ustedes) → ___', answer: 'trajeron', nl: 'u (mv.) bracht(en)' },
      { es: 'venir (ella) → ___', answer: 'vino', nl: 'zij kwam' },
      { es: 'ver (ellas) → ___', answer: 'vieron', nl: 'zij zagen' },
    ],
  },

  // 18 · Luis, een slechte student
  ...[
    ['1', 'En los últimos meses Luis ha dejado de hacer los deberes.', 'Él ahora nunca hace los deberes, pasa más tiempo con sus amigos.', 'De laatste maanden maakt Luis zijn huiswerk niet meer.'],
    ['2', 'Luis ha vuelto a tener muy malas notas en los exámenes.', 'Los resultados de sus exámenes han sido otra vez muy malos.', 'Luis heeft weer heel slechte examencijfers.'],
    ['3', 'Luis siempre empieza a estudiar la noche antes del examen.', 'Luis se prepara muy poco para los exámenes.', 'Luis begint altijd pas de avond voor het examen te studeren.'],
    ['4', 'El profesor de Luis acaba de hablar con sus padres.', 'Hace unos días el profesor de Luis se reunió con sus padres.', 'De leraar van Luis heeft net met zijn ouders gesproken.'],
    ['5', 'Luis sigue pensando que lo más importante es hacer lo que le gusta y ser feliz.', 'Luis no cambia de opinión y disfruta de la vida.', 'Luis blijft denken dat het belangrijkste is doen wat hij graag doet en gelukkig zijn.'],
  ].map(([n, prompt, answer, nl], _, all) => q(`q.wb-u5.18-${n}`, U5_18, `«${prompt}» ¿Qué frase significa lo mismo?`,
    all.map(x => x[2]), answer, nl)),

  // 19a · Tegenstellingen
  {
    id: 'g.wb-u5.19-contrarios', kind: 'grammar', theme: 'eigenschappen', src: P[121],
    rule: 'Kies het tegenovergestelde.',
    examples: [
      { es: 'alegre ↔ ___', answer: 'triste', options: ['triste', 'tranquilo', 'reservado'], nl: 'vrolijk ↔ droevig' },
      { es: 'alto ↔ ___', answer: 'bajo', options: ['bajo', 'caro', 'oscuro'], nl: 'groot ↔ klein (van gestalte)' },
      { es: 'antiguo ↔ ___', answer: 'moderno', options: ['moderno', 'caliente', 'fácil'], nl: 'oud ↔ modern' },
      { es: 'barato ↔ ___', answer: 'caro', options: ['caro', 'feo', 'malo'], nl: 'goedkoop ↔ duur' },
      { es: 'bonito ↔ ___', answer: 'feo', options: ['feo', 'caro', 'bajo'], nl: 'mooi ↔ lelijk' },
      { es: 'bueno ↔ ___', answer: 'malo', options: ['malo', 'frío', 'mayor'], nl: 'goed ↔ slecht' },
      { es: 'caliente ↔ ___', answer: 'frío', options: ['frío', 'oscuro', 'tranquilo'], nl: 'warm ↔ koud' },
      { es: 'claro ↔ ___', answer: 'oscuro', options: ['oscuro', 'difícil', 'ruidoso'], nl: 'licht ↔ donker' },
      { es: 'comunicativo ↔ ___', answer: 'reservado', options: ['reservado', 'desordenado', 'impaciente'], nl: 'communicatief ↔ gesloten' },
      { es: 'desordenado ↔ ___', answer: 'ordenado', options: ['ordenado', 'paciente', 'comunicativo'], nl: 'slordig ↔ ordelijk' },
      { es: 'difícil ↔ ___', answer: 'fácil', options: ['fácil', 'barato', 'claro'], nl: 'moeilijk ↔ gemakkelijk' },
      { es: 'impaciente ↔ ___', answer: 'paciente', options: ['paciente', 'alegre', 'ordenado'], nl: 'ongeduldig ↔ geduldig' },
      { es: 'joven ↔ ___', answer: 'mayor', options: ['mayor', 'alto', 'moderno'], nl: 'jong ↔ ouder' },
      { es: 'ruidoso ↔ ___', answer: 'tranquilo', options: ['tranquilo', 'alegre', 'claro'], nl: 'lawaaierig ↔ rustig' },
    ],
  },

  // 21 · Perfecto of indefinido?
  q('q.wb-u5.21-1', U5_21, 'El verano pasado ___ a dos chicas andaluzas en un hotel en Menorca.', ['he conocido', 'conocí'], 'conocí',
    'Vorige zomer leerde ik twee Andalusische meisjes kennen. (el verano pasado → indefinido)'),
  q('q.wb-u5.21-2', U5_21, 'Pues hoy las ___ en el centro comercial La Vaguada.', ['he visto', 'vi'], 'he visto',
    'Vandaag heb ik ze gezien in het winkelcentrum. (hoy → perfecto)',
    { context: 'El verano pasado conocí a dos chicas andaluzas en Menorca.' }),
  q('q.wb-u5.21-3', U5_21, 'Dicen que hace dos meses ___ a Madrid.', ['se han mudado', 'se mudaron'], 'se mudaron',
    'Ze zeggen dat ze twee maanden geleden naar Madrid verhuisd zijn. (hace dos meses → indefinido)'),
  q('q.wb-u5.21-4', U5_21, 'La primera semana ___ en una pensión.', ['se han quedado', 'se quedaron'], 'se quedaron',
    'De eerste week logeerden ze in een pension. (afgesloten verleden → indefinido)',
    { context: 'Hace dos meses se mudaron a Madrid.' }),
  q('q.wb-u5.21-5', U5_21, 'Después ___ un piso muy bonito en el barrio de Lavapiés.', ['han encontrado', 'encontraron'], 'encontraron',
    'Daarna vonden ze een heel mooi appartement in de wijk Lavapiés.',
    { context: 'Hace dos meses se mudaron a Madrid. La primera semana se quedaron en una pensión.' }),

  // 22 · Het verslag van een detective
  s('s.wb-u5.22-1', U5_22, 'El sábado a las 8 de la mañana su mujer salió de casa y tomó un taxi para ir al aeropuerto.',
    'Zaterdag om 8 uur ’s ochtends vertrok uw vrouw van huis en nam ze een taxi naar de luchthaven.', { answer: 'salió', hint: 'salir' }),
  s('s.wb-u5.22-2', U5_22, 'El sábado a las 8 de la mañana su mujer salió de casa y tomó un taxi para ir al aeropuerto.',
    'Zaterdag om 8 uur ’s ochtends vertrok uw vrouw van huis en nam ze een taxi naar de luchthaven.', { answer: 'tomó', hint: 'tomar' }),
  s('s.wb-u5.22-3', U5_22, 'En el aeropuerto se encontró con su amiga, la señora Martínez.',
    'Op de luchthaven ontmoette ze haar vriendin, mevrouw Martínez.', { answer: 'se encontró', hint: 'encontrarse' }),
  s('s.wb-u5.22-4', U5_22, 'Juntas volaron a Barcelona.',
    'Samen vlogen ze naar Barcelona.', { answer: 'volaron', hint: 'volar' }),
  s('s.wb-u5.22-5', U5_22i, 'Allí, lo primero que hicieron las dos señoras fue ponerse unos zapatos deportivos.',
    'Het eerste wat de twee dames daar deden, was sportschoenen aantrekken.', { answer: 'hicieron', hint: 'hacer' }),
  s('s.wb-u5.22-6', U5_22i, 'Allí, lo primero que hicieron las dos señoras fue ponerse unos zapatos deportivos.',
    'Het eerste wat de twee dames daar deden, was sportschoenen aantrekken.', { answer: 'fue', hint: 'ser' }),
  s('s.wb-u5.22-7', U5_22i, 'Luego las dos señoras fueron en taxi al Museo Picasso.',
    'Daarna gingen de twee dames met de taxi naar het Picassomuseum.', { answer: 'fueron', hint: 'ir' }),
  s('s.wb-u5.22-8', U5_22, 'En el Museo Picasso se quedaron cuatro horas.',
    'In het Picassomuseum bleven ze vier uur.', { answer: 'se quedaron', hint: 'quedarse' }),
  s('s.wb-u5.22-9', U5_22, 'Después de salir del museo, comieron un bocadillo, bebieron una cerveza y tomaron otro taxi.',
    'Na het museum aten ze een broodje, dronken ze een biertje en namen ze een andere taxi.', { answer: 'comieron', hint: 'comer' }),
  s('s.wb-u5.22-10', U5_22, 'Después de salir del museo, comieron un bocadillo, bebieron una cerveza y tomaron otro taxi.',
    'Na het museum aten ze een broodje, dronken ze een biertje en namen ze een andere taxi.', { answer: 'bebieron', hint: 'beber' }),
  s('s.wb-u5.22-11', U5_22, 'Después de salir del museo, comieron un bocadillo, bebieron una cerveza y tomaron otro taxi.',
    'Na het museum aten ze een broodje, dronken ze een biertje en namen ze een andere taxi.', { answer: 'tomaron', hint: 'tomar' }),
  s('s.wb-u5.22-12', U5_22i, 'En el taxi fueron a la Fundació Antoni Tàpies, donde estuvieron otras tres horas.',
    'Met de taxi gingen ze naar de Fundació Antoni Tàpies, waar ze nog eens drie uur bleven.', { answer: 'fueron', hint: 'ir' }),
  s('s.wb-u5.22-13', U5_22i, 'En el taxi fueron a la Fundació Antoni Tàpies, donde estuvieron otras tres horas.',
    'Met de taxi gingen ze naar de Fundació Antoni Tàpies, waar ze nog eens drie uur bleven.', { answer: 'estuvieron', hint: 'estar' }),
  s('s.wb-u5.22-14', U5_22i, 'Al final fueron a la Fundación Miró, donde las dos pasaron el resto de la tarde.',
    'Tot slot gingen ze naar de Fundación Miró, waar ze de rest van de middag doorbrachten.', { answer: 'fueron', hint: 'ir' }),
  s('s.wb-u5.22-15', U5_22, 'Al final fueron a la Fundación Miró, donde las dos pasaron el resto de la tarde.',
    'Tot slot gingen ze naar de Fundación Miró, waar ze de rest van de middag doorbrachten.', { answer: 'pasaron', hint: 'pasar' }),

  // 23 · Het juiste woord
  q('q.wb-u5.23-1', U5_23, 'Empecé ___ estudiar español en 2016.', ['a', 'de', 'en'], 'a',
    'Ik begon in 2016 Spaans te studeren. (empezar a + infinitief)'),
  q('q.wb-u5.23-2', U5_23, 'Lo que me gusta es ver ___ vídeo.', ['el', 'al', 'lo'], 'el',
    'Wat ik leuk vind, is de video bekijken.'),
  q('q.wb-u5.23-3', U5_23dh, '___ un año conocí a mi novia.', ['Hace', 'Desde hace', 'Desde'], 'Hace',
    'Een jaar geleden leerde ik mijn vriendin kennen. (hace + tijdsduur bij een afgesloten handeling)'),
  q('q.wb-u5.23-4', U5_23, 'No entiendo ___ dices.', ['lo que', 'que', 'el que'], 'lo que',
    'Ik begrijp niet wat je zegt.'),
  q('q.wb-u5.23-5', U5_23, 'Lo que más nos gusta es trabajar ___ parejas.', ['en', 'a', 'con'], 'en',
    'Wat we het liefst doen, is in paren werken.'),
  q('q.wb-u5.23-6', U5_23, 'El lápiz es una cosa que sirve ___ escribir.', ['para', 'a', 'de'], 'para',
    'Een potlood is iets om mee te schrijven. (servir para)'),
  q('q.wb-u5.23-7', U5_23, 'Leer textos es ___ difícil.', ['muy', 'mucho', 'muchos'], 'muy',
    'Teksten lezen is heel moeilijk. (muy + bijvoeglijk naamwoord)', { grammarRef: 'gr.muy-mucho' }),
  q('q.wb-u5.23-8', U5_23dh, 'Ana y Juan bailan salsa ___ un año.', ['desde hace', 'hace', 'desde'], 'desde hace',
    'Ana en Juan dansen al een jaar salsa. (desde hace + tijdsduur, handeling duurt nog)'),

  // 24 · Ervaringen met het Spaans
  q('q.wb-u5.24-1', U5_24, '¿Cuándo empezaste a estudiar español?',
    ['Hace un año.', 'Porque mi novio es colombiano.', 'Sí, con la familia de mi novio.', 'Hablo también inglés y un poco de francés.'],
    'Hace un año.', 'Wanneer ben je met Spaans begonnen? — Een jaar geleden.'),
  q('q.wb-u5.24-2', U5_24, '¿Por qué aprendes español?',
    ['Porque mi novio es colombiano.', 'Hace un año.', 'Sí, con la familia de mi novio.', 'No, ella deja de dar clase el año que viene.'],
    'Porque mi novio es colombiano.', 'Waarom leer je Spaans? — Omdat mijn vriend Colombiaan is.'),
  q('q.wb-u5.24-3', U5_24, '¿Hablas español fuera de clase?',
    ['Sí, con la familia de mi novio.', 'Hace un año.', 'Porque mi novio es colombiano.', 'Hablo también inglés y un poco de francés.'],
    'Sí, con la familia de mi novio.', 'Spreek je Spaans buiten de les? — Ja, met de familie van mijn vriend.'),
  q('q.wb-u5.24-4', U5_24, '¿Qué otros idiomas hablas?',
    ['Hablo también inglés y un poco de francés.', 'Hace un año.', 'Porque mi novio es colombiano.', 'Sí, con la familia de mi novio.'],
    'Hablo también inglés y un poco de francés.', 'Welke andere talen spreek je? — Ook Engels en een beetje Frans.'),
  q('q.wb-u5.24-5', U5_24, '¿Vuelves a inscribirte en el próximo curso?',
    ['Claro que sí. Me gusta mucho el idioma.', 'Hace un año.', 'Hablo también inglés y un poco de francés.', 'Porque mi novio es colombiano.'],
    'Claro que sí. Me gusta mucho el idioma.', 'Schrijf je je opnieuw in voor de volgende cursus? — Natuurlijk, ik vind de taal heel mooi.'),
  q('q.wb-u5.24-6', U5_24, '¿Sigues teniendo la misma profesora en el próximo curso?',
    ['No, ella deja de dar clase el año que viene.', 'Hace un año.', 'Porque mi novio es colombiano.', 'Sí, con la familia de mi novio.'],
    'No, ella deja de dar clase el año que viene.', 'Heb je volgend jaar nog dezelfde lerares? — Nee, ze stopt volgend jaar met lesgeven.'),

  // 25a · Vacature (lezen)
  r('r.wb-u5.oferta.1', U5_25, '«El profesor o la profesora de francés tiene que saber español.» ¿Verdadero o falso?',
    ['verdadero', 'falso'], 'falso', 'Fout: de school zoekt een leraar Engels, niet Frans.'),
  r('r.wb-u5.oferta.2', U5_25, '«Piden cinco años de experiencia.» ¿Verdadero o falso?',
    ['verdadero', 'falso'], 'falso', 'Fout: ze vragen minstens één jaar ervaring; het contract is voor vijf jaar.'),
  r('r.wb-u5.oferta.3', U5_25, '«La escuela paga poco, pero tiene buen ambiente de trabajo.» ¿Verdadero o falso?',
    ['verdadero', 'falso'], 'falso', 'Fout: de school biedt een goed loon én een goede werksfeer.'),
  r('r.wb-u5.oferta.4', U5_25, '«El profesor o la profesora va a trabajar en Málaga.» ¿Verdadero o falso?',
    ['verdadero', 'falso'], 'verdadero', 'Juist: het is voor de nieuwe academie in Málaga.'),

  // 25b · Sollicitatiebrief
  s('s.wb-u5.25b-1', U5_25b, 'En el periódico SUR del 24 de octubre, ustedes ofrecen trabajo para una profesora de inglés en su escuela de Málaga.',
    'In de krant SUR van 24 oktober bieden jullie werk aan voor een lerares Engels in jullie school in Málaga.',
    { answer: 'ofrecen', options: ['ofrecen', 'envían', 'enseñan'] }),
  s('s.wb-u5.25b-2', U5_25b, 'En el periódico SUR del 24 de octubre, ustedes ofrecen trabajo para una profesora de inglés en su escuela de Málaga.',
    'In de krant SUR van 24 oktober bieden jullie werk aan voor een lerares Engels in jullie school in Málaga.',
    { answer: 'escuela', options: ['escuela', 'tienda', 'biblioteca'] }),
  s('s.wb-u5.25b-3', U5_25b, 'He trabajado durante cinco años como profesora de inglés para extranjeros.',
    'Ik heb vijf jaar gewerkt als lerares Engels voor buitenlanders.',
    { answer: 'profesora', options: ['profesora', 'alumna', 'cocinera'] }),
  s('s.wb-u5.25b-4', U5_25b, 'Ahora vivo en Málaga y busco trabajo.',
    'Nu woon ik in Málaga en zoek ik werk.',
    { answer: 'busco', options: ['busco', 'ofrezco', 'dejo'] }),
  s('s.wb-u5.25b-5', U5_25b, 'Soy responsable y me gusta mucho enseñar idiomas.',
    'Ik ben verantwoordelijk en geef heel graag taalles.',
    { answer: 'enseñar', options: ['enseñar', 'vender', 'olvidar'] }),
  s('s.wb-u5.25b-6', U5_25b, 'Les envío mi currículum y espero poder hablar pronto con ustedes.',
    'Ik stuur jullie mijn cv en hoop snel met jullie te kunnen praten.',
    { answer: 'currículum', options: ['currículum', 'factura', 'pedido'] }),

  // 26 · Kerstmis in Mexico en Spanje (lezen)
  ...[
    ['1', 'Es una mezcla de tradición cristiana y prehispánica.', 'las Posadas', 'De posadas vallen samen met een oud Azteeks feest voor de zon dat later christelijk werd.'],
    ['2', 'Los camellos vuelven a la ciudad.', 'los Reyes Magos', 'In de optocht van de Drie Koningen lopen echte kamelen mee.'],
    ['3', 'Los niños escriben cartas para pedir regalos.', 'los Reyes Magos', 'Kinderen geven brieven aan de Drie Koningen met hun wensen.'],
    ['4', 'Invitar a comer a amigos o vecinos es una expresión de la hospitalidad.', 'las Posadas', 'Bij de posadas nodigen de gastheren de zangers uit om te eten.'],
    ['5', 'Se celebran del 16 al 24 de diciembre con cantos y deliciosas comidas.', 'las Posadas', 'De posadas vallen van 16 tot 24 december.'],
    ['6', 'La noche del 5 al 6 de enero es la gran ilusión de los niños.', 'los Reyes Magos', 'In de nacht van 5 op 6 januari brengen de Drie Koningen de cadeaus.'],
  ].map(([n, frase, answer, nl]) => r(`r.wb-u5.navidad.${n}`, U5_26, `¿Las Posadas o los Reyes Magos? «${frase}»`,
    ['las Posadas', 'los Reyes Magos'], answer, nl)),

  // Ya sé · Autoevaluación
  q('q.wb-u5.ya-se-1', { theme: 'eigenschappen', src: P[124] }, 'un chico trabajador – una chica ___',
    ['trabajadora', 'trabajador', 'trabajadera'], 'trabajadora',
    'Bijvoeglijke naamwoorden op -or krijgen in het vrouwelijk -ora.'),
];

/* ------------------------------------------------------------------ */
/* UNIDAD 6 · Te lo compro                                             */
/* ------------------------------------------------------------------ */

const U6_2 = { theme: 'interrogativos', src: P[125], grammarRef: 'gr.que-cual' };
const U6_3 = { theme: 'onbepaalde-voornaamwoorden', src: P[125], grammarRef: 'gr.ontkenning' };
const U6_4 = { theme: 'onbepaalde-voornaamwoorden', src: P[126], grammarRef: 'gr.onbepaald', instruction: 'Vul het juiste onbepaald voornaamwoord in' };
const U6_5 = { theme: 'gr-woordkeuze', src: P[126] };
const U6_8a = { theme: 'gr-voorwerp', src: P[127], grammarRef: 'gr.meewerkend-voorwerp' };
const U6_8b = { theme: 'gr-voorwerp', src: P[127], grammarRef: 'gr.combinatie-voornaamwoorden' };
const U6_9 = { theme: 'gr-voorwerp', src: P[127], grammarRef: 'gr.combinatie-voornaamwoorden' };
const U6_10 = { theme: 'gr-woordkeuze', src: P[128] };
const U6_11 = { theme: 'gr-voorwerp', src: P[128], grammarRef: 'gr.combinatie-voornaamwoorden' };
const U6_12 = { theme: 'gr-voorwerp', src: P[129], grammarRef: 'gr.lijdend-voorwerp' };
const U6_12i = { ...U6_12, grammarRef: 'gr.meewerkend-voorwerp' };
const U6_12c = { ...U6_12, grammarRef: 'gr.combinatie-voornaamwoorden' };
const U6_13 = { theme: 'gr-woordkeuze', src: P[129] };
const U6_14 = { theme: 'gr-woordkeuze', src: P[129] };
const U6_15 = { theme: 'interrogativos', src: P[130] };
const U6_16 = { theme: 'interrogativos', src: P[130], grammarRef: 'gr.que-cual' };
const U6_17 = { theme: 'gr-voorwerp', src: P[131], grammarRef: 'gr.meewerkend-voorwerp' };
const U6_17d = { ...U6_17, grammarRef: 'gr.lijdend-voorwerp' };
const U6_18 = { theme: 'onbepaalde-voornaamwoorden', src: P[131], grammarRef: 'gr.onbepaald' };
const U6_19 = { theme: 'onbepaalde-voornaamwoorden', src: P[131] };
const U6_20 = { theme: 'gr-voorwerp', src: P[132], grammarRef: 'gr.combinatie-voornaamwoorden' };
const U6_21 = { theme: 'gr-woordkeuze', src: P[132] };
const U6_23 = { theme: 'gr-woordkeuze', src: P[133], instruction: 'Vul het juiste woord in (antwoord op een klacht)' };
const U6_24 = { theme: 'lezen-u6', src: P[133], text: 't.wb-u6.carnaval' };

const QC = ['qué', 'cuál', 'cuáles'];
const QC_ = ['Qué', 'Cuál', 'Cuáles'];

const unit6 = [
  // 2 · Qué of cuál/es?
  q('q.wb-u6.2-1', U6_2, 'Bueno, ¿de ___ color prefieres el jersey?', QC, 'qué',
    'Welke kleur wil je voor de trui? (qué + zelfstandig naamwoord)'),
  q('q.wb-u6.2-2', U6_2, 'A ti, ¿___ te gusta más?', QC, 'cuál',
    'Welke vind jij het mooist? (keuze binnen een bekende groep → cuál)',
    { context: 'El jersey rojo es bonito, pero el negro también. Me gustan los dos.' }),
  q('q.wb-u6.2-3', U6_2, 'No sé… A ver, ¿___ modelos tienen?', QC, 'qué',
    'Welke modellen hebben ze? (qué + zelfstandig naamwoord)', { context: 'Oye, y para papá, ¿qué tal un reloj?' }),
  q('q.wb-u6.2-4', U6_2, '¿___ te gusta más?', QC_, 'Cuál',
    'Welk vind je het mooist? (één uit een bekende groep → cuál)', { context: 'Tienen estos tres relojes.' }),
  q('q.wb-u6.2-5', U6_2, 'Esas camisetas son preciosas. ¿___ talla tiene papá?', QC_, 'Qué',
    'Welke maat heeft papa? (qué + zelfstandig naamwoord)'),
  q('q.wb-u6.2-6', U6_2, '¿___ le vas a comprar a tu mujer?', QC_, 'Qué',
    'Wat ga je voor je vrouw kopen? (algemene vraag → qué)'),
  q('q.wb-u6.2-7', U6_2, 'Mira, una perfumería… ¿Pero sabes ___ perfume usa tu mujer?', QC, 'qué',
    'Maar weet je welk parfum je vrouw gebruikt? (qué + zelfstandig naamwoord)'),
  q('q.wb-u6.2-8', U6_2, 'Sí, pero ¿___?', QC, 'cuáles',
    'Ja, maar welke? (meervoud, zonder zelfstandig naamwoord → cuáles)',
    { context: 'A mis nietos les voy a regalar unos juegos para el ordenador.' }),
  q('q.wb-u6.2-9', U6_2, '¿___ tipo de juegos les gusta a los chicos de catorce años?', QC_, 'Qué',
    'Wat voor spelletjes vinden jongens van veertien leuk? (qué + zelfstandig naamwoord)'),

  // 3 · Is 'no' nodig?
  ...[
    ['1', 'Nadie se va del Rastro con las manos vacías.', 'Nadie no se va del Rastro con las manos vacías.', 'Niemand vertrekt met lege handen van de Rastro. (nadie vóór het werkwoord → geen no)'],
    ['2', '¿No has comprado nada para Marisa?', '¿Has comprado nada para Marisa?', 'Heb je niets voor Marisa gekocht? (nada na het werkwoord → no ervoor)'],
    ['3', 'De esta tienda ningún mueble me gusta.', 'De esta tienda ningún mueble no me gusta.', 'Geen enkel meubel uit deze winkel bevalt me. (ningún vóór het werkwoord → geen no)'],
    ['4', 'Van a cerrar la tienda porque nadie compra ahí.', 'Van a cerrar la tienda porque nadie no compra ahí.', 'De winkel gaat sluiten omdat niemand daar koopt.'],
    ['5', '¿Sabes? Patricia nunca ha estado en el Rastro.', '¿Sabes? Patricia nunca no ha estado en el Rastro.', 'Patricia is nog nooit op de Rastro geweest. (nunca vóór het werkwoord → geen no)'],
    ['6', '¿Chaquetas de cuero? Lo siento, no me queda ninguna.', '¿Chaquetas de cuero? Lo siento, me queda ninguna.', 'Leren jassen? Sorry, ik heb er geen meer. (ninguna na het werkwoord → no ervoor)'],
    ['7', 'No quiero comprar nada aquí.', 'Quiero comprar nada aquí.', 'Ik wil hier niets kopen. (nada na het werkwoord → no ervoor)'],
    ['8', 'Ningún vendedor de antigüedades abre los domingos.', 'Ningún vendedor de antigüedades no abre los domingos.', 'Geen enkele antiekhandelaar is op zondag open.'],
  ].map(([n, good, bad, nl]) => q(`q.wb-u6.3-${n}`, U6_3, '¿Qué frase es correcta?',
    Number(n) % 2 ? [good, bad] : [bad, good], good, nl)),

  // 4 · Op de Rastro
  s('s.wb-u6.4-1', U6_4, 'Hola, ¿tiene alguna novela de García Márquez?',
    'Hallo, hebt u een roman van García Márquez?', { answer: 'alguna', options: ['alguna', 'alguno', 'algo', 'ninguna'] }),
  s('s.wb-u6.4-2', U6_4, '¿Novelas de García Márquez? No, lo siento. No tengo ninguna.',
    'Romans van García Márquez? Nee, sorry, ik heb er geen.', { answer: 'ninguna', options: ['ninguna', 'ninguno', 'nada', 'alguna'] }),
  s('s.wb-u6.4-3', U6_4, 'Estoy buscando un reloj antiguo para un regalo. ¿Tiene alguno?',
    'Ik zoek een antiek uurwerk als cadeau. Hebt u er een?', { answer: 'alguno', options: ['alguno', 'alguna', 'algo', 'alguien'] }),
  s('s.wb-u6.4-4', U6_4, '¿Relojes antiguos? Yo no tengo ninguno, pero el vendedor de la esquina tiene algunos muy bonitos.',
    'Antieke uurwerken? Ik heb er geen, maar de verkoper op de hoek heeft er een paar heel mooie.', { answer: 'ninguno', options: ['ninguno', 'ninguna', 'nada', 'nadie'] }),
  s('s.wb-u6.4-5', U6_4, '¿Relojes antiguos? Yo no tengo ninguno, pero el vendedor de la esquina tiene algunos muy bonitos.',
    'Antieke uurwerken? Ik heb er geen, maar de verkoper op de hoek heeft er een paar heel mooie.', { answer: 'algunos', options: ['algunos', 'algunas', 'algo', 'alguien'] }),
  s('s.wb-u6.4-6', U6_4, 'Tengo que comprar algo para el cumpleaños de mamá.',
    'Ik moet iets kopen voor mama’s verjaardag.', { answer: 'algo', options: ['algo', 'alguien', 'alguno', 'nada'] }),
  s('s.wb-u6.4-7', U6_4, '¿Todavía no le has comprado nada a mamá?',
    'Heb je nog niets voor mama gekocht?', { answer: 'nada', options: ['nada', 'nadie', 'algo', 'ninguno'] }),
  s('s.wb-u6.4-8', U6_4, 'Oye, ¿y si le compras algunas plantas?',
    'Zeg, en als je eens een paar planten voor haar koopt?', { answer: 'algunas', options: ['algunas', 'algunos', 'algo', 'alguien'] }),
  s('s.wb-u6.4-9', U6_4, '¿Plantas? Buena idea, creo que no tiene ninguna.',
    'Planten? Goed idee, ik denk dat ze er geen heeft.', { answer: 'ninguna', options: ['ninguna', 'ninguno', 'nada', 'nadie'] }),
  s('s.wb-u6.4-10', U6_4, '¿El libro de cocina que quieres regalar? No, nadie lo tiene.',
    'Het kookboek dat je wilt geven? Nee, niemand heeft het.', { answer: 'nadie', options: ['nadie', 'nada', 'ninguno', 'alguien'] }),
  s('s.wb-u6.4-11', U6_4, 'Hoy me voy a ir con las manos vacías. Todavía no he comprado nada.',
    'Vandaag ga ik met lege handen naar huis. Ik heb nog niets gekocht.', { answer: 'nada', options: ['nada', 'nadie', 'algo', 'ninguno'] }),
  s('s.wb-u6.4-12', U6_4, 'Podemos ir a tomar unas tapas. ¿O quieres buscar algo más?',
    'We kunnen tapas gaan eten. Of wil je nog iets anders zoeken?', { answer: 'algo', options: ['algo', 'alguien', 'nada', 'alguno'] }),
  s('s.wb-u6.4-13', U6_4, 'Sí, sí, espera… Quizás alguien tiene libros de ciencia ficción.',
    'Ja, ja, wacht… Misschien heeft iemand sciencefictionboeken.', { answer: 'alguien', options: ['alguien', 'algo', 'nadie', 'alguno'] }),

  // 5 · In een winkel
  ...[
    ['1', '¿Me puedo probar esta falda?', 'Por supuesto. Los probadores están allí.', ['¿Qué número calza?', 'No, en efectivo.', 'Durante dos semanas y con el ticket de compra.'], 'Mag ik deze rok passen? — Natuurlijk, de paskamers zijn daar.'],
    ['2', 'La chaqueta me gusta, pero el verde no.', 'La tenemos también en negro.', ['¿Qué número calza?', 'No, en efectivo.', 'Durante dos semanas y con el ticket de compra.'], 'De jas bevalt me, maar het groen niet. — We hebben hem ook in het zwart.'],
    ['3', 'Me queda un poco estrecha.', 'Tenemos también otras tallas.', ['La tenemos también en negro.', 'No, en efectivo.', 'Durante dos semanas y con el ticket de compra.'], 'Hij zit wat nauw. — We hebben ook andere maten.'],
    ['4', 'Estoy buscando unas sandalias deportivas.', '¿Qué número calza?', ['No, en efectivo.', 'Durante dos semanas y con el ticket de compra.', 'La tenemos también en negro.'], 'Ik zoek sportsandalen. — Welke schoenmaat hebt u?'],
    ['5', '¿Puedo cambiar la camiseta?', 'Durante dos semanas y con el ticket de compra.', ['¿Qué número calza?', 'No, en efectivo.'], 'Mag ik het T-shirt ruilen? — Binnen twee weken en met het kasticket.'],
    ['6', '¿Paga con tarjeta?', 'No, en efectivo.', ['Tenemos también otras tallas.', '¿Qué número calza?', 'Por supuesto. Los probadores están allí.'], 'Betaalt u met de kaart? — Nee, contant.'],
  ].map(([n, prompt, answer, others, nl]) => q(`q.wb-u6.5-${n}`, U6_5, prompt, [answer, ...others], answer, nl)),

  // 8a · Meewerkend voorwerp vervangen
  ...[
    ['1', 'Reservamos a los clientes las mejores ofertas especiales.', '___ reservamos las mejores ofertas especiales.', 'We reserveren voor hen de beste speciale aanbiedingen.'],
    ['2', 'Ofrecemos a nuestros clientes los productos de la mejor calidad.', '___ ofrecemos los productos de la mejor calidad.', 'We bieden hun producten van de beste kwaliteit.'],
    ['3', 'Si no están contentos, devolvemos el dinero a los clientes.', 'Si no están contentos, ___ devolvemos el dinero.', 'Als ze niet tevreden zijn, geven we hun het geld terug.'],
    ['4', 'Enviamos a nuestros clientes todas las compras gratis.', '___ enviamos todas las compras gratis.', 'We sturen hun alle aankopen gratis op.'],
    ['5', 'Si lo desean, guardamos a los clientes los regalos de Navidad hasta el día antes.', 'Si lo desean, ___ guardamos los regalos de Navidad hasta el día antes.', 'Als ze willen, bewaren we hun kerstcadeaus tot de dag ervoor.'],
    ['6', 'Ofrecemos a todos nuestros clientes el servicio de compra por internet.', '___ ofrecemos el servicio de compra por internet.', 'We bieden hun de dienst van online winkelen aan.'],
  ].map(([n, context, prompt, nl]) => {
    const cap = prompt.startsWith('___');
    const opts = cap ? ['Les', 'Los', 'Le', 'Se'] : ['les', 'los', 'le', 'se'];
    return q(`q.wb-u6.8a-${n}`, U6_8a, prompt, opts, opts[0], `${nl} (a los clientes → les)`, { context });
  }),

  // 8b · Beide voorwerpen vervangen
  ...[
    ['1', 'Les reservamos las mejores ofertas especiales.', '___ reservamos.', 'Se las', ['Se las', 'Les las', 'Se los', 'Se le'], 'We reserveren ze voor hen.'],
    ['2', 'Les ofrecemos los productos de la mejor calidad.', '___ ofrecemos.', 'Se los', ['Se los', 'Les los', 'Se las', 'Se le'], 'We bieden ze hun aan.'],
    ['3', 'Si no están contentos, les devolvemos el dinero.', 'Si no están contentos, ___ devolvemos.', 'se lo', ['se lo', 'les lo', 'se la', 'se le'], 'Als ze niet tevreden zijn, geven we het hun terug.'],
    ['4', 'Les enviamos todas las compras gratis.', '___ enviamos gratis.', 'Se las', ['Se las', 'Les las', 'Se los', 'Se le'], 'We sturen ze hun gratis op.'],
    ['5', 'Si lo desean, les guardamos los regalos de Navidad hasta el día antes.', 'Si lo desean, ___ guardamos hasta el día antes.', 'se los', ['se los', 'les los', 'se las', 'se le'], 'Als ze willen, bewaren we ze voor hen tot de dag ervoor.'],
    ['6', 'Les ofrecemos el servicio de compra por internet.', '___ ofrecemos.', 'Se lo', ['Se lo', 'Les lo', 'Se la', 'Se le'], 'We bieden het hun aan.'],
  ].map(([n, context, prompt, answer, options, nl]) => q(`q.wb-u6.8b-${n}`, U6_8b, prompt, options, answer,
    `${nl} (le/les + lo/la/los/las → se lo, se la…)`, { context })),

  // 9 · Malena geeft spullen weg
  ...[
    ['1', 'Este libro es para ti.', 'me lo', ['me lo', 'te lo', 'me la', 'se lo'], 'Echt, geef je het mij?'],
    ['2', 'La lámpara es para Marisa.', 'se la', ['se la', 'le la', 'se lo', 'me la'], 'Echt, geef je hem (de lamp) aan haar?'],
    ['3', 'Los cómics son para los niños.', 'se los', ['se los', 'les los', 'se las', 'nos los'], 'Echt, geef je ze aan hen?'],
    ['4', 'Las copas de cristal son para vosotras.', 'nos las', ['nos las', 'os las', 'nos los', 'se las'], 'Echt, geef je ze aan ons?'],
    ['5', 'El reloj de cuco también es para vosotras.', 'nos lo', ['nos lo', 'os lo', 'nos la', 'se lo'], 'Echt, geef je hem (de koekoeksklok) aan ons?'],
    ['6', 'El espejo barroco es para mi madre.', 'se lo', ['se lo', 'le lo', 'se la', 'me lo'], 'Echt, geef je hem (de spiegel) aan haar?'],
  ].map(([n, context, answer, options, nl]) => q(`q.wb-u6.9-${n}`, U6_9, '¿De verdad, ___ regalas?', options, answer, nl,
    { context: `Malena: «${context}»` })),

  // 10a · Verschillende manieren van 'geven'
  ...[
    ['1', 'dar en una ocasión especial, por ejemplo un cumpleaños', 'regalar', 'schenken, cadeau geven'],
    ['2', 'dar algo por un tiempo y esperar recibirlo otra vez', 'prestar', 'uitlenen'],
    ['3', 'darle un objeto prestado a su propietario', 'devolver', 'teruggeven'],
    ['4', 'no dar algo personalmente, sino por correo o correo electrónico', 'enviar', 'sturen, versturen'],
  ].map(([n, def, answer, nl]) => q(`q.wb-u6.10-${n}`, U6_10, `¿Qué verbo significa «${def}»?`,
    ['regalar', 'prestar', 'devolver', 'enviar'], answer, `${answer} = ${nl}`)),

  // 11 · De receptioniste reageert
  ...[
    ['1', 'Señora López, ¿puede enviar estos faxes al director del Hotel Alfa?', 'Enseguida ___ envío.', 'se los', ['se los', 'le los', 'se las', 'se lo'], 'Ik stuur ze hem meteen.'],
    ['2', '¿Puede prepararme la cuenta de la habitación 38?', 'Enseguida ___ preparo.', 'se la', ['se la', 'le la', 'me la', 'se lo'], 'Ik maak ze (de rekening) meteen voor u klaar.'],
    ['3', 'Perdone, ¿puede dar esta carta a la señora Gutiérrez?', 'Sí, ahora ___ doy.', 'se la', ['se la', 'le la', 'se lo', 'la le'], 'Ja, ik geef hem (de brief) haar nu.'],
    ['4', '¿Nos puede pedir un taxi, por favor?', 'Enseguida ___ pido.', 'se lo', ['se lo', 'les lo', 'nos lo', 'se la'], 'Ik bel er meteen een voor u.'],
    ['5', '¿Puede mostrarme cómo funciona el aire acondicionado?', 'Enseguida ___ muestro.', 'se lo', ['se lo', 'le lo', 'me lo', 'se la'], 'Ik toon het u meteen.'],
    ['6', 'Julia, ¿me puedes dar la llave del garaje?', 'Sí, enseguida ___ doy.', 'te la', ['te la', 'me la', 'se lo', 'te lo'], 'Ja, ik geef hem (de sleutel) je meteen. (tú → te la)'],
    ['7', '¿Puedes llevarle este paquete al cliente de la habitación 23?', 'Enseguida ___ llevo.', 'se lo', ['se lo', 'le lo', 'se la', 'lo le'], 'Ik breng het hem meteen.'],
    ['8', 'Tienes que reservar una mesa al señor Cuesta en Casa Lucio.', 'Ahora ___ reservo.', 'se la', ['se la', 'le la', 'se lo', 'la le'], 'Ik reserveer ze (de tafel) nu voor hem.'],
  ].map(([n, context, prompt, answer, options, nl]) => q(`q.wb-u6.11-${n}`, U6_11, prompt, options, answer, nl, { context })),

  // 12 · Het antwoord van Jaime
  q('q.wb-u6.12-1', U6_12, 'El ordenador viejo no me ___ tienes que devolver.', ['lo', 'le', 'la', 'los'], 'lo',
    'De oude computer hoef je me niet terug te geven. (el ordenador → lo)'),
  q('q.wb-u6.12-2', U6_12, '___ puedes tirar.', ['Lo', 'Le', 'La', 'Se'], 'Lo',
    'Je mag hem weggooien.', { context: 'El ordenador viejo es demasiado antiguo y ya no sirve para nada.' }),
  q('q.wb-u6.12-3', U6_12, 'Si al final Pablo no ___ quiere, ¿me los puedes dar a mí?', ['los', 'les', 'las', 'le'], 'los',
    'Als Pablo ze uiteindelijk niet wil, kun je ze aan mij geven? (los libros → los)', { context: 'Oye, y los libros…' }),
  q('q.wb-u6.12-4', U6_12c, '¿___ puedes dar a mí?', ['Me los', 'Me les', 'Se los', 'Los me'], 'Me los',
    'Kun je ze aan mij geven? (me + los)', { context: 'Y los libros… si al final Pablo no los quiere,' }),
  q('q.wb-u6.12-5', U6_12i, 'Bueno, a mí no ___ gustan los libros de ciencia ficción.', ['me', 'mí', 'le', 'te'], 'me',
    'Nou ja, ik hou niet van sciencefictionboeken.'),
  q('q.wb-u6.12-6', U6_12, 'A mí no me gustan los libros de ciencia ficción, ya ___ sabes.', ['lo', 'le', 'la', 'los'], 'lo',
    'Ik hou niet van sciencefiction, dat weet je. (lo = dat)'),
  q('q.wb-u6.12-7', U6_12c, 'Pero ___ puedo dar a María, para la biblioteca de la escuela.', ['se los', 'le los', 'se las', 'les los'], 'se los',
    'Maar ik kan ze aan María geven, voor de schoolbibliotheek. (le + los → se los)', { context: 'A mí no me gustan los libros de ciencia ficción.' }),
  q('q.wb-u6.12-8', U6_12i, 'María necesita libros y dice que ___ interesan todos.', ['le', 'la', 'les', 'se'], 'le',
    'María heeft boeken nodig en zegt dat ze alles interessant vindt.'),
  q('q.wb-u6.12-9', U6_12, '¿Por qué no ___ vendes en el Rastro?', ['las', 'les', 'los', 'la'], 'las',
    'Waarom verkoop je ze niet op de Rastro? (las cosas → las)', { context: 'Si todavía tienes cosas en el sótano…' }),
  q('q.wb-u6.12-10', { theme: 'gr-wederkerend', src: P[129], grammarRef: 'gr.wederkerend' }, '___ vemos mañana. Un besito, Jaime',
    ['Nos', 'Se', 'Les', 'Me'], 'Nos', 'We zien elkaar morgen. Kusjes, Jaime'),

  // 13 · Winkels en producten
  ...[
    ['1', 'las sandalias', 'zapatería', ['zapatería', 'perfumería', 'papelería', 'carnicería'], 'de sandalen → de schoenwinkel'],
    ['2', 'el perfume', 'perfumería', ['perfumería', 'panadería', 'librería', 'zapatería'], 'het parfum → de parfumerie'],
    ['3', 'el champú', 'perfumería', ['perfumería', 'carnicería', 'papelería', 'frutería'], 'de shampoo → de parfumerie'],
    ['4', 'el pan', 'panadería', ['panadería', 'perfumería', 'zapatería', 'librería'], 'het brood → de bakkerij'],
    ['5', 'los dulces', 'panadería', ['panadería', 'carnicería', 'papelería', 'zapatería'], 'het zoetgoed → de bakkerij'],
    ['6', 'las naranjas', 'frutería', ['frutería', 'carnicería', 'perfumería', 'librería'], 'de sinaasappels → de fruitwinkel'],
    ['7', 'las manzanas', 'frutería', ['frutería', 'panadería', 'papelería', 'zapatería'], 'de appels → de fruitwinkel'],
    ['8', 'las chuletas', 'carnicería', ['carnicería', 'panadería', 'perfumería', 'librería'], 'de koteletten → de slagerij'],
    ['9', 'el pollo', 'carnicería', ['carnicería', 'papelería', 'zapatería', 'perfumería'], 'de kip → de slagerij'],
    ['10', 'la lechuga', 'verdulería', ['verdulería', 'carnicería', 'papelería', 'perfumería'], 'de sla → de groentewinkel'],
    ['11', 'los espárragos', 'verdulería', ['verdulería', 'panadería', 'librería', 'zapatería'], 'de asperges → de groentewinkel'],
    ['12', 'una guía turística', 'librería', ['librería', 'carnicería', 'frutería', 'perfumería'], 'een reisgids → de boekhandel'],
    ['13', 'una agenda', 'papelería', ['papelería', 'carnicería', 'verdulería', 'zapatería'], 'een agenda → de papierwinkel'],
    ['14', 'un bolígrafo', 'papelería', ['papelería', 'panadería', 'frutería', 'perfumería'], 'een balpen → de papierwinkel'],
  ].map(([n, product, answer, options, nl]) => q(`q.wb-u6.13-${n}`, U6_13,
    `¿Dónde se compra normalmente ${product}? En la ___.`, options, answer, nl)),

  // 14 · Een klacht: woordenschat
  ...[
    ['1', 'la oferta', 'de aanbieding'],
    ['2', 'el pedido', 'de bestelling'],
    ['3', 'el descuento', 'de korting'],
    ['4', 'la factura', 'de rekening'],
    ['5', 'el importe', 'het bedrag'],
    ['6', 'el artículo', 'het artikel'],
    ['7', 'el pago', 'de betaling'],
    ['8', 'el precio de venta al público (PVP)', 'de verkoopprijs'],
  ].map(([n, es, answer], i, all) => q(`q.wb-u6.14-${n}`, U6_14, `¿Qué significa «${es}»?`,
    [answer, ...[1, 3, 5].map(k => all[(i + k) % all.length][2])], answer, `${es} = ${answer}`)),

  // 15 · Vragenlijst over koopgewoonten
  q('q.wb-u6.15-1', U6_15, '¿___ años tiene usted?', ['Cuántos', 'Qué', 'Cuáles', 'Cuándo'], 'Cuántos', 'Hoe oud bent u?'),
  q('q.wb-u6.15-2', { ...U6_15, grammarRef: 'gr.que-cual' }, '¿___ profesión tiene?', ['Qué', 'Cuál', 'Dónde', 'Cuántos'], 'Qué',
    'Welk beroep hebt u? (qué + zelfstandig naamwoord)'),
  q('q.wb-u6.15-3', U6_15, '¿___ compra regularmente (supermercado, mercado, tienda del barrio…)?', ['Dónde', 'Cuándo', 'Cuántos', 'Cuál'], 'Dónde',
    'Waar koopt u gewoonlijk (supermarkt, markt, buurtwinkel…)?'),
  q('q.wb-u6.15-4', { ...U6_15, grammarRef: 'gr.que-cual' }, '¿___ de estas tiendas ofrece un servicio online?', ['Cuál', 'Qué', 'Cuáles', 'Dónde'], 'Cuál',
    'Welke van deze winkels biedt een onlinedienst aan? (cuál de…, enkelvoud)'),
  q('q.wb-u6.15-5', U6_15, 'Si usted trabaja durante la semana, ¿___ hace normalmente la compra?', ['cuándo', 'cuántos', 'cuál', 'cuáles'], 'cuándo',
    'Als u in de week werkt, wanneer doet u dan meestal boodschappen?'),
  q('q.wb-u6.15-6', { ...U6_15, grammarRef: 'gr.que-cual' }, 'Si compra online, ¿___ son sus motivos?', ['cuáles', 'qué', 'cuál', 'cuántos'], 'cuáles',
    'Als u online koopt, wat zijn uw redenen? (cuáles + ser, meervoud)'),
  q('q.wb-u6.15-7', { ...U6_15, grammarRef: 'gr.que-cual' }, '¿___ importancia tiene la marca para usted?', ['Qué', 'Cuál', 'Cuáles', 'Dónde'], 'Qué',
    'Hoe belangrijk is het merk voor u? (qué + zelfstandig naamwoord)'),
  q('q.wb-u6.15-8', U6_15, '¿Paga sus compras en efectivo o con tarjeta? ¿___?', ['Por qué', 'Cuántos', 'Dónde', 'Cuándo'], 'Por qué',
    'Betaalt u contant of met de kaart? Waarom?'),

  // 16 · Qué, cuál of cuáles?
  q('q.wb-u6.16-1', U6_16, '¿___ pastel llevamos? ¿El grande o el pequeño?', QC_, 'Qué',
    'Welke taart nemen we mee? (qué + zelfstandig naamwoord)'),
  q('q.wb-u6.16-2', U6_16, '¿___ es tu correo electrónico?', QC_, 'Cuál', 'Wat is je e-mailadres? (cuál + ser)'),
  q('q.wb-u6.16-3', U6_16, '¿___ prefieres para tu cumpleaños, una camiseta o unas gafas?', QC_, 'Qué',
    'Wat wil je liever voor je verjaardag, een T-shirt of een zonnebril? (kiezen tussen verschillende dingen → qué)'),
  q('q.wb-u6.16-4', U6_16, '¿___ le compramos a Mercedes?', QC_, 'Qué', 'Wat kopen we voor Mercedes?'),
  q('q.wb-u6.16-5', U6_16, '¿___ de estos sombreros te gusta más?', QC_, 'Cuál', 'Welke van deze hoeden vind je het mooist?'),
  q('q.wb-u6.16-6', U6_16, '¿___ de las zapatillas prefieres, las rojas o las azules?', QC_, 'Cuáles',
    'Welke sportschoenen verkies je, de rode of de blauwe? (meervoud → cuáles)'),

  // 17 · Een cadeau voor een moeilijke vriendin
  q('q.wb-u6.17-1', U6_17, '¿Qué ___ parece si le regalamos a Linda estas gafas de sol?', ['te', 'ti'], 'te',
    'Wat vind je ervan als we Linda deze zonnebril geven?'),
  q('q.wb-u6.17-2', U6_17, '¿Qué te parece si ___ regalamos a Linda estas gafas de sol?', ['le', 'la'], 'le',
    'Wat vind je ervan als we Linda deze zonnebril geven? (a Linda = meewerkend voorwerp → le)'),
  q('q.wb-u6.17-3', U6_17d, '¿Tú crees que ___ va a llevar?', ['las', 'les'], 'las',
    'Denk je dat ze hem (de bril) gaat dragen? (las gafas → las)', { context: '¿Le regalamos a Linda estas gafas de sol?' }),
  q('q.wb-u6.17-4', U6_17, 'A Linda las gafas ___ encantan.', ['le', 'se'], 'le', 'Linda is dol op brillen.'),
  q('q.wb-u6.17-5', U6_17d, 'Ya sabes que Linda solo ___ usa de marcas famosas.', ['las', 'les'], 'las',
    'Je weet dat Linda alleen brillen van bekende merken draagt.', { context: '¿Las gafas de sol?' }),
  q('q.wb-u6.17-6', U6_17, 'Unas gafas de sol de marca ___ parecen demasiado caras.', ['me', 'mi'], 'me',
    'Een merkzonnebril vind ik te duur.'),
  q('q.wb-u6.17-7', U6_17, '¿Tú sabes qué música ___ gusta a Linda?', ['le', 'la'], 'le', 'Weet jij van welke muziek Linda houdt?'),
  q('q.wb-u6.17-8', U6_17d, '¿Tú ___ has visto alguna vez escuchando música?', ['le', 'la'], 'la',
    'Heb jij haar ooit muziek zien beluisteren? (a Linda = lijdend voorwerp → la)', { context: 'Hablamos de Linda.' }),
  q('q.wb-u6.17-9', U6_17, 'A Linda ___ podemos regalar un curso de yoga.', ['le', 'la'], 'le', 'We kunnen Linda een yogacursus geven.'),
  q('q.wb-u6.17-10', U6_17, 'Seguro que el curso de yoga ___ va a gustar.', ['le', 'la'], 'le',
    'Die yogacursus gaat ze zeker leuk vinden.', { context: 'Le regalamos a Linda un curso de yoga.' }),
  q('q.wb-u6.17-11', U6_17, 'Vamos a un estudio de yoga y ___ compramos un cheque regalo.', ['le', 'se'], 'le',
    'We gaan naar een yogastudio en kopen een cadeaubon voor haar.', { context: 'El regalo es para Linda.' }),
  q('q.wb-u6.17-12', { ...U6_17, grammarRef: 'gr.combinatie-voornaamwoorden' }, '¡Genial! ___ podemos enviar a casa con unas flores.',
    ['Se lo', 'Le lo'], 'Se lo', 'Geweldig! We kunnen hem (de bon) haar thuis sturen met bloemen. (le + lo → se lo)',
    { context: 'Le compramos a Linda un cheque regalo.' }),

  // 18 · Beurs van jonge ontwerpers
  q('q.wb-u6.18-1', U6_18, '___ los diseñadores son españoles.', ['Todos', 'Algunos', 'Nadie', 'Ningún'], 'Todos',
    'Alle ontwerpers zijn Spaans.', { context: 'Feria de jóvenes diseñadores españoles: participan estudiantes de escuelas de moda de toda España.' }),
  q('q.wb-u6.18-2', U6_18, 'La mayoría es de Cataluña, ___ son de la Comunidad de Madrid.', ['algunos', 'todos', 'nadie', 'ningún'], 'algunos',
    'De meesten komen uit Catalonië, enkelen uit Madrid.', { context: 'Participan 65 estudiantes de Cataluña, 12 de Madrid y el resto de otras comunidades.' }),
  q('q.wb-u6.18-3', U6_18, 'No hay ___ de la escuela sevillana.', ['nadie', 'ningún', 'algunos', 'todos'], 'nadie',
    'Er is niemand van de school uit Sevilla.', { context: 'Esta vez no participan estudiantes de la escuela sevillana.' }),
  q('q.wb-u6.18-4', U6_18, '___ los modelos son para el próximo verano.', ['Todos', 'Algunos', 'Nadie', 'Ningún'], 'Todos',
    'Alle modellen zijn voor volgende zomer.', { context: 'En la feria se presentan las tendencias para el próximo verano.' }),
  q('q.wb-u6.18-5', U6_18, 'No hay ___ modelo de invierno.', ['ningún', 'nadie', 'algunos', 'todos'], 'ningún',
    'Er is geen enkel wintermodel. (ninguno → ningún vóór een mannelijk zelfstandig naamwoord)',
    { context: 'En la feria se presentan las tendencias para el próximo verano.' }),
  q('q.wb-u6.18-6', U6_18, '___ puede comprar los modelos, solo ver y probar.', ['Nadie', 'Ningún', 'Todos', 'Algunos'], 'Nadie',
    'Niemand kan de modellen kopen, alleen bekijken en passen.', { context: 'Los visitantes pueden probarse los modelos, pero no comprarlos.' }),

  // 19 · Vragen en antwoorden
  ...[
    ['1', '¿Has encontrado algo en el Corte Inglés?', 'No, nada. Prefiero las tiendas pequeñas.', ['¡Sí, yo! Me encantan los mercadillos.', 'Es verdad, se pasa todo el tiempo comprando.', 'Qué raro. ¿No hay nadie en la caja?'], 'Heb je iets gevonden in de Corte Inglés? — Nee, niets. Ik verkies kleine winkels.'],
    ['2', '¿No tienen nada en tu talla?', 'No, solo les quedan las tallas L y XL.', ['¡Sí, yo! Me encantan los mercadillos.', 'Es verdad, se pasa todo el tiempo comprando.', 'Yo tampoco, está todo muy caro.'], 'Hebben ze niets in jouw maat? — Nee, ze hebben alleen nog L en XL.'],
    ['3', '¿Alguien de vosotros quiere ir al Rastro?', '¡Sí, yo! Me encantan los mercadillos.', ['No, solo les quedan las tallas L y XL.', 'Qué raro. ¿No hay nadie en la caja?', 'No, lo siento, no tenemos ninguno.'], 'Wil iemand van jullie naar de Rastro? — Ja, ik! Ik ben dol op vlooienmarkten.'],
    ['4', '¿Nadie me puede prestar dinero?', 'Lo siento, me lo he gastado todo en el outlet.', ['No, solo les quedan las tallas L y XL.', 'Es verdad, se pasa todo el tiempo comprando.', 'No, lo siento, no tenemos ninguno.'], 'Kan niemand me geld lenen? — Sorry, ik heb alles uitgegeven in de outlet.'],
    ['5', '¿Tienen algún reloj antiguo?', 'No, lo siento, no tenemos ninguno.', ['¡Sí, yo! Me encantan los mercadillos.', 'Es verdad, se pasa todo el tiempo comprando.', 'Yo tampoco, está todo muy caro.'], 'Hebt u een antiek uurwerk? — Nee, sorry, we hebben er geen.'],
    ['6', 'No veo a ningún vendedor en la tienda.', 'Qué raro. ¿No hay nadie en la caja?', ['No, solo les quedan las tallas L y XL.', '¡Sí, yo! Me encantan los mercadillos.', 'No, lo siento, no tenemos ninguno.'], 'Ik zie geen enkele verkoper in de winkel. — Vreemd. Is er niemand aan de kassa?'],
    ['7', 'Todos los sábados Marta se va de compras.', 'Es verdad, se pasa todo el tiempo comprando.', ['No, solo les quedan las tallas L y XL.', 'No, lo siento, no tenemos ninguno.', '¡Sí, yo! Me encantan los mercadillos.'], 'Elke zaterdag gaat Marta winkelen. — Klopt, ze is de hele tijd aan het shoppen.'],
    ['8', 'Hoy no compro nada.', 'Yo tampoco, está todo muy caro.', ['No, solo les quedan las tallas L y XL.', '¡Sí, yo! Me encantan los mercadillos.', 'No, lo siento, no tenemos ninguno.'], 'Vandaag koop ik niets. — Ik ook niet, alles is heel duur.'],
  ].map(([n, prompt, answer, others, nl]) => q(`q.wb-u6.19-${n}`, U6_19, prompt, [answer, ...others], answer, nl)),

  // 20 · Wie doet wat voor het feest?
  q('q.wb-u6.20-1', U6_20, '___ puedo comprar yo.', ['Se la', 'Le la', 'Se lo', 'La le'], 'Se la',
    'Ik kan hem (de pijp) voor hem kopen. (le + la → se la)', { context: '¿Quién le compra la pipa a papá?' }),
  q('q.wb-u6.20-2', U6_20, 'Gloria ___ va a llevar.', ['se la', 'le la', 'se lo', 'la le'], 'se la',
    'Gloria gaat het (het eten) naar haar brengen.', { context: 'La tía Marta está enferma. ¿Quién puede llevarle la comida a casa?' }),
  q('q.wb-u6.20-3', U6_20, 'Yo ___ voy a comprar.', ['se lo', 'le lo', 'se la', 'lo le'], 'se lo',
    'Ik ga het (het parfum) voor haar kopen.', { context: '¿Quién le quiere comprar a mamá el perfume?' }),
  q('q.wb-u6.20-4', U6_20, 'Ángel ___ puede prestar.', ['se lo', 'le lo', 'se la', 'lo le'], 'se lo',
    'Ángel kan het (het pak) hem lenen.', { context: 'El primo Juan no tiene ropa para la fiesta. ¿Quién le puede prestar un traje?' }),
  q('q.wb-u6.20-5', U6_20, 'Yo ___ voy a dar.', ['se lo', 'le lo', 'se la', 'lo le'], 'se lo',
    'Ik ga haar er een (een massage) geven.', { context: 'Mamá está muy nerviosa. ¿Quién le va a dar un masaje?' }),
  q('q.wb-u6.20-6', U6_20, 'Los niños ___ van a entregar.', ['se los', 'les los', 'se las', 'los les'], 'se los',
    'De kinderen gaan ze (de cadeaus) aan hen geven. (les + los → se los)', { context: '¿Quién les va a entregar los regalos a papá y mamá?' }),
  q('q.wb-u6.20-7', U6_20, 'Puedo ___ yo.', ['comprársela', 'comprárselo', 'comprarle la'], 'comprársela',
    'Ik kan hem (de pijp) voor hem kopen. (voornaamwoorden achter de infinitief, met accent)', { context: '¿Quién le compra la pipa a papá?' }),
  q('q.wb-u6.20-8', U6_20, 'Gloria va a ___.', ['llevársela', 'llevárselo', 'llevarle la'], 'llevársela',
    'Gloria gaat het (het eten) naar haar brengen.', { context: 'La tía Marta está enferma. ¿Quién puede llevarle la comida a casa?' }),
  q('q.wb-u6.20-9', U6_20, 'Yo voy a ___.', ['comprárselo', 'comprársela', 'comprarle lo'], 'comprárselo',
    'Ik ga het (het parfum) voor haar kopen.', { context: '¿Quién le quiere comprar a mamá el perfume?' }),
  q('q.wb-u6.20-10', U6_20, 'Ángel puede ___.', ['prestárselo', 'prestársela', 'prestarle lo'], 'prestárselo',
    'Ángel kan het (het pak) hem lenen.', { context: 'El primo Juan no tiene ropa para la fiesta. ¿Quién le puede prestar un traje?' }),
  q('q.wb-u6.20-11', U6_20, 'Yo voy a ___.', ['dárselo', 'dársela', 'darle lo'], 'dárselo',
    'Ik ga haar er een (een massage) geven.', { context: 'Mamá está muy nerviosa. ¿Quién le va a dar un masaje?' }),
  q('q.wb-u6.20-12', U6_20, 'Los niños van a ___.', ['entregárselos', 'entregárselas', 'entregarles los'], 'entregárselos',
    'De kinderen gaan ze (de cadeaus) aan hen geven.', { context: '¿Quién les va a entregar los regalos a papá y mamá?' }),

  // 21 · Het juiste woord
  q('q.wb-u6.21-1', { theme: 'interrogativos', src: P[132], grammarRef: 'gr.que-cual' }, '¿___ es tu tienda favorita?', ['Cuál', 'Qué'], 'Cuál',
    'Wat is je favoriete winkel? (cuál + ser)'),
  q('q.wb-u6.21-2', { theme: 'onbepaalde-voornaamwoorden', src: P[132], grammarRef: 'gr.onbepaald' }, '___ cliente ha venido hoy a la tienda de antigüedades.',
    ['Ningún', 'Ninguno', 'Nadie'], 'Ningún', 'Er is vandaag geen enkele klant naar de antiekwinkel gekomen. (ningún vóór een mannelijk zelfstandig naamwoord)'),
  q('q.wb-u6.21-3', { theme: 'gr-voorwerp', src: P[132], grammarRef: 'gr.meewerkend-voorwerp' }, 'No sé qué ___ puedo regalar a mis sobrinos.',
    ['les', 'los', 'se'], 'les', 'Ik weet niet wat ik mijn neefjes kan geven. (a mis sobrinos = meewerkend voorwerp → les)'),
  q('q.wb-u6.21-4', { theme: 'gr-voorwerp', src: P[132], grammarRef: 'gr.combinatie-voornaamwoorden' }, 'No tengo el DVD aquí, ___ lo he prestado a Pedro.',
    ['se', 'le', 'les'], 'se', 'Ik heb de dvd hier niet, ik heb hem aan Pedro uitgeleend. (le + lo → se lo)'),
  q('q.wb-u6.21-5', U6_21, 'Los pantalones te ___ un poco cortos, ¿no?', ['quedan', 'son', 'están'], 'quedan',
    'De broek is je wat te kort, niet? (quedar = zitten, passen)'),
  q('q.wb-u6.21-6', U6_21, '¿Qué ___ calza?', ['número', 'talla', 'medida'], 'número',
    'Welke schoenmaat hebt u? (bij schoenen: número)'),
  q('q.wb-u6.21-7', { theme: 'interrogativos', src: P[132], grammarRef: 'gr.que-cual' }, '¿De ___ color prefieres el jersey?', ['qué', 'cuál'], 'qué',
    'In welke kleur wil je de trui? (cuál nooit vóór een zelfstandig naamwoord)'),
  q('q.wb-u6.21-8', U6_21, 'Me encanta ir ___ compras.', ['de', 'a', 'en'], 'de', 'Ik ga heel graag winkelen. (ir de compras)'),
  q('q.wb-u6.21-9', { theme: 'onbepaalde-voornaamwoorden', src: P[132], grammarRef: 'gr.onbepaald' }, '___ ciudad va al Rastro.',
    ['Toda la', 'Toda', 'Todo la'], 'Toda la', 'De hele stad gaat naar de Rastro.'),
  q('q.wb-u6.21-10', { theme: 'onbepaalde-voornaamwoorden', src: P[132], grammarRef: 'gr.ontkenning' }, '¡Qué pena! Ya no queda ___ del pastel que me gusta.',
    ['nada', 'algo', 'nadie'], 'nada', 'Jammer! Er is niets meer over van de taart die ik lekker vind. (no … nada)'),

  // 23b · Antwoord op een klacht
  s('s.wb-u6.23-1', U6_23, 'Durante el mes de agosto tuvimos una oferta especial para todos los pedidos realizados antes del 31 de agosto.',
    'In augustus hadden we een speciale aanbieding voor alle bestellingen vóór 31 augustus.',
    { answer: 'oferta', options: ['oferta', 'factura', 'descuento', 'importe'] }),
  s('s.wb-u6.23-2', U6_23, 'Ustedes hicieron el pedido a principios de septiembre.',
    'U plaatste de bestelling begin september.',
    { answer: 'pedido', options: ['pedido', 'descuento', 'importe', 'artículos'] }),
  s('s.wb-u6.23-3', U6_23, 'Como son muy buenos clientes, les propuse un descuento del 15 %.',
    'Omdat u heel goede klanten bent, stelde ik u een korting van 15 % voor.',
    { answer: 'descuento', options: ['descuento', 'pedido', 'importe', 'oferta'] }),
  s('s.wb-u6.23-4', U6_23, 'Uno de nuestros empleados se equivocó y escribió el precio original de los artículos.',
    'Een van onze medewerkers vergiste zich en schreef de oorspronkelijke prijs van de artikelen op.',
    { answer: 'artículos', options: ['artículos', 'descuentos', 'importes', 'facturas'] }),
  s('s.wb-u6.23-5', U6_23, 'Le pido disculpas y le envío la factura corregida con el importe correcto.',
    'Mijn excuses; ik stuur u de verbeterde rekening met het juiste bedrag.',
    { answer: 'factura', options: ['factura', 'descuento', 'pedido', 'importe'] }),
  s('s.wb-u6.23-6', U6_23, 'Le pido disculpas y le envío la factura corregida con el importe correcto.',
    'Mijn excuses; ik stuur u de verbeterde rekening met het juiste bedrag.',
    { answer: 'importe', options: ['importe', 'pedido', 'oferta', 'artículos'] }),

  // 24 · Carnaval in Oruro en Cádiz (lezen)
  ...[
    ['1', 'La fiesta es Patrimonio de la Humanidad.', 'Oruro', 'De UNESCO riep het carnaval van Oruro uit tot werelderfgoed.'],
    ['2', 'Grupos de cantantes compiten en concursos musicales.', 'Cádiz', 'In Cádiz strijden coros en chirigotas tegen elkaar in wedstrijden.'],
    ['3', 'El origen de la fiesta simboliza los peligros del trabajo en las minas.', 'Oruro', 'Oruro is een mijnstad; het feest verwijst naar de gevaren van de mijnen.'],
    ['4', 'Participan casi un millón de personas.', 'Oruro', 'Oruro heeft zo’n 340 000 inwoners, maar tijdens carnaval bijna een miljoen.'],
    ['5', 'Los habitantes de la ciudad se llaman gaditanos.', 'Cádiz', 'Inwoners van Cádiz heten gaditanos.'],
    ['6', 'Más de 400 bailarines con máscaras representan la lucha del bien y del mal.', 'Oruro', 'Dat is de Diablada van Oruro.'],
    ['7', 'Como en muchas fiestas, se mezclan tradiciones cristianas con creencias prehispánicas.', 'Oruro', 'Prehispaanse (inheemse) tradities vind je in Bolivia, niet in Spanje.'],
    ['8', 'Es tradición comer pequeñas raciones de pescado frito en los bares.', 'Cádiz', 'In Cádiz eet men pescaíto frito in de bars.'],
  ].map(([n, frase, answer, nl]) => r(`r.wb-u6.carnaval.${n}`, U6_24, `¿Oruro o Cádiz? «${frase}»`, ['Oruro', 'Cádiz'], answer, nl)),

  // Ya sé · Autoevaluación
  q('q.wb-u6.ya-se-1', { theme: 'interrogativos', src: P[134], grammarRef: 'gr.que-cual' }, '¿___ chaqueta compramos?', QC_, 'Qué',
    'Welke jas kopen we? (qué + zelfstandig naamwoord)'),
  q('q.wb-u6.ya-se-2', { theme: 'interrogativos', src: P[134], grammarRef: 'gr.que-cual' }, '¿___ te gusta más?', QC_, 'Cuál',
    'Welke vind je het mooist?', { context: 'Hay dos chaquetas, una azul y una negra.' }),
  q('q.wb-u6.ya-se-3', { theme: 'onbepaalde-voornaamwoorden', src: P[134], grammarRef: 'gr.onbepaald' }, 'Hoy no he comprado ___.',
    ['nada', 'algo', 'nadie', 'ninguno'], 'nada', 'Vandaag heb ik niets gekocht.'),
  q('q.wb-u6.ya-se-4', { theme: 'onbepaalde-voornaamwoorden', src: P[134], grammarRef: 'gr.onbepaald' }, '¿Conoces a ___ en la clase?',
    ['alguien', 'algo', 'nadie', 'alguno'], 'alguien', 'Ken je iemand in de klas?'),
  q('q.wb-u6.ya-se-5', { theme: 'gr-voorwerp', src: P[134], grammarRef: 'gr.combinatie-voornaamwoorden' }, '¿Ese reloj? ___ he comprado a mi hijo.',
    ['Se lo', 'Le lo', 'Se la', 'Lo le'], 'Se lo', 'Dat uurwerk? Dat heb ik voor mijn zoon gekocht.'),
];

/* ------------------------------------------------------------------ */
/* UNIDAD 7 · ¡Qué descanso!                                           */
/* ------------------------------------------------------------------ */

const U7_1 = { theme: 'gr-woordkeuze', src: P[135] };
const U7_2 = { theme: 'gr-woordkeuze', src: P[135], instruction: 'Vul het juiste woord in (bij de dokter)' };
const U7_4 = { theme: 'gr-woordkeuze', src: P[136] };
const U7_5 = { theme: 'gr-voorwerp', src: P[136] };
const U7_5b = { theme: 'gr-voorwerp', src: P[137] };
const U7_6 = { theme: 'bijwoord', src: P[137], grammarRef: 'gr.mente', instruction: 'Bijvoeglijk naamwoord of bijwoord? Vul de juiste vorm in' };
const U7_8 = { theme: 'gr-zin-imperfecto', src: P[138], grammarRef: 'gr.imperfecto', instruction: 'Vul de imperfecto in' };
const U7_9 = { theme: 'gr-zin-imperfecto', src: P[138], grammarRef: 'gr.imperfecto', instruction: 'Vroeger (imperfecto) en nu: vul de imperfecto in' };
const U7_10 = { theme: 'gr-woordkeuze', src: P[139] };
const U7_11 = { theme: 'gr-voorwerp', src: P[139], grammarRef: 'gr.meewerkend-voorwerp' };
const U7_12 = { theme: 'gr-voorwerp', src: P[139], grammarRef: 'gr.meewerkend-voorwerp' };
const U7_12d = { ...U7_12, grammarRef: 'gr.lijdend-voorwerp' };
const U7_13 = { theme: 'bijwoord', src: P[140], grammarRef: 'gr.mente' };
const U7_15 = { theme: 'gr-zin-imperfecto', src: P[140], grammarRef: 'gr.imperfecto', instruction: 'Vroeger (imperfecto) en nu: vul de imperfecto in' };
const U7_16 = { theme: 'gr-woordkeuze', src: P[140] };
const U7_17 = { theme: 'gr-zin-imperfecto', src: P[141], grammarRef: 'gr.imperfecto', instruction: 'Vul de imperfecto in' };
const U7_19 = { theme: 'gr-woordkeuze', src: P[142] };
const U7_22 = { theme: 'lezen-u7', src: P[143], text: 't.wb-u7.fallas' };
const U7_23 = { theme: 'gr-woordkeuze', src: P[144] };

const unit7 = [
  // 1 · Lichaamsdelen
  q('q.wb-u7.1-1', U7_1, 'Los zapatos se llevan en los ___.', ['pies', 'dientes', 'brazos', 'ojos'], 'pies', 'Schoenen draag je aan je voeten.'),
  q('q.wb-u7.1-2', U7_1, 'En la mano tenemos cinco ___.', ['dedos', 'piernas', 'orejas', 'dientes'], 'dedos', 'Aan een hand hebben we vijf vingers.'),
  q('q.wb-u7.1-3', U7_1, 'Un buen futbolista tiene que cuidar mucho sus ___.', ['piernas', 'orejas', 'dientes', 'narices'], 'piernas',
    'Een goede voetballer moet goed voor zijn benen zorgen.'),
  q('q.wb-u7.1-4', U7_1, 'En situaciones formales nos damos la ___ para saludarnos.', ['mano', 'barriga', 'espalda', 'rodilla'], 'mano',
    'In formele situaties geven we elkaar een hand om te groeten.'),
  q('q.wb-u7.1-5', U7_1, 'La ___ nos sirve para probar la comida y para hablar.', ['boca', 'espalda', 'nariz', 'oreja'], 'boca',
    'Met de mond proeven we het eten en praten we.'),
  q('q.wb-u7.1-6', U7_1, 'El sombrero lo llevamos en la ___.', ['cabeza', 'nariz', 'espalda', 'mano'], 'cabeza', 'Een hoed draag je op je hoofd.'),
  q('q.wb-u7.1-7', U7_1, 'Mi hija tiene los ___ azules; mi hijo los tiene marrones.', ['ojos', 'brazos', 'dientes', 'pies'], 'ojos',
    'Mijn dochter heeft blauwe ogen; mijn zoon bruine.'),
  q('q.wb-u7.1-8', U7_1, 'La minifalda tiene que ser muy corta, siempre por encima de las ___.', ['rodillas', 'manos', 'orejas', 'cabezas'], 'rodillas',
    'Een minirok moet heel kort zijn, altijd boven de knieën.'),

  // 2a · Bij de dokter
  s('s.wb-u7.2-1', U7_2, 'A ver, ¿qué le pasa hoy?', 'Zeg eens, wat scheelt er vandaag?',
    { answer: 'pasa', options: ['pasa', 'mejore', 'receta', 'tomar'] }),
  s('s.wb-u7.2-2', U7_2, 'Estoy fatal. Me duele mucho el estómago.', 'Ik voel me beroerd. Mijn maag doet veel pijn.',
    { answer: 'fatal', options: ['fatal', 'fiebre', 'receta', 'farmacia'] }),
  s('s.wb-u7.2-3', U7_2, 'Me duele mucho el estómago y tengo diarrea.', 'Mijn maag doet veel pijn en ik heb diarree.',
    { answer: 'estómago', options: ['estómago', 'fiebre', 'receta', 'farmacia'] }),
  s('s.wb-u7.2-4', U7_2, 'Me duele mucho el estómago y tengo diarrea.', 'Mijn maag doet veel pijn en ik heb diarree.',
    { answer: 'diarrea', options: ['diarrea', 'estómago', 'farmacia', 'mejor'] }),
  s('s.wb-u7.2-5', U7_2, '¿Tiene fiebre? Sí, treinta y ocho con cinco.', 'Hebt u koorts? Ja, achtendertig vijf.',
    { answer: 'fiebre', options: ['fiebre', 'diarrea', 'receta', 'estómago'] }),
  s('s.wb-u7.2-6', U7_2, 'Tranquilo, que no es nada grave.', 'Rustig maar, het is niets ernstigs.',
    { answer: 'grave', options: ['grave', 'fatal', 'mejor', 'fiebre'] }),
  s('s.wb-u7.2-7', U7_2, 'Con esta receta puede comprar en la farmacia unas pastillas para la diarrea.',
    'Met dit voorschrift kunt u bij de apotheek pillen tegen diarree kopen.',
    { answer: 'receta', options: ['receta', 'farmacia', 'fiebre', 'diarrea'] }),
  s('s.wb-u7.2-8', U7_2, 'Con esta receta puede comprar en la farmacia unas pastillas para la diarrea.',
    'Met dit voorschrift kunt u bij de apotheek pillen tegen diarree kopen.',
    { answer: 'farmacia', options: ['farmacia', 'receta', 'fiebre', 'estómago'] }),
  s('s.wb-u7.2-9', U7_2, 'Tiene que tomar tres pastillas al día.', 'U moet drie pillen per dag nemen.',
    { answer: 'tomar', options: ['tomar', 'pasa', 'mejore', 'receta'] }),
  s('s.wb-u7.2-10', U7_2, 'Bueno, doctor, si no estoy mejor mañana, vengo otra vez.', 'Goed, dokter, als het morgen niet beter gaat, kom ik terug.',
    { answer: 'mejor', options: ['mejor', 'fatal', 'grave', 'mejore'] }),
  s('s.wb-u7.2-11', U7_2, '¡Que se mejore, señor González!', 'Beterschap, meneer González!',
    { answer: 'mejore', options: ['mejore', 'pasa', 'tomar', 'mejor'] }),

  // 4a · Goede raad voor een goede gezondheid
  ...[
    ['1', '¿Qué le pasa al bebé?', 'No sé, tiene una diarrea muy fuerte.', ['Sí, casi treinta y nueve.', 'Sí, pero para eso se necesita receta.', '¡Huy, no! Tengo alergia al limón.'], 'Wat scheelt de baby? — Ik weet het niet, hij heeft erge diarree.'],
    ['2', '¿Tienes fiebre?', 'Sí, casi treinta y nueve.', ['No sé, tiene una diarrea muy fuerte.', 'Unas gotas para la nariz y un jarabe.', '¡Huy, no! Tengo alergia al limón.'], 'Heb je koorts? — Ja, bijna negenendertig.'],
    ['3', '¿Por qué no tomas un té con limón?', '¡Huy, no! Tengo alergia al limón.', ['Sí, casi treinta y nueve.', 'No sé, tiene una diarrea muy fuerte.', 'Unas gotas para la nariz y un jarabe.'], 'Waarom neem je geen thee met citroen? — O nee! Ik ben allergisch voor citroen.'],
    ['4', 'Para el dolor de garganta, ¿qué me recomienda?', 'Lo mejor es tomar leche caliente con miel.', ['Sí, casi treinta y nueve.', 'No sé, tiene una diarrea muy fuerte.', '¡Huy, no! Tengo alergia al limón.'], 'Wat raadt u me aan tegen keelpijn? — Het beste is warme melk met honing.'],
    ['5', '¿No tiene algo más fuerte?', 'Sí, pero para eso se necesita receta.', ['Sí, casi treinta y nueve.', 'No sé, tiene una diarrea muy fuerte.', '¡Huy, no! Tengo alergia al limón.'], 'Hebt u niets sterkers? — Ja, maar daarvoor hebt u een voorschrift nodig.'],
    ['6', '¿Qué te ha recetado el médico contra el resfriado?', 'Unas gotas para la nariz y un jarabe.', ['Sí, casi treinta y nueve.', 'No sé, tiene una diarrea muy fuerte.', 'Sí, pero para eso se necesita receta.'], 'Wat heeft de dokter je voorgeschreven tegen de verkoudheid? — Neusdruppels en een siroop.'],
  ].map(([n, prompt, answer, others, nl]) => q(`q.wb-u7.4-${n}`, U7_4, prompt, [answer, ...others], answer, nl)),

  // 5a · Het juiste voornaamwoord
  q('q.wb-u7.5-1', { ...U7_5, grammarRef: 'gr.meewerkend-voorwerp' }, 'Pues ___ gusta mucho mi trabajo.', ['me', 'a mí'], 'me',
    'Ik vind mijn werk heel leuk. (gustar heeft altijd me/te/le… nodig)'),
  q('q.wb-u7.5-2', { ...U7_5, grammarRef: 'gr.lijdend-voorwerp' }, 'Tú ya ___ sabes, ¿no?', ['lo', 'le'], 'lo', 'Dat weet je al, niet? (lo = dat)'),
  q('q.wb-u7.5-3', { ...U7_5, grammarRef: 'gr.meewerkend-voorwerp' }, '___ cuesta mucho concentrarme.', ['Me', 'Yo'], 'Me',
    'Ik heb veel moeite om me te concentreren.'),
  q('q.wb-u7.5-4', { ...U7_5, grammarRef: 'gr.meewerkend-voorwerp' }, 'Estoy muy nerviosa y ___ duele la cabeza.', ['me', 'mi'], 'me',
    'Ik ben erg zenuwachtig en heb hoofdpijn.'),
  q('q.wb-u7.5-5', { ...U7_5, grammarRef: 'gr.meewerkend-voorwerp' }, 'Ayer fui al médico y ___ dijo que tengo estrés.', ['me', 'se'], 'me',
    'Gisteren ging ik naar de dokter en hij zei me dat ik stress heb.'),
  q('q.wb-u7.5-6', { theme: 'gr-woordkeuze', src: P[136] }, 'El médico me dijo que ___ que tengo es estrés.', ['lo', 'el'], 'lo',
    'De dokter zei dat wat ik heb stress is. (lo que = wat)'),
  q('q.wb-u7.5-7', { ...U7_5, grammarRef: 'gr.meewerkend-voorwerp' }, '___ recomendó irme de vacaciones.', ['Me', 'Le'], 'Me',
    'Hij raadde me aan op vakantie te gaan.', { context: 'María Jesús: «Ayer fui al médico.»' }),
  q('q.wb-u7.5-8', { theme: 'gr-wederkerend', src: P[136], grammarRef: 'gr.wederkerend' }, 'El médico me recomendó ___ de vacaciones y no pensar en el trabajo.',
    ['irme', 'irse'], 'irme', 'De dokter raadde me aan op vakantie te gaan en niet aan het werk te denken. (ik → irme)'),
  q('q.wb-u7.5-9', { theme: 'gr-wederkerend', src: P[137], grammarRef: 'gr.wederkerend' }, '___ levanto todos los días a las seis.', ['Me', 'Se'], 'Me',
    'Ik sta elke dag om zes uur op.'),
  q('q.wb-u7.5-10', { ...U7_5b, grammarRef: 'gr.lijdend-voorwerp' }, 'Preparo el desayuno para los niños y después ___ llevo al colegio en coche.',
    ['los', 'ellos'], 'los', 'Ik maak het ontbijt voor de kinderen en daarna breng ik ze met de auto naar school.'),
  q('q.wb-u7.5-11', { theme: 'gr-bezittelijk', src: P[137], grammarRef: 'gr.bezittelijk' }, 'Voy directamente a ___ trabajo.', ['mi', 'mí'], 'mi',
    'Ik ga meteen naar mijn werk. (mi zonder accent = mijn)'),
  q('q.wb-u7.5-12', { ...U7_5b, grammarRef: 'gr.lijdend-voorwerp' }, 'A las cinco ___ llevo a la piscina.', ['los', 'me'], 'los',
    'Om vijf uur breng ik ze naar het zwembad.', { context: 'Rosa habla de sus hijos.' }),
  q('q.wb-u7.5-13', { theme: 'gr-wederkerend', src: P[137], grammarRef: 'gr.wederkerend' }, 'Por la noche ___ acuesto tarde.', ['me', 'yo'], 'me',
    '’s Avonds ga ik laat slapen.'),
  q('q.wb-u7.5-14', { ...U7_5b, grammarRef: 'gr.meewerkend-voorwerp' }, 'Me acuesto tarde, porque ___ gusta ver un poco la televisión.', ['me', 'le'], 'me',
    'Ik ga laat slapen, omdat ik graag nog wat tv kijk.'),
  q('q.wb-u7.5-15', { theme: 'gr-wederkerend', src: P[137], grammarRef: 'gr.wederkerend' }, 'Mi padre ya no trabaja. ___ levanta todos los días a las nueve.',
    ['Se', 'Le'], 'Se', 'Mijn vader werkt niet meer. Hij staat elke dag om negen uur op.'),
  q('q.wb-u7.5-16', { ...U7_5b, grammarRef: 'gr.meewerkend-voorwerp' }, 'Después ___ cuesta mucho organizar su día.', ['le', 'se'], 'le',
    'Daarna heeft hij veel moeite om zijn dag te organiseren.', { context: 'Mi padre ya no trabaja.' }),
  q('q.wb-u7.5-17', { ...U7_5b, grammarRef: 'gr.lijdend-voorwerp' }, 'Los primeros meses ___ pasó mejor.', ['los', 'las'], 'los',
    'De eerste maanden bracht hij beter door. (los meses → los)', { context: 'Mi padre está jubilado desde marzo.' }),
  q('q.wb-u7.5-18', { ...U7_5b, grammarRef: 'gr.meewerkend-voorwerp' }, 'Mis hermanos y yo ___ recomendamos buscarse un hobby.', ['le', 'lo'], 'le',
    'Mijn broers en ik raden hem aan een hobby te zoeken.', { context: 'Mi padre se aburre.' }),
  q('q.wb-u7.5-19', { theme: 'gr-bezittelijk', src: P[137], grammarRef: 'gr.bezittelijk' }, 'Pero él no escucha ___ consejos.', ['nuestros', 'nosotros'], 'nuestros',
    'Maar hij luistert niet naar onze raad.'),

  // 6 · Bijvoeglijk naamwoord of bijwoord?
  s('s.wb-u7.6-1', U7_6, 'Esta vez viajamos cómodamente en tren.', 'Deze keer reizen we comfortabel met de trein.',
    { answer: 'cómodamente', hint: 'cómodo' }),
  s('s.wb-u7.6-2', U7_6, '¿En el AVE? La verdad es que es muy cómodo.', 'Met de AVE? Die is echt heel comfortabel.',
    { answer: 'cómodo', hint: 'cómodo' }),
  s('s.wb-u7.6-3', U7_6, 'Ayer tuve una conversación muy agradable con el nuevo jefe.', 'Gisteren had ik een heel aangenaam gesprek met de nieuwe baas.',
    { answer: 'agradable', hint: 'agradable' }),
  s('s.wb-u7.6-4', U7_6, 'A mí también me parece que el nuevo jefe es simpático.', 'Ik vind de nieuwe baas ook sympathiek.',
    { answer: 'simpático', hint: 'simpático' }),
  s('s.wb-u7.6-5', U7_6, '¡Qué inteligente es Juan! Ha aprendido fácilmente chino en poco tiempo.', 'Wat is Juan slim! Hij heeft in korte tijd vlot Chinees geleerd.',
    { answer: 'fácilmente', hint: 'fácil' }),
  s('s.wb-u7.6-6', U7_6, 'Vaya, pues el chino no es un idioma fácil, creo.', 'Tja, Chinees is toch geen makkelijke taal, denk ik.',
    { answer: 'fácil', hint: 'fácil' }),
  s('s.wb-u7.6-7', U7_6, 'Han probado científicamente que el estrés es más grave que muchas otras enfermedades.',
    'Men heeft wetenschappelijk bewezen dat stress ernstiger is dan veel andere ziektes.', { answer: 'científicamente', hint: 'científico' }),
  s('s.wb-u7.6-8', U7_6, '¿Seguro que es un estudio científico? Esa revista no es muy seria.',
    'Is het zeker een wetenschappelijke studie? Dat tijdschrift is niet erg serieus.', { answer: 'científico', hint: 'científico' }),

  // 7 · Werkwoordtabel (usted)
  {
    id: 'g.wb-u7.7-presente', kind: 'grammar', theme: 'gr-zin-presente', src: P[137], grammarRef: 'gr.presente',
    rule: 'Geef de presente-vorm voor usted.',
    examples: [
      { es: 'ser → usted ___', answer: 'es', nl: 'u bent' },
      { es: 'estar → usted ___', answer: 'está', nl: 'u bent' },
      { es: 'ir → usted ___', answer: 'va', nl: 'u gaat' },
      { es: 'hacer → usted ___', answer: 'hace', nl: 'u doet' },
      { es: 'ver → usted ___', answer: 've', nl: 'u ziet' },
      { es: 'tener → usted ___', answer: 'tiene', nl: 'u hebt' },
      { es: 'poner → usted ___', answer: 'pone', nl: 'u zet' },
    ],
  },
  {
    id: 'g.wb-u7.7-perfecto', kind: 'grammar', theme: 'verleden-tijden', src: P[137], grammarRef: 'gr.perfecto',
    rule: 'Geef de perfecto-vorm voor usted.',
    examples: [
      { es: 'ser → usted ___', answer: 'ha sido', nl: 'u bent geweest' },
      { es: 'estar → usted ___', answer: 'ha estado', nl: 'u bent geweest' },
      { es: 'ir → usted ___', answer: 'ha ido', nl: 'u bent gegaan' },
      { es: 'hacer → usted ___', answer: 'ha hecho', nl: 'u hebt gedaan' },
      { es: 'ver → usted ___', answer: 'ha visto', nl: 'u hebt gezien' },
      { es: 'tener → usted ___', answer: 'ha tenido', nl: 'u hebt gehad' },
      { es: 'poner → usted ___', answer: 'ha puesto', nl: 'u hebt gezet' },
    ],
  },
  {
    id: 'g.wb-u7.7-indefinido', kind: 'grammar', theme: 'verleden-tijden', src: P[137], grammarRef: 'gr.indefinido-onregelmatig',
    rule: 'Geef de indefinido-vorm voor usted.',
    examples: [
      { es: 'ser → usted ___', answer: 'fue', nl: 'u was' },
      { es: 'estar → usted ___', answer: 'estuvo', nl: 'u was' },
      { es: 'ir → usted ___', answer: 'fue', nl: 'u ging' },
      { es: 'hacer → usted ___', answer: 'hizo', nl: 'u deed' },
      { es: 'ver → usted ___', answer: 'vio', nl: 'u zag' },
      { es: 'tener → usted ___', answer: 'tuvo', nl: 'u had' },
      { es: 'poner → usted ___', answer: 'puso', nl: 'u zette' },
    ],
  },
  {
    id: 'g.wb-u7.7-imperfecto', kind: 'grammar', theme: 'verleden-tijden', src: P[137], grammarRef: 'gr.imperfecto',
    rule: 'Geef de imperfecto-vorm voor usted.',
    examples: [
      { es: 'ser → usted ___', answer: 'era', nl: 'u was' },
      { es: 'estar → usted ___', answer: 'estaba', nl: 'u was' },
      { es: 'ir → usted ___', answer: 'iba', nl: 'u ging' },
      { es: 'hacer → usted ___', answer: 'hacía', nl: 'u deed' },
      { es: 'ver → usted ___', answer: 'veía', nl: 'u zag' },
      { es: 'tener → usted ___', answer: 'tenía', nl: 'u had' },
      { es: 'poner → usted ___', answer: 'ponía', nl: 'u zette' },
    ],
  },

  // 8 · De scholen van vroeger
  s('s.wb-u7.8-1', U7_8, 'Mi abuelo Jesús, el padre de mi padre, era profesor.', 'Mijn grootvader Jesús, de vader van mijn vader, was leraar.',
    { answer: 'era', hint: 'ser' }),
  s('s.wb-u7.8-2', U7_8, 'La escuela estaba en un pequeño pueblo de la provincia de Málaga.', 'De school lag in een klein dorp in de provincie Málaga.',
    { answer: 'estaba', hint: 'estar' }),
  s('s.wb-u7.8-3', U7_8, 'Los profesores entonces ganaban muy poco dinero y tenían que hacer otros trabajos para poder vivir.',
    'De leraren verdienden toen heel weinig geld en moesten ander werk doen om rond te komen.', { answer: 'ganaban', hint: 'ganar' }),
  s('s.wb-u7.8-4', U7_8, 'Los profesores entonces ganaban muy poco dinero y tenían que hacer otros trabajos para poder vivir.',
    'De leraren verdienden toen heel weinig geld en moesten ander werk doen om rond te komen.', { answer: 'tenían', hint: 'tener' }),
  s('s.wb-u7.8-5', U7_8, 'Por eso mi abuelo, por las noches, ayudaba también en la oficina de Correos.',
    'Daarom hielp mijn grootvader ’s avonds ook op het postkantoor.', { answer: 'ayudaba', hint: 'ayudar' }),
  s('s.wb-u7.8-6', U7_8, 'Allí trabajaba también mi abuela y así los dos se conocieron.',
    'Daar werkte ook mijn grootmoeder en zo leerden ze elkaar kennen.', { answer: 'trabajaba', hint: 'trabajar' }),
  s('s.wb-u7.8-7', U7_8, 'En aquella época los niños y las niñas estudiaban por separado.',
    'In die tijd studeerden jongens en meisjes apart.', { answer: 'estudiaban', hint: 'estudiar' }),
  s('s.wb-u7.8-8', U7_8, 'Los alumnos no tenían libros, porque no podían comprarlos.',
    'De leerlingen hadden geen boeken, omdat ze die niet konden kopen.', { answer: 'tenían', hint: 'tener' }),
  s('s.wb-u7.8-9', U7_8, 'Los alumnos no tenían libros, porque no podían comprarlos.',
    'De leerlingen hadden geen boeken, omdat ze die niet konden kopen.', { answer: 'podían', hint: 'poder' }),
  s('s.wb-u7.8-10', U7_8, 'También había niños de todas las edades en la misma clase y tenían que aprender todos juntos.',
    'Er zaten ook kinderen van alle leeftijden in dezelfde klas en ze moesten allemaal samen leren.', { answer: 'había', hint: 'haber (hay)' }),
  s('s.wb-u7.8-11', U7_8, 'También había niños de todas las edades en la misma clase y tenían que aprender todos juntos.',
    'Er zaten ook kinderen van alle leeftijden in dezelfde klas en ze moesten allemaal samen leren.', { answer: 'tenían', hint: 'tener' }),
  s('s.wb-u7.8-12', U7_8, 'Normalmente, cuando eran muchos, los mayores ayudaban a los más pequeños.',
    'Als ze met veel waren, hielpen de ouderen meestal de kleinsten.', { answer: 'eran', hint: 'ser' }),
  s('s.wb-u7.8-13', U7_8, 'Normalmente, cuando eran muchos, los mayores ayudaban a los más pequeños.',
    'Als ze met veel waren, hielpen de ouderen meestal de kleinsten.', { answer: 'ayudaban', hint: 'ayudar' }),
  s('s.wb-u7.8-14', U7_8, 'Mi abuelo dice que todos aprendían mucho y que eran muy felices.',
    'Mijn grootvader zegt dat ze allemaal veel leerden en heel gelukkig waren.', { answer: 'aprendían', hint: 'aprender' }),
  s('s.wb-u7.8-15', U7_8, 'Mi abuelo dice que todos aprendían mucho y que eran muy felices.',
    'Mijn grootvader zegt dat ze allemaal veel leerden en heel gelukkig waren.', { answer: 'eran', hint: 'ser' }),

  // 9b · Antonio heeft zijn leven veranderd
  s('s.wb-u7.9-1', U7_9, 'Antes Antonio iba a todos los lugares en taxi, pero ahora va en bicicleta.',
    'Vroeger ging Antonio overal met de taxi heen, maar nu fietst hij.', { answer: 'iba', hint: 'ir' }),
  s('s.wb-u7.9-2', U7_9, 'Antes Antonio llevaba siempre camisa y corbata, pero ahora lleva ropa vieja y cómoda.',
    'Vroeger droeg Antonio altijd hemd en das, maar nu draagt hij oude, gemakkelijke kleren.', { answer: 'llevaba', hint: 'llevar' }),
  s('s.wb-u7.9-3', U7_9, 'Antes Antonio vivía con mucho dinero, pero ahora vive con poco dinero.',
    'Vroeger leefde Antonio met veel geld, nu met weinig.', { answer: 'vivía', hint: 'vivir' }),
  s('s.wb-u7.9-4', U7_9, 'Antes Antonio dormía en hoteles de lujo, pero ahora duerme en una casa antigua.',
    'Vroeger sliep Antonio in luxehotels, maar nu slaapt hij in een oud huis.', { answer: 'dormía', hint: 'dormir' }),
  s('s.wb-u7.9-5', U7_9, 'Antes Antonio viajaba en avión todas las semanas, pero ahora pasa todo el tiempo en el campo.',
    'Vroeger vloog Antonio elke week, maar nu is hij de hele tijd op het platteland.', { answer: 'viajaba', hint: 'viajar' }),
  s('s.wb-u7.9-6', U7_9, 'Antes Antonio cenaba en restaurantes caros con clientes; ahora consume solo los productos que cultiva.',
    'Vroeger dineerde Antonio met klanten in dure restaurants; nu eet hij alleen wat hij zelf teelt.', { answer: 'cenaba', hint: 'cenar' }),
  s('s.wb-u7.9-7', U7_9, 'Antes Antonio ganaba millones con su empresa, pero ahora gana dinero con la venta de verdura.',
    'Vroeger verdiende Antonio miljoenen met zijn bedrijf, nu verdient hij geld met de verkoop van groenten.', { answer: 'ganaba', hint: 'ganar' }),

  // 10 · Raad voor een nieuwe collega
  ...[
    ['1', 'No tengo todavía copia de mi contrato.', '¿Por qué no preguntas en el departamento de Recursos Humanos?', ['Puedes ir a clases de inglés por la tarde.', 'Tienes que llamar al servicio técnico.', 'Puedes llamar a la agencia de viajes de la empresa.'], 'Ik heb nog geen kopie van mijn contract. — Waarom vraag je het niet aan de personeelsdienst?'],
    ['2', 'Todavía no conozco a todos los colegas.', 'Puedes presentarte a los compañeros.', ['Tienes que llamar al servicio técnico.', 'Puedes llamar a la agencia de viajes de la empresa.', 'Conviene llamar al departamento de Informática.'], 'Ik ken nog niet alle collega’s. — Je kunt je aan de collega’s voorstellen.'],
    ['3', 'Mi ordenador no funciona bien.', 'Conviene llamar al departamento de Informática.', ['Puedes presentarte a los compañeros.', 'Puedes ir a clases de inglés por la tarde.', 'Puedes llamar a la agencia de viajes de la empresa.'], 'Mijn computer werkt niet goed. — Je belt best de IT-afdeling.'],
    ['4', 'Hay muchos clientes de EE. UU. y yo no sé inglés.', 'Puedes ir a clases de inglés por la tarde.', ['Tienes que llamar al servicio técnico.', 'Puedes presentarte a los compañeros.', 'Conviene llamar al departamento de Informática.'], 'Er zijn veel Amerikaanse klanten en ik spreek geen Engels. — Je kunt ’s avonds Engelse les volgen.'],
    ['5', 'Necesito enviar un paquete.', 'Conviene pedir ayuda a la asistente.', ['Puedes ir a clases de inglés por la tarde.', 'Conviene llamar al departamento de Informática.', 'Puedes presentarte a los compañeros.'], 'Ik moet een pakje versturen. — Vraag best hulp aan de assistente.'],
    ['6', 'Tengo que reservar un vuelo.', 'Puedes llamar a la agencia de viajes de la empresa.', ['Tienes que llamar al servicio técnico.', 'Puedes presentarte a los compañeros.', 'Conviene llamar al departamento de Informática.'], 'Ik moet een vlucht boeken. — Je kunt het reisbureau van het bedrijf bellen.'],
    ['7', 'El aire acondicionado no funciona.', 'Tienes que llamar al servicio técnico.', ['Puedes presentarte a los compañeros.', 'Puedes ir a clases de inglés por la tarde.', 'Puedes llamar a la agencia de viajes de la empresa.'], 'De airco werkt niet. — Je moet de technische dienst bellen.'],
    ['8', 'Todavía no he leído los documentos para la reunión de mañana.', '¿Por qué no te quedas en la oficina una hora más?', ['Tienes que llamar al servicio técnico.', 'Puedes llamar a la agencia de viajes de la empresa.', 'Conviene llamar al departamento de Informática.'], 'Ik heb de documenten voor de vergadering van morgen nog niet gelezen. — Waarom blijf je niet een uurtje langer op kantoor?'],
  ].map(([n, prompt, answer, others, nl]) => q(`q.wb-u7.10-${n}`, U7_10, prompt, [answer, ...others], answer, nl)),

  // 11 · Me, te, le, nos, os, les bij gustar-werkwoorden
  q('q.wb-u7.11-1', U7_11, 'A los niños ___ encanta dormir.', ['les', 'le', 'los', 'nos'], 'les', 'De kinderen slapen dolgraag.'),
  q('q.wb-u7.11-2', U7_11, 'A María ___ duelen las piernas.', ['le', 'la', 'les', 'se'], 'le', 'María heeft pijn aan haar benen.'),
  q('q.wb-u7.11-3', U7_11, 'A mí ___ cuesta concentrarme.', ['me', 'mi', 'te', 'se'], 'me', 'Ik heb moeite om me te concentreren.'),
  q('q.wb-u7.11-4', U7_11, 'A Jorge y a mí ___ duele el estómago.', ['nos', 'os', 'les', 'me'], 'nos', 'Jorge en ik hebben buikpijn.'),
  q('q.wb-u7.11-5', U7_11, 'A ti ___ fascinan las terapias alternativas, ¿no?', ['te', 'ti', 'le', 'se'], 'te', 'Jij bent gefascineerd door alternatieve therapieën, niet?'),
  q('q.wb-u7.11-6', U7_11, 'A María y a ti ___ interesa la reflexoterapia.', ['os', 'nos', 'le', 'te'], 'os', 'María en jij zijn geïnteresseerd in reflexologie.'),

  // 12 · Voornaamwoorden in dialogen
  q('q.wb-u7.12-1', U7_12, 'Buenos días, señora Martós, ¿___ puede decir qué le duele?', ['me', 'le', 'se', 'la'], 'me',
    'Goedendag, mevrouw Martós, kunt u me zeggen wat er pijn doet?'),
  q('q.wb-u7.12-2', U7_12, 'Buenos días, señora Martós, ¿me puede decir qué ___ duele?', ['le', 'la', 'me', 'se'], 'le',
    'Goedendag, mevrouw Martós, kunt u me zeggen wat er pijn doet (bij u)?'),
  q('q.wb-u7.12-3', U7_12, '___ duele todo, seguro que tengo gripe.', ['Me', 'Le', 'Mi', 'Se'], 'Me',
    'Alles doet pijn, ik heb vast griep.', { context: 'Señora Martós, ¿qué le duele?' }),
  q('q.wb-u7.12-4', U7_12d, '___ tienes en el botiquín del baño.', ['Las', 'Les', 'Los', 'La'], 'Las',
    'Ze liggen in het medicijnkastje in de badkamer. (las aspirinas → las)', { context: 'Teresa, ¿dónde has puesto las aspirinas?' }),
  q('q.wb-u7.12-5', U7_12, '¿Y no ___ molesta estar todo el día en casa?', ['le', 'se', 'les', 'nos'], 'le',
    'En stoort het hem niet om de hele dag thuis te zijn?', { context: 'Oye, tu padre está ya jubilado, ¿no?' }),
  q('q.wb-u7.12-6', U7_12, '¿Qué dices? ___ fascina el deporte y va todos los días al gimnasio.', ['Le', 'Se', 'Les', 'Me'], 'Le',
    'Wat zeg je nu? Hij is gek op sport en gaat elke dag naar de fitness.', { context: '¿A tu padre no le molesta estar todo el día en casa?' }),
  q('q.wb-u7.12-7', U7_12, 'Hola, Paco. ¿Qué ___ ha dicho el médico?', ['te', 'ti', 'le', 'se'], 'te', 'Hallo Paco. Wat heeft de dokter je gezegd?'),
  q('q.wb-u7.12-8', U7_12, 'Pues nada, que tengo estrés. ___ ha recomendado descansar y hacer más deporte.', ['Me', 'Te', 'Se', 'Le'], 'Me',
    'Niets bijzonders, ik heb stress. Hij heeft me aangeraden te rusten en meer te sporten.', { context: '¿Qué te ha dicho el médico?' }),
  q('q.wb-u7.12-9', U7_12, 'A Pepe y a ti ___ gusta mucho la naturaleza, ¿no?', ['os', 'nos', 'te', 'le'], 'os',
    'Pepe en jij houden erg van de natuur, niet?'),
  q('q.wb-u7.12-10', U7_12, 'Sí, ___ encanta.', ['nos', 'os', 'les', 'se'], 'nos',
    'Ja, we zijn er dol op.', { context: 'A Pepe y a ti os gusta mucho la naturaleza, ¿no?' }),
  q('q.wb-u7.12-11', U7_12, 'Y a los niños también ___ gusta mucho pasar el día en el campo.', ['les', 'los', 'le', 'nos'], 'les',
    'En de kinderen brengen de dag ook graag op het platteland door.'),
  q('q.wb-u7.12-12', U7_12, 'Por favor, ¿___ puede decir dónde está la consulta del doctor Torres?', ['me', 'mi', 'se', 'lo'], 'me',
    'Kunt u me zeggen waar de praktijk van dokter Torres is?'),
  q('q.wb-u7.12-13', U7_12d, 'Sí, claro. Allí, al final del pasillo ___ tiene.', ['la', 'lo', 'le', 'las'], 'la',
    'Ja, natuurlijk. Daar, aan het einde van de gang. (la consulta → la)', { context: '¿Dónde está la consulta del doctor Torres?' }),
  q('q.wb-u7.12-14', { ...U7_12, grammarRef: 'gr.combinatie-voornaamwoorden' }, 'Ay, me olvidé, pero ___ compro esta tarde.',
    ['se los', 'le los', 'se las', 'los le'], 'se los', 'Oei, vergeten, maar ik koop ze vanmiddag voor haar. (le + los → se los)',
    { context: '¿Compraste los medicamentos para tu hermana?' }),

  // 13 · Bijvoeglijk naamwoord of bijwoord: wat betekent de zin?
  ...[
    ['1', 'Voy a comprar algo de comida rápida.', 'Voy a comprar comida ya preparada.', 'Voy a comprar comida lo antes posible.', 'rápida (bijv. nw.) zegt iets over het eten: fastfood.'],
    ['2', 'Voy a comprar algo de comida rápidamente.', 'Voy a comprar comida lo antes posible.', 'Voy a comprar comida ya preparada.', 'rápidamente (bijwoord) zegt iets over het kopen: snel.'],
    ['3', 'Viajamos a Cádiz en un tren cómodamente.', 'El viaje fue agradable y no hubo problemas.', 'Era un tren nuevo y con buen servicio.', 'cómodamente zegt iets over het reizen.'],
    ['4', 'Viajamos a Cádiz en un tren muy cómodo.', 'Era un tren nuevo y con buen servicio.', 'El viaje fue agradable y no hubo problemas.', 'cómodo zegt iets over de trein.'],
    ['5', 'Estuvimos en un balneario tranquilo.', 'En el balneario no había ruido.', 'Estuvimos en un balneario y nos relajamos.', 'tranquilo zegt iets over het kuuroord.'],
    ['6', 'Estuvimos en un balneario tranquilamente.', 'Estuvimos en un balneario y nos relajamos.', 'En el balneario no había ruido.', 'tranquilamente zegt iets over hoe wij er waren.'],
    ['7', 'Aprendo una lengua fácil.', 'La lengua que aprendo no es complicada.', 'No tengo problemas para aprender una lengua.', 'fácil zegt iets over de taal.'],
    ['8', 'Aprendo una lengua fácilmente.', 'No tengo problemas para aprender una lengua.', 'La lengua que aprendo no es complicada.', 'fácilmente zegt iets over het leren.'],
  ].map(([n, frase, answer, other, nl]) => q(`q.wb-u7.13-${n}`, U7_13, `«${frase}» ¿Qué significa?`,
    Number(n) % 2 ? [answer, other] : [other, answer], answer, nl)),

  // 15 · Het leven van David voor en na Gabriela
  s('s.wb-u7.15-1', U7_15, 'Antes, David salía de fiesta por las noches, pero ahora ve la tele en casa.',
    'Vroeger ging David ’s avonds uit, maar nu kijkt hij thuis tv.', { answer: 'salía', hint: 'salir' }),
  s('s.wb-u7.15-2', U7_15, 'Antes, David comía en restaurantes, pero ahora cocina en casa para la familia.',
    'Vroeger at David in restaurants, maar nu kookt hij thuis voor het gezin.', { answer: 'comía', hint: 'comer' }),
  s('s.wb-u7.15-3', U7_15, 'Antes, David vivía en un apartamento en el centro de la ciudad, pero ahora vive en una casa en las afueras.',
    'Vroeger woonde David in een appartement in het centrum, maar nu woont hij in een huis in de rand van de stad.', { answer: 'vivía', hint: 'vivir' }),
  s('s.wb-u7.15-4', U7_15, 'Antes, David se acostaba a las 3 de la mañana, pero ahora se acuesta temprano.',
    'Vroeger ging David om 3 uur ’s nachts slapen, maar nu gaat hij vroeg naar bed.', { answer: 'se acostaba', hint: 'acostarse' }),
  s('s.wb-u7.15-5', U7_15, 'Antes, David dormía hasta las 10 de la mañana, pero ahora se levanta a las 6 para preparar el desayuno.',
    'Vroeger sliep David tot 10 uur, maar nu staat hij om 6 uur op om het ontbijt te maken.', { answer: 'dormía', hint: 'dormir' }),
  s('s.wb-u7.15-6', U7_15, 'Antes, David conducía un coche deportivo, pero ahora conduce un coche familiar.',
    'Vroeger reed David met een sportwagen, maar nu met een gezinswagen.', { answer: 'conducía', hint: 'conducir' }),
  s('s.wb-u7.15-7', U7_15, 'Antes, David visitaba cada verano un país diferente, pero ahora visita a la familia de su mujer en Guatemala.',
    'Vroeger bezocht David elke zomer een ander land, maar nu bezoekt hij de familie van zijn vrouw in Guatemala.', { answer: 'visitaba', hint: 'visitar' }),
  s('s.wb-u7.15-8', U7_15, 'Antes, David tenía muchas novias, pero ahora sabe que Gabriela es la mujer de su vida.',
    'Vroeger had David veel vriendinnen, maar nu weet hij dat Gabriela de vrouw van zijn leven is.', { answer: 'tenía', hint: 'tener' }),

  // 16 · Welk woord hoort er niet bij?
  ...[
    ['1', ['mano', 'nariz', 'ojo', 'boca'], 'mano', 'De hand hoort niet bij het gezicht (neus, oog, mond).'],
    ['2', ['fiebre', 'barriga', 'tos', 'gripe'], 'barriga', 'De buik is een lichaamsdeel, geen ziekte of symptoom.'],
    ['3', ['crema', 'yodo', 'diente', 'gota'], 'diente', 'Een tand is geen middel uit de apotheek.'],
    ['4', ['zumo de limón', 'aspirina', 'infusión', 'leche con miel'], 'aspirina', 'Aspirine is een geneesmiddel, de rest zijn huismiddeltjes.'],
    ['5', ['hacer ejercicio', 'fumar', 'comer fruta', 'pasear'], 'fumar', 'Roken is niet gezond.'],
    ['6', ['acupuntura', 'masaje', 'jarabe', 'reflexoterapia'], 'jarabe', 'Siroop is een geneesmiddel, geen behandeling of therapie.'],
  ].map(([n, options, answer, nl]) => q(`q.wb-u7.16-${n}`, U7_16, '¿Qué palabra no forma parte del grupo?', options, answer, nl)),

  // 17 · Elisa vertelt over haar jeugd
  s('s.wb-u7.17-1', U7_17, 'Mis padres estaban separados.', 'Mijn ouders waren gescheiden.', { answer: 'estaban', hint: 'estar' }),
  s('s.wb-u7.17-2', U7_17, 'Mi madre era italiana y vivía en Milán porque trabajaba como diseñadora de moda.',
    'Mijn moeder was Italiaanse en woonde in Milaan omdat ze als modeontwerpster werkte.', { answer: 'era', hint: 'ser' }),
  s('s.wb-u7.17-3', U7_17, 'Mi madre era italiana y vivía en Milán porque trabajaba como diseñadora de moda.',
    'Mijn moeder was Italiaanse en woonde in Milaan omdat ze als modeontwerpster werkte.', { answer: 'vivía', hint: 'vivir' }),
  s('s.wb-u7.17-4', U7_17, 'Mi madre era italiana y vivía en Milán porque trabajaba como diseñadora de moda.',
    'Mijn moeder was Italiaanse en woonde in Milaan omdat ze als modeontwerpster werkte.', { answer: 'trabajaba', hint: 'trabajar' }),
  s('s.wb-u7.17-5', U7_17, 'Mi hermano y yo vivíamos con mi padre en Bolzano, donde él tenía un pequeño hotel.',
    'Mijn broer en ik woonden bij mijn vader in Bolzano, waar hij een klein hotel had.', { answer: 'vivíamos', hint: 'vivir' }),
  s('s.wb-u7.17-6', U7_17, 'Mi hermano y yo vivíamos con mi padre en Bolzano, donde él tenía un pequeño hotel.',
    'Mijn broer en ik woonden bij mijn vader in Bolzano, waar hij een klein hotel had.', { answer: 'tenía', hint: 'tener' }),
  s('s.wb-u7.17-7', U7_17, 'En la escuela se hablaba italiano en clase, pero todos los días había una hora de alemán.',
    'Op school sprak men Italiaans in de klas, maar elke dag was er een uur Duits.', { answer: 'hablaba', hint: 'hablar' }),
  s('s.wb-u7.17-8', U7_17, 'En la escuela se hablaba italiano en clase, pero todos los días había una hora de alemán.',
    'Op school sprak men Italiaans in de klas, maar elke dag was er een uur Duits.', { answer: 'había', hint: 'haber (hay)' }),
  s('s.wb-u7.17-9', U7_17, 'Mi hermano y yo éramos muy deportistas, nos encantaba esquiar.',
    'Mijn broer en ik waren heel sportief, we skieden dolgraag.', { answer: 'éramos', hint: 'ser' }),
  s('s.wb-u7.17-10', U7_17, 'Mi hermano y yo éramos muy deportistas, nos encantaba esquiar.',
    'Mijn broer en ik waren heel sportief, we skieden dolgraag.', { answer: 'encantaba', hint: 'encantar' }),
  s('s.wb-u7.17-11', U7_17, 'Todos los días, después de la escuela, íbamos al entrenamiento y el fin de semana participábamos en competiciones.',
    'Elke dag gingen we na school naar de training en in het weekend namen we deel aan wedstrijden.', { answer: 'íbamos', hint: 'ir' }),
  s('s.wb-u7.17-12', U7_17, 'Todos los días, después de la escuela, íbamos al entrenamiento y el fin de semana participábamos en competiciones.',
    'Elke dag gingen we na school naar de training en in het weekend namen we deel aan wedstrijden.', { answer: 'participábamos', hint: 'participar' }),
  s('s.wb-u7.17-13', U7_17, 'Después del deporte y de los deberes nos acostábamos a las nueve o nueve y media de la noche.',
    'Na het sporten en het huiswerk gingen we om negen of half tien slapen.', { answer: 'nos acostábamos', hint: 'acostarse' }),
  s('s.wb-u7.17-14', U7_17, 'En las vacaciones mi hermano y yo íbamos a visitar a nuestra madre y pasábamos el verano con ella en Milán.',
    'In de vakantie gingen mijn broer en ik op bezoek bij onze moeder en brachten we de zomer met haar door in Milaan.', { answer: 'íbamos', hint: 'ir' }),
  s('s.wb-u7.17-15', U7_17, 'En las vacaciones mi hermano y yo íbamos a visitar a nuestra madre y pasábamos el verano con ella en Milán.',
    'In de vakantie gingen mijn broer en ik op bezoek bij onze moeder en brachten we de zomer met haar door in Milaan.', { answer: 'pasábamos', hint: 'pasar' }),

  // 18 · La movida madrileña
  s('s.wb-u7.18-1', U7_17, 'En esa época, Madrid no solo era la capital de España, era la capital del cambio.',
    'In die tijd was Madrid niet alleen de hoofdstad van Spanje, het was de hoofdstad van de verandering.', { answer: 'era', hint: 'ser' }),
  s('s.wb-u7.18-2', U7_17, 'La gente joven ya no se identificaba con el estilo de vida de sus padres.',
    'De jongeren identificeerden zich niet meer met de levensstijl van hun ouders.', { answer: 'se identificaba', hint: 'identificarse' }),
  s('s.wb-u7.18-3', U7_17, 'Los jóvenes buscaban otros caminos y luchaban por ser diferentes y romper con el pasado.',
    'De jongeren zochten andere wegen en streden om anders te zijn en met het verleden te breken.', { answer: 'buscaban', hint: 'buscar' }),
  s('s.wb-u7.18-4', U7_17, 'Los jóvenes buscaban otros caminos y luchaban por ser diferentes y romper con el pasado.',
    'De jongeren zochten andere wegen en streden om anders te zijn en met het verleden te breken.', { answer: 'luchaban', hint: 'luchar' }),
  s('s.wb-u7.18-5', U7_17, 'La gente joven salía por las noches, bailaba hasta el amanecer y escuchaba un nuevo tipo de música.',
    'De jongeren gingen ’s nachts uit, dansten tot zonsopgang en luisterden naar een nieuw soort muziek.', { answer: 'salía', hint: 'salir' }),
  s('s.wb-u7.18-6', U7_17, 'La gente joven salía por las noches, bailaba hasta el amanecer y escuchaba un nuevo tipo de música.',
    'De jongeren gingen ’s nachts uit, dansten tot zonsopgang en luisterden naar een nieuw soort muziek.', { answer: 'bailaba', hint: 'bailar' }),
  s('s.wb-u7.18-7', U7_17, 'La gente joven salía por las noches, bailaba hasta el amanecer y escuchaba un nuevo tipo de música.',
    'De jongeren gingen ’s nachts uit, dansten tot zonsopgang en luisterden naar een nieuw soort muziek.', { answer: 'escuchaba', hint: 'escuchar' }),
  s('s.wb-u7.18-8', U7_17, 'Las chicas llevaban ropa como Madonna y en las discotecas los jóvenes se movían como Michael Jackson.',
    'De meisjes droegen kleren zoals Madonna en in de disco’s bewogen de jongeren als Michael Jackson.', { answer: 'llevaban', hint: 'llevar' }),
  s('s.wb-u7.18-9', U7_17, 'Las chicas llevaban ropa como Madonna y en las discotecas los jóvenes se movían como Michael Jackson.',
    'De meisjes droegen kleren zoals Madonna en in de disco’s bewogen de jongeren als Michael Jackson.', { answer: 'se movían', hint: 'moverse' }),
  s('s.wb-u7.18-10', U7_17, 'España se presentaba a Europa con una nueva imagen más moderna e intentaba borrar la imagen negativa de la dictadura.',
    'Spanje presenteerde zich aan Europa met een nieuw, moderner imago en probeerde het negatieve beeld van de dictatuur uit te wissen.', { answer: 'se presentaba', hint: 'presentarse' }),
  s('s.wb-u7.18-11', U7_17, 'España se presentaba a Europa con una nueva imagen más moderna e intentaba borrar la imagen negativa de la dictadura.',
    'Spanje presenteerde zich aan Europa met een nieuw, moderner imago en probeerde het negatieve beeld van de dictatuur uit te wissen.', { answer: 'intentaba', hint: 'intentar' }),

  // 19 · Het juiste woord
  q('q.wb-u7.19-1', U7_19, 'Antes siempre iba ___ taxi a todos los lugares.', ['en', 'con', 'a'], 'en',
    'Vroeger ging ik overal met de taxi heen. (ir en taxi)'),
  q('q.wb-u7.19-2', { theme: 'gr-voorwerp', src: P[142], grammarRef: 'gr.meewerkend-voorwerp' }, 'Después del paseo ___ duelen las piernas, no puedo caminar más.',
    ['me', 'a mí', 'mi'], 'me', 'Na de wandeling doen mijn benen pijn, ik kan niet meer stappen.'),
  q('q.wb-u7.19-3', { ...U7_19, grammarRef: 'gr.muy-mucho' }, 'Últimamente mi marido tiene dolores de espalda ___ fuertes.', ['muy', 'mucho', 'muchos'], 'muy',
    'De laatste tijd heeft mijn man heel erge rugpijn. (muy + bijvoeglijk naamwoord)'),
  q('q.wb-u7.19-4', U7_19, '___ los 17 años viajé por primera vez a Inglaterra.', ['A', 'Con', 'En'], 'A',
    'Op mijn 17e reisde ik voor het eerst naar Engeland. (a los … años)'),
  q('q.wb-u7.19-5', U7_19, 'El balneario se encuentra en la provincia ___ Pontevedra.', ['de', 'en', 'a'], 'de',
    'Het kuuroord ligt in de provincie Pontevedra.'),
  q('q.wb-u7.19-6', { theme: 'gr-voorwerp', src: P[142], grammarRef: 'gr.meewerkend-voorwerp' }, 'Después del deporte un masaje ___ puede ayudar a relajarse.',
    ['le', 'se', 'lo'], 'le', 'Na het sporten kan een massage hem helpen ontspannen.'),
  q('q.wb-u7.19-7', { ...U7_19, grammarRef: 'gr.imperfecto' }, 'Cuando ___ 16 años empecé a fumar.', ['tenía', 'había', 'era'], 'tenía',
    'Toen ik 16 was, begon ik te roken. (leeftijd: tener … años)'),
  q('q.wb-u7.19-8', U7_19, 'Las curas ___ balneario eran muy variadas.', ['en el', 'al', 'a'], 'en el',
    'De kuren in het kuuroord waren heel gevarieerd.'),

  // 22 · Las Fallas de Valencia (lezen)
  ...[
    ['1', 'Las Fallas de Valencia son una fiesta…', ['nacional', 'de la ciudad'], 'de la ciudad', 'Het is het feest van de stad Valencia.'],
    ['2', 'Se celebran…', ['al final del invierno', 'al principio del verano'], 'al final del invierno', 'Van 15 tot 19 maart: op het einde van de winter, om de lente te vieren.'],
    ['3', 'El elemento principal de esta fiesta es…', ['el fuego', 'el agua'], 'el fuego', 'Vuur: de beelden worden verbrand en er is veel vuurwerk.'],
    ['4', 'La fiesta dura…', ['casi una semana', 'algo más de una semana'], 'casi una semana', 'Het feest duurt vijf dagen.'],
    ['5', 'Se trata de una fiesta muy…', ['ruidosa', 'religiosa'], 'ruidosa', 'Het is heel lawaaierig door de muziek en het knalvuurwerk.'],
    ['6', 'Las fallas son esculturas…', ['de madera', 'de cartón'], 'de cartón', 'De fallas zijn enorme beelden van karton.'],
    ['7', 'En la noche de San José, las fallas…', ['se llevan al museo', 'se queman'], 'se queman', 'Ze worden verbrand; alleen één winnende figuur gaat naar het museum.'],
    ['8', 'Cuando la fiesta termina, los valencianos…', ['ya piensan en las próximas Fallas', 'se van de vacaciones'], 'ya piensan en las próximas Fallas', 'Ze denken meteen aan het feest van volgend jaar.'],
  ].map(([n, qq, options, answer, nl]) => r(`r.wb-u7.fallas.${n}`, U7_22, qq, options, answer, nl)),

  // 23b · Uitspraak en spelling
  ...[
    ['1', 'cha_eta', ['chaqueta', 'chaceta', 'chaketa'], 'chaqueta', 'de jas — [ke] schrijf je qu'],
    ['2', '_itarra', ['guitarra', 'gitarra', 'jitarra'], 'guitarra', 'de gitaar — [gi] schrijf je gui'],
    ['3', 'traba_ó', ['trabajó', 'trabagó', 'trabacó'], 'trabajó', 'hij werkte — [xo] schrijf je jo'],
    ['4', '_apato', ['zapato', 'capato', 'sapato'], 'zapato', 'de schoen — [θa] schrijf je za'],
    ['5', 'venta_a', ['ventaja', 'ventaga', 'ventacha'], 'ventaja', 'het voordeel — [xa] schrijf je ja'],
    ['6', 'lle_é', ['llegué', 'llegé', 'llejé'], 'llegué', 'ik kwam aan — [ge] schrijf je gue'],
    ['7', 'co_ina', ['cocina', 'cozina', 'coquina'], 'cocina', 'de keuken — [θi] schrijf je ci'],
    ['8', 'ti_eras', ['tijeras', 'tigeras', 'tizeras'], 'tijeras', 'de schaar'],
    ['9', '_uarenta', ['cuarenta', 'quarenta', 'kuarenta'], 'cuarenta', 'veertig — [ku] schrijf je cu'],
    ['10', 'empe_é', ['empecé', 'empezé', 'empequé'], 'empecé', 'ik begon — [θe] schrijf je ce (ze bestaat niet)'],
    ['11', 'a_encia', ['agencia', 'ajencia', 'aguencia'], 'agencia', 'het agentschap'],
    ['12', 'practi_é', ['practiqué', 'practicé', 'practiké'], 'practiqué', 'ik oefende — [ke] schrijf je que'],
    ['13', '_entral', ['central', 'zentral', 'quentral'], 'central', 'centraal — [θe] schrijf je ce'],
  ].map(([n, gap, options, answer, nl]) => q(`q.wb-u7.23-${n}`, U7_23, `Hoe schrijf je dit woord? ${gap}`, options, answer, nl)),

  // Ya sé · Autoevaluación
  {
    id: 'g.wb-u7.mente', kind: 'grammar', theme: 'bijwoord', src: P[144], grammarRef: 'gr.mente',
    rule: 'Maak een bijwoord op -mente van het bijvoeglijk naamwoord.',
    examples: [
      { es: 'lento → ___', answer: 'lentamente', nl: 'traag' },
      { es: 'fácil → ___', answer: 'fácilmente', nl: 'gemakkelijk' },
      { es: 'agradable → ___', answer: 'agradablemente', nl: 'aangenaam' },
      { es: 'cómodo → ___', answer: 'cómodamente', nl: 'comfortabel' },
      { es: 'científico → ___', answer: 'científicamente', nl: 'wetenschappelijk' },
      { es: 'rápido → ___', answer: 'rápidamente', nl: 'snel' },
      { es: 'tranquilo → ___', answer: 'tranquilamente', nl: 'rustig' },
    ],
  },
  {
    id: 'g.wb-u7.imperfecto-vormen', kind: 'grammar', theme: 'verleden-tijden', src: P[144], grammarRef: 'gr.imperfecto',
    rule: 'Geef de imperfecto-vorm voor de gegeven persoon.',
    examples: [
      { es: 'hablar (tú) → ___', answer: 'hablabas', nl: 'jij sprak' },
      { es: 'comer (tú) → ___', answer: 'comías', nl: 'jij at' },
      { es: 'ser (yo) → ___', answer: 'era', nl: 'ik was' },
      { es: 'ver (tú) → ___', answer: 'veías', nl: 'jij zag' },
      { es: 'ir (usted) → ___', answer: 'iba', nl: 'u ging' },
    ],
  },
];

export default {
  atoms: [...unit5, ...unit6, ...unit7],
  texts: {
    't.wb-u5.oferta': {
      title: 'Oferta de trabajo',
      es: 'La Escuela Internacional de Idiomas necesita un profesor o una profesora de inglés para su nueva academia en Málaga. '
        + 'Buscan personas con formación universitaria, con un año de experiencia como mínimo como profesor/a de inglés y con buenos conocimientos del español. '
        + 'La escuela ofrece un contrato de cinco años, un buen clima de trabajo y un buen sueldo. '
        + 'Los interesados pueden enviar su currículum a la escuela «El sol», en Madrid.',
      nl: 'Een taalschool zoekt een leraar Engels voor haar nieuwe vestiging in Málaga.',
      src: P[123],
    },
    't.wb-u5.navidad': {
      title: 'La Navidad en México y España',
      es: 'En México se celebran las Posadas del 16 al 24 de diciembre. Amigos, familiares o vecinos van de casa en casa, cantan canciones tradicionales y piden «posada»; '
        + 'los anfitriones los invitan a comer, una muestra de la hospitalidad mexicana. La tradición recuerda el viaje de José y María a Belén, '
        + 'pero coincide con una antigua fiesta azteca en honor al sol: es una mezcla de lo cristiano y lo prehispánico. '
        + 'En España los niños esperan a los Reyes Magos. El 5 de enero hay una cabalgata por la ciudad, con camellos de verdad, y los Reyes regalan caramelos; '
        + 'algunos niños les dan cartas con los regalos que desean. Por la noche dejan sus zapatos en la puerta, comida para los Reyes y agua para los camellos. '
        + 'En la noche del 5 al 6 de enero los Reyes traen los regalos.',
      nl: 'Eigen samenvatting van de tekst over de posadas (Mexico) en de Drie Koningen (Spanje).',
      src: 'spanish-md/IMG_20260918_201953739.md',
    },
    't.wb-u6.carnaval': {
      title: 'El carnaval de Oruro y de Cádiz',
      es: 'Oruro, en Bolivia, es una ciudad de unos 340 000 habitantes, pero en carnaval llegan a ser casi un millón de personas. '
        + 'La UNESCO declaró su carnaval Patrimonio de la Humanidad. La fiesta mezcla creencias prehispánicas y cristianas y en su origen simboliza los peligros del trabajo en las minas. '
        + 'El baile más famoso es la Diablada: más de 400 bailarines vestidos de rojo y con máscaras representan la lucha del bien y del mal. '
        + 'En Cádiz, en Andalucía, el carnaval es famoso por su ambiente y su música. Grupos como los coros y las chirigotas escriben canciones y compiten en concursos. '
        + 'Todos se disfrazan, salen a la calle y en los bares se come pescaíto frito. La gente de Cádiz se llama gaditana.',
      nl: 'Eigen samenvatting van de tekst over het carnaval in Oruro (Bolivia) en Cádiz (Spanje).',
      src: 'spanish-md/IMG_20260918_202058516.md',
    },
    't.wb-u7.fallas': {
      title: 'Las Fallas de Valencia',
      es: 'Del 15 al 19 de marzo, al final del invierno, la ciudad de Valencia celebra la llegada de la primavera con una fiesta llena de color, fuego y ruido. '
        + 'Las fallas son esculturas enormes de cartón; cada barrio de la ciudad prepara la suya durante todo el año. '
        + 'La fiesta dura cinco días y es muy ruidosa por la música y los petardos. '
        + 'En la noche de San José se queman las fallas; solo una figura ganadora se guarda en el Museo de las Fallas. '
        + 'Y cuando termina la fiesta, los valencianos ya empiezan a pensar en las Fallas del año siguiente.',
      nl: 'Eigen samenvatting van de tekst over de Fallas in Valencia.',
      src: 'spanish-md/IMG_20260918_202210120.md',
    },
  },
};
