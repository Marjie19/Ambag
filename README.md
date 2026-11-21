# AMBAG

**An AI-Assisted Academic Group Contribution Tracking and Verification System**
SYSANDE · Group 8 — Aaron Matthew Natividad, Francesca San Jose, Paolo Reyes, Marjorie Ann Yulo

AMBAG makes each member's contribution to a group project **visible and verifiable**.
Inspired by GitHub's commit history, students log their work as **task commits** (what they
did, how long it took, and evidence). Teammates **confirm** each other's commits, and the
system **summarizes** progress for the professor. AI only summarizes — it never grades.

## This starter

A lightweight, client-side prototype (no backend yet) that runs in any browser:

- **Log a task commit** — member, task, minutes spent, and evidence (link or note)
- **Built-in timer** — track time and drop it straight into a commit
- **Peer confirmation** — a teammate (not the author) confirms a commit
- **Contribution summary** — commits, confirmed count, and total time per member

Data is saved in the browser via `localStorage`, so the demo survives refreshes. This is a
starting point for the core screens; the full build (accounts, shared database, AI summaries)
is the next phase. Note: the graded finals deliverable is the SRS paper (due Nov 28); this
working system is the team's own extra.

## Run it

Just open `index.html` in a browser — no install needed.

## Files

- `index.html` — page structure
- `styles.css` — styling
- `app.js` — commit log, timer, peer-confirm, and summary logic

## Roadmap

- [ ] Shared backend / database (so commits sync across members)
- [ ] User accounts and login
- [ ] AI progress summary for the professor view
- [ ] Figma hi-fi screens → polished UI
