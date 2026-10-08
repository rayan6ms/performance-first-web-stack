import * as v from "valibot";

const positiveNumber = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty("Enter a value greater than zero."),
  v.transform(Number),
  v.number("Enter a valid number."),
  v.finite("Enter a finite number."),
  v.gtValue(0, "Enter a value greater than zero."),
);

export type RateResult = {
  errors: { income?: string; hours?: string; result?: string };
  rate?: number;
};

export function estimateRate(incomeText: string, hoursText: string): RateResult {
  const income = v.safeParse(positiveNumber, incomeText);
  const hours = v.safeParse(positiveNumber, hoursText);
  if (!income.success || !hours.success) {
    return {
      errors: {
        income: income.success ? undefined : income.issues[0].message,
        hours: hours.success ? undefined : hours.issues[0].message,
      },
    };
  }

  const rate = income.output / hours.output;
  if (!Number.isFinite(rate) || rate <= 0) {
    return {
      errors: { result: "These values exceed the calculator’s numeric range. Adjust them." },
    };
  }
  return { rate, errors: {} };
}

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatRate(rate: number): string {
  return rate < 0.005 ? "Less than $0.01" : dollars.format(rate);
}
