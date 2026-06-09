import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { chartColors } from './chartConfig';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChartCard({ title, labels, values }) {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [chartColors.brand, chartColors.rose, chartColors.amber, chartColors.emerald, chartColors.violet],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="glass-panel p-4">
      <h3 className="mb-4 font-semibold">{title}</h3>
      <div className="mx-auto h-64 max-w-xs">
        <Doughnut
          data={data}
          options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
        />
      </div>
    </div>
  );
}
