import { useMemo, useState } from "react";
import { computeAge, formatDmy, todayObject, toIso } from "./age.js";

const SAMPLE = "1998-03-14";
const STORE_KEY = "age-calculator-dob";

function readSaved() {
  try {
    return localStorage.getItem(STORE_KEY);
  } catch {
    return null;
  }
}

function save(value) {
  try {
    localStorage.setItem(STORE_KEY, value);
  } catch {
    /* storage can be blocked; the calculator still works */
  }
}

function Unit({ value, one, many }) {
  return (
    <div className="unit">
      <span className="num">{value}</span>
      <span className="lbl">{value === 1 ? one : many}</span>
    </div>
  );
}

export default function App() {
  const today = useMemo(todayObject, []);
  const saved = useMemo(readSaved, []);
  const [birth, setBirth] = useState(saved || SAMPLE);
  const [isSample, setIsSample] = useState(!saved);
  const [result, setResult] = useState(() => computeAge(saved || SAMPLE, today));

  function handleChange(e) {
    setBirth(e.target.value);
    setIsSample(false);
    setResult(null); // the old answer no longer matches the date, so clear it
  }

  function handleSubmit(e) {
    e.preventDefault();
    const r = computeAge(birth, today);
    setResult(r);
    if (!r.error) save(birth);
  }

  const ok = result && !result.error;

  return (
    <main className="card">
      <h1>Evaluate Current Age</h1>

      <form className="form" onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="dob">Enter your Date of Birth</label>
          <div className="control">
            <input
              id="dob"
              type="date"
              value={birth}
              min="1900-01-01"
              max={toIso(today)}
              onChange={handleChange}
            />
            <p className="note">
              Format: DD-MM-YYYY{isSample ? ". This is a sample date, so enter yours." : ""}
            </p>
          </div>
        </div>

        <div className="row">
          <label htmlFor="today">System Date</label>
          <div className="control">
            <input id="today" type="text" value={formatDmy(today)} readOnly />
            <p className="note">Today's date, taken from your device.</p>
          </div>
        </div>

        <button type="submit" className="btn">
          Find Present age
        </button>
      </form>

      {result && result.error && (
        <p className="error" role="alert">
          {result.error}
        </p>
      )}

      <section className="result" aria-live="polite" aria-label="Result">
        <h2 className="eyebrow">Current age</h2>
        <div className="age">
          <Unit value={ok ? result.years : "--"} one="year" many="years" />
          <Unit value={ok ? result.months : "--"} one="month" many="months" />
          <Unit value={ok ? result.days : "--"} one="day" many="days" />
        </div>
        <div className="born">
          <span className="eyebrow">Day of birth</span>
          <span className="weekday">{ok ? result.bornOn : "--"}</span>
        </div>
      </section>
    </main>
  );
}
