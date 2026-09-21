# Design brief — ¡Vamos!, a Spanish practice app

> Hand this document to a designer as-is. It assumes no prior knowledge of the project.
> A working, unstyled-on-purpose prototype exists; this brief describes what it should
> *become*, not what it currently looks like.

## 1. What this is

A practice app for one specific Spanish course — *Sí, claro nuevo 1.2* — used by
Dutch-speaking adult learners in an evening class. Think Duolingo, but scoped to one
textbook and built for people who already own the book and want to drill it.

**The user**: an adult, Dutch-speaking, beginner-to-A2 Spanish. Practising on a **phone**,
in short bursts — on the couch, on the train, ten minutes before class. Not a child, not
a gamer. Motivated but easily discouraged.

**The feeling to aim for**: warm, encouraging, a bit playful. Spanish sunlight rather
than corporate ed-tech. It should never feel like a test. Getting something wrong should
feel like a nudge, not a buzzer.

**Core loop**: pick topics → 12 questions → see how you did → go again.

## 2. Non-negotiable constraints

These come from how the app is built. Designs that violate them cannot be implemented.

| Constraint | Consequence for design |
|---|---|
| **Phone portrait is the primary target** | Design at 375×812 first. Everything reachable one-handed. Desktop is a widened version, not a different design. |
| **The on-screen keyboard covers the bottom ~45% of the screen** | The primary action button must stay visible and tappable while typing. It currently sits in a sticky bottom bar. |
| **No frameworks, no build step, no external assets** | No web fonts from a CDN, no icon libraries, no images. System fonts and emoji only. Inline SVG is fine if you supply it. |
| **Emoji is the illustration layer** | Vocabulary items carry an emoji (👔 for *la corbata*). Many items have none — the layout must not break or look empty without one. |
| **Colour alone may never signal correctness** | Right/wrong must also differ by icon (✓/✗) and shape/border. Roughly 8% of men have colour-vision deficiency. |
| **Dark mode is required** | Both themes must be specified. The app follows the OS setting. |
| **Reduced motion is required** | Specify a static fallback for every animation. |

## 3. Design tokens to define

Supply concrete values for light **and** dark:

- **Colours**: page background, surface, secondary surface, border/line, primary text,
  secondary text, brand, brand-on-text, success, success-background, error,
  error-background.
- **Type scale**: instruction, prompt word (large, the hero of the screen), body, meta/hint,
  button label. System font stack — specify weights and sizes, not families.
- **Spacing scale**, **corner radii**, **shadow/elevation** (the current build uses a flat
  "pressable" 2–4px bottom shadow that compresses on tap — keep or replace deliberately).
- **Minimum tap target**: 52px currently. Do not go below 44px.

## 4. Screens

### 4.1 Start / topic picker — the home screen

**Purpose**: choose what to practise and see progress at a glance.

Regions, top to bottom:

1. **Top bar**: app name "¡Vamos!" on the left. On the right: 🔥 streak count,
   ⭐ XP total, ⚙️ settings button.
2. **Lede**: "Kies wat je wil oefenen."
3. **The tree** — the bulk of the screen. Eight *unidades*, each containing 1–8 *themes*:
   - **Unit row**: checkbox, a numbered circular badge (1–8), unit title
     (e.g. "Caminando"), and a meta line ("8 onderdelen"). Selecting a unit selects all
     its themes. Needs a visible **indeterminate** state when only some children are
     selected.
   - **Theme row** (indented): checkbox, emoji, theme name ("De accessoires"), meta line
     ("15 woorden"), a **mastery bar** (thin, 0–100%), and a **▶ instant-start button**
     that begins a lesson on that theme alone, ignoring the checkboxes.
   - Consider making units collapsible — there are ~40 theme rows in total, which is a
     long scroll on a phone. This is an open design question.
4. **Sticky bottom bar**: a selection summary ("3 onderdelen · 47 oefeningen"), then two
   buttons side by side — "Woorden koppelen" (secondary) and "¡Vamos!" (primary).
   Both disabled when nothing is selected; the match button also needs ≥5 vocabulary items.

### 4.2 Lesson — the question screen

1. **Top bar**: ✕ quit button, a **progress bar** filling left-to-right, and a counter
   ("4/12").
2. **Question area** — varies by exercise type, see §5.
3. **Sticky bottom bar**: the primary button, labelled "Controleer" → then "Volgende" →
   "Afronden" on the last question. Disabled until an answer is entered.

### 4.3 Answer feedback — *the most important state in the app*

After checking, the feedback panel appears **above** the button inside the bottom bar, and
the whole bar tints green or red. The button relabels to "Volgende" and takes focus.

The panel contains, in order:

- Icon (✓ or ✗) + heading. Correct headings rotate through Spanish praise:
  "¡Muy bien!", "¡Perfecto!", "¡Olé!", "¡Genial!". Incorrect is a calm Dutch
  "Niet juist" — never scolding.
- **The correct answer** (only when wrong).
- **A correction note** (optional). This appears when the answer was *accepted but
  imperfect* — the app forgives a missing accent or a single typo but still teaches the
  right spelling: "Bijna! Let op de accenten: canción" or "Typfoutje! Juist is: la corbata".
  This is a **third state — accepted-with-a-note** — and it should read as encouraging, not
  as a partial failure. Design it distinctly from plain-correct.
- **An explanation** (optional): "la pajarita = de vlinderdas".
- **A source reference** in small print: which course page this came from.
- **A ⚠️ report button**, top-right of the panel, for flagging a wrong exercise.

### 4.4 Match-pairs round — a separate activity

Two columns of five cells: Spanish on the left, Dutch on the right, each column shuffled
independently. Tap one cell on each side to attempt a pair.

- **Correct**: both cells flash green and disappear; **a new pair slides into the freed
  row** from a pool. The round continues until 40 words are matched.
- **Wrong**: both cells shake red, then clear after ~0.5s.
- Top bar shows progress toward the 40-word goal.
- Design the replace-on-match transition carefully — it is the signature moment of this
  screen. Cells must not reflow jarringly when one is replaced.
- Cells hold 1–4 words ("las zapatillas de deporte"). Specify text wrapping and a minimum
  cell height; the two columns must stay aligned row-for-row.

### 4.5 Results

Centred: a big badge emoji (🏆 perfect / 🎉 good / 💪 keep going), a Spanish headline,
a score line ("9 van 12 juist"), then three stat tiles — **Goed**, **Punten**, **Op rij**.

Below, a "Nog even bekijken" list of missed items, each row showing the Spanish and the
correct Dutch. Bottom bar: "Terug" (secondary) and "Nog een les" (primary).

### 4.6 Settings

Simple labelled toggle rows: **Geluid**, **Spaanse uitspraak** (with a sub-line warning
when the device has no Spanish voice installed), **Minder beweging**. Then a progress
summary, a "Gemelde fouten kopiëren" button, and a destructive "Alle voortgang wissen".

## 5. Exercise types — layout and interaction

There are eleven. All share the pattern: **instruction line → prompt → input area**.

| Type | Prompt | Input | Notes |
|---|---|---|---|
| **Multiple choice** | Emoji + word in a bordered card | 4 stacked full-width option buttons | Options are single words or short phrases |
| **Type the answer** | Emoji + word | Text field + a row of accent keys (á é í ó ú ñ ¿ ¡) | Accent row only when typing Spanish. Must sit above the keyboard |
| **Fill the gap** | A sentence with a `___` inline | Either an inline text field *inside* the sentence, or 3 option buttons | Sentence wraps to 2–3 lines; the gap must stay visually obvious when wrapped |
| **Word bank** | Dutch sentence | An empty "answer" tray (dashed) above a bank of shuffled word tiles | Tap to move a tile up, tap again to send it back. 3–9 tiles |
| **Match pairs** | — | See §4.4 | Its own screen |
| **Conjugation grid** | Verb + tense | **Six labelled text fields** (yo, tú, él/ella/usted, nosotros, vosotros, ellos) | The hardest layout. Person labels are long; on 375px a label+field row is tight. Enter jumps to the next field. Each field is graded separately, with the correct form shown beside any wrong one |
| **Article picker** | `___ mochila` + Dutch hint | 4 compact buttons: el / la / los / las | Small and fast — a palate cleanser |
| **Accent restoration** | Word shown stripped of accents | Pre-filled text field + accent keys | Checked strictly — accents are the point here |
| **Odd one out** | Instruction only | 4 option buttons, each emoji + Spanish word | |
| **Listen & type** | A large 🔊 play button | Text field + accent keys | Hidden entirely on devices without a Spanish voice |
| **Listen & choose** | A large 🔊 play button | 4 option buttons | Same |

### Component states to specify

For **option buttons**: default, focus, selected (chosen, not yet checked), correct,
incorrect, disabled-after-answer. Note that after checking, the *correct* option is
highlighted even if the user picked a different one.

For **text fields**: default, focus, correct, incorrect, disabled.

For **word tiles**: in-bank, placed-in-answer, used/greyed, disabled.

For **match cells**: default, selected, correct (brief, before removal), wrong (brief).

Also: progress bar, mastery bar, streak badge, XP counter, checkbox (incl. indeterminate),
toast, stat tile, mistake row.

## 6. Motion

| Moment | Current behaviour | Duration |
|---|---|---|
| Correct answer | Feedback panel slides up | 200ms |
| Wrong match pair | Horizontal shake | 400ms |
| Correct match pair | Scale pop, then the row is replaced | 300ms + 320ms |
| Results badge | Scale pop on entry | 400ms |
| Progress bar | Width transition | 300ms |
| Button press | 2px downward nudge, shadow compresses | 60ms |

With reduced motion, all of these become instant state changes. Specify whether anything
should be replaced by a cross-fade rather than simply removed.

## 7. Copy (Dutch UI, Spanish flavour)

| Where | String |
|---|---|
| App name | ¡Vamos! |
| Start lede | Kies wat je wil oefenen. |
| Nothing selected | Niets geselecteerd |
| Selection summary | `{n} onderdelen · {m} oefeningen` |
| Start button | ¡Vamos! |
| Match button | Woorden koppelen |
| Check button | Controleer |
| Next button | Volgende |
| Last question | Afronden |
| Correct headings | ¡Muy bien! · ¡Perfecto! · ¡Olé! · ¡Genial! |
| Incorrect heading | Niet juist |
| Correct answer line | `Juist antwoord: {answer}` |
| Accent nudge | `Bijna! Let op de accenten: {answer}` |
| Typo nudge | `Typfoutje! Juist is: {answer}` |
| Results (perfect) | ¡Perfecto! |
| Results (good) | ¡Muy bien! |
| Results (poor) | ¡Sigue así! |
| Score line | `{n} van {m} juist` |
| Stat tiles | Goed · Punten · Op rij |
| Mistakes heading | Nog even bekijken |
| Result buttons | Terug · Nog een les |
| Settings | Geluid · Spaanse uitspraak · Minder beweging |
| Reset | Alle voortgang wissen |
| Reset confirm | Alle voortgang, punten en streaks wissen? |
| Report toast | Genoteerd — je kan dit later nakijken via Instellingen. |

Spanish text in questions must always be typographically correct: `¿` `¡` `á é í ó ú` `ñ`.
Do not let a chosen font mangle these.

## 8. Responsive

Phone portrait is the design. On ≥680px the app centres in a ~620px column, multiple-choice
options go to two columns, and the prompt word grows. Nothing else changes. There is no
tablet or desktop-specific layout.

## 9. What would help most

Ranked, if effort is limited:

1. **The feedback moment** (§4.3) — most emotionally load-bearing part of the app.
2. **The question screen frame** — top bar, prompt card, bottom action bar.
3. **The topic picker tree** — dense, and the one screen users see every single session.
4. **Match-pairs** — the most distinctive interaction.
5. **The conjugation grid on a narrow screen** — the genuinely hard layout problem.
