import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { reportService } from '../../services/reportService';

export default function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    reportService.getAll().then(setReports);
  }, []);

  return (
    <div className="page-container">
      <PageHeader title="Reports" subtitle="Export operational and safety reports." />
      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((r) => (
          <div key={r.id} className="glass-panel flex items-center justify-between p-5">
            <div>
              <span className="font-medium">{r.title}</span>
              <p className="mt-1 text-xs text-slate-500">{r.description}</p>
            </div>
            <Button variant="outline">Download</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
