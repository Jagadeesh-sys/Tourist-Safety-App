import { STORAGE_KEYS } from '../utils/constants';
import {
  computeAnalytics,
  computeChartData,
  computeSafetyStats,
  getCurrentUser,
  getDb,
  nextId,
  relativeTime,
  saveDb,
  validateUserLogin,
} from './mockStore';

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));

function parseBody(config) {
  if (!config.data) return {};
  if (typeof config.data === 'string') {
    try {
      return JSON.parse(config.data);
    } catch {
      return {};
    }
  }
  return config.data;
}

function pathOnly(url) {
  let u = (url || '').split('?')[0];
  u = u.replace(/^https?:\/\/[^/]+/i, '');
  u = u.replace(/^\/+/, '').replace(/^api\//, '');
  return u;
}

function normalizeEmail(email) {
  return email?.toLowerCase?.()?.trim() || '';
}

function persistSession(user) {
  localStorage.setItem(STORAGE_KEYS.TOKEN, `mock-token-${user.role}-${Date.now()}`);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export async function handleMockRequest(config) {
  await delay();
  const method = (config.method || 'get').toUpperCase();
  const path = pathOnly(config.url);
  const body = parseBody(config);
  const user = getCurrentUser();
  const db = getDb();

  // —— Auth ——
  if (method === 'POST' && path === 'auth/login') {
    const authenticated = validateUserLogin(db, body.email, body.password);
    if (!authenticated) {
      return Promise.reject({ response: { status: 401, data: { message: 'Invalid email or password' } } });
    }
    persistSession(authenticated);
    return { data: { token: localStorage.getItem(STORAGE_KEYS.TOKEN), user: authenticated } };
  }

  if (method === 'POST' && path === 'auth/register') {
    const email = body.email?.toLowerCase();
    if (db.users.some((u) => u.email === email)) {
      return Promise.reject({ response: { status: 400, data: { message: 'Email already registered' } } });
    }
    if (!body.password || body.password.length < 6) {
      return Promise.reject({ response: { status: 400, data: { message: 'Password must be at least 6 characters' } } });
    }
    const newUser = {
      id: nextId(db.users),
      name: body.name || 'New User',
      email,
      password: body.password,
      role: 'TOURIST',
      status: 'active',
      phone: body.phone || '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      nationality: '',
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    saveDb(db);
    const userPayload = {
      email: newUser.email,
      name: newUser.name,
      role: (newUser.role || 'TOURIST').toUpperCase(),
    };
    persistSession(userPayload);
    return { data: { token: localStorage.getItem(STORAGE_KEYS.TOKEN), user: userPayload } };
  }

  if (method === 'POST' && path === 'auth/forgot-password') {
    return { data: { message: 'If that email exists, a reset link was sent.' } };
  }

  // —— Profile ——
  if (path === 'users/me') {
    if (!user?.email) {
      return Promise.reject({ response: { status: 401, data: { message: 'Sign in required' } } });
    }
    const idx = db.users.findIndex((u) => u.email === user.email);
    const dbUser = idx >= 0 ? db.users[idx] : null;

    if (method === 'GET') {
      return {
        data: {
          name: dbUser?.name || user.name,
          email: user.email,
          role: user.role,
          phone: dbUser?.phone || '',
          emergencyContactName: dbUser?.emergencyContactName || '',
          emergencyContactPhone: dbUser?.emergencyContactPhone || '',
          nationality: dbUser?.nationality || '',
          preferredLanguage: dbUser?.preferredLanguage || 'en',
          memberSince: dbUser?.createdAt || null,
        },
      };
    }

    if (method === 'PUT') {
      const profile = {
        name: body.name?.trim() || dbUser?.name || user.name,
        phone: body.phone?.trim() || '',
        emergencyContactName: body.emergencyContactName?.trim() || '',
        emergencyContactPhone: body.emergencyContactPhone?.trim() || '',
        nationality: body.nationality?.trim() || '',
        preferredLanguage: body.preferredLanguage || 'en',
      };

      if (idx >= 0) {
        db.users[idx] = { ...db.users[idx], ...profile };
      }
      saveDb(db);

      const sessionUser = {
        email: user.email,
        name: profile.name,
        role: user.role,
        phone: profile.phone,
      };
      persistSession(sessionUser);

      return {
        data: {
          ...profile,
          email: user.email,
          role: user.role,
          memberSince: dbUser?.createdAt || null,
        },
      };
    }
  }

  // —— Public landing ——
  if (method === 'GET' && path === 'public/landing') {
    return {
      data: {
        destinations: db.destinations,
        safetyAlerts: db.safetyAlerts,
        emergencyServices: db.emergencyServices,
        safePlaces: db.safePlaces,
        travelGuide: db.travelGuide,
        testimonials: db.testimonials,
      },
    };
  }

  // —— Trips ——
  if (method === 'GET' && path === 'trips/my') {
    const email = normalizeEmail(user?.email);
    const trips = email
      ? db.trips.filter((t) => normalizeEmail(t.userEmail) === email)
      : db.trips;
    return { data: trips };
  }

  if (method === 'GET' && path.startsWith('trips/') && path !== 'trips/my') {
    const id = path.split('/')[1];
    const trip = db.trips.find((t) => String(t.id) === String(id));
    if (!trip) return Promise.reject({ response: { status: 404, data: { message: 'Trip not found' } } });
    return { data: trip };
  }

  if (method === 'POST' && path === 'trips') {
    if (!user?.email) {
      return Promise.reject({ response: { status: 401, data: { message: 'Sign in to create a trip' } } });
    }
    const dest = db.destinations.find((d) => body.destination?.includes(d.name)) ?? db.destinations[0];
    const trip = {
      id: nextId(db.trips),
      userEmail: normalizeEmail(user.email),
      title: body.title,
      destination: body.destination,
      startDate: body.startDate,
      endDate: body.endDate,
      notes: body.notes || '',
      status: 'planned',
      safetyScore: 80 + Math.floor(Math.random() * 15),
      lat: dest?.lat ?? 15.2993,
      lng: dest?.lng ?? 74.124,
    };
    db.trips.push(trip);
    db.notifications.unshift({
      id: nextId(db.notifications),
      userEmail: trip.userEmail,
      title: 'Trip created',
      body: `${trip.title} was added to your trips.`,
      time: 'Just now',
      unread: true,
    });
    saveDb(db);
    return { data: trip };
  }

  if (method === 'PUT' && path.startsWith('trips/')) {
    const id = path.split('/')[1];
    const idx = db.trips.findIndex((t) => String(t.id) === String(id));
    if (idx === -1) return Promise.reject({ response: { status: 404 } });
    db.trips[idx] = { ...db.trips[idx], ...body };
    saveDb(db);
    return { data: db.trips[idx] };
  }

  if (method === 'DELETE' && path.startsWith('trips/')) {
    const id = path.split('/')[1];
    db.trips = db.trips.filter((t) => String(t.id) !== String(id));
    saveDb(db);
    return { data: { success: true } };
  }

  if (method === 'GET' && path === 'admin/trips') {
    return { data: db.trips };
  }

  // —— Travel ——
  if (method === 'GET' && path === 'travel/attractions') return { data: db.attractions };
  if (method === 'GET' && path === 'travel/hotels') return { data: db.hotels };
  if (method === 'GET' && path === 'travel/restaurants') return { data: db.restaurants };

  if (method === 'GET' && path === 'travel/routes/recommendation') {
    const activeTrip = db.trips.find((t) => t.userEmail === user?.email && t.status === 'active') ?? db.trips[0];
    return {
      data: {
        distance: '24 km',
        duration: '42 min',
        safetyNote: `Route to ${activeTrip?.destination ?? 'your destination'} avoids high-risk zones.`,
        steps: ['Start at current location', 'Via NH66 main road', `Arrive ${activeTrip?.destination ?? 'destination'}`],
        center: activeTrip ? { lat: activeTrip.lat, lng: activeTrip.lng } : { lat: 15.2993, lng: 74.124 },
        markers: db.attractions.slice(0, 3).map((a) => ({
          id: a.id,
          lat: a.lat,
          lng: a.lng,
          label: a.name,
        })),
      },
    };
  }

  if (method === 'POST' && path === 'travel/ai/chat') {
    const userMessage = (body.message || '').toLowerCase();
    let reply = '';
    
    if (userMessage.includes('goa')) {
      reply = `Great choice for Goa! 🎉 Here's a safe plan:\n\n1. **Stay in** Baga or Calangute (well-lit, tourist-friendly)\n2. **Avoid** isolated beaches after 9 PM\n3. **Use** registered pre-paid taxis only\n4. **Emergency**: Keep 100/108 handy\n\nCurrent safety alerts: ${db.safetyAlerts.map(a => a.title).join(', ')}`;
    } else if (userMessage.includes('plan') || userMessage.includes('trip')) {
      reply = `Let's plan your safe trip! 🗺️\n\nFirst, tell me: \n- Destination\n- Dates\n- Travel type (solo/family/group)\n\nI'll help with:\n✅ Safe accommodations\n✅ Low-risk routes\n✅ Emergency contacts\n✅ Local safety tips`;
    } else if (userMessage.includes('dark') || userMessage.includes('night') || userMessage.includes('safe')) {
      reply = `Night safety tips 🌙:\n\n1. Travel in groups\n2. Stick to well-lit, busy areas\n3. Keep phone charged & GPS on\n4. Use ride-sharing apps with live tracking\n5. Avoid unlicensed vendors\n\nCurrent GeoFence alerts: ${db.geofenceAlerts.length}`;
    } else if (userMessage.includes('family') || userMessage.includes('kids')) {
      reply = `Family-friendly safety guide 👨‍👩‍👧:\n\n- Pick hotels with 24/7 security\n- Keep kids within sight at all times\n- Research kid-safe attractions first\n- Save local emergency numbers\n- Carry a small first-aid kit\n\nTop family spots: Goa beaches, Jaipur forts, Kerala backwaters!`;
    } else if (userMessage.includes('emergency') || userMessage.includes('sos')) {
      reply = `Emergency protocol ⚠️:\n\n1. Tap the SOS button in app immediately\n2. Share your live location\n3. Call local police (100) or ambulance (108)\n4. Notify your emergency contact\n\nWe've pre-saved your emergency contact in profile!`;
    } else {
      reply = `Hi there! 👋 I'm your safety travel assistant.\n\nAsk me about:\n- Trip planning\n- Safety tips\n- Emergency procedures\n- Destination advice\n- Family-friendly travel\n\nHow can I help you today?`;
    }
    
    return { data: { reply } };
  }

  // —— Safety / SOS / Incidents ——
  if (method === 'POST' && path === 'sos') {
    const sos = {
      id: nextId(db.sos),
      tourist: user?.name || 'Tourist',
      userEmail: user?.email,
      location: body.location || 'Current location',
      message: body.message || 'Emergency SOS',
      lat: body.lat ?? body.latitude ?? 15.2993,
      lng: body.lng ?? body.longitude ?? 74.124,
      status: 'active',
      time: new Date().toISOString(),
    };
    db.sos.unshift(sos);
    db.officerCases.unshift({
      id: nextId(db.officerCases),
      caseId: `SOS-${sos.id}`,
      tourist: sos.tourist,
      priority: 'critical',
      status: 'new',
    });
    saveDb(db);
    return { data: sos };
  }

  if (method === 'GET' && path === 'sos/my') {
    return { data: db.sos.filter((s) => s.userEmail === user?.email) };
  }

  if (method === 'GET' && path === 'sos/active') {
    return { data: db.sos.filter((s) => s.status === 'active') };
  }

  if (method === 'GET' && path === 'admin/sos') {
    return {
      data: db.sos.map((s) => ({
        ...s,
        time: relativeTime(s.time),
      })),
    };
  }

  if (method === 'POST' && path === 'incidents') {
    const incident = {
      id: nextId(db.incidents),
      userEmail: user?.email,
      type: body.type,
      location: body.location,
      occurredAt: body.occurredAt || new Date().toISOString(),
      description: body.description,
      status: 'open',
      lat: 15.49 + Math.random() * 0.05,
      lng: 73.82 + Math.random() * 0.05,
    };
    db.incidents.push(incident);
    if (user?.email) {
      db.notifications.unshift({
        id: nextId(db.notifications),
        userEmail: user.email,
        title: 'Incident reported',
        body: `Your ${body.type} report at ${body.location} was received.`,
        time: 'Just now',
        unread: true,
      });
    }
    saveDb(db);
    return { data: incident };
  }

  if (method === 'GET' && path === 'incidents/my') {
    return { data: db.incidents.filter((i) => i.userEmail === user?.email) };
  }

  if (method === 'GET' && path === 'incidents') {
    return { data: db.incidents };
  }

  if (method === 'GET' && path === 'geofence/alerts') {
    return { data: db.geofenceAlerts };
  }

  if (method === 'GET' && path === 'geofence/zones') {
    return { data: db.geofenceZones };
  }

  if (method === 'GET' && path === 'safety/stats') {
    return { data: computeSafetyStats(db, user?.email) };
  }

  // —— Analytics ——
  if (method === 'GET' && path === 'analytics/dashboard') {
    return { data: computeAnalytics(db) };
  }

  if (method === 'GET' && path === 'analytics/charts') {
    return { data: computeChartData(db) };
  }

  // —— Users ——
  if (method === 'GET' && path === 'admin/users') {
    return { data: db.users };
  }

  // —— Community ——
  if (method === 'GET' && path === 'community/posts') {
    return { data: db.communityPosts.filter((p) => p.flags < 2) };
  }

  if (method === 'GET' && path === 'admin/community') {
    return { data: db.communityPosts };
  }

  if (method === 'POST' && path === 'community/posts') {
    const post = {
      id: nextId(db.communityPosts),
      user: user?.name || 'Anonymous',
      text: body.text,
      likes: 0,
      flags: 0,
    };
    db.communityPosts.unshift(post);
    saveDb(db);
    return { data: post };
  }

  // —— Notifications ——
  if (method === 'GET' && path === 'notifications') {
    const list = db.notifications.filter((n) => n.userEmail === user?.email);
    return { data: list };
  }

  // —— Lost & found ——
  if (method === 'GET' && path === 'lost-found') {
    return { data: db.lostFound };
  }

  if (method === 'POST' && path === 'lost-found') {
    const item = {
      id: nextId(db.lostFound),
      item: body.item,
      location: body.location,
      status: 'open',
      reportedAt: new Date().toISOString(),
    };
    db.lostFound.unshift(item);
    saveDb(db);
    return { data: item };
  }

  // —— Officer ——
  if (method === 'GET' && path === 'officer/cases') {
    return { data: db.officerCases };
  }

  if (method === 'GET' && path === 'officer/stats') {
    return {
      data: {
        assignedCases: db.officerCases.length,
        activeSos: db.sos.filter((s) => s.status === 'active').length,
        openIncidents: db.incidents.filter((i) => i.status === 'open').length,
      },
    };
  }

  // —— Reports ——
  if (method === 'GET' && path === 'admin/reports') {
    return { data: db.reports };
  }

  // —— Maps ——
  if (method === 'GET' && path === 'maps/heatmap') {
    return {
      data: {
        center: db.heatmapPoints[0] ?? { lat: 15.2993, lng: 74.124 },
        heatmapData: db.heatmapPoints,
        markers: db.geofenceAlerts.map((a, i) => ({
          id: `gf-${i}`,
          lat: a.lat,
          lng: a.lng,
          label: a.zone,
        })),
      },
    };
  }

  if (method === 'GET' && path === 'maps/sos') {
    return {
      data: {
        center: db.sos[0] ? { lat: db.sos[0].lat, lng: db.sos[0].lng } : { lat: 15.2993, lng: 74.124 },
        markers: db.sos.map((s) => ({
          id: s.id,
          lat: s.lat,
          lng: s.lng,
          label: `${s.tourist} — ${s.status}`,
        })),
      },
    };
  }

  if (method === 'GET' && path === 'maps/safe-places') {
    const places = [
      ...db.hotels.map((h) => ({ id: `h-${h.id}`, lat: h.lat, lng: h.lng, label: h.name })),
      ...db.restaurants.map((r) => ({ id: `r-${r.id}`, lat: r.lat, lng: r.lng, label: r.name })),
    ];
    return {
      data: {
        center: places[0] ? { lat: places[0].lat, lng: places[0].lng } : { lat: 15.2993, lng: 74.124 },
        markers: places,
        safePlaces: db.safePlaces,
      },
    };
  }

  return Promise.reject({
    response: { status: 404, data: { message: `Mock API: ${method} /${path} not found` } },
  });
}
