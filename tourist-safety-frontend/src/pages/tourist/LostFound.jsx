import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { lostFoundService } from '../../services/lostFoundService';

export default function LostFound() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ item: '', location: '' });

  const load = () => lostFoundService.getAll().then(setRows);

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await lostFoundService.report(form);
    setForm({ item: '', location: '' });
    load();
  };

  const columns = [
    { key: 'item', label: 'Item' },
    { key: 'location', label: 'Location' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="page-container space-y-6">
      <PageHeader title="Lost & Found" subtitle="Report or search for lost belongings." />
      <form onSubmit={handleSubmit} className="glass-panel grid gap-4 p-4 sm:grid-cols-3">
        <Input label="Item" required value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} />
        <Input label="Location" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <div className="flex items-end">
          <Button type="submit" className="w-full sm:w-auto">Report item</Button>
        </div>
      </form>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
