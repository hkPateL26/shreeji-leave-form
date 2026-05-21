import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  AlertCircle, 
  Loader2, 
  Send, 
  CheckSquare, 
  User, 
  Calendar, 
  FileText, 
  Paperclip, 
  Hourglass,
  CheckCircle2,
  Plus,
  ChevronDown
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Skeleton from '../components/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { vibrate } from '../utils/haptics';
import { addActivity, addLeave, getLeaves } from '../utils/activityService';
import '../index.css';

const WEBHOOK_URL = 'https://moonlight-pregame-ladybug.ngrok-free.dev/webhook/c046e597-d21c-44e4-969f-b263d86f5855';

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

const LeaveHistoryCard = ({ leave }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isApproved = leave.status === 'APPROVED';
  const themeGlow = isApproved ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)';
  const themeBorder = isApproved ? 'rgba(34,197,94,0.3)' : 'rgba(59,130,246,0.3)';
  
  const headerIcon = isApproved ? <CheckCircle2 size={20} color="#fff" /> : <Hourglass size={20} color="#fff" />;
  const headerText = isApproved ? 'Application Approved' : 'Application Received';
  const headerGradient = isApproved ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
  
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -4, scale: 1.01 }}
      style={{
        background: 'var(--bg-surface)',
        borderRadius: '24px',
        border: `1px solid ${themeBorder}`,
        boxShadow: `0 12px 30px -10px ${themeGlow}, inset 0 2px 0 0 rgba(255,255,255,0.05)`,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', background: `radial-gradient(circle, ${themeGlow} 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none', filter: 'blur(20px)', opacity: 0.8 }} />

      {/* Header */}
      <div 
        onClick={() => { vibrate(10); setIsExpanded(!isExpanded); }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: isExpanded ? '1px solid var(--border-subtle)' : 'none', paddingBottom: isExpanded ? '16px' : '0', position: 'relative', zIndex: 1, cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: headerGradient, padding: '10px', borderRadius: '12px', boxShadow: `0 6px 16px ${themeGlow}` }}>
            {headerIcon}
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Leave Status</div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>{headerText}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: isApproved ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', 
            color: isApproved ? '#22c55e' : '#f59e0b', 
            padding: '6px 12px', 
            borderRadius: '10px', 
            fontSize: '11px', 
            fontWeight: 800,
            border: `1px solid ${isApproved ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}`,
            boxShadow: `0 4px 10px ${isApproved ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)'}`
          }}>
            {leave.status}
          </div>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} style={{ color: 'var(--text-secondary)' }}>
            <ChevronDown size={20} />
          </motion.div>
        </div>
      </div>
      
      {/* Body Grid */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: '16px' }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', position: 'relative', zIndex: 1 }}>
              <div style={{ background: 'var(--bg-surface-solid)', padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <User size={14} /> <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Applicant</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{leave.name}</div>
              </div>
              
              <div style={{ background: 'var(--bg-surface-solid)', padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <Calendar size={14} /> <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {leave.startDate} {leave.endDate ? <span style={{ color: 'var(--text-secondary)', margin: '0 4px' }}>→</span> : ''} {leave.endDate}
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-solid)', padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--border-subtle)', gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <FileText size={14} /> <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reason</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.5 }}>{leave.reason}</div>
              </div>

              {leave.fileName && (
                <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, transparent 100%)', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(139,92,246,0.2)', gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ background: '#8b5cf6', padding: '6px', borderRadius: '8px', color: '#fff' }}><Paperclip size={14} /></div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{leave.fileName}</span>
                  </div>
                  <span onClick={() => vibrate(10)} style={{ color: '#8b5cf6', fontSize: '12px', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>View</span>
                </div>
              )}
            </div>
            
            {!isApproved && (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(245,158,11,0.05)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(245,158,11,0.1)', marginTop: '12px' }}>
                <Hourglass size={14} color="#f59e0b" />
                You will receive an automated update regarding your approval status shortly.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const LeaveForm = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('history'); // 'history' | 'form'
  const [leaves, setLeaves] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    startDate: '',
    endDate: '',
    reason: '',
    file: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load leaves and simulate loading
    setLeaves(getLeaves());
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file: file
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.startDate) newErrors.startDate = 'Start Date is required';
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('Type', 'Leave');
      submitData.append('Name', formData.name);
      submitData.append('Email', formData.email);
      submitData.append('Start Date', formData.startDate);
      if (formData.endDate) submitData.append('End Date', formData.endDate);
      submitData.append('Reason', formData.reason);

      if (formData.file) {
        submitData.append('File', formData.file);
      }

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: submitData
      });

      if (response.ok) {
        // Log activity
        addActivity({
          type: 'leave',
          name: formData.name,
          details: formData
        });
        
        // Add to leave history
        const newLeave = addLeave({
          name: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
          fileName: formData.file ? formData.file.name : null
        });
        
        setLeaves([newLeave, ...leaves]);
        
        // Reset form and return to history
        setFormData({ name: '', email: '', startDate: '', endDate: '', reason: '', file: null });
        setView('history');
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="glass-container form-container" style={{ paddingBottom: '100px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        
        {/* Header Section */}
        <motion.div className="header-section" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ flex: '1 1 min-content' }}>
            <h2 className="form-title" style={{ marginBottom: '4px', fontSize: 'clamp(24px, 6vw, 32px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {view === 'history' ? 'Leave History' : 'Request Leave'}
            </h2>
            <p className="form-subtitle" style={{ margin: 0, fontSize: 'clamp(13px, 3.5vw, 16px)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {view === 'history' ? 'Track your leave applications' : 'Fill in the details below'}
            </p>
          </div>
          
          {view === 'history' ? (
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { vibrate(15); setView('form'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'var(--accent)', color: 'white',
                border: 'none', padding: '10px 16px', borderRadius: '12px',
                fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(14,165,233,0.3)',
                flexShrink: 0
              }}
            >
              <Plus size={18} /> <span>Ask for Leave</span>
            </motion.button>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { vibrate(10); setView('history'); }}
              style={{
                background: 'var(--bg-base)', color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)', padding: '8px 16px', borderRadius: '12px',
                fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                flexShrink: 0
              }}
            >
              Cancel
            </motion.button>
          )}
        </motion.div>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Skeleton height="180px" borderRadius="12px" />
            <Skeleton height="180px" borderRadius="12px" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            
            {view === 'history' && (() => {
              const totalLeaves = leaves.length;
              const pendingLeaves = leaves.filter(l => l.status === 'PENDING').length;
              const approvedLeaves = leaves.filter(l => l.status === 'APPROVED').length;

              return (
              <motion.div 
                key="history"
                variants={containerVariants} initial="hidden" animate="show" exit={{ opacity: 0, y: -20 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                
                {/* ── Stats Row ───────────────────────────────── */}
                {totalLeaves > 0 && (
                  <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.05, transform: 'scale(1.5)', pointerEvents: 'none' }}>
                        <Calendar size={60} color="var(--text-primary)" />
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Total Leaves</div>
                      <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{totalLeaves}</div>
                    </div>

                    <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(34,197,94,0.2)', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px -8px rgba(34,197,94,0.15)' }}>
                      <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.1, transform: 'scale(1.5)', pointerEvents: 'none' }}>
                        <CheckCircle2 size={60} color="#22c55e" />
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Approved</div>
                      <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{approvedLeaves}</div>
                    </div>

                    <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(245,158,11,0.2)', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px -8px rgba(245,158,11,0.15)' }}>
                      <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.1, transform: 'scale(1.5)', pointerEvents: 'none' }}>
                        <Hourglass size={60} color="#f59e0b" />
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Pending</div>
                      <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{pendingLeaves}</div>
                    </div>
                  </motion.div>
                )}
                {leaves.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px dashed var(--border-subtle)' }}>
                    <Calendar size={40} color="var(--text-secondary)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                    <h3 style={{ margin: '0 0 8px', color: 'var(--text-primary)' }}>No Leave History</h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>You haven't applied for any leaves yet.</p>
                  </div>
                ) : (
                  leaves.map((leave) => (
                    <LeaveHistoryCard key={leave.id} leave={leave} />
                  ))
                )}
              </motion.div>
              );
            })()}

            {view === 'form' && (
              <motion.form 
                key="form"
                onSubmit={handleSubmit} noValidate variants={containerVariants} initial="hidden" animate="show" exit={{ opacity: 0, y: 20 }}
                style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-subtle)' }}
              >
                <motion.div className="form-group" variants={itemVariants}>
                  <label className="form-label">Name <span className="required-asterisk">*</span></label>
                  <input type="text" className="form-input" name="name" value={formData.name} onChange={(e) => handleChange(e.target)} placeholder="Enter your full name" />
                  {errors.name && <span className="error-message"><AlertCircle size={14} /> {errors.name}</span>}
                </motion.div>

                <motion.div className="form-group" variants={itemVariants}>
                  <label className="form-label">Email <span className="required-asterisk">*</span></label>
                  <input type="email" className="form-input" name="email" value={formData.email} onChange={(e) => handleChange(e.target)} placeholder="Enter your corporate email" />
                  {errors.email && <span className="error-message"><AlertCircle size={14} /> {errors.email}</span>}
                </motion.div>

                <motion.div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <motion.div className="form-group" variants={itemVariants} style={{ marginBottom: 0 }}>
                    <label className="form-label">Start Date <span className="required-asterisk">*</span></label>
                    <input type="date" className="form-input" name="startDate" value={formData.startDate} onChange={(e) => handleChange(e.target)} />
                    {errors.startDate && <span className="error-message"><AlertCircle size={14} /> {errors.startDate}</span>}
                  </motion.div>

                  <motion.div className="form-group" variants={itemVariants}>
                    <label className="form-label">End Date (Optional)</label>
                    <input type="date" className="form-input" name="endDate" value={formData.endDate} onChange={(e) => handleChange(e.target)} />
                  </motion.div>
                </motion.div>

                <motion.div className="form-group" variants={itemVariants}>
                  <label className="form-label">Reason <span className="required-asterisk">*</span></label>
                  <textarea className="form-textarea" name="reason" value={formData.reason} onChange={(e) => handleChange(e.target)} placeholder="Briefly explain the reason for your leave..." />
                  {errors.reason && <span className="error-message"><AlertCircle size={14} /> {errors.reason}</span>}
                </motion.div>

                <motion.div className="form-group" variants={itemVariants}>
                  <label className="form-label">File Attachment (Optional)</label>
                  <div className="file-upload-wrapper">
                    <input type="file" className="file-upload-input" onChange={handleFileChange} />
                    <div className="file-upload-custom">
                      <UploadCloud className="upload-icon" size={20} />
                      <span className="file-name" style={{ color: formData.file ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {formData.file ? formData.file.name : 'Choose file or drag & drop'}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.button 
                  variants={itemVariants}
                  type="submit" 
                  className="submit-btn" 
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => vibrate(30)}
                  style={{ 
                    background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', 
                    color: '#ffffff', 
                    boxShadow: '0 8px 20px -6px rgba(14, 165, 233, 0.5)',
                    border: 'none',
                    marginTop: '10px'
                  }}
                >
                  {isSubmitting ? <><Loader2 className="spinner" size={20} /> Submitting Request...</> : <><Send size={20} /> Submit Leave Request</>}
                </motion.button>
              </motion.form>
            )}
            
          </AnimatePresence>
        )}
      </div>
    </PageTransition>
  );
};

export default LeaveForm;
