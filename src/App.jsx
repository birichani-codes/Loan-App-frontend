import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Bar, Line } from 'react-chartjs-2';
import LoanResults from './components/LoanResults';
import { Spinner } from 'react-bootstrap';

function App() {
  const [loanResultDTO, setLoanResultDTO] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleFormSubmit = (formData) => {
    const { loanAmount, interestRate, loanTerm, paymentFrequency, compoundedFrequency } = formData;

    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      alert('Please enter positive values for loan amount, interest rate, and loan term.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const ratePerPeriod = interestRate / 100 / compoundedFrequency;
      const numPayments = loanTerm * paymentFrequency;

      const paymentPerPeriod = 
        (loanAmount * ratePerPeriod) /
        (1 - Math.pow(1 + ratePerPeriod, -numPayments));

      const totalPayments = paymentPerPeriod * numPayments;
      const totalInterest = totalPayments - loanAmount;

      let balance = loanAmount;
      const amortizationEntries = [];
      const principalData = [];
      const interestData = [];
      const loanBalanceData = [];

      for (let i = 1; i <= numPayments; i++) {
        const interest = balance * ratePerPeriod;
        const principal = paymentPerPeriod - interest;
        const endingBalance = balance - principal;

        amortizationEntries.push({
          period: i,
          beginningBalance: balance.toFixed(2),
          interest: interest.toFixed(2),
          principal: principal.toFixed(2),
          endingBalance: endingBalance.toFixed(2),
        });

        principalData.push(principal);
        interestData.push(interest);
        loanBalanceData.push(endingBalance.toFixed(2));

        balance = endingBalance;
      }

      setLoanResultDTO({
        paymentPerPeriod: paymentPerPeriod.toFixed(2),
        totalPayments: totalPayments.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        amortizationEntries,
        principalData,
        interestData,
        loanBalanceData,
        paymentFrequency,
        compoundedFrequency,
      });

      setShowResults(true);
      setLoading(false);
    }, 2000);
  };

  const handleBackToForm = () => {
    setShowResults(false);
    setLoanResultDTO(null);
  };

  const handleLogin = (credentials) => {
    const { username, password } = credentials;

    if (username === "loan" && password === "test") {
      setLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '800px', fontFamily: 'Jost, sans-serif' }}>
      <h1 className="text-center text-primary mb-4">Loan Calculator</h1>
      {!loggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <>
          {!showResults ? (
            <LoanForm onSubmit={handleFormSubmit} />
          ) : (
            <>
              <LoanResults loanResultDTO={loanResultDTO} onBack={handleBackToForm} />
              <LoanGraph loanResultDTO={loanResultDTO} />
              <AmortizationTable amortizationEntries={loanResultDTO.amortizationEntries} />
            </>
          )}
          {loading && (
            <div className="text-center mt-4">
              <Spinner animation="border" variant="primary" />
              <p>Calculating...</p>
            </div>
          )}
          <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
}

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin({ username, password });
  };

  return (
    <div className="card p-4 shadow-lg mt-4">
      <h2 className="text-center mb-3" style={{ fontSize: '2rem', color: '#0056b3' }}>Welcome Back</h2>
      <p className="text-center text-muted">Access the Loan Calculator by logging in</p>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-group">
          <label htmlFor="username" style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#343a40' }}>Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control p-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="password" style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#343a40' }}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control p-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-block mt-4 p-3"
          style={{ fontSize: '1.2rem', letterSpacing: '0.5px', transition: 'background-color 0.3s ease-in-out' }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

const AmortizationTable = ({ amortizationEntries }) => {
  return (
    <div className="mt-5">
      <h3>Amortization Schedule</h3>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Period</th>
            <th>Beginning Balance</th>
            <th>Interest</th>
            <th>Principal</th>
            <th>Ending Balance</th>
          </tr>
        </thead>
        <tbody>
          {amortizationEntries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.period}</td>
              <td>{entry.beginningBalance}</td>
              <td>{entry.interest}</td>
              <td>{entry.principal}</td>
              <td>{entry.endingBalance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const LoanGraph = ({ loanResultDTO }) => {
  const { principalData, interestData, loanBalanceData } = loanResultDTO;

  const barData = {
    labels: principalData.map((_, index) => `Period ${index + 1}`),
    datasets: [
      {
        label: 'Principal',
        data: principalData,
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'Interest',
        data: interestData,
        backgroundColor: 'rgba(220, 53, 69, 0.5)',
        borderColor: 'rgba(220, 53, 69, 1)',
        borderWidth: 1,
      }
    ]
  };

  const lineData = {
    labels: loanBalanceData.map((_, index) => `Period ${index + 1}`),
    datasets: [
      {
        label: 'Loan Balance Over Time',
        data: loanBalanceData,
        borderColor: 'rgba(40, 167, 69, 1)',
        fill: false,
        borderWidth: 2,
      }
    ]
  };

  return (
    <div className="mt-5">
      <h3>Principal vs Interest Payment Over Time</h3>
      <Bar data={barData} options={{
        scales: {
          y: { beginAtZero: true },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
              }
            }
          }
        }
      }} />

      <h3 className="mt-5">Loan Balance Over Time</h3>
      <Line data={lineData} options={{
        scales: {
          y: { beginAtZero: true },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                return `Balance: $${context.raw.toFixed(2)}`;
              }
            }
          }
        }
      }} />
    </div>
  );
};

const LoanForm = ({ onSubmit }) => {
  const [paymentFrequency, setPaymentFrequency] = useState(12);
  const [compoundedFrequency, setCompoundedFrequency] = useState(12);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const formData = {
      loanAmount: parseFloat(data.get('loanAmount')),
      interestRate: parseFloat(data.get('interestRate')),
      loanTerm: parseFloat(data.get('loanTerm')),
      paymentFrequency: parseInt(paymentFrequency),
      compoundedFrequency: parseInt(compoundedFrequency),
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="shadow-lg p-4 rounded">
      <div className="form-group">
        <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Loan Amount</label>
        <input type="number" name="loanAmount" className="form-control p-3" required />
      </div>
      <div className="form-group mt-3">
        <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Interest Rate (%)</label>
        <input type="number" name="interestRate" className="form-control p-3" required />
      </div>
      <div className="form-group mt-3">
        <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Loan Term (years)</label>
        <input type="number" name="loanTerm" className="form-control p-3" required />
      </div>
      <div className="form-group mt-3">
        <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Payment Frequency (times per year)</label>
        <input
          type="number"
          name="paymentFrequency"
          className="form-control p-3"
          value={paymentFrequency}
          onChange={(e) => setPaymentFrequency(e.target.value)}
        />
      </div>
      <div className="form-group mt-3">
        <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Compounding Frequency (times per year)</label>
        <input
          type="number"
          name="compoundedFrequency"
          className="form-control p-3"
          value={compoundedFrequency}
          onChange={(e) => setCompoundedFrequency(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-block mt-4 p-3"
        style={{ fontSize: '1.2rem', letterSpacing: '0.5px' }}
      >
        Calculate Loan
      </button>
    </form>
  );
};

export default App;
