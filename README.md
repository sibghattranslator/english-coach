# English Coach

A free website to learn English speaking and grammar (Wren & Martin topics) and prepare for competitive exams (CSS, PMS, PCS, FPSC, PPSC). No account, no API key, no cost.

## Features
- **Speak and get corrected:** use the microphone (Chrome/Edge) or type. Built-in rules catch common Urdu/Pashto-speaker mistakes ("I am agree", "he said me", "discuss about"), and the free LanguageTool service checks the rest. Shows a before/after view, the rule, and lets you hear and repeat the correct sentence.
- **20 grammar topics** with rules, examples, and quizzes (sentence, parts of speech, nouns, articles, pronouns, adjectives, verbs and modals, 12 tenses, agreement, voice, narration, infinitives and gerunds, adverbs, prepositions, conjunctions, clauses and conditionals, transformation, punctuation, synthesis, confused words and spelling).
- **Vocabulary:** 85 words, 40 idioms, 50 one-word substitutions, 22 phrasal verbs, pronunciation list, 35 common mistakes. Flashcards and quizzes.
- **Exam prep:** timed 20-question MCQ test, precis, essay, comprehension, letters and interview guides, 25 essay topics, useful phrases.
- **Progress:** streak, quiz scores, mistake log, mock-test history, download and restore your progress.

## New: Translation practice and CSS subjects
- **Translate:** 55 sentence pairs. *Urdu to English:* you see and hear an Urdu sentence and say it in English; grammar is corrected at once and wrong sentences return until you get all 10 right. *English to Urdu:* you hear an English sentence and say it in Urdu; your answer is compared with the model.
- **Subjects:** International Relations, Gender Studies, European History and Criminology (CSS optional), plus Pakistan Affairs, Islamiat and General Science (CSS compulsory). Each has notes you can listen to, MCQs, and oral questions where your English is corrected and the key points you missed are shown.
- Urdu voice needs an Urdu text-to-speech voice on your device (usually present on Android Chrome). Urdu answer checking is approximate (word overlap), so always read the model answer.

See **GUIDE.md** for how the files fit together and how to change things.

## Use it on your computer
Best: double-click **START.bat** (needs Python). It opens the app at http://localhost:8000/ where the browser asks for the microphone ONLY ONCE (choose "Allow while visiting the site"). Keep the black window open while studying.
Opening `index.html` directly also works, but Chrome then asks for the microphone every time.

## Put it online (GitHub Pages, free)
1. Create a free account at github.com and click **New repository**. Name it `english-coach`, set it **Public**, click **Create**.
2. Click **uploading an existing file**, drag in everything from this folder (index.html, css, js, README.md), then **Commit changes**.
3. Go to **Settings > Pages**. Under Branch choose `main` and `/ (root)`, click **Save**.
4. After about 1 minute your site is live at `https://YOUR-USERNAME.github.io/english-coach/`. Open it on your phone too.

The microphone works best on the https link above.

## Add your own content
All lessons and word lists are plain files in the `js` folder:
`data-grammar.js` (lessons and quizzes), `data-vocab.js` (words, idioms, mistakes), `data-exam.js` (topics and guides). Add a line in the same format and refresh.

## Notes
- Automatic correction is helpful but not perfect. Check important rules in the Wren & Martin book.
- Speech recognition may auto-correct some words; typing your sentence shows your real mistakes.
- Progress is saved only in your browser. Use "Download my progress" to keep a backup.
- Grammar checking uses https://languagetool.org (free tier). Only the sentence you check is sent.
