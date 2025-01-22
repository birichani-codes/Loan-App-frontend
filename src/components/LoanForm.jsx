import React, { useState } from 'react';

const LoanForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate: '',
    loanTerm: '',
    loanTermMonths: '',
    compoundFrequency: 'Annually',
    paymentFrequency: 'Monthly',
    additionalFees: '',
    gracePeriod: '',
    loanType: 'Fixed',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="form-group">
        <label htmlFor="loanAmount">Loan Amount</label>
        <input
          type="number"
          id="loanAmount"
          name="loanAmount"
          value={formData.loanAmount}
          onChange={handleInputChange}
          className="form-control"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="interestRate">Interest Rate (%)</label>
        <input
          type="number"
          id="interestRate"
          name="interestRate"
          value={formData.interestRate}
          onChange={handleInputChange}
          className="form-control"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="loanTerm">Loan Term (Years)</label>
        <input
          type="number"
          id="loanTerm"
          name="loanTerm"
          value={formData.loanTerm}
          onChange={handleInputChange}
          className="form-control"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="loanTermMonths">Loan Term (Months)</label>
        <input
          type="number"
          id="loanTermMonths"
          name="loanTermMonths"
          value={formData.loanTermMonths}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      {/* Compound Frequency */}
      <div className="form-group">
        <label htmlFor="compoundFrequency">Compound Frequency</label>
        <select
          id="compoundFrequency"
          name="compoundFrequency"
          value={formData.compoundFrequency}
          onChange={handleInputChange}
          className="form-control"
          required
        >
          <option value="Annually">Annually</option>
          <option value="Semi-Annually">Semi-Annually</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Monthly">Monthly</option>
          <option value="Daily">Daily</option>
          <option value="Continuously">Continuously</option>
        </select>
      </div>

      {/* Payment Frequency */}
      <div className="form-group">
        <label htmlFor="paymentFrequency">Payment Frequency</label>
        <select
          id="paymentFrequency"
          name="paymentFrequency"
          value={formData.paymentFrequency}
          onChange={handleInputChange}
          className="form-control"
          required
        >
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Annually">Annually</option>
          <option value="Weekly">Weekly</option>
        </select>
      </div>

      {/* Additional Fees */}
      <div className="form-group">
        <label htmlFor="additionalFees">Additional Fees</label>
        <input
          type="number"
          id="additionalFees"
          name="additionalFees"
          value={formData.additionalFees}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      {/* Grace Period */}
      <div className="form-group">
        <label htmlFor="gracePeriod">Grace Period (Months)</label>
        <input
          type="number"
          id="gracePeriod"
          name="gracePeriod"
          value={formData.gracePeriod}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      {/* Loan Type (Fixed or Variable) */}
      <div className="form-group">
        <label htmlFor="loanType">Loan Type</label>
        <select
          id="loanType"
          name="loanType"
          value={formData.loanType}
          onChange={handleInputChange}
          className="form-control"
        >
          <option value="Fixed">Fixed</option>
          <option value="Variable">Variable</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary mt-3">
        Calculate
      </button>
    </form>
  );
};

export default LoanForm;
