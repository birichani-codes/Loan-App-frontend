import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Line,
  Bar
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Button, Switch, FormControlLabel, Grid, Box, Typography, Slider } from '@mui/material';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function LoanResults({ loanResultDTO }) {
  const [chartType, setChartType] = useState('line');
  const [darkMode, setDarkMode] = useState(false);

  // Chart Data
  const periods = loanResultDTO.amortizationEntries.map((entry) => entry.period);
  const principalPayments = loanResultDTO.amortizationEntries.map((entry) => entry.principal);
  const interestPayments = loanResultDTO.amortizationEntries.map((entry) => entry.interest);

  const chartData = {
    labels: periods,
    datasets: [
      {
        label: 'Principal Payments',
        data: principalPayments,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Interest Payments',
        data: interestPayments,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Period',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount',
        },
      },
    },
  };

  // Export Chart as Image
  const exportChart = () => {
    const link = document.createElement('a');
    link.download = 'amortization_chart.png';
    link.href = document.querySelector('canvas').toDataURL();
    link.click();
  };

  // Download Report as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Loan Summary', 20, 10);
    doc.text(`Payment Per Period: ${loanResultDTO.paymentPerPeriod}`, 20, 20);
    doc.text(`Total Payments: ${loanResultDTO.totalPayments}`, 20, 30);
    doc.text(`Total Interest: ${loanResultDTO.totalInterest}`, 20, 40);

    autoTable(doc, {
      head: [['Period', 'Beginning Balance', 'Interest', 'Principal', 'Ending Balance']],
      body: loanResultDTO.amortizationEntries.map((entry) => [
        entry.period,
        entry.beginningBalance,
        entry.interest,
        entry.principal,
        entry.endingBalance,
      ]),
    });

    doc.save('loan_report.pdf');
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Box
      sx={{
        bgcolor: darkMode ? '#121212' : '#f5f5f5',
        color: darkMode ? '#fff' : '#000',
        minHeight: '100vh',
        p: 4,
      }}
    >
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
              p: 4,
              borderRadius: 2,
              boxShadow: 2,
              mb: 4,
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Loan Results
            </Typography>

            {/* Loan Summary */}
            <Box mt={4}>
              <Typography variant="h6">Loan Summary</Typography>
              <Typography>Payment Per Period: {loanResultDTO.paymentPerPeriod}</Typography>
              <Typography>Total Payments: {loanResultDTO.totalPayments}</Typography>
              <Typography>Total Interest: {loanResultDTO.totalInterest}</Typography>
            </Box>

            {/* Amortization Graph */}
            <Box mt={4}>
              <Typography variant="h6">Amortization Graph</Typography>
              <Box mt={2}>
                {chartType === 'line' ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <Bar data={chartData} options={chartOptions} />
                )}
              </Box>
              <Box mt={2}>
                <FormControlLabel
                  control={<Switch checked={chartType === 'bar'} onChange={() => setChartType(chartType === 'line' ? 'bar' : 'line')} />}
                  label="Switch to Bar Chart"
                />
                <Button variant="contained" sx={{ ml: 2 }} onClick={exportChart}>
                  Export Chart as Image
                </Button>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box mt={4} display="flex" justifyContent="space-between">
              <Button variant="contained" onClick={downloadPDF}>
                Download Report as PDF
              </Button>
              <FormControlLabel
                control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
                label="Dark Mode"
              />
            </Box>
          </Box>

          {/* Additional Information */}
          <Box mt={4} textAlign="center">
            <Typography variant="body1">
              This loan calculator provides detailed insights into your loan repayments, helping you manage your finances effectively by showing principal and interest payments over time.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LoanResults;
