import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { chartColors, defaultChartOptions } from './chartConfig';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function LineChartCard({ title, labels, values }) {
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        borderColor: chartColors.brand,
        backgroundColor: chartColors.brandLight,
        fill: true,
        tension: 0.35,
      },
    ],
  };

  return (
    <div className="glass-panel p-4">
      <h3 className="mb-4 font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      <div className="h-64">
        <Line data={data} options={defaultChartOptions} />
      </div>
    </div>
  );
}
