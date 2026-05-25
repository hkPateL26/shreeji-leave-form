import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { getActivities, getCheckInStatus } from '../utils/activityService';
import {
  Clock, Calendar as CalendarIcon, LogIn, LogOut, CalendarRange,
  ChevronRight, ChevronDown, User, Mail, Code2, Globe,
  FileText, ClipboardList, CalendarDays, X, CheckCircle2, Hourglass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '../components/Skeleton';
import { vibrate, playCheckInSound, playCheckOutSound } from '../utils/haptics';
import '../index.css';

const DetailRow = ({ icon: Icon, label, value, color }) => {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ background: `${color}18`, border: `1px solid ${color}28`, borderRadius: '8px', padding: '5px', flexShrink: 0, display: 'flex' }}>
        <Icon size={13} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.6, wordBreak: 'break-word' }}>{value}</div>
      </div>
    </div>
  );
};

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.09 } } };
const itemVariants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 26 } } };

const typeConfig = {
  checkin:  { label: 'Check In',      color: '#10b981', icon: LogIn },
  checkout: { label: 'Check Out',     color: '#f43f5e', icon: LogOut },
  leave:    { label: 'Leave Request', color: '#0ea5e9', icon: CalendarRange },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState('Welcome back');
  const [currentDate, setCurrentDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');

  useEffect(() => {
    // Set greeting based on time
    const hr = new Date().getHours();
    if (hr < 12) setGreeting('Good Morning');
    else if (hr < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Set formatted date
    setCurrentDate(new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));

    // Simulate data fetch
    const fetchTimer = setTimeout(() => {
      setActivities(getActivities());
      setIsCheckedIn(getCheckInStatus());
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(fetchTimer);
  }, []);

  useEffect(() => {
    if (isLoading || activities.length === 0) {
      setSessionTime('');
      return;
    }

    if (!isCheckedIn) {
      // Find the last completed session duration if checked out
      const latestCheckOut = activities.find(a => a.type === 'checkout');
      if (latestCheckOut) {
        const matchingCheckIn = activities.find(
          a => a.type === 'checkin' && new Date(a.timestamp) < new Date(latestCheckOut.timestamp)
        );
        if (matchingCheckIn) {
          const durationMs = new Date(latestCheckOut.timestamp).getTime() - new Date(matchingCheckIn.timestamp).getTime();
          if (durationMs > 0) {
            const totalSecs = Math.floor(durationMs / 1000);
            const hrs = Math.floor(totalSecs / 3600);
            const mins = Math.floor((totalSecs % 3600) / 60);
            setSessionTime(`Last Session: ${hrs}h ${mins}m`);
            return;
          }
        }
      }
      setSessionTime('Session: Offline');
      return;
    }

    const latestCheckIn = activities.find(a => a.type === 'checkin');
    if (!latestCheckIn) {
      setSessionTime('Active: 00:00:00');
      return;
    }

    const startTime = new Date(latestCheckIn.timestamp).getTime();

    const updateTimer = () => {
      const diffMs = new Date().getTime() - startTime;
      if (diffMs < 0) {
        setSessionTime('Active: 00:00:00');
        return;
      }
      const totalSecs = Math.floor(diffMs / 1000);
      const hrs = Math.floor(totalSecs / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;
      const formatted = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      setSessionTime(`Active: ${formatted}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isCheckedIn, activities, isLoading]);

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const fmtTime = (d) => new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  const renderDetails = (activity) => {
    const d = activity.details || {};
    const color = typeConfig[activity.type]?.color || '#94a3b8';
    if (activity.type === 'checkin') return (
      <>
        <DetailRow icon={User}          label="Name"               value={activity.name || d.name}  color={color} />
        <DetailRow icon={Mail}          label="Email"              value={d.email}                  color={color} />
        <DetailRow icon={Code2}         label="Technology"         value={d.technology}             color={color} />
        <DetailRow icon={Globe}         label="Domain"             value={d.domain}                 color={color} />
        <DetailRow icon={FileText}      label="Yesterday Progress" value={d.yesterdayProgress}      color={color} />
        <DetailRow icon={ClipboardList} label="Today's Plan"       value={d.todayPlan}              color={color} />
      </>
    );
    if (activity.type === 'checkout') return (
      <>
        <DetailRow icon={User}          label="Name"             value={activity.name || d.name}  color={color} />
        <DetailRow icon={FileText}      label="Today's Progress" value={d.todayProgress}          color={color} />
        <DetailRow icon={ClipboardList} label="Tomorrow's Plan"  value={d.tomorrowPlan}           color={color} />
      </>
    );
    if (activity.type === 'leave') return (
      <>
        <DetailRow icon={User}         label="Name"       value={activity.name || d.name}  color={color} />
        <DetailRow icon={Mail}         label="Email"      value={d.email}                  color={color} />
        <DetailRow icon={CalendarDays} label="Start Date" value={d.startDate}              color={color} />
        <DetailRow icon={CalendarDays} label="End Date"   value={d.endDate || 'N/A'}       color={color} />
        <DetailRow icon={FileText}     label="Reason"     value={d.reason}                 color={color} />
      </>
    );
    return null;
  };

  return (
    <PageTransition>
      <div className="glass-container dashboard-container" style={{ paddingBottom: '140px' }}>

        {/* ── Welcome Banner & Quick Stats (Desktop Only) ── */}
        {!isLoading && (
          <>
            <div className="desktop-welcome-banner">
              <div className="welcome-banner-overlay" />
              <div className="welcome-banner-content">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                  <span className="welcome-badge">Workspace Active</span>
                  <h1 className="welcome-title">{greeting}, {activities[0]?.name || "Intern"}! 👋</h1>
                  <p className="welcome-subtitle">Have a productive and wonderful day ahead. All your logs are synced live with the Shreeji I-tech servers.</p>
                </motion.div>
                <motion.div className="welcome-banner-right" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
                  <div className="banner-date-card">
                    <CalendarIcon size={20} className="banner-date-icon" />
                    <span className="banner-date-text">{currentDate}</span>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="desktop-metrics-grid">
              <motion.div className="metric-card" whileHover={{ y: -4 }}>
                <div className="metric-icon-wrapper checkin-glow">
                  <LogIn size={20} color="#10b981" />
                </div>
                <div className="metric-details">
                  <span className="metric-label">Status</span>
                  <span className="metric-value" style={{ color: isCheckedIn ? '#f43f5e' : '#10b981' }}>
                    {isCheckedIn ? 'Checked In' : 'Checked Out'}
                  </span>
                  {sessionTime && (
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {sessionTime}
                    </span>
                  )}
                </div>
              </motion.div>
              
              <motion.div className="metric-card" whileHover={{ y: -4 }}>
                <div className="metric-icon-wrapper activity-glow">
                  <ClipboardList size={20} color="#0ea5e9" />
                </div>
                <div className="metric-details">
                  <span className="metric-label">Submissions</span>
                  <span className="metric-value">{activities.length} Logs</span>
                </div>
              </motion.div>

              <motion.div className="metric-card" whileHover={{ y: -4 }}>
                <div className="metric-icon-wrapper role-glow">
                  <User size={20} color="#8b5cf6" />
                </div>
                <div className="metric-details">
                  <span className="metric-label">Internship Role</span>
                  <span className="metric-value">Developer</span>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* ═══ Desktop 2-col grid ═══════════════════════════════ */}
        {isLoading ? (
          <>
            {/* Desktop Welcome Banner & Metrics Skeleton (Desktop only) */}
            <div className="desktop-only-banner" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px', width: '100%' }}>
              <Skeleton height="120px" borderRadius="24px" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <Skeleton height="88px" borderRadius="20px" />
                <Skeleton height="88px" borderRadius="20px" />
                <Skeleton height="88px" borderRadius="20px" />
              </div>
            </div>
            <div className="dashboard-desktop-grid">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Skeleton height="20px" width="100px" borderRadius="4px" />
                <Skeleton height="90px" borderRadius="22px" />
                <div className="desktop-only-banner" style={{ marginTop: '24px' }}>
                  <Skeleton height="140px" borderRadius="22px" />
                  <Skeleton height="140px" borderRadius="22px" style={{ marginTop: '24px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Skeleton height="20px" width="120px" borderRadius="4px" />
                <Skeleton height="70px" borderRadius="16px" />
                <Skeleton height="70px" borderRadius="16px" />
                <Skeleton height="70px" borderRadius="16px" />
              </div>
            </div>
          </>
        ) : (
        <div className="dashboard-desktop-grid">

          {/* ── Col 1: Status ──────────────────────────────────── */}
          <div>
            <motion.div variants={itemVariants} initial="hidden" animate="show" style={{ marginBottom: '28px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Daily Status
              </p>

              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  vibrate(40);
                  if (!isCheckedIn) {
                    playCheckInSound();
                    navigate('/checkin');
                  } else {
                    playCheckOutSound();
                    setShowModal(true);
                  }
                }}
                style={{
                  borderRadius: '22px', padding: '20px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: isCheckedIn
                    ? 'linear-gradient(145deg, rgba(244,63,94,0.13), rgba(225,29,72,0.04))'
                    : 'linear-gradient(145deg, rgba(16,185,129,0.13), rgba(5,150,105,0.04))',
                  border: `1px solid ${isCheckedIn ? 'rgba(244,63,94,0.28)' : 'rgba(16,185,129,0.28)'}`,
                  boxShadow: isCheckedIn ? '0 10px 32px -10px rgba(244,63,94,0.28)' : '0 10px 32px -10px rgba(16,185,129,0.22)',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '60px', height: '34px', borderRadius: '100px', padding: '4px',
                    background: 'var(--bg-surface-solid)',
                    border: `1px solid ${isCheckedIn ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.3)'}`,
                    display: 'flex', alignItems: 'center',
                    justifyContent: isCheckedIn ? 'flex-end' : 'flex-start',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.25)'
                  }}>
                    <motion.div layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: isCheckedIn ? 'linear-gradient(135deg,#fb7185,#e11d48)' : 'linear-gradient(135deg,#34d399,#059669)',
                      boxShadow: isCheckedIn ? '0 0 10px rgba(244,63,94,0.55)' : '0 0 10px rgba(16,185,129,0.55)',
                    }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
                      {isCheckedIn ? 'Checked In' : 'Checked Out'}
                    </div>
                    <div style={{ fontSize: '13px', marginTop: '2px', fontWeight: 600, color: isCheckedIn ? '#fb7185' : '#34d399' }}>
                      {isCheckedIn ? 'Tap to Check Out →' : 'Tap to Check In →'}
                    </div>
                    {sessionTime && (
                      <div style={{ 
                        fontSize: '11px', 
                        marginTop: '6px', 
                        fontWeight: 700, 
                        color: isCheckedIn ? '#fb7185' : 'var(--text-secondary)', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.04em', 
                        background: isCheckedIn ? 'rgba(244,63,94,0.1)' : 'rgba(255,255,255,0.06)', 
                        padding: '3px 8px', 
                        borderRadius: '6px', 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: isCheckedIn ? '1px solid rgba(244,63,94,0.15)' : '1px solid var(--border-subtle)'
                      }}>
                        ⏱️ {sessionTime}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isCheckedIn ? 'rgba(244,63,94,0.12)' : 'rgba(16,185,129,0.12)',
                  color: isCheckedIn ? '#f43f5e' : '#10b981',
                  border: `1px solid ${isCheckedIn ? 'rgba(244,63,94,0.2)' : 'rgba(16,185,129,0.2)'}`
                }}>
                  <ChevronRight size={17} />
                </div>
              </motion.div>
            </motion.div>

            {/* ── Desktop Weekly Tracker & Profile (Desktop Only) ── */}
            <div className="desktop-only-banner">
              <motion.div className="desktop-attendance-card" variants={itemVariants} initial="hidden" animate="show">
                <p className="card-section-title">Weekly Attendance Tracker</p>
                <div className="weekly-tracker-grid">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => {
                    const todayIdx = new Date().getDay() - 1; // 0 for Mon, 4 for Fri
                    const isPastOrToday = idx <= todayIdx;
                    const isChecked = isPastOrToday && (idx < todayIdx || isCheckedIn);
                    
                    return (
                      <div key={day} className="weekly-tracker-day">
                        <span className="tracker-day-name">{day}</span>
                        <div className={`tracker-day-dot ${isChecked ? 'active' : isPastOrToday ? 'pending' : ''}`}>
                          {isChecked ? <CheckCircle2 size={12} color="#fff" /> : isPastOrToday ? <Hourglass size={12} color="var(--text-secondary)" /> : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div className="desktop-profile-card" variants={itemVariants} initial="hidden" animate="show">
                <div className="profile-card-header">
                  <div className="profile-avatar-wrapper">
                    <User size={20} />
                  </div>
                  <div className="profile-header-info">
                    <span className="profile-name">{activities[0]?.name || "Intern"}</span>
                    <span className="profile-role">Shreeji Intern</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Technology:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{activities.find(a => a.type === 'checkin')?.details?.technology || 'React + Node'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingBottom: '2px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                    <span style={{ fontWeight: 700, color: isCheckedIn ? '#10b981' : '#f43f5e' }}>{isCheckedIn ? 'ACTIVE' : 'INACTIVE'}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ── Col 2: Recent Activity ─────────────────────────── */}
          <div>
            <motion.div variants={containerVariants} initial="hidden" animate="show">
              <motion.p variants={itemVariants} style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Recent Activity
              </motion.p>

              {activities.length === 0 ? (
                <motion.div variants={itemVariants} style={{
                  textAlign: 'center', padding: '44px 16px',
                  background: 'var(--bg-surface)', borderRadius: '18px',
                  border: '1px dashed var(--border-subtle)'
                }}>
                  <Clock size={28} style={{ opacity: 0.3, color: 'var(--text-secondary)', marginBottom: '10px' }} />
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>No activity recorded yet.</p>
                </motion.div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="desktop-activity-scroll-list">
                    {activities.slice(0, 3).map((activity) => {
                      const cfg = typeConfig[activity.type] || { label: activity.type, color: '#94a3b8', icon: Clock };
                      const { label, color, icon: Icon } = cfg;
                      const isExpanded = expandedId === activity.id;
                      return (
                        <motion.div
                          key={activity.id}
                          layout
                          variants={itemVariants}
                          onClick={() => { vibrate(15); setExpandedId(isExpanded ? null : activity.id); }}
                          whileTap={{ scale: 0.985 }}
                          style={{
                            background: 'var(--bg-surface)',
                            border: `1px solid ${isExpanded ? color + '45' : 'var(--border-subtle)'}`,
                            borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
                            boxShadow: isExpanded ? `0 6px 20px -6px ${color}28` : 'none',
                            transition: 'border-color 0.25s, box-shadow 0.25s',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 14px' }}>
                            <div style={{
                              width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                              background: `${color}16`, border: `1px solid ${color}28`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                              <Icon size={18} color={color} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>{label}</span>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{fmtTime(activity.timestamp)}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <CalendarIcon size={11} />
                                  {fmtDate(activity.timestamp)}
                                </div>
                                {activity.name && (
                                  <span style={{ fontSize: '12px', color, fontWeight: 700, maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {activity.name}
                                  </span>
                                )}
                              </div>
                            </div>
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                              style={{ color: isExpanded ? color : 'var(--text-secondary)', flexShrink: 0 }}
                            >
                              <ChevronDown size={16} />
                            </motion.div>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                style={{ overflow: 'hidden' }}
                              >
                                <div style={{ margin: '0 14px', paddingBottom: '14px', borderTop: `1px solid ${color}20` }}>
                                  <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                                    background: `${color}12`, border: `1px solid ${color}25`,
                                    borderRadius: '100px', padding: '4px 10px', marginTop: '12px', marginBottom: '8px',
                                    fontSize: '11px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.05em'
                                  }}>
                                    {label} Details
                                  </div>
                                  {renderDetails(activity)}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {activities.length > 3 && (
                    <motion.button
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { vibrate(20); setShowHistoryModal(true); }}
                      style={{
                        width: '100%', padding: '14px', marginTop: '8px',
                        background: 'var(--bg-surface)', color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)', borderRadius: '16px',
                        fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                      }}
                    >
                      See All Activity <ChevronRight size={14} />
                    </motion.button>
                  )}
                </div>
              )}
            </motion.div>
          </div>

        </div>
        )}
      </div>{/* /glass-container */}

      {/* ── Checkout Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay">
            <motion.div
              className="modal-content"
              initial={{ scale: 0.88, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            >
              <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', width: '150px', height: '150px', background: 'rgba(244,63,94,0.18)', filter: 'blur(50px)', borderRadius: '50%', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                  initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.08, stiffness: 400, damping: 20 }}
                  style={{ display: 'inline-flex', padding: '16px', background: 'rgba(244,63,94,0.12)', borderRadius: '50%', color: '#fb7185', marginBottom: '18px', border: '1px solid rgba(244,63,94,0.2)', boxShadow: '0 8px 32px rgba(244,63,94,0.2)' }}
                >
                  <LogOut size={30} strokeWidth={2.5} />
                </motion.div>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '22px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.5px' }}>Check Out?</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '22px', lineHeight: 1.6 }}>
                  Are you sure you want to end your day? You will be asked to submit your daily progress.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { vibrate(30); setShowModal(false); navigate('/checkout'); }}
                    style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#f43f5e,#e11d48)', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 18px -4px rgba(244,63,94,0.55)' }}
                  >
                    Yes, Check Out
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => { vibrate(10); setShowModal(false); }}
                    style={{ width: '100%', padding: '14px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '14px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Activity History Modal ─────────────────────────── */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" style={{ padding: '20px' }}>
            <motion.div
              className="modal-content"
              initial={{ scale: 0.88, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              style={{ width: '100%', maxWidth: '500px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: 0 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '18px', fontWeight: 800 }}>Activity History</h3>
                <button onClick={() => { vibrate(10); setShowHistoryModal(false); }} style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <X size={16} />
                </button>
              </div>
              
              <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                {activities.map((activity) => {
                  const cfg = typeConfig[activity.type] || { label: activity.type, color: '#94a3b8', icon: Clock };
                  const { label, color, icon: Icon } = cfg;
                  const isExpanded = expandedId === activity.id;
                  return (
                    <motion.div
                      key={activity.id}
                      layout
                      onClick={() => setExpandedId(isExpanded ? null : activity.id)}
                      whileTap={{ scale: 0.985 }}
                      style={{
                        background: 'var(--bg-surface)',
                        border: `1px solid ${isExpanded ? color + '45' : 'var(--border-subtle)'}`,
                        borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
                        boxShadow: isExpanded ? `0 6px 20px -6px ${color}28` : 'none',
                        transition: 'border-color 0.25s, box-shadow 0.25s',
                        flexShrink: 0
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 14px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0, background: `${color}16`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={18} color={color} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>{label}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{fmtTime(activity.timestamp)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <CalendarIcon size={11} />
                              {fmtDate(activity.timestamp)}
                            </div>
                            {activity.name && (
                              <span style={{ fontSize: '12px', color, fontWeight: 700, maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {activity.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} style={{ color: isExpanded ? color : 'var(--text-secondary)', flexShrink: 0 }}>
                          <ChevronDown size={16} />
                        </motion.div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                            <div style={{ margin: '0 14px', paddingBottom: '14px', borderTop: `1px solid ${color}20` }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: `${color}12`, border: `1px solid ${color}25`, borderRadius: '100px', padding: '4px 10px', marginTop: '12px', marginBottom: '8px', fontSize: '11px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {label} Details
                              </div>
                              {renderDetails(activity)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default Dashboard;
