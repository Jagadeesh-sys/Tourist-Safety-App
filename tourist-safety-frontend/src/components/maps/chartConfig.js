export const chartColors = {
  brand: '#06b6d4',
  brandLight: 'rgba(6, 182, 212, 0.2)',
  rose: '#f43f5e',
  amber: '#f59e0b',
  emerald: '#10b981',
  violet: '#8b5cf6',
};

export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'bottom' },
  },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true },
  },
};
