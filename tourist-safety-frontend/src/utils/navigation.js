import {
  FiAlertTriangle,
  FiBarChart2,
  FiBell,
  FiCompass,
  FiFlag,
  FiGrid,
  FiHeart,
  FiHome,
  FiMap,
  FiMapPin,
  FiMessageCircle,
  FiNavigation,
  FiPackage,
  FiShield,
  FiUsers,
  FiUser,
  FiClipboard,
  FiRadio,
  FiLayers,
  FiFileText,
} from 'react-icons/fi';
import { ROLES } from './constants';

export const roleHomePath = {
  [ROLES.TOURIST]: '/tourist/dashboard',
  [ROLES.USER]: '/tourist/dashboard', // added
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.OFFICER]: '/officer/dashboard',
};

/** Resolve dashboard path from user or role; defaults to tourist dashboard. */
export function resolveRoleHomePath(userOrRole) {
  const role =
    typeof userOrRole === 'string' ? userOrRole : userOrRole?.role;
  const normalized = role?.toUpperCase?.();
  return roleHomePath[normalized] ?? roleHomePath[ROLES.TOURIST];
}

export const navigationByRole = {
  [ROLES.TOURIST]: [
    { label: 'Dashboard', path: '/tourist/dashboard', icon: FiGrid },
    { label: 'Profile', path: '/tourist/profile', icon: FiUser },
    { label: 'Create Trip', path: '/tourist/create-trip', icon: FiMap },
    { label: 'My Trips', path: '/tourist/my-trips', icon: FiCompass },
    { label: 'Attractions', path: '/tourist/attractions', icon: FiMapPin },
    { label: 'Hotels & Dining', path: '/tourist/hotels-restaurants', icon: FiHome },
    { label: 'Live Tracking', path: '/tourist/live-tracking', icon: FiRadio },
    { label: 'Smart Routes', path: '/tourist/smart-routes', icon: FiNavigation },
    { label: 'AI Assistant', path: '/tourist/ai-assistant', icon: FiMessageCircle },
    { label: 'Safety Dashboard', path: '/tourist/safety', icon: FiShield },
    { label: 'GeoFence Alerts', path: '/tourist/geofence', icon: FiLayers },
    { label: 'SOS Emergency', path: '/tourist/sos', icon: FiAlertTriangle, danger: true },
    { label: 'Report Incident', path: '/tourist/incident', icon: FiFileText },
    { label: 'Community', path: '/tourist/community', icon: FiUsers },
    { label: 'Lost & Found', path: '/tourist/lost-found', icon: FiPackage },
    { label: 'Notifications', path: '/tourist/notifications', icon: FiBell },
  ],
  [ROLES.ADMIN]: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: FiGrid },
    { label: 'Users', path: '/admin/users', icon: FiUsers },
    { label: 'Trips', path: '/admin/trips', icon: FiCompass },
    { label: 'SOS Monitoring', path: '/admin/sos', icon: FiAlertTriangle, danger: true },
    { label: 'Incidents', path: '/admin/incidents', icon: FiFileText },
    { label: 'GeoFences', path: '/admin/geofences', icon: FiLayers },
    { label: 'Analytics', path: '/admin/analytics', icon: FiBarChart2 },
    { label: 'Community', path: '/admin/community', icon: FiHeart },
    { label: 'Reports', path: '/admin/reports', icon: FiClipboard },
  ],
  [ROLES.OFFICER]: [
    { label: 'Dashboard', path: '/officer/dashboard', icon: FiGrid },
    { label: 'Assigned Cases', path: '/officer/cases', icon: FiClipboard },
    { label: 'Live SOS', path: '/officer/live-sos', icon: FiAlertTriangle, danger: true },
    { label: 'Incident Response', path: '/officer/incidents', icon: FiFlag },
    { label: 'Profile', path: '/officer/profile', icon: FiUser },
  ],
};
