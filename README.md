# ¡Vamos! — Spaans oefenen

Een oefenapp voor de cursus *Sí, claro nuevo 1.2*. Kies wat je wil oefenen, krijg korte
lessen met wisselende oefenvormen, en woorden die je fout hebt komen vaker terug.

Statische site: gewoon HTML, CSS en JavaScript. Geen framework, geen build, geen
npm-afhankelijkheden.

## Wat er in zit

**10305 oefenfeiten**, gedolven uit de cursusbladzijden en de bundel van de lesgever, plus een
kleine aanvulling met A1-basiswoorden (`tools/content/a1-basics.mjs`) en berekende getallen
(`tools/content/numerals.mjs`):

| soort | aantal | wordt |
|---|---|---|
| woordenschat ES↔NL | 1201 | meerkeuze, intypen, lidwoord, accenten, koppelen, hoort-niet-bij, welk-is-onregelmatig, luisteren, bijvoeglijk naamwoord laten overeenkomen, letterpuzzel, welk plaatje?, klopt het?, meervoud, woord in een zin, wat betekent het woord hier?, welk is welk?, welk woord hoor je?, zeg het |
| vervoegingen | 6918 (8 tijden, wederkerende werkwoorden in 5; de meeste berekend) | vervoegingstabel, losse vorm kiezen of intypen, welke tijd?, wie doet het?, klopt het?, zet om naar een andere tijd, antwoord op de vraag, welke tijd past bij de tijdsaanduiding?, welke vorm hoor je?, wat betekent de vorm? (Nederlandse vertaling uit `js/dutch.js`) |
| zinnen (werkboek, bundel, dialogen uit de cursus) | 819 | invuloefening, zin bouwen, dictee, zoek de fout, wat betekent de zin?, welke zin klopt?, zeg het na |
| grammaticaregels | 74 | invuloefening, meerkeuze |
| toets- en werkboekvragen | 604 | meerkeuze (toets unidad 1, instaptoets, Miradores, werkboek) |
| leesvragen bij 58 teksten | 204 | lezen |
| dialoogregels (20 eigen dialogen) | 207 | wat zeggen ze?, zet in volgorde (eerste regel gegeven), dictee, zoek de fout |
| klemtoon | 132 | tik de beklemtoonde lettergreep |
| getallen, uur, datum, prijs | 11 soorten, elke vraag een ander voorbeeld | schrijf voluit, luister en schrijf in cijfers, lees en kies |

Bij een fout antwoord verschijnt een korte grammatica-uitleg (35 onderwerpen, met
verwijzing naar de grammatica achteraan het boek), en een 💡-tip: een ezelsbruggetje voor dat
woord (ruim 400, in `tools/memos.mjs`: verwante woorden, herkomst, valse vrienden) of een
vuistregel die `js/hints.js` uit het woord afleidt — woorden op -ción en -dad zijn vrouwelijk,
op -ma vaak mannelijk, -dor is een toestel, bij een laarswerkwoord vallen nosotros en
vosotros buiten de laars.

Verdeeld over 156 thema's in 13 groepen, op onderwerp in plaats van per unidad.

De werkwoorden staan in twee groepen: *betekenis* (per activiteit) en *vervoegen*, met per
tijd — presente, gerundio, indefinido, futuro, imperfecto, perfecto, estar + gerundio,
condicional en subjuntivo — een thema voor
regelmatig op -ar, -er en -ir, klankveranderend (enkel presente) en onregelmatig. Omdat de
cursus vooral onregelmatige rijtjes geeft, vult `tools/conjugate.mjs` de regelmatige
werkwoorden uit de woordenschat aan; die atomen hebben `generated: true`.

## Starten

```bash
node tools/serve.mjs          # http://localhost:8080
node tools/serve.mjs 3000     # andere poort
```

De server toont ook het adres van je laptop op het netwerk, zodat je de app meteen op je
telefoon kan openen.

## Testen

```bash
npm test                         # alles hieronder
node tools/test-check.mjs        # antwoordcontrole
node tools/test-scheduler.mjs    # Leitner-planning en koppelronde
node tools/test-phonetic.mjs     # klankschrift en stem-fonemen
node tools/test-speakscore.mjs   # oordeel in de spreekmodus
node tools/validate.mjs          # controleert data/course.js
```

De uitspraak van de stem zelf controleer je apart (zie *Spreekmodus*):

```bash
npm i --no-save onnxruntime-node     # eenmalig, enkel voor deze controle
node tools/check-voice.mjs --asr small
```

## Oefendata maken

De oefeningen worden gedolven uit de cursusmarkdown (`course-md/` en `spanish-md/` in de
map hiernaast — die blijven lokaal, zie *Auteursrecht*).

```bash
# 1. agenten schrijven fragmenten out_*.json naar een tijdelijke map
# 2. samenvoegen tot data/course.js
node tools/merge.mjs /pad/naar/fragmenten
# 3. indelen op betekenis en vervoegingen aanvullen
node tools/regroup.mjs
# 4. controleren
node tools/validate.mjs
```

`data/course.js` staat met één atoom per regel (`tools/course-format.mjs`): bijna zo klein
als geminimaliseerde JSON, maar een gewijzigd woord blijft in git één regel.

`merge.mjs` ontdubbelt woorden die in beide corpora voorkomen, bouwt de themaboom op en
voegt te kleine thema's samen (meerkeuze heeft minstens vier woorden per thema nodig om
afleiders te kunnen kiezen).

De fragmenten van die eerste mijnronde bestaan niet meer. Nieuwe inhoud komt daarom als
gewone modules in `tools/content/` (formaat in `tools/content/index.mjs`), en
`regroup.mjs` voegt die bij elke run opnieuw in:

```bash
node tools/content/index.mjs      # controleert de modules
node tools/regroup.mjs            # schrijft data/course.js opnieuw
```

## Hoe het werkt

**Atomen, geen kant-en-klare vragen.** `data/course.js` bevat feiten — een woordpaar, een
vervoegde vorm, een grammaticaregel — en niet uitgeschreven oefeningen. Elke oefenvorm
zegt zelf via `supports()` of ze een bepaald atoom aankan, en de vraag wordt pas bij het
tonen samengesteld. Eén woordpaar levert zo meerkeuze, intypen, luisteren, lidwoord,
koppelen en "hoort niet bij" op, zonder de inhoud zes keer op te slaan.

**Leitner-dozen.** Elk oefenitem zit in doos 1 tot 5. Juist → een doos hoger, fout → twee
dozen lager (minstens doos 1). De trekkans is `1/doosnummer`, dus doos 1 komt vijf keer zo
vaak langs als doos 5. Daarbovenop telt de tijd sinds je het item zag: elke doos heeft een
rusttijd (5 minuten, 1, 3, 7 en 21 dagen); wat net nog langskwam weegt tot tien keer minder,
wat al lang wacht tot drie keer meer. Geen vervaldatums: sla je drie dagen over, dan is er
geen achterstand — er is gewoon altijd werk.

**Herkansing.** Een fout antwoord komt drie vragen later nog eens terug, liefst in een andere
oefenvorm. Die herkansing verschuift geen doos en telt niet in de score, maar het overzicht
toont "later juist".

**Eerst herkennen, dan maken.** In doos 1–2 krijgen meerkeuzevormen voorrang, in doos 4–5
de vormen waarin je zelf typt.

**Eerst kennismaken.** Een woord dat je nog nooit zag, krijgt eerst een kaart: het woord,
de uitspraak, de vertaling, een ezelsbrug en een zin uit de cursus waarin het staat. De
eerste vraag erover komt twee vragen later (`withIntros` in `js/session.js`), zodat ze toetst
of het bleef hangen en niet of je het net nog zag. Een kaart telt niet als vraag.

**Een hint in plaats van opgeven.** Bij het intypen geeft 💡 eerst de eerste letter en de
lengte (`c _ _ _ _ _ _`), dan om de andere letter. Juist met een hint telt niet als fout, maar
het item schuift ook niet naar een hogere doos (`record(key, correct, { hold: true })`).

**Verwarde woorden.** Een fout antwoord dat zelf een ander woord uit de cursus is
(*la boca* voor *la bota*), of een fout paar in de koppelronde, wordt een verward paar.
Komt een van beide terug, dan vraagt "welk is welk?" naar precies dat verschil en toont
daarna beide woorden naast elkaar. Twee keer na elkaar juist en het paar verdwijnt.

**Lastiger afleiders naarmate je het kent.** Vanaf doos 3 zet meerkeuze er woorden bij die
op het juiste lijken (*caro* / *carro*) of waarmee je het eerder verwarde. Dan volstaat
het niet meer om het onderwerp te herkennen.

**Woorden in zinnen.** `data.contextsFor` zoekt elk woord in de zinnen, dialogen,
grammaticavoorbeelden en leesteksten van de cursus. Woorden die ook een vervoeging of een
ander woord zijn (*como*, *vino*) en namen midden in een zin (*Granada*) vallen weg.

**Gemengde herhaling.** "Herhaal alles door elkaar" trekt uit alles wat je al eens zag, over
de thema's heen. Door elkaar oefenen blijft beter hangen dan thema per thema.

**Tikken in een leestekst.** Elk gekend woord in een leestekst is aantikbaar: de woordenlijst,
een vervoegde vorm (*fuimos* → ir/ser, nosotros, indefinido), een meervoud, een voltooid
deelwoord of een klein woordje (`js/gloss.js`).

**Spreken (optioneel).** Met spraakherkenning van de browser zeg je woorden en zinnen
hardop. Chrome stuurt het geluid naar een herkenningsdienst, dus dit staat standaard uit
(*Instellingen → Spreekoefeningen*). Wie even niet kan praten, slaat de vraag over zonder
fout; de les vraagt dan niets meer hardop.

**Twee richtingen apart.** `nl→es` en `es→nl` zijn losse items met een eigen doos. Een
woord herkennen is iets anders dan het kunnen produceren.

**Stabiele id's.** De voortgang in `localStorage` hangt aan de atoom-id, dus die id moet
een nieuwe generatie overleven. Hij is afgeleid van het Spaanse lemma alleen —
`v.la-corbata`, `c.tener.indefinido.1s` — en bewust *niet* van het thema, want de indeling
in thema's is het eerste wat verschuift als de data opnieuw gedolven wordt. Een woord naar
een ander thema verplaatsen laat de voortgang dus intact; enkel het Spaanse woord zelf
corrigeren maakt een nieuw item. `validate.mjs` meldt wat er alsnog verweesd raakt.

**Vergevingsgezinde controle.** Hoofdletters, spaties en lidwoorden maken niet uit. Een
ontbrekend accent of één typefout wordt aanvaard, maar toont wel de juiste schrijfwijze
("Bijna! Let op de accenten: canción"). Twee uitzonderingen: bij de accentoefening is de
controle streng, en bij vervoegingen telt een andere persoon (`tuvo` voor `tuve`) nooit als
typefout — dat is een vergissing, geen slordigheid.

## Spreekmodus

*🎙️ Spreekmodus* op het startscherm: de app zegt een zin of woord, jij zegt het na. Met een
selectie oefen je de zinnen en woorden van die onderdelen, zonder selectie alle zinnen en
dialoogregels (tot veertien woorden). Nazeggen heeft een eigen doos per zin (`<id>:say`),
los van het woord kennen, en een mislukte uitspraak komt niet in de foutenlijst van de lessen.

Alles draait **op het toestel**: geen geluid gaat naar een server, en na één download werkt
het offline. Twee kleine modellen, samen ± 93 MB (één keer, in de Cache API):

| | model | grootte |
|---|---|---|
| stem | [Piper](https://github.com/OHF-Voice/piper1-gpl) *sharvard* (es_ES, medium, mannelijke spreker), gewichten als float16 | 39 MB, in `models/` |
| gehoor | [Whisper](https://huggingface.co/onnx-community/whisper-tiny) tiny, meertalig, 8-bit | 42 MB, van Hugging Face |
| runtime | [ONNX Runtime Web](https://onnxruntime.ai) 1.23 (WebAssembly, één draad) | 12 MB (2 MB gecomprimeerd), van jsDelivr |

Zodra de stem op het toestel staat, spreekt ze ook alle andere oefeningen uit in plaats van
de stem van de browser (uit te zetten in *Instellingen → Spreekmodus*).

Waarom *sharvard*: de iets kleinere stem *davefx* (32 MB) maakt korte losse woorden
onverstaanbaar — *mal*, *más*, *sol*, *ayer* verstaat zelfs Whisper large-v3 niet. Op 100
woorden uit de cursus: davefx 80 juist, sharvard 99; op 50 zinnen allebei 49. De stem is
getraind op [Sharvard](https://datashare.ed.ac.uk/handle/10283/574) (Aubanel, García Lecumberri
& Cooke, 2014), CC BY 3.0 — zie `models/MODEL_CARD-sharvard.md`.

**Klankschrift.** Elke zin en elk woord staat er met IPA onder, woord per woord
(`js/phonetic.js`, ook op de kennismakingskaart en de flashcards): Castiliaans, met
lettergrepen en klemtoon, en de klanken zoals ze in hun omgeving klinken — de zachte
[β ð ɣ] tussen klinkers, de n die [m] of [ŋ] wordt. Getallen, afkortingen, Romeinse cijfers,
leenwoorden en buitenlandse namen worden eerst uitgeschreven zoals een Spanjaard ze zegt
(*footing* → [ˈfu.tin], *siglo XVII*, *750 €*).

**De stem krijgt dezelfde klanken.** Piper is getraind op de fonemen van espeak-ng. In
plaats van espeak mee te leveren, maakt `phonetic.js` die fonemen zelf, uit dezelfde analyse
als de klankschrift. Over alle 9 075 Spaanse teksten van de cursus is dat woord voor woord
gelijk aan espeak-ng 1.52 (99,98 %); de enige verschillen zijn plaatsen waar espeak zich
vergist (*pingüino* als pin-gu-i-no, *Wright*). Wat je leest is dus wat je hoort.

**Vergevingsgezind luisteren.** Een klein model verstaat een leerder vaak half. Daarom
oordeelt de app niet op de herkende tekst alleen (`js/speakScore.js`):

- wat Whisper hoorde, wordt op klank vergeleken, niet op spelling: b/v/β, s/θ/z, ll/y,
  r/ɾ … tellen als gelijk, en "a ver" voor "haber" is gewoon juist;
- Whisper krijgt ook de verwachte zin voorgelegd en zegt per woord hoe waarschijnlijk
  die is bij jouw geluid, en bij stilte. Het verschil is het *bewijs* dat het geluid dat
  woord steunt — los van hoe gewoon het woord is.

Een woord is goed (groen), bijna (oranje) of niet gehoord (rood). De zin is juist als
minstens 80 % (gewogen naar lettergrepen) goed is en er geen inhoudswoord ontbreekt; bijna
vanaf 60 % met hoogstens één gemist woord, of als elk woord minstens bijna is. Drie pogingen,
de beste telt; je hoort je eigen poging terug met *▶ Jouw poging*.

Geijkt op nagemaakte leerders, 60 zinnen en 60 woorden per toestand: de stem zelf, de andere
spreker, een andere stem (davefx), en de stem met een zwaar Nederlands accent (r als [ʁ], geen
[θ], harde b/d/g, open klinkers, trager). Juist / bijna / fout:

| toestand | zinnen | woorden |
|---|---|---|
| zoals het voorbeeld | 60 / 0 / 0 | 60 / 0 / 0 |
| andere spreker | 60 / 0 / 0 | 60 / 0 / 0 |
| andere stem | 60 / 0 / 0 | 53 / 6 / 1 |
| zwaar accent | 59 / 1 / 0 | 60 / 0 / 0 |
| iets anders gezegd | 0 / 0 / 60 | 1 / 2 / 57 |

Een zin waarin één woord vervangen is, krijgt meestal *bijna* (45 van 60), met dat woord in
het rood; wie maar de helft zegt, meestal *fout* (53 van 60). Het zwakke punt zijn zinnen van
twee woorden: één toevallig "gehoord" woord is daar al twee derde van de zin. Dat geeft
hoogstens *bijna*, nooit *juist*.

**Controle van de uitspraak.** `tools/check-voice.mjs` laat de stem elke tekst van de
spreekmodus zeggen en Whisper meeluisteren: de app moet haar eigen voorbeeld goedkeuren, en
wat een groter model (`--asr small`) niet verstaat, is na te kijken in `phonetic.js`.

## Een oefenvorm toevoegen

Maak een module in `js/types/` die dit contract volgt, en zet ze in `js/types/index.js`:

```js
export default {
  id: 'mijnVorm',
  label: 'Mijn vorm',
  supports(item, env) { return item.atom.kind === 'vocab'; },
  render(item, root, ctx) {
    // teken in root; ctx.ready(bool) zet de knop aan, ctx.submit() bevestigt
    return {
      focus() {},
      check() { return { correct: true, expected: '…', note: null, given: '…' }; },
      reveal(result) {},
    };
  },
};
```

`ctx.skip({ noSpeaking })` slaat de vraag over zonder iets te bewaren. `check()` mag ook
`hinted: true` teruggeven (juist met een hint: de doos blijft staan) en
`confusionWith: '<atoom-id>'` (een "welk is welk?"-vraag over dat paar). Een typvorm krijgt
een hint met `hintLadder(antwoord)` uit `js/hintLadder.js`.

De lesmotor kent geen enkele oefenvorm van binnen, dus verder hoeft er niets te wijzigen.
Een vorm die meerdere atomen tegelijk beoordeelt (zoals de vervoegingstabel) geeft daarnaast
`covers(item)` en een `perAtom`-lijst terug.

## Bestanden

```
index.html            alle schermen als secties
css/style.css         mobiel eerst, donkere modus, beperkte beweging
js/main.js            schermbeheer en bedrading
js/session.js         de lesmotor
js/scheduler.js       Leitner-dozen en gewogen trekking
js/hints.js           ezelsbruggetjes en vuistregels onder een fout antwoord
js/hintLadder.js      hint bij het intypen (eerste letter, dan meer)
js/intro.js           kennismakingskaart voor een nieuw woord
js/gloss.js           betekenis van een aangetikt woord in een leestekst
js/numerals.js        getallen, uren, data en prijzen voluit en in cijfers
js/recognition.js     spraakherkenning van de browser voor de spreekoefeningen
js/phonetic.js        klankschrift (IPA) en de fonemen voor de stem
js/speakScore.js      het oordeel in de spreekmodus
js/voice/             stem (Piper) en gehoor (Whisper) op het toestel: worker, opname
models/               de stem van de spreekmodus (tools/make-voice.py)
js/check.js           antwoordcontrole, woordenlijstnotatie (frigo(rífico), sencillo/-a)
js/matchRound.js      de koppelronde
js/types/             de oefenvormen
data/course.js        gegenereerde oefendata
tools/                server, tests, validatie, samenvoegen
tools/content/        handmatig samengestelde inhoud: toetsen, werkboek, dialogen,
                      teksten, klemtoon, grammatica-uitleg
DESIGN-BRIEF.md       opdracht voor de vormgeving
```

## Publiceren

De app is een statische map: alles uploaden naar S3 of GitHub Pages volstaat.

`robots.txt` weert zoekmachines. Let op: een moeilijk te raden URL is **niet besloten** —
iedereen met de link kan de app openen. Dat is bewust zo gekozen voor een klasgroep die het
boek zelf heeft.

De voortgang staat in `localStorage`, per toestel. Wie de link doorgeeft, deelt geen
voortgang. Via *Instellingen → Reservekopie* bewaar je ze als bestand en zet je ze terug
(ook op een ander toestel; per item wint de kant die het vaakst geoefend is).

**Offline en updates.** De service worker serveert alles eerst uit de cache van de huidige
versie, zodat de app meteen start, ook zonder bereik. Na `npm run release` krijgt `sw.js` een
nieuwe cachenaam; telefoons halen de nieuwe versie op de achtergrond binnen en tonen dan
"Er is een nieuwe versie — Herladen". Op `localhost` en het thuisnetwerk geldt netwerk eerst,
zodat je je eigen wijzigingen meteen ziet.

## Auteursrecht

De cursusmarkdown en de foto's staan in `.gitignore` en horen niet online. Alleen de
afgeleide oefendata gaat mee in de repo.
