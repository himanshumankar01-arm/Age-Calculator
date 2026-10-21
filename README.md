# Age Calculator (React + Vite)

Pick a date of birth, press "Find Present age", and see your exact age in years, months and days, plus the weekday you were born on.

## Run it

You need Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the address that appears in the terminal (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

The finished site is written to the `dist` folder.

## How the page works

1. "Enter your Date of Birth" is a date picker (shown as DD-MM-YYYY).
2. "System Date" is today's date from your device. It is read-only.
3. "Find Present age" works out the age and shows it in the result box with the day of birth.

## Files

- `src/App.jsx` has the page.
- `src/age.js` has the date maths (age and weekday).
- `src/styles.css` has the layout and the light and dark colors.

Your date of birth is saved in your browser only.
