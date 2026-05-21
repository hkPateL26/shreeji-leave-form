import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, CalendarRange, PieChart, HelpCircle } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import CheckIn from './pages/CheckIn';
import CheckOut from './pages/CheckOut';
import LeaveForm from './pages/LeaveForm';
import Status from './pages/Status';
import HelpSupport from './pages/HelpSupport';
import BottomNav from './components/BottomNav';
import ThemeToggle from './components/ThemeToggle';
import { vibrate } from './utils/haptics';

import './index.css';

/* ── Desktop Sidebar ─────────────────────────────────── */
const Sidebar = () => {
  const location = useLocation();
  const links = [
    { path: '/',      label: 'Dashboard', icon: LayoutDashboard },
    { path: '/status',label: 'Status',    icon: PieChart },
    { path: '/leave', label: 'Leave',     icon: CalendarRange },
    { path: '/support',label: 'Support',   icon: HelpCircle },
  ];

  return (
    <aside className="desktop-sidebar">
      {/* Branding */}
      <div className="sidebar-brand">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '42px', width: '42px', flexShrink: 0 }}>
          <img src="/logo.png" alt="Shreeji I-tech" style={{ height: '100%', width: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(14,165,233,0.4))' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px', lineHeight: '1.1' }}>Shreeji I-tech</div>
          <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.2px', marginTop: '2px' }}>Intern Portal</div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '8px 0 16px' }} />

      {/* Nav Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', paddingLeft: '12px' }}>
          Menu
        </p>
        {links.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink key={path} to={path} end={path === '/'} style={{ textDecoration: 'none' }} onClick={() => vibrate(20)}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                  background: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '14px',
                  transition: 'background 0.2s ease, color 0.2s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(14,165,233,0.35)' : 'none',
                }}
              >
                <Icon size={17} />
                {label}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer area inside sidebar (e.g. user profile or nothing) */}
      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.05em' }}>v2.0.1</span>
      </div>
    </aside>
  );
};

/* ── Top Header (Mobile & Desktop) ───────────────────── */
const TopHeader = () => {
  const location = useLocation();
  const getTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard Overview';
      case '/checkin': return 'Daily Check In';
      case '/checkout': return 'Daily Check Out';
      case '/leave': return 'Leave Request';
      case '/status': return 'Status Dashboard';
      case '/support': return 'Help & Support';
      default: return 'Portal';
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="top-header"
    >
      <div className="top-header-left">
        <img src="/logo.png" alt="Shreeji I-tech" className="mobile-only-logo" style={{ height: '30px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(14,165,233,0.35))' }} />
        <h1 className="desktop-only-title">{getTitle()}</h1>
      </div>
      <ThemeToggle inline />
    </motion.header>
  );
};

/* ── Animated Routes ─────────────────────────────────── */
const AppLayout = () => {
  const location = useLocation();
  return (
    <div className="app-shell">
      {/* Sidebar — desktop only */}
      <Sidebar />

      {/* Right side */}
      <div className="app-main">
        {/* Unified Top Header */}
        <TopHeader />

        {/* Scrollable page content */}
        <div className="content-area">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/"         element={<Dashboard />} />
              <Route path="/checkin"  element={<CheckIn />} />
              <Route path="/checkout" element={<CheckOut />} />
              <Route path="/leave"    element={<LeaveForm />} />
              <Route path="/status"   element={<Status />} />
              <Route path="/support"  element={<HelpSupport />} />
            </Routes>
          </AnimatePresence>
        </div>

        {/* Mobile bottom nav */}
        <BottomNav />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;