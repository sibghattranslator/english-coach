# How this repo works (for future changes)

It is a plain website. No server, no database, no build step. The browser reads the files and runs them. GitHub Pages only hosts the files.

## Folder map
```
english-coach/
  index.html            The page shell: menu bar + empty <main>. Loads all scripts.
  css/style.css         All colours and layout.
  js/
    data-grammar.js     CONTENT: 20 grammar lessons + quizzes
    data-vocab.js       CONTENT: words, idioms, one-word, phrasal verbs, pronunciation, common mistakes
    data-exam.js        CONTENT: speaking topics, essay topics, precis/essay/interview guides, phrases
    data-translate.js   CONTENT: Urdu/English sentence pairs
    data-subjects.js    CONTENT: CSS subjects (notes, MCQs, oral questions)
    data-interview.js   CONTENT: spoken interview scripts (questions + follow-up rules)
    app.js              CODE: menu/router, Grammar, Speak, Vocabulary, Exam, Progress, grammar checker rules
    extra.js            CODE: Translate drill and Subjects pages
  README.md             Short intro
  GUIDE.md              This file
```
Rule of thumb: **to change what is taught, edit a `data-*.js` file. To change how the app behaves, edit `app.js` or `extra.js`.**

## How a page loads
1. `index.html` loads the `data-*.js` files first (they create global lists such as `GRAMMAR`, `VOCAB`, `PAIRS`, `SUBJECTS`).
2. Then `app.js` and `extra.js` run. The address ending (`#grammar`, `#translate/u2e`, `#subjects/ir/quiz`) decides which function draws the page. That is the "router" at the top of `app.js` (`const routes = {...}`).
3. Your progress (quiz scores, known words, mistake log, streak) is saved in the browser's localStorage under the key `english_coach_v1`. It never leaves your device.

## Common changes

**Add a vocabulary word** (`data-vocab.js`, list `VOCAB`): add a line
`["word","meaning","اردو معنی","example sentence"],`

**Add an idiom / one-word / phrasal verb**: same file, lists `IDIOMS`, `ONEWORD`, `PHRASAL`; copy a neighbouring line.

**Add a common mistake** (`COMMON_ERRORS`): `["wrong sentence","correct sentence","why"],`

**Add a translation sentence** (`data-translate.js`, list `PAIRS`):
`["اردو جملہ","English answer|another accepted English answer"],`
Use `|` to accept more than one correct English version. Write the English in full form (do not, not don't) for best matching.

**Add a grammar quiz question** (`data-grammar.js`): inside a topic's `quiz:[ ... ]` add
`["Question?",["option A","option B","option C","option D"],1,"Why this is right."],`
The number is the position of the correct option, counting from 0 (A=0, B=1, C=2, D=3).

**Add a new grammar topic:** copy a whole `{id:"...",title:"...",rules:[...],quiz:[...]}` block, give it a new unique `id`.

**Add a CSS subject** (`data-subjects.js`): copy one block of `SUBJECTS` and change `id`, `name`, `group`, `notes`, `mcq`, `oral`. It appears automatically on the Subjects page. For `oral` questions, `keys` is a list of `["label shown","regex words"]`; a key point counts as covered if the answer contains any of the words in the regex (separated by `|`).

**Add an essay or speaking topic** (`data-exam.js`): add a string to `ESSAY_TOPICS` or to a list inside `SPEAK_TOPICS`.

**Teach the app a new common mistake correction** (`app.js`, array `RULES`): add a row
`[/\bwrong phrase\b/gi, () => "right phrase", "Short explanation"],`
This is what fixes things like "I am agree" instantly, without internet.

**Change colours:** top of `css/style.css` (`--teal`, `--navy`).

**Add a menu item or page:** add a link in `index.html` nav, add a function that fills `app.innerHTML`, and register it in `const routes` in `app.js`.

## Publishing a change
- Edit the file on GitHub (open the file, click the pencil icon, change, **Commit changes**). The site updates in about a minute. Press Ctrl+F5 (or clear the cache on the phone) to see it.
- Or edit on your computer, then upload the changed files again (same names) to the repo.

## If something breaks
- Open the site, press F12, look at the **Console** tab. A red message shows the file and line.
- The usual cause is a missing comma or quote in a data file. Each item ends with a comma, and text must be inside quotes. Do not put a double quote inside a double-quoted text; use a single quote.
- Keep a copy of the working zip before big changes.

## Things the app cannot do (by design, it is free and offline-first)
- It cannot understand meaning like an AI. It checks grammar with built-in rules plus the free LanguageTool service, and compares your sentence to the model answer by matching words.
- Urdu answer checking is approximate. Urdu voice needs an Urdu voice installed on the device.
- Progress is per browser. Use Progress > Download my progress to move it to another device.

## Microphone asks every time?
A page opened from a file (file://) is asked for the microphone each time. Use START.bat (localhost) or the GitHub Pages https link; both remember your choice after you click "Allow while visiting the site".

## Interviews (data-interview.js)
Each interview has `topics`. A topic has a main question `q` and `follow` rules: `["word1|word2","follow-up question"]`. If your answer contains one of the words, the interviewer asks that follow-up. Otherwise it asks a general follow-up from `INTERVIEW_GENERIC`. After two follow-ups it moves to the next topic. To add a new interview, copy a block (css / freelance / job) and change the name and questions; it appears in the Interview menu after you add it to the list in `buildSide` in `app.js`.
