# ¡Vamos! — Spaans oefenen

Een oefenapp voor de cursus *Sí, claro nuevo 1.2*. Kies wat je wil oefenen, krijg korte
lessen met wisselende oefenvormen, en woorden die je fout hebt komen vaker terug.

Statische site: gewoon HTML, CSS en JavaScript. Geen framework, geen build, geen
npm-afhankelijkheden.

## Wat er in zit

**9459 oefenfeiten**, gedolven uit de cursusbladzijden en de bundel van de lesgever:

| soort | aantal | wordt |
|---|---|---|
| woordenschat ES↔NL | 1141 | meerkeuze, intypen, lidwoord, accenten, koppelen, hoort-niet-bij, welk-is-onregelmatig, luisteren, bijvoeglijk naamwoord laten overeenkomen |
| vervoegingen | 6204 (8 tijden; de meeste berekend) | vervoegingstabel, losse vorm kiezen of intypen, welke tijd?, wie doet het? |
| zinnen (werkboek, bundel, dialogen uit de cursus) | 758 | invuloefening, zin bouwen, dictee |
| grammaticaregels | 74 | invuloefening, meerkeuze |
| toets- en werkboekvragen | 604 | meerkeuze (toets unidad 1, instaptoets, Miradores, werkboek) |
| leesvragen bij 58 teksten | 204 | lezen |
| dialoogregels (20 eigen dialogen) | 207 | wat zeggen ze?, wat volgt er?, zet in volgorde, dictee |
| klemtoon | 132 | tik de beklemtoonde lettergreep |

Bij een fout antwoord verschijnt een korte grammatica-uitleg (33 onderwerpen, met
verwijzing naar de grammatica achteraan het boek).

Verdeeld over 144 thema's in 13 groepen, op onderwerp in plaats van per unidad.

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
npm test                       # alle drie hieronder
node tools/test-check.mjs      # antwoordcontrole
node tools/test-scheduler.mjs  # Leitner-planning en koppelronde
node tools/validate.mjs        # controleert data/course.js
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
