"use client";

import { useMemo, useState } from "react";

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

export default function CalculatorPage() {
  const [loanAmount, setLoanAmount] = useState("5000000");
  const [annualRate, setAnnualRate] = useState("8.5");
  const [tenureYears, setTenureYears] = useState("20");

  const result = useMemo(() => {
    const principal = Math.max(0, Number(loanAmount) || 0);
    const rate = Math.max(0, Number(annualRate) || 0) / 1200;
    const months = Math.max(0, Number(tenureYears) || 0) * 12;

    if (!principal || !months) {
      return { emi: 0, totalPayment: 0, totalInterest: 0, months: 0 };
    }

    const emi = rate === 0
      ? principal / months
      : (principal * rate * Math.pow(1 + rate, months)) /
        (Math.pow(1 + rate, months) - 1);

    const totalPayment = emi * months;
    return {
      emi,
      totalPayment,
      totalInterest: totalPayment - principal,
      months,
    };
  }, [loanAmount, annualRate, tenureYears]);

  const valid =
    Number(loanAmount) > 0 &&
    Number(annualRate) >= 0 &&
    Number(tenureYears) > 0 &&
    Number(tenureYears) <= 40;

  return (
    <main className="container page-shell">
      <div className="eyebrow gold-text">PLAN YOUR HOME LOAN</div>
      <h1 className="page-title">Home loan <em>EMI calculator.</em></h1>
      <p className="muted">
        Estimate your monthly instalment, total interest and overall repayment
        before you shortlist a property.
      </p>

      <div className="emi-layout">
        <section className="emi-panel">
          <h2>Enter your loan details</h2>
          <p className="muted">Change any value to update your estimate instantly.</p>

          <label className="emi-field">
            <span>Loan amount (₹)</span>
            <input
              type="number"
              min="1"
              step="10000"
              value={loanAmount}
              onChange={(event) => setLoanAmount(event.target.value)}
              inputMode="numeric"
            />
          </label>

          <label className="emi-field">
            <span>Annual interest rate (%)</span>
            <input
              type="number"
              min="0"
              max="30"
              step="0.05"
              value={annualRate}
              onChange={(event) => setAnnualRate(event.target.value)}
              inputMode="decimal"
            />
          </label>

          <label className="emi-field">
            <span>Loan tenure (years)</span>
            <input
              type="number"
              min="1"
              max="40"
              step="1"
              value={tenureYears}
              onChange={(event) => setTenureYears(event.target.value)}
              inputMode="numeric"
            />
          </label>

          {!valid && (
            <p className="auth-message" role="alert">
              Enter a loan amount above zero, an interest rate from 0% upward,
              and a tenure between 1 and 40 years.
            </p>
          )}

          <button
            className="btn btn-outline emi-reset"
            type="button"
            onClick={() => {
              setLoanAmount("5000000");
              setAnnualRate("8.5");
              setTenureYears("20");
            }}
          >
            Reset calculator
          </button>
        </section>

        <section className="emi-result" aria-live="polite">
          <div className="eyebrow">YOUR ESTIMATED MONTHLY EMI</div>
          <div className="emi-main">{valid ? money(result.emi) : "—"}</div>
          <div className="emi-result-grid">
            <div>
              <span>Principal amount</span>
              <strong>{valid ? money(Number(loanAmount)) : "—"}</strong>
            </div>
            <div>
              <span>Total interest</span>
              <strong>{valid ? money(result.totalInterest) : "—"}</strong>
            </div>
            <div>
              <span>Total repayment</span>
              <strong>{valid ? money(result.totalPayment) : "—"}</strong>
            </div>
            <div>
              <span>Number of monthly payments</span>
              <strong>{valid ? result.months.toLocaleString("en-IN") : "—"}</strong>
            </div>
          </div>
          {valid && result.totalPayment > 0 && (
            <div className="emi-breakdown">
              <div className="emi-breakdown-bar">
                <span style={{ width: `${(Number(loanAmount) / result.totalPayment) * 100}%` }} />
              </div>
              <div className="emi-legend">
                <span><i className="emi-principal-dot" /> Principal</span>
                <span><i className="emi-interest-dot" /> Interest</span>
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="notice emi-note">
        <strong>Please note</strong>
        <p>
          This is an indicative estimate using a standard monthly-reducing
          balance formula. Actual EMI, fees, taxes, rate changes and eligibility
          depend on the lender and your loan offer. This calculator does not
          submit a loan application or guarantee approval.
        </p>
      </div>
    </main>
  );
}
