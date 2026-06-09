import PageHeader from '../../components/common/PageHeader';
import { useNotifications } from '../../hooks/useNotifications';

export default function Notifications() {
  const { notifications, loading } = useNotifications();

  return (
    <div className="page-container">
      <PageHeader title="Notifications" subtitle="Alerts, trip updates, and safety messages." />
      {loading ? (
        <p className="text-sm text-slate-500">Loading notifications…</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li key={n.id} className={`glass-panel p-4 ${n.unread ? 'ring-2 ring-brand-500/30' : ''}`}>
              <p className="font-semibold">{n.title}</p>
              <p className="text-sm text-slate-500">{n.body}</p>
              <p className="mt-1 text-xs text-slate-400">{n.time}</p>
            </li>
          ))}
          {notifications.length === 0 && <p className="text-sm text-slate-500">No notifications yet.</p>}
        </ul>
      )}
    </div>
  );
}
