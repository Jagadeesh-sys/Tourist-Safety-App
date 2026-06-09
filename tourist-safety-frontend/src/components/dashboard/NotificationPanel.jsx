import { useNotifications } from '../../hooks/useNotifications';

export default function NotificationPanel({ open, onClose }) {
  const { notifications } = useNotifications();
  if (!open) return null;

  return (
    <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-slate-200 bg-white shadow-elevated dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <h3 className="font-semibold">Notifications</h3>
        <button type="button" onClick={onClose} className="text-xs text-brand-600">
          Close
        </button>
      </div>
      <ul className="max-h-80 overflow-y-auto p-2">
        {notifications.map((n) => (
          <li
            key={n.id}
            className={`rounded-xl p-3 text-sm ${n.unread ? 'bg-brand-50 dark:bg-brand-900/20' : ''}`}
          >
            <p className="font-medium text-slate-800 dark:text-slate-100">{n.title}</p>
            <p className="mt-1 text-slate-500">{n.body}</p>
            <p className="mt-1 text-xs text-slate-400">{n.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
