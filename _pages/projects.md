---
layout: single
title: "Personal projects"
permalink: /projects/
author_profile: true
toc: true
toc_label: "Projects"
---

Things I build in my own time, mostly for myself and my family. Each one is a complete product:
designed, built, tested and deployed end to end. For each I describe the architecture, the parts
that were hard, and how I solved them.

## Portfolio tracker

A self-hosted investment tracker for the household: several portfolios with sharing between
family members, live prices, dividends, RSU vesting, ILS/USD conversion, loans and credit balances,
before- and after-tax estimates, and history charts.

### Architecture

```
Browser (vanilla JS single-page app)
        │  HTTPS, session cookie
        ▼
Node.js 22 server: hand-written router, auth, REST routes
  ├─ finance engine: lots ledger, FX, tax, RSU vesting, loan amortization
  ├─ market data: prices, dividends and exchange rates, refreshed on demand
  ├─ import (CSV, broker exports) and export (Excel / CSV)
  └─ built-in node:sqlite database on an encrypted volume
        ▲
GitHub Actions ──► container on Fly.io (a small machine that stops when idle)
```

The whole app has **zero npm dependencies**: plain Node.js, its built-in SQLite module, and a
vanilla-JS front end with no build step. Deploying is one container and one command.

### Challenges and solutions

- **No third-party libraries.** I wrote the small pieces a framework would normally provide: a
  ~200-line router, a CSV parser and an Excel (.xlsx) writer. The payoff is an app with no
  dependency updates or supply-chain vulnerabilities to chase.
- **Getting the money right.** Holdings are a ledger of buy, sell and opening lots, so cost basis
  and gain/loss are always derived, never typed. RSUs follow their vesting schedule, with a tax
  estimate that splits the grant value (income tax) from later profit (capital gains). Loans are
  amortized from their terms and can be re-anchored to the bank's real balance on any date. The
  calculations are covered by automated tests.
- **Cheap hosting without background jobs.** The server machine sleeps when nobody is using it.
  Instead of timers, a page view triggers a refresh of prices, dividends and exchange rates when
  the data is older than an hour, and daily history snapshots can be triggered by an external
  scheduler.
- **Real financial data on the public internet.** Registration is closed by default, passwords
  are hashed with scrypt, logins lock out after repeated failures, and every request goes through
  strict security headers, same-site checks and an audit log. Exports are never cached and guard
  against spreadsheet formula injection. A pre-commit hook blocks databases, exports and keys from
  ever reaching git.
- **Showing it without showing my data.** A read-only demo account is rebuilt every day from
  invented holdings dated relative to today, so its 18 months of charts always look current.
- **Importing the family spreadsheet.** A converter reads the old Hebrew Google Sheet, infers each
  row's currency from the sheet's own arithmetic and normalizes Tel Aviv fund prices.

## Personal AI agent ("Blaze")

A personal assistant I talk to on WhatsApp and in a web dashboard. It understands text, images,
voice notes and documents, searches the web, keeps a long-term memory, and sends me reminders it
writes itself.

### Architecture

```
WhatsApp (linked device bridge)      Streamlit web UI (password protected)
              │                                   │
              └────────────────┬──────────────────┘
                               ▼
               LangGraph agent: model ⇄ tools loop
   tools: web search · weather · memory graph · reminders · documents · skills
                │                           │
                ▼                           ▼
    LLMs through OpenRouter          Markdown knowledge graph
    (cheap primary, fallback model)  in S3 (local files in development)

GitHub Actions: tests ─► ARM64 Docker image ─► one small AWS EC2 host
                         (staging and production containers)
```

### Challenges and solutions

- **Memory that stays clean.** Long-term memory is a graph of Markdown notes with links between
  subjects. Early on, updating a note duplicated its headers and old facts. Now the save tool
  strips structure and merges facts, and the instructions tell the model to update and dedupe
  rather than append, with a test that checks it.
- **Reliability on a budget.** The main model is a fast, low-cost one; if it fails or returns
  nothing, the agent retries and then falls back to a second model. Some vision models had no
  tool-calling support, which shaped the model choice.
- **Keeping costs visible.** Every model call logs its tokens and cost, and a report script sums
  them. The system prompt is arranged so that its long, stable part can be cached, keeping the
  running cost to a few cents a day.
- **WhatsApp as a front end.** The bridge only answers allowed contacts, in groups only when
  mentioned, stamps every message with my local time, transcribes voice notes and splits long
  documents so the agent can read them in parts.
- **Reminders the agent writes.** One-off and repeating reminders are stored next to the memory.
  A scheduler wakes the agent when one is due, so the message can include fresh context such as
  the weather or a link.
- **Untrusted content.** Text from documents and web pages is fenced and treated as data, never as
  instructions, to defend against prompt injection.
- **Safe deploys.** Each deploy runs the test suite, builds an image tagged with its exact commit
  and deploys to staging or production by branch. Prompts and skills are plain files that update
  without a redeploy. A disk-full incident taught me to pull the new image before stopping the old
  container.

## Math Wonderland

A math adventure game for kids that runs in a phone browser. It relies on pictures, numbers and
sound, so children who can't read yet can play. It covers counting through times tables, shapes
and puzzles across several themed worlds. [Source on GitHub](https://github.com/nimros01/math-wonderland).

### Architecture

```
Static site, no build step (ES modules + CSS)
  ├─ skills: one question generator per stage
  ├─ play: rounds, adaptive difficulty, demos, boss levels
  ├─ visuals and solutions: picture hints and step-by-step solvers
  ├─ audio: sound effects synthesized with Web Audio
  ├─ progress: players, stars, gems and pets in local storage
  └─ cloud: optional family sync over Firebase's REST API
Service worker ──► plays offline, installs to the home screen
```

### Challenges and solutions

- **Teaching before reading.** A short animated hand shows how to answer each new stage, hints turn
  numbers into ten-frames, blocks and arrays, and wrong answers open a picture-based solution
  that also explains the most common mistake behind that answer.
- **The right level for each child.** Questions get harder after three right answers in a row and
  easier after a miss, missed questions return at the end of the round, and a placement quest
  finds a new player's starting stage.
- **Endless fresh questions.** Every stage has a generator rather than a fixed question bank, and
  each question carries structured data that the solvers turn into explanations.
- **Motivation without manipulation.** Gems, stickers, a pet to grow and a room to decorate, with
  purchases that need a deliberate press-and-hold so young children can't spend by accident.
- **Sharing progress between devices without accounts.** Family sync uses a random 10-character
  family code and anonymous sign-in. Local saves are always the truth; sync merges players in the
  background and never blocks play. Database rules let a device open only a family whose code it
  knows, and nobody can list or delete families. It talks to Firebase through REST, with no SDK.

## Recall Ladder (memory game)

A memory training game for the whole family. Players climb a ladder of stages that get harder,
remembering objects, numbers, flipped tiles and the order of events, and learn real memory
techniques along the way.

### Architecture

```
One self-contained HTML file (vanilla JS, inline SVG charts)
  ├─ game and practice modes, four memory types, three levels
  ├─ training: memory techniques picked from the player's own results
  ├─ statistics: progress charts, CSV export and import
  └─ local storage first ──► optional account sync to Firestore
Service worker for offline play; served as static assets from Cloudflare
```

### Challenges and solutions

- **Coaching, not just testing.** The game looks at where a player struggles and suggests a
  technique for it: a story chain or a memory palace for objects, number shapes or chunking for
  digits, seeing a picture in a tile pattern. Short drills then measure whether it helped.
- **Statistics worth reading.** Every stage played is stored with its timings and settings. The
  statistics screen draws its own charts in SVG, adapts to per-day or per-session views, and can
  compare players.
- **Accounts without a backend.** Players can play with no account at all. Creating one with email
  and password uploads everything played on that device, and joins players with the same name.
  Nothing uploads until the email address is confirmed.
- **Data you can trust.** Database rules let each account read and write only its own data,
  validate every field of every stage record, and make records append-only, so history can never
  be rewritten or deleted from the client.

## Music Mood Mixer

Describe a mood, a moment or a memory in your own words, and get a real playlist created in your
Spotify or Tidal account. A language model picks the songs; the app finds them in the streaming
catalog and builds the playlist.

### Architecture

```
Browser (vanilla JS, 3 steps: connect ─► describe ─► playlist)
        │  same-origin /api calls
        ▼
FastAPI backend (one async worker, in Docker), which also serves the front end
  ├─ auth: Spotify OAuth redirect flow · Tidal device login, polled until done
  ├─ Gemini: mood text ─► strict JSON list of {artist, title}
  ├─ catalog search ─► track ids ─► new playlist ─► link back to the user
  └─ serverless Redis: sessions, tokens, allowlist flags, host playlist index
```

### Challenges and solutions

- **Two very different logins.** Spotify uses a standard redirect, but Tidal uses a device login
  that runs as a pending background task in the server. That task can't be stored in a database, so
  it is held in memory until it completes and only then are plain tokens saved to Redis. The front
  end opens a popup and polls for the result.
- **A bug that only appeared in production.** Login polling failed at random after deployment. The
  cause was four server worker processes, each with its own memory, so the poll often hit a worker
  that had never seen the login. Since the server is fully asynchronous, one worker handles the load
  comfortably, and the bug disappeared.
- **Spotify's five-user limit.** Apps in Spotify's development mode can only write to the accounts
  of a handful of pre-registered users. After login the app checks whether the user is on that list.
  If not, it falls back to creating a public playlist on a dedicated host account and returns its
  link. A Redis sorted set tracks those playlists by age, and they are cleaned up lazily, by age and
  by count, whenever a new one is made, so no scheduler is needed.
- **An undocumented API change.** Creating a playlist started returning a bare 403 even with the
  right permissions. Calling the newer "my playlists" endpoint directly, instead of the client
  library's legacy one, fixed it.
- **Reliable output from the model.** The model is instructed to return only a strict JSON list of
  songs, which is parsed and validated before any song is searched for.
- **Protecting a paid API.** Prompt length and song count are capped on both client and server,
  endpoints are rate-limited per IP, CORS is restricted, and model output is inserted as text, never
  as HTML.
- **One deployable unit.** The backend serves the front end itself, so all API calls are relative
  and there is no cross-origin configuration to get wrong between environments.
