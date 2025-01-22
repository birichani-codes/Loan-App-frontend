import React, { useState } from "react";

const LoanCalculator = () => {
  const [step, setStep] = useState("form"); // 'form' or 'results'
  const [formData, setFormData] = useState({});
  const [results, setResults] = useState(null);

  // Handle form submission
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    const loanAmount = parseFloat(data.get("loanAmount"));
    const interestRate = parseFloat(data.get("interestRate"));
    const loanTermYears = parseInt(data.get("loanTermYears"));
    const loanTermMonths = parseInt(data.get("loanTermMonths"));
    const compoundFrequency = data.get("compoundFrequency");
    const paybackFrequency = data.get("paybackFrequency");

    // Calculate based on compound interest frequency
    const periodsPerYear = getCompoundFrequency(periodsPerYear, compoundFrequency);
    const monthlyInterestRate = interestRate / 100 / periodsPerYear;

    const numPayments = loanTermYears * periodsPerYear;
    const compoundedAmount = loanAmount * Math.pow(1 + monthlyInterestRate, numPayments);
    const totalPayment = compoundedAmount;

    setFormData({
      loanAmount,
      interestRate,
      loanTermYears,
      loanTermMonths,
      compoundFrequency,
      paybackFrequency,
    });

    setResults({
      compoundedAmount: compoundedAmount.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
    });

    setStep("results");
  };

  // Get compound frequency in terms of periods per year
  const getCompoundFrequency = (compoundFrequency) => {
    switch (compoundFrequency) {
      case "Annually":
        return 1;
      case "Semi-Annually":
        return 2;
      case "Quarterly":
        return 4;
      case "Monthly":
        return 12;
      case "Daily":
        return 365;
      case "Continuously":
        return "Continuously";
      default:
        return 1;
    }
  };

  // Reset form and go back to the LoanForm
  const handleReset = () => {
    setStep("form");
    setFormData({});
    setResults(null);
  };

  return (
    <div className="container mt-5">
      {step === "form" && (
        <LoanForm onSubmit={handleFormSubmit} />
      )}
      {step === "results" && (
        <LoanResults
          formData={formData}
          results={results}
          onBack={handleReset}
        />
      )}
    </div>
  );
};

const LoanForm = ({ onSubmit }) => (
  <div>
    <h1 className="text-center">Loan Calculator</h1>
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="loanAmount">Loan Amount</label>
        <input type="number" id="loanAmount" name="loanAmount" className="form-control" required />
      </div>
      <div className="form-group">
        <label htmlFor="interestRate">Interest Rate (%)</label>
        <input type="number" id="interestRate" name="interestRate" className="form-control" required />
      </div>
      <div className="form-group">
        <label htmlFor="loanTermYears">Loan Term (Years)</label>
        <input type="number" id="loanTermYears" name="loanTermYears" className="form-control" required />
      </div>
      <div className="form-group">
        <label htmlFor="loanTermMonths">Loan Term (Months)</label>
        <input type="number" id="loanTermMonths" name="loanTermMonths" className="form-control" required />
      </div>
      <div className="form-group">
        <label htmlFor="compoundFrequency">Compound Frequency</label>
        <select id="compoundFrequency" name="compoundFrequency" className="form-control" required>
          <option value="Annually">Annually</option>
          <option value="Semi-Annually">Semi-Annually</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Monthly">Monthly</option>
          <option value="Daily">Daily</option>
          <option value="Continuously">Continuously</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="paybackFrequency">Payback Frequency</label>
        <select id="paybackFrequency" name="paybackFrequency" className="form-control" required>
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Annually">Annually</option>
          <option value="Weekly">Weekly</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary mt-3">Calculate</button>
    </form>
  </div>
);

const LoanResults = ({ formData, results, onBack }) => (
  <div>
    <h1 className="text-center">Loan Results</h1>
    <div className="mt-4">
      <h5>Loan Details</h5>
      <p>Loan Amount: {formData.loanAmount}</p>
      <p>Interest Rate: {formData.interestRate}%</p>
      <p>Loan Term (Years): {formData.loanTermYears}</p>
      <p>Loan Term (Months): {formData.loanTermMonths}</p>
      <p>Compound Frequency: {formData.compoundFrequency}</p>
      <p>Payback Frequency: {formData.paybackFrequency}</p>
    </div>
    <div className="mt-4">
      <h5>Results</h5>
      <p>Compounded Amount: {results.compoundedAmount}</p>
      <p>Total Payment: {results.totalPayment}</p>
    </div>
    <button onClick={onBack} className="btn btn-secondary mt-3">Back to Form</button>
  </div>
);

export default LoanCalculator;
