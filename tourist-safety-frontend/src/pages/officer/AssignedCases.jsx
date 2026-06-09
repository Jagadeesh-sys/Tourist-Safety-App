import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import { officerService } from '../../services/officerService';

export default function AssignedCases() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    officerService.getCases().then(setRows);
  }, []);

  const columns = [
    { key: 'caseId', label: 'Case' },
    { key: 'tourist', label: 'Tourist' },
    { key: 'priority', label: 'Priority' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="page-container">
      <PageHeader title="Assigned Cases" subtitle="Your active response assignments." />
      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
