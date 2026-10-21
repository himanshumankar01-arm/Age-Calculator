// Date maths for the age calculator. Uses UTC so daylight saving never shifts a day.

const DAY = 86400000;
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function parseDate(s) {
  if (!s) return null;
  const p = s.split("-").map(Number);
  if (p.length !== 3 || p.some(Number.isNaN)) return null;
  return { y: p[0], m: p[1] - 1, d: p[2] };
}

const toMs = (o) => Date.UTC(o.y, o.m, o.d);
const daysInMonth = (y, m) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
const pad = (n) => String(n).padStart(2, "0");

function addMonths(b, n) {
  const total = b.m + n;
  const y = b.y + Math.floor(total / 12);
  const m = ((total % 12) + 12) % 12;
  return { y, m, d: Math.min(b.d, daysInMonth(y, m)) };
}

export function todayObject() {
  const n = new Date();
  return { y: n.getFullYear(), m: n.getMonth(), d: n.getDate() };
}

// 2026-10-12, the format a date input uses.
export function toIso(o) {
  return `${o.y}-${pad(o.m + 1)}-${pad(o.d)}`;
}

// 12-10-2026, the format shown to the person.
export function formatDmy(o) {
  return `${pad(o.d)}-${pad(o.m + 1)}-${o.y}`;
}

// Returns { error } or { years, months, days, bornOn }.
export function computeAge(birthStr, today) {
  const b = parseDate(birthStr);
  if (!b) return { error: "Enter your date of birth." };
  if (b.y < 1900) return { error: "Use a birth year of 1900 or later." };
  if (toMs(b) > toMs(today)) return { error: "That date is in the future. Check the date of birth." };

  let months = (today.y - b.y) * 12 + (today.m - b.m);
  while (toMs(addMonths(b, months + 1)) <= toMs(today)) months++;
  while (toMs(addMonths(b, months)) > toMs(today)) months--;
  const days = Math.round((toMs(today) - toMs(addMonths(b, months))) / DAY);

  return {
    years: Math.floor(months / 12),
    months: months % 12,
    days,
    bornOn: WEEKDAYS[new Date(toMs(b)).getUTCDay()],
  };
}
