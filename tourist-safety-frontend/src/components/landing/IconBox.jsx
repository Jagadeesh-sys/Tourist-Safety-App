import { FiMapPin } from 'react-icons/fi';

/** Renders a react-icon component safely (avoids invalid element type errors). */
export default function IconBox({ icon: Icon, size = 20, className = '' }) {
  const Resolved = Icon || FiMapPin;
  return <Resolved size={size} className={className} />;
}
