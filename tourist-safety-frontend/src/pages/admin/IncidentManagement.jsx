import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import { safetyService } from '../../services/safetyService';

export default function IncidentManagement() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    safetyService.getAllIncidents().then(setRows);
  }, []);

  const columns = [
    { key: 'type', label: 'Type' },
    { key: 'location', label: 'Location' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="page-container">
      <PageHeader title="Incident Management" subtitle="Review and assign incident reports." />
      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
