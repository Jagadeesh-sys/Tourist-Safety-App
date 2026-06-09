import { Navigate, Route, Routes } from 'react-router-dom';
import { ROLES } from '../utils/constants';
import { resolveRoleHomePath } from '../utils/navigation';
import { authService } from '../services/authService';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

import Destinations from '../pages/landing/Destinations';
import SafetyAlerts from '../pages/landing/SafetyAlerts';
import Emergency from '../pages/landing/Emergency';
import Hotels from '../pages/landing/Hotels';
import TravelGuide from '../pages/landing/TravelGuide';
import ContactUs from '../pages/landing/ContactUs';

import TouristDashboard from '../pages/tourist/Dashboard';
import TouristProfile from '../pages/tourist/Profile';
import CreateTrip from '../pages/tourist/CreateTrip';
import MyTrips from '../pages/tourist/MyTrips';
import TripDetails from '../pages/tourist/TripDetails';
import Attractions from '../pages/tourist/Attractions';
import HotelsRestaurants from '../pages/tourist/HotelsRestaurants';
import LiveTracking from '../pages/tourist/LiveTracking';
import SmartRoutes from '../pages/tourist/SmartRoutes';
import AIAssistant from '../pages/tourist/AIAssistant';
import SafetyDashboard from '../pages/tourist/SafetyDashboard';
import GeoFenceAlerts from '../pages/tourist/GeoFenceAlerts';
import TouristSOS from '../pages/tourist/SOS';
import ReportIncident from '../pages/tourist/ReportIncident';
import CommunityFeed from '../pages/tourist/CommunityFeed';
import LostFound from '../pages/tourist/LostFound';
import Notifications from '../pages/tourist/Notifications';

import AdminDashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import TripManagement from '../pages/admin/TripManagement';
import SOSMonitoring from '../pages/admin/SOSMonitoring';
import IncidentManagement from '../pages/admin/IncidentManagement';
import GeoFenceManagement from '../pages/admin/GeoFenceManagement';
import Analytics from '../pages/admin/Analytics';
import CommunityModeration from '../pages/admin/CommunityModeration';
import Reports from '../pages/admin/Reports';

import OfficerDashboard from '../pages/officer/Dashboard';
import AssignedCases from '../pages/officer/AssignedCases';
import LiveSOS from '../pages/officer/LiveSOS';
import IncidentResponse from '../pages/officer/IncidentResponse';
import OfficerProfile from '../pages/officer/Profile';

function PublicOnly({ children }) {
  if (authService.isAuthenticated()) {
    const user = authService.getStoredUser();
    return <Navigate to={resolveRoleHomePath(user)} replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/destinations" element={<Destinations />} />
      <Route path="/safety-alerts" element={<SafetyAlerts />} />
      <Route path="/emergency" element={<Emergency />} />
      <Route path="/hotels" element={<Hotels />} />
      <Route path="/travel-guide" element={<TravelGuide />} />
      <Route path="/contact" element={<ContactUs />} />

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="register" element={<PublicOnly><Register /></PublicOnly>} />
        <Route path="forgot-password" element={<PublicOnly><ForgotPassword /></PublicOnly>} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route element={<RoleRoute allowedRoles={[ROLES.TOURIST, ROLES.USER]} />}>
            <Route path="/tourist/dashboard" element={<TouristDashboard />} />
            <Route path="/tourist/profile" element={<TouristProfile />} />
            <Route path="/tourist/create-trip" element={<CreateTrip />} />
            <Route path="/tourist/my-trips" element={<MyTrips />} />
            <Route path="/tourist/trips/:id" element={<TripDetails />} />
            <Route path="/tourist/attractions" element={<Attractions />} />
            <Route path="/tourist/hotels-restaurants" element={<HotelsRestaurants />} />
            <Route path="/tourist/live-tracking" element={<LiveTracking />} />
            <Route path="/tourist/smart-routes" element={<SmartRoutes />} />
            <Route path="/tourist/ai-assistant" element={<AIAssistant />} />
            <Route path="/tourist/safety" element={<SafetyDashboard />} />
            <Route path="/tourist/geofence" element={<GeoFenceAlerts />} />
            <Route path="/tourist/sos" element={<TouristSOS />} />
            <Route path="/tourist/incident" element={<ReportIncident />} />
            <Route path="/tourist/community" element={<CommunityFeed />} />
            <Route path="/tourist/lost-found" element={<LostFound />} />
            <Route path="/tourist/notifications" element={<Notifications />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/trips" element={<TripManagement />} />
            <Route path="/admin/sos" element={<SOSMonitoring />} />
            <Route path="/admin/incidents" element={<IncidentManagement />} />
            <Route path="/admin/geofences" element={<GeoFenceManagement />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/community" element={<CommunityModeration />} />
            <Route path="/admin/reports" element={<Reports />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={[ROLES.OFFICER]} />}>
            <Route path="/officer/dashboard" element={<OfficerDashboard />} />
            <Route path="/officer/cases" element={<AssignedCases />} />
            <Route path="/officer/live-sos" element={<LiveSOS />} />
            <Route path="/officer/incidents" element={<IncidentResponse />} />
            <Route path="/officer/profile" element={<OfficerProfile />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
