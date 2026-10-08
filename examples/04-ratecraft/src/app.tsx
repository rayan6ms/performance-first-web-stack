import { createMemo, createSignal, Show } from "solid-js";
import { estimateRate, formatRate } from "./rate";
import "./app.css";

export default function App() {
  const [income, setIncome] = createSignal("");
  const [hours, setHours] = createSignal("");
  const [submitted, setSubmitted] = createSignal(false);
  const estimate = createMemo(() => estimateRate(income(), hours()));
  const errors = () => (submitted() ? estimate().errors : {});
  let incomeInput!: HTMLInputElement;
  let hoursInput!: HTMLInputElement;

  function submit(event: SubmitEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (estimate().errors.income) incomeInput.focus();
    else if (estimate().errors.hours) hoursInput.focus();
  }

  return (
    <main>
      <header>
        <p class="wordmark">
          RateCraft <span> / Freelance tools</span>
        </p>
        <p class="eyebrow">START WITH YOUR GOAL</p>
        <h1>
          Make your hours <em>add up.</em>
        </h1>
        <p class="intro">Turn the income you want into an hourly rate you can work with.</p>
      </header>

      <section class="calculator" aria-labelledby="calculator-heading">
        <div class="form-panel">
          <h2 id="calculator-heading">Your monthly numbers</h2>
          <p class="hint">Use the hours you can bill, rather than all the hours you work.</p>
          <form noValidate onSubmit={submit}>
            <div class="field">
              <label for="income">
                Target monthly income ($)
                <input
                  ref={(element) => {
                    incomeInput = element;
                  }}
                  id="income"
                  type="text"
                  inputmode="decimal"
                  required
                  placeholder="e.g. 6000"
                  value={income()}
                  onInput={(event) => setIncome(event.currentTarget.value)}
                  aria-invalid={!!errors().income}
                  aria-describedby="income-error"
                />
              </label>
              <p class="error" id="income-error">
                {errors().income}
              </p>
            </div>
            <div class="field">
              <label for="hours">
                Billable hours per month
                <input
                  ref={(element) => {
                    hoursInput = element;
                  }}
                  id="hours"
                  type="text"
                  inputmode="decimal"
                  required
                  placeholder="e.g. 120"
                  value={hours()}
                  onInput={(event) => setHours(event.currentTarget.value)}
                  aria-invalid={!!errors().hours}
                  aria-describedby="hours-error"
                />
              </label>
              <p class="error" id="hours-error">
                {errors().hours}
              </p>
            </div>
            <button type="submit">
              Estimate my rate <span aria-hidden="true">↗</span>
            </button>
          </form>
          <noscript>
            <p>Enable JavaScript to calculate your rate in this browser.</p>
          </noscript>
        </div>

        <output class="result-panel" for="income hours" aria-live="polite" aria-atomic="true">
          <p class="eyebrow">YOUR HOURLY ESTIMATE</p>
          <Show
            when={submitted() && estimate().rate !== undefined}
            fallback={
              <>
                <p class="empty-result">
                  A starting point,
                  <br />
                  made for you.
                </p>
                <p>
                  {errors().result || "Enter your income goal and billable hours to see your rate."}
                </p>
              </>
            }
          >
            <p class="rate">{formatRate(estimate().rate!)}</p>
            <p class="rate-unit">per billable hour</p>
            <p>Monthly income ÷ monthly billable hours. Updates as you adjust your numbers.</p>
          </Show>
          <p class="note">
            A simple estimate. Allow for taxes, expenses, and time off when setting your final rate.
          </p>
        </output>
      </section>
      <footer>Calculated in your browser. Your numbers stay with you.</footer>
    </main>
  );
}
