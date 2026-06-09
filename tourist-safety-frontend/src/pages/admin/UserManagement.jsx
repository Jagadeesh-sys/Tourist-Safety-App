import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import { userService } from '../../services/userService';

// Helper function to get role badge styles
const getRoleBadge = (role) => {
  const roleLower = (role || '').toUpperCase();
  const styles = {
    ADMIN: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    OFFICER: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    TOURIST: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[roleLower] || 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}`}>
      {role || 'Unknown'}
    </span>
  );
};

// Helper function to get status badge styles
const getStatusBadge = (status) => {
  const statusLower = (status || '').toLowerCase();
  const styles = {
    active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    inactive: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[statusLower] || 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}`}>
      {status || 'Unknown'}
    </span>
  );
};

export default function UserManagement() {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const filtered = Array.isArray(rows) 
    ? rows.filter((r) => 
        (r?.name || '').toLowerCase().includes(q.toLowerCase()) || 
        (r?.email || '').toLowerCase().includes(q.toLowerCase())
      ) 
    : [];

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (row) => getRoleBadge(row.role) },
    { key: 'status', label: 'Status', render: (row) => getStatusBadge(row.status) },
  ];

  return (
    <div className="page-container space-y-6">
      <PageHeader title="User Management" subtitle="Manage tourists, admins, and officers." />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar 
          value={q} 
          onChange={(e) => setQ(e.target.value)} 
          placeholder="Search users by name or email…" 
        />
        <div className="flex items-center gap-2 text-sm text-slate-500">
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-500"></div>
              <span>Loading…</span>
            </>
          ) : (
            <span>{filtered.length} {filtered.length === 1 ? 'user' : 'users'}</span>
          )}
        </div>
      </div>
      <DataTable columns={columns} rows={filtered} emptyMessage="No users found." />
    </div>
  );
}
