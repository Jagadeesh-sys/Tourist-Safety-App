import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { chartColors, defaultChartOptions } from './chartConfig';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChartCard({ title, labels, values }) {
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: [chartColors.brand, chartColors.violet, chartColors.amber, chartColors.emerald, chartColors.rose],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="glass-panel p-4">
      <h3 className="mb-4 font-semibold">{title}</h3>
      <div className="h-64">
        <Bar data={data} options={defaultChartOptions} />
      </div>
    </div>
  );
}
