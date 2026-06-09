import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import { safetyService } from '../../services/safetyService';

export default function IncidentResponse() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    safetyService.getAllIncidents().then(setRows);
  }, []);

  const columns = [
    { key: 'type', label: 'Type' },
    { key: 'location', label: 'Location' },
    { key: 'status', label: 'Status' },
    { key: 'description', label: 'Details' },
  ];

  return (
    <div className="page-container">
      <PageHeader title="Incident Response" subtitle="Review and respond to reported incidents." />
      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
