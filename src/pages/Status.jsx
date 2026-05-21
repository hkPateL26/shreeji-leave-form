import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  Target, 
  Hourglass, 
  Timer, 
  Palmtree, 
  ClipboardList, 
  CheckCircle2, 
  Clock,
  Flame,
  Trophy,
  Activity,
  CalendarDays,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import PageTransition from '../components/PageTransition';
import Skeleton from '../components/Skeleton';
import CircularProgress from '../components/CircularProgress';
import '../index.css';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const MetricCard = ({ icon: Icon, title, value, color }) => (
  <motion.div 
    variants={itemVariants}
    whileHover={{ scale: 1.03, y: -4 }}
    style={{ 
      background: 'var(--bg-surface)', 
      borderRadius: '24px', 
      padding: '20px',
      border: `1px solid ${color}30`,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      boxShadow: `0 10px 30px -10px ${color}20, inset 0 2px 0 0 rgba(255,255,255,0.05)`,
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none', filter: 'blur(10px)' }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
      <div style={{ background: `linear-gradient(135deg, ${color}20, ${color}05)`, padding: '10px', borderRadius: '14px', color: color, boxShadow: `inset 0 0 0 1px ${color}40` }}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</span>
    </div>
    <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px', display: 'flex', alignItems: 'baseline', gap: '4px', position: 'relative', zIndex: 1 }}>
      {value.split(' ').map((part, i) => (
        <span key={i} style={{ fontSize: i > 0 ? '15px' : 'inherit', color: i > 0 ? 'var(--text-secondary)' : 'inherit' }}>{part}</span>
      ))}
    </div>
  </motion.div>
);

// Dummy Data for Advanced Features
const chartData = [
  { name: 'Mon', hours: 7.5 },
  { name: 'Tue', hours: 8.2 },
  { name: 'Wed', hours: 8.0 },
  { name: 'Thu', hours: 9.1 },
  { name: 'Fri', hours: 7.8 },
  { name: 'Sat', hours: 4.0 },
  { name: 'Sun', hours: 0 },
];

const timelineEvents = [
  { time: '09:00 AM', title: 'Checked In', desc: 'Office - Main Desk', type: 'in', icon: MapPin, color: '#38bdf8' },
  { time: '01:15 PM', title: 'Lunch Break', desc: '45 mins offline', type: 'break', icon: Clock, color: '#f59e0b' },
  { time: '02:00 PM', title: 'Resumed', desc: 'Back to work', type: 'resume', icon: Activity, color: '#10b981' },
  { time: '06:30 PM', title: 'Checked Out', desc: 'Completed 8h 45m', type: 'out', icon: CheckCircle2, color: '#22c55e' }
];

const heatmapData = Array.from({ length: 35 }, (_, i) => Math.floor(Math.random() * 5)); // 0 to 4 levels

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-surface-solid)', padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>{label}</p>
        <p style={{ margin: 0, color: 'var(--accent)', fontSize: '16px', fontWeight: 800 }}>{payload[0].value} <span style={{fontSize: '12px', color: 'var(--text-secondary)'}}>hrs</span></p>
      </div>
    );
  }
  return null;
};

const Status = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('Month');

  // Dummy data for different time filters
  const filterData = {
    Day: { progress: 100, target: '8 hrs', worked: '8h 15m', remaining: '0 hrs' },
    Week: { progress: 85, target: '40 hrs', worked: '34h 10m', remaining: '5h 50m' },
    Month: { progress: 75, target: '120 hrs', worked: '90h 17m', remaining: '29h 43m' }
  };

  const currentData = filterData[timeFilter];

  // Simulate network request
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageTransition>
      <div className="glass-container" style={{ paddingBottom: '120px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Skeleton height="360px" borderRadius="32px" />
            <Skeleton height="220px" borderRadius="32px" />
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Attendance & Target Dashboard */}
            <motion.div variants={itemVariants} style={{ 
              display: 'flex', flexDirection: 'column', 
              background: 'linear-gradient(145deg, var(--bg-surface) 0%, rgba(30,41,59,0.15) 100%)', 
              padding: '24px 20px', borderRadius: '24px', position: 'relative', overflow: 'hidden', 
              border: '1px solid var(--border-subtle)', boxShadow: '0 8px 30px -10px rgba(0,0,0,0.15)' 
            }}>
              
              <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(30px)', opacity: 0.8 }} />

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #38bdf8 100%)', padding: '10px', borderRadius: '12px', color: '#fff', boxShadow: '0 6px 16px var(--accent-glow)' }}>
                    <BarChart2 size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Attendance Overview</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>Your progress summary</p>
                  </div>
                </div>
                
                {/* Time Filter Toggle */}
                <div style={{ display: 'flex', background: 'var(--bg-surface-solid)', borderRadius: '12px', padding: '4px', border: '1px solid var(--border-subtle)' }}>
                  {['Day', 'Week', 'Month'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setTimeFilter(f)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        background: timeFilter === f ? 'var(--accent)' : 'transparent',
                        color: timeFilter === f ? '#fff' : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: timeFilter === f ? '0 4px 10px var(--accent-glow)' : 'none'
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Content Grid (Responsive) */}
              <div className="status-overview-grid">
                
                {/* Circular Progress */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '130%', height: '130%', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 60%)', filter: 'blur(25px)', zIndex: -1, opacity: 0.6 }} />
                    <CircularProgress percentage={currentData.progress} size={150} strokeWidth={14} color="var(--accent)" />
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'var(--bg-surface)', padding: '6px 16px', borderRadius: '20px', border: '1px solid var(--border-subtle)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    Overall Progress
                  </div>
                </div>
                
                {/* Metrics Grid */}
                <div className="status-metrics-grid" style={{ marginTop: '20px' }}>
                  <MetricCard icon={Target} title="Target" value={currentData.target} color="#ef4444" />
                  <MetricCard icon={Hourglass} title="Worked" value={currentData.worked} color="#f59e0b" />
                  <MetricCard icon={Timer} title="Remaining" value={currentData.remaining} color="#10b981" />
                </div>
                
              </div>
            </motion.div>



            {/* Productivity Trends (Chart) */}
            <motion.div variants={itemVariants} style={{ 
              background: 'linear-gradient(145deg, var(--bg-surface) 0%, rgba(30,41,59,0.15) 100%)', 
              padding: '24px 20px', borderRadius: '24px', border: '1px solid var(--border-subtle)', 
              boxShadow: '0 8px 30px -10px rgba(0,0,0,0.15)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ background: 'var(--bg-surface-solid)', padding: '10px', borderRadius: '12px', color: 'var(--accent)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <TrendingUp size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Productivity Trends</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>Hours worked this week</p>
                </div>
              </div>
              
              <div style={{ height: '220px', width: '100%', marginTop: '20px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-subtle)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area type="monotone" dataKey="hours" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>



            {/* Leave Summary */}
            <motion.div variants={itemVariants} style={{ 
              display: 'flex', flexDirection: 'column', 
              background: 'linear-gradient(145deg, var(--bg-surface) 0%, rgba(30,41,59,0.15) 100%)', 
              padding: '24px 20px', borderRadius: '24px', position: 'relative', overflow: 'hidden', 
              border: '1px solid var(--border-subtle)', boxShadow: '0 8px 30px -10px rgba(0,0,0,0.15)' 
            }}>
              
              <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(30px)', opacity: 0.8 }} />

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                <div style={{ background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)', padding: '10px', borderRadius: '12px', color: '#fff', boxShadow: '0 6px 16px rgba(34,197,94,0.3)' }}>
                  <Palmtree size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Leave Status</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>Your time off summary</p>
                </div>
              </div>
              
              {/* Content Grid (Responsive) */}
              <div className="status-leave-grid">
                
                <motion.div whileHover={{ scale: 1.02 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid var(--border-subtle)', backdropFilter: 'blur(10px)', boxShadow: 'inset 0 2px 0 0 rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'var(--bg-surface-solid)', padding: '12px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      <ClipboardList size={22} color="var(--text-primary)" />
                    </div>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.02em' }}>Total Applied</span>
                  </div>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>4</span>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <motion.div whileHover={{ scale: 1.04, y: -4 }} style={{ padding: '20px 16px', background: 'linear-gradient(180deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.02) 100%)', borderRadius: '20px', border: '1px solid rgba(34,197,94,0.25)', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px -8px rgba(34,197,94,0.15)' }}>
                    <div style={{ background: 'rgba(34,197,94,0.15)', padding: '8px', borderRadius: '50%', color: '#22c55e' }}>
                      <CheckCircle2 size={20} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: '#22c55e', lineHeight: 1 }}>2</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 700, marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Approved</div>
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.04, y: -4 }} style={{ padding: '20px 16px', background: 'linear-gradient(180deg, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.02) 100%)', borderRadius: '20px', border: '1px solid rgba(59,130,246,0.25)', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px -8px rgba(59,130,246,0.15)' }}>
                    <div style={{ background: 'rgba(59,130,246,0.15)', padding: '8px', borderRadius: '50%', color: '#3b82f6' }}>
                      <Clock size={20} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: '#3b82f6', lineHeight: 1 }}>2</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 700, marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending</div>
                    </div>
                  </motion.div>
                </div>
                
              </div>
            </motion.div>

          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default Status;
