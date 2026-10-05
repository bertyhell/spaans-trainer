/* Tests voor de Leitner-planning en de koppelronde.
 * Draait zonder browser: localStorage wordt nagebootst.
 *   node tools/test-scheduler.mjs  */

/* --- minimale localStorage-stand-in, moet vóór de imports bestaan --- */
const store = new Map();
globalThis.localStorage = {
  getItem: k => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: k => store.delete(k),
  clear: () => store.clear(),
};

const scheduler = await import('../js/scheduler.js');
const storage = await import('../js/storage.js');
const { MatchRound } = await import('../js/matchRound.js');
const { Session } = await import('../js/session.js');

let failed = 0;
const rows = [];
function t(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failed++;
  rows.push([ok, label, actual, expected]);
}
function ok(label, cond, detail = '') {
  if (!cond) failed++;
  rows.push([cond, label, detail, '']);
}

const reset = () => { storage.resetAll(); };

/* ---------------- dozen ---------------- */
reset();
t('nieuw item start in doos 1', storage.getProgress('x').box, 1);
t('juist → doos omhoog', scheduler.record('x', true).box, 2);
t('nog eens juist', scheduler.record('x', true).box, 3);
t('fout vanuit doos 3 → doos 1', scheduler.record('x', false).box, 1);

reset();
for (let i = 0; i < 6; i++) scheduler.record('w', true);
t('fout vanuit doos 5 → doos 3', scheduler.record('w', false).box, 3);

reset();
for (let i = 0; i < 10; i++) scheduler.record('y', true);
t('doos loopt niet boven het maximum', storage.getProgress('y').box, scheduler.MAX_BOX);
t('tellers kloppen', storage.getProgress('y').seen, 10);

reset();
scheduler.record('z', false);
scheduler.record('z', false);
t('fouten worden geteld', storage.getProgress('z').wrong, 2);

/* ---------------- gewichten ---------------- */
t('doos 1 weegt het zwaarst', scheduler.weightForBox(1), 1);
t('doos 5 weegt het lichtst', scheduler.weightForBox(5), 0.2);
ok('zwakkere dozen wegen zwaarder',
  scheduler.weightForBox(1) > scheduler.weightForBox(3) &&
  scheduler.weightForBox(3) > scheduler.weightForBox(5));

/* ---------------- tijd ---------------- */
{
  const now = Date.now();
  const DAY = 24 * 3600 * 1000;
  t('net gezien weegt weinig', scheduler.dueFactor({ box: 3, lastSeen: now }, now), 0.1);
  t('rusttijd om → factor 1', scheduler.dueFactor({ box: 3, lastSeen: now - 3 * DAY }, now), 1);
  t('lang niet gezien → factor 3', scheduler.dueFactor({ box: 2, lastSeen: now - 30 * DAY }, now), 3);
  ok('hogere doos mag langer rusten',
    scheduler.dueFactor({ box: 2, lastSeen: now - DAY }, now) > scheduler.dueFactor({ box: 5, lastSeen: now - DAY }, now));

  // Twee items in dezelfde doos: het oude komt veel vaker in de les.
  reset();
  const pair = [{ atomId: 'old', direction: null, key: 'old' }, { atomId: 'new', direction: null, key: 'new' }];
  storage.setProgress('old', { box: 3, seen: 2, wrong: 0, lastSeen: now - 10 * DAY });
  storage.setProgress('new', { box: 3, seen: 2, wrong: 0, lastSeen: now });
  let olds = 0;
  for (let i = 0; i < 300; i++) if (scheduler.drawLesson(pair, 1, now)[0].key === 'old') olds++;
  ok(`lang niet geziene item gaat voor (${olds}/300)`, olds > 250);
}

/* ---------------- vormkeuze per doos ---------------- */
{
  const { weightFor } = await import('../js/types/index.js');
  ok('doos 1: meerkeuze zwaarder dan intypen relatief',
    weightFor('multipleChoice', 1) / weightFor('typeAnswer', 1) > weightFor('multipleChoice', 5) / weightFor('typeAnswer', 5));
  ok('doos 5: intypen weegt dubbel', weightFor('typeAnswer', 5) === 2 * weightFor('typeAnswer', 3));
}

/* ---------------- trekking ---------------- */
reset();
const items = Array.from({ length: 50 }, (_, i) => ({ atomId: `a${i}`, direction: null, key: `a${i}` }));
// Alles één keer gezien, zodat niets als "nieuw" geldt.
for (const it of items) scheduler.record(it.key, true);           // iedereen doos 2
for (let i = 0; i < 10; i++) scheduler.record(`a${i}`, false);     // eerste tien terug naar doos 1
for (let i = 40; i < 50; i++) { for (let n = 0; n < 5; n++) scheduler.record(`a${i}`, true); } // laatste tien naar doos 5

const lesson = scheduler.drawLesson(items, 12);
t('les heeft de gevraagde lengte', lesson.length, 12);
t('geen enkel item twee keer', new Set(lesson.map(l => l.key)).size, 12);

let weak = 0, strong = 0;
for (let run = 0; run < 400; run++) {
  for (const it of scheduler.drawLesson(items, 12)) {
    const n = Number(it.key.slice(1));
    if (n < 10) weak++;
    else if (n >= 40) strong++;
  }
}
ok(`zwakke items komen vaker terug (doos 1: ${weak}, doos 5: ${strong})`,
  weak > strong * 1.8, `verhouding ${(weak / strong).toFixed(2)}×`);

/* ---------------- kleine selecties ---------------- */
reset();
const few = [{ atomId: 'p', direction: null, key: 'p' }, { atomId: 'q', direction: null, key: 'q' }];
const short = scheduler.drawLesson(few, 12);
t('te kleine selectie krimpt i.p.v. te herhalen', short.length, 2);
t('lege selectie geeft lege les', scheduler.drawLesson([], 12).length, 0);

/* ---------------- nieuw vs herhaling ---------------- */
reset();
const mixed = Array.from({ length: 40 }, (_, i) => ({ atomId: `m${i}`, direction: null, key: `m${i}` }));
for (let i = 0; i < 20; i++) scheduler.record(`m${i}`, true);   // eerste 20 gezien
const mix = scheduler.drawLesson(mixed, 12);
const fresh = mix.filter(x => Number(x.key.slice(1)) >= 20).length;
ok(`nieuwe items begrensd (${fresh} van 12 nieuw)`, fresh <= 6, `${fresh} nieuw`);
ok('er zit ook herhaling in', mix.length - fresh > 0);

/* ---------------- beheersing ---------------- */
reset();
t('onbekend thema is 0% beheerst', scheduler.mastery(['n1', 'n2']), 0);
scheduler.record('n1', true); scheduler.record('n1', true); scheduler.record('n1', true); scheduler.record('n1', true);
t('doos 5 telt als volledig beheerst', scheduler.mastery(['n1']), 1);
t('lege lijst geeft 0', scheduler.mastery([]), 0);

/* ---------------- koppelronde ---------------- */
reset();
const atoms = Array.from({ length: 30 }, (_, i) => ({
  id: `v${i}`, kind: 'vocab', theme: 'x', es: `es${i}`, nl: [`nl${i}`],
}));
const round = new MatchRound({ atoms, target: 10, visible: 5 });
t('vijf rijen zichtbaar', round.active.length, 5);
t('doel begrensd door de voorraad', round.target, 10);

const firstId = round.active[0].id;
const otherId = round.active[1].id;
t('foute koppeling afgewezen', round.tryMatch(firstId, otherId).ok, false);
t('misser telt mee', round.wrongAttempts, 1);
const good = round.tryMatch(firstId, firstId);
t('juiste koppeling aanvaard', good.ok, true);
t('na één paar schuift er nog niets in', good.left.length + good.right.length, 0);
t('een misser houdt het woord in doos 1', storage.getProgress(scheduler.itemKey(firstId, 'es2nl')).box, 1);

// Een foutloos gekoppeld woord klimt wel, en na twee paren schuiven er twee in.
const clean = round.active.find(a => a.id !== firstId && !round.missedOnce.has(a.id)).id;
const second = round.tryMatch(clean, clean);
t('foutloos gekoppeld woord klimt', storage.getProgress(scheduler.itemKey(clean, 'es2nl')).box, 2);
t('na twee paren schuiven er twee nieuwe in',
  [second.left.filter(s => s.cell).length, second.right.filter(s => s.cell).length], [2, 2]);
t('nog steeds vijf rijen', round.active.length, 5);
t('afronden telt één keer', [round.finish().done, round.finish().done, storage.get().exercisesDone], [2, 2, 2]);

const r2 = new MatchRound({ atoms, target: 3, visible: 5 });
while (!r2.finished) { const id = r2.active[0].id; r2.tryMatch(id, id); }
t('ronde stopt bij het doel', r2.matched, 3);
ok('ronde meldt zichzelf als klaar', r2.finished);

const small = new MatchRound({ atoms: atoms.slice(0, 3), target: 40, visible: 5 });
t('kleine voorraad verlaagt het doel', small.target, 3);
t('kleine voorraad verlaagt de rijen', small.active.length, 3);

/* ---------------- les: tabel met meerdere atomen ---------------- */
reset();
{
  // Session zonder constructor: die heeft de cursusdata nodig om te trekken.
  const s = Object.create(Session.prototype);
  Object.assign(s, { index: 0, results: [], recentTypes: [],
    queue: [{ atomId: 'c.1s', key: 'c.1s', direction: null, atom: { id: 'c.1s' } }] });
  s.submit({ id: 'conjugationGrid' }, {
    correct: false, expected: '…',
    perAtom: [
      { atomId: 'c.1s', correct: true, expected: 'tuve', given: 'tuve' },
      { atomId: 'c.3s', correct: false, expected: 'tuvo', given: 'tuve' },
    ],
  });
  t('getrokken persoon in de tabel krijgt zijn doos', storage.getProgress('c.1s').box, 2);
  t('foute persoon valt terug', storage.getProgress('c.3s').seen, 1);
  t('fout staat bij de foute persoon', Object.keys(storage.get().mistakes), ['c.3s']);
}

/* ---------------- les: herkansing ---------------- */
reset();
{
  const s = Object.create(Session.prototype);
  const mk = id => ({ atomId: id, key: id, direction: null, atom: { id } });
  Object.assign(s, { index: 0, results: [], recentTypes: [], questions: 5,
    queue: ['q0', 'q1', 'q2', 'q3', 'q4'].map(mk) });
  s.submit({ id: 'choice' }, { correct: false, expected: 'x' });
  t('fout item komt drie vragen later terug', s.queue.map(q => q.key), ['q0', 'q1', 'q2', 'q3', 'q0', 'q4']);
  t('fout zakt de doos niet onder 1', storage.getProgress('q0').box, 1);
  s.next(); s.submit({ id: 'choice' }, { correct: true, expected: 'x' });
  s.next(); s.next(); s.next();
  t('herkansing staat op de plaats', s.current.retryOf != null, true);
  const boxBefore = storage.getProgress('q0').box;
  s.submit({ id: 'multipleChoice' }, { correct: true, expected: 'x' });
  t('herkansing verschuift geen doos', storage.getProgress('q0').box, boxBefore);
  t('herkansing telt niet in de score', s.scored.length, 2);
  t('herkansing wordt bij de fout genoteerd', s.results[0].retryCorrect, true);
  t('geen tweede herkansing', s.queue.filter(q => q.key === 'q0').length, 2);
}

/* ---------------- reservekopie ---------------- */
reset();
{
  scheduler.record('b1', true); scheduler.record('b1', true);
  storage.get().settings.sound = false;
  storage.report('r1');
  const backup = storage.exportState();
  storage.resetAll();
  t('wissen houdt instellingen', storage.get().settings.sound, false);
  t('wissen houdt meldingen', storage.get().reports, ['r1']);
  t('wissen wist dozen', storage.getProgress('b1').seen, 0);
  scheduler.record('b2', true);
  const n = storage.importState(backup);
  t('kopie zet dozen terug', storage.getProgress('b1').box, 3);
  t('kopie laat nieuwere voortgang staan', storage.getProgress('b2').seen, 1);
  t('aantal ingelezen items', n, 1);
  let threw = false;
  try { storage.importState('{"foo":1}'); } catch { threw = true; }
  t('vreemd bestand geweigerd', threw, true);
}

/* ---------------- streak ---------------- */
reset();
const s1 = storage.touchStreak();
t('eerste dag geeft streak 1', s1.current, 1);
t('twee keer op één dag telt één keer', storage.touchStreak().current, 1);
t('huidige streak leesbaar', storage.currentStreak(), 1);

/* ---------------- rapport ---------------- */
const width = Math.max(...rows.map(r => r[1].length));
for (const [good2, label, a, e] of rows) {
  const head = `${good2 ? '  ok  ' : ' FAIL '} ${label.padEnd(width)}`;
  console.log(good2 ? head : `${head}  kreeg ${JSON.stringify(a)}, verwacht ${JSON.stringify(e)}`);
}
console.log(`\n${rows.length - failed}/${rows.length} geslaagd`);
process.exit(failed ? 1 : 0);
