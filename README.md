# Countdown Timer App

A glassmorphism-styled countdown timer built with vanilla JavaScript, HTML, and Tailwind CSS. Enter hours, minutes, and seconds, and the app counts down with a looping alert sound and custom popup when time's up.

![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-yellow)
![Tailwind CSS](https://img.shields.io/badge/CSS-Tailwind-38bdf8)

## Features

- ⏱️ Hours / Minutes / Seconds input
- ▶️ Start, Pause, and Reset controls
- 🔊 Looping alert sound when the countdown hits zero
- 🪟 Custom glass-style "Time's up!" modal (no native browser alert)
- 🎨 Glassmorphism UI — frosted glass card on a gradient background
- 📱 Responsive layout

## Tech Stack

- **HTML5** — structure
- **Tailwind CSS** (via CDN) — styling
- **Vanilla JavaScript** — no frameworks, no libraries — just the DOM and browser APIs
- **Google Fonts** — Space Grotesk (display) + Inter (body)

## How It Works

1. Enter a duration into the Hours / Minutes / Seconds fields.
2. Click **Start** — the app converts your input into a total number of seconds and begins counting down every second.
3. Click **Pause** at any time to freeze the countdown without losing progress.
4. Click **Start** again to resume from where you paused.
5. Click **Reset** to clear everything back to `00:00:00`.
6. When the countdown reaches zero, a sound loops continuously and a custom popup appears. Click **OK** to silence the sound and dismiss it.

## Running It Locally

No build step, no install — it's plain HTML/JS.

1. Download the repo (Code → Download ZIP, or just download `timer.html` and `app.js` individually)
2. Unzip it if needed
3. Open `timer.html` directly in your browser — double-click it, no server required

---

## Instructor's Notes — What We Actually Built, Concept by Concept

This project was built as a guided learning exercise, following on from an earlier todo-list app. Below is a breakdown of every concept covered, in the order we tackled them — think of this as your own study notes for revisiting later.

### 1. Time math (`updateDisplay`)
The core insight: a countdown isn't really "hours, minutes, seconds" internally — it's just one number, `totalSeconds`, ticking down. We only convert it into `HH:MM:SS` for *display* purposes, using:
- `Math.floor(totalSeconds / 3600)` → whole hours
- `Math.floor((totalSeconds % 3600) / 60)` → whole minutes left after removing hours
- `totalSeconds % 60` → seconds left after removing hours and minutes

The pattern: use `%` (modulo) to find the *remainder* after removing a bigger unit, then divide to get the next unit down. This same pattern applies to any nested-unit conversion (e.g. bytes → KB/MB/GB).

### 2. String formatting (`padStart`)
`String(5).padStart(2, '0')` → `"05"`. Ensures digits always display as two characters, which is what makes a countdown *look* like a real clock instead of `1:5:3`.

### 3. Template literals
We used `` `${hoursStr}:${minutesStr}:${secondsStr}` `` instead of string concatenation (`+`). Backticks allow `${}` to embed variables directly inside a string — cleaner and easier to read than chaining `+` operators.

### 4. Reading form input (`getInputinSeconds`)
`input.value` is **always a string**, even for `type="number"` fields. We convert with `Number(...)`, and guard against invalid/empty input using `|| 0` (so a blank or broken input falls back to zero instead of crashing the app).

### 5. `setInterval` and `clearInterval`
The heart of the app. `setInterval(callback, 1000)` repeatedly runs a function every second, forever, until explicitly stopped. It returns an ID (`timerId`), which is the *only* way to later cancel that specific loop with `clearInterval(timerId)`. Without saving that ID, there'd be no way to pause or stop the countdown once started.

### 6. State management (`isRunning`, `totalSeconds`, `timerId`)
Three variables track the entire app's state:
- `totalSeconds` — how much time is left
- `timerId` — a handle to the currently running interval (or `null` if none)
- `isRunning` — a flag preventing duplicate intervals from starting if Start is clicked twice

Every function (`startTimer`, `pauseTimer`, `resetTimer`) reads and updates these three variables consistently — this is the same "single source of truth" pattern used in the earlier todo-list app.

### 7. Debugging a `null` element
Early on, `hourInput` came back `null` because the HTML `id` (`hoursInput`) didn't exactly match the JS (`hourInput`). This is one of the most common bugs in DOM-driven apps: `getElementById` fails *silently* by returning `null` rather than throwing an immediate error — the crash only happens later, when you try to use it (e.g. `null.value`). Lesson: always check the console first, and compare IDs directly when something is unexpectedly `null`.

### 8. Audio playback and looping
`new Audio(url)` creates a sound object. `.play()` starts it, `.pause()` stops it (there's no `.stop()` method), and `.currentTime = 0` rewinds it. Setting `.loop = true` makes it repeat automatically until paused.

### 9. Why native `alert()` broke the looping sound
Browsers **suspend audio playback** the moment a native `alert()`/`confirm()`/`prompt()` dialog opens — a deliberate anti-abuse measure so sites can't trap users behind a dialog while blasting sound. This is why the sound played once and then silently cut off. The fix was replacing `alert()` with a **custom-built modal** (a hidden `<div>` toggled visible via `classList.remove('hidden')`), since regular page content isn't affected by that browser restriction.

### 10. Event listeners and function references
`startBtn.addEventListener('click', startTimer)` — note `startTimer` has **no parentheses**. Without parentheses, we're passing a *reference* to the function, to be run later on click. With parentheses (`startTimer()`), it would execute immediately on page load instead of waiting for a click.

### 11. Tailwind CSS and glassmorphism
Styling was done entirely with Tailwind utility classes rather than custom CSS. Key techniques:
- `bg-white/10` + `backdrop-blur-xl` + `border-white/20` → the "frosted glass" look
- `bg-gradient-to-br from-X via-X to-X` → multi-stop background gradients
- `flex items-center justify-center` → the standard centering pattern
- `focus:ring-2` / `hover:bg-X` → conditional state-based styling
- A monospace-leaning display font (Space Grotesk) was chosen deliberately for the digits, so they don't visually shift width as numbers change each second.

---

**Core takeaway:** this app is really just three ideas working together — a ticking interval, a few state variables everyone agrees on, and small pure functions that convert between "seconds" and "human-readable time." Every timer, stopwatch, or scheduling feature you build in the future will lean on this same foundation.
