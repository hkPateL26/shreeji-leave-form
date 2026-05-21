import React, { useState, useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import Skeleton from '../components/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  Mail, 
  Phone, 
  MessageSquare, 
  ChevronDown, 
  Loader2, 
  CheckCircle2, 
  ExternalLink,
  LifeBuoy
} from 'lucide-react';
import { vibrate } from '../utils/haptics';
import '../index.css';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const HelpSupport = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    message: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // 800ms premium feel micro-loading
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="glass-container form-container" style={{ paddingBottom: '140px', maxWidth: '850px', margin: '0 auto', width: '100%' }}>
          {/* Header Section */}
          <div className="header-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Skeleton width="180px" height="32px" borderRadius="10px" />
            <Skeleton width="280px" height="18px" borderRadius="6px" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '12px' }}>
            {/* Quick Contacts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ padding: '20px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Skeleton width="28px" height="28px" borderRadius="50%" />
                  <Skeleton width="100px" height="20px" borderRadius="6px" />
                  <Skeleton width="150px" height="14px" borderRadius="4px" />
                </div>
              ))}
            </div>

            {/* FAQs Accordion */}
            <div style={{ background: 'var(--bg-surface)', borderRadius: '24px', padding: '24px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Skeleton width="20px" height="20px" borderRadius="50%" />
                <Skeleton width="220px" height="22px" borderRadius="6px" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                    <Skeleton width="50%" height="16px" borderRadius="4px" />
                    <Skeleton width="16px" height="16px" borderRadius="4px" />
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket Form */}
            <div style={{ background: 'var(--bg-surface)', borderRadius: '24px', padding: '24px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Skeleton width="20px" height="20px" borderRadius="50%" />
                <Skeleton width="180px" height="22px" borderRadius="6px" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Skeleton width="80px" height="14px" borderRadius="4px" />
                    <Skeleton width="100%" height="45px" borderRadius="10px" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Skeleton width="90px" height="14px" borderRadius="4px" />
                    <Skeleton width="100%" height="45px" borderRadius="10px" />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Skeleton width="110px" height="14px" borderRadius="4px" />
                  <Skeleton width="100%" height="45px" borderRadius="10px" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Skeleton width="140px" height="14px" borderRadius="4px" />
                  <Skeleton width="100%" height="120px" borderRadius="10px" />
                </div>
                <Skeleton width="100%" height="45px" borderRadius="10px" />
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const faqs = [
    {
      q: "How do I request a leave?",
      a: "Go to the 'Leave' tab from the menu, select your leave dates, fill in the reason, upload any supporting documents if needed, and submit. You can track its approval status in the 'Status' tab."
    },
    {
      q: "What should I do if I forget to Check In or Check Out?",
      a: "If you missed checking in or out, please submit a quick support ticket here choosing the 'Attendance Correction' category, or contact your supervisor directly to update your hours."
    },
    {
      q: "Why is the page loading blank on my mobile?",
      a: "This app is continuously updated. If it appears blank or buggy, the browser's Service Worker may be caching an older version. Clear your browser cache or unregister the service worker in DevTools -> Application -> Service Workers, then reload."
    },
    {
      q: "How are my daily progress reports tracked?",
      a: "Your daily check-in and check-out responses are automatically logged and formatted into reports. These are sent directly to the management team for review and attendance verification."
    }
  ];

  const handleToggleFaq = (index) => {
    vibrate(10);
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }
    if (!formData.message.trim()) tempErrors.message = "Message is required";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      vibrate(50);
      return;
    }

    setIsSubmitting(true);
    vibrate(30);

    // Simulate sending support ticket to server
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        category: 'General Inquiry',
        message: ''
      });
      vibrate([40, 40, 40]);
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="glass-container form-container" style={{ paddingBottom: '140px', maxWidth: '850px', margin: '0 auto', width: '100%' }}>
        
        {/* Header Section */}
        <motion.div className="header-section" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="form-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <LifeBuoy className="upload-icon" size={28} />
            Help & Support
          </h2>
          <p className="form-subtitle">Contact administration, search FAQs, or open a support ticket</p>
        </motion.div>

        {/* ── Grid Layout for FAQs & Ticket ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '12px' }}>
          
          {/* Quick Contacts */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
          >
            <motion.a 
              href="mailto:support@shreejiitech.com"
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex', flexDirection: 'column', gap: '8px', padding: '20px',
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: '16px', color: 'inherit', textDecoration: 'none', transition: 'all 0.2s ease'
              }}
              onClick={() => vibrate(15)}
            >
              <Mail style={{ color: 'var(--accent)' }} size={24} />
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>Email Support</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>support@shreejiitech.com</div>
            </motion.a>

            <motion.a 
              href="https://wa.me/919999999999" 
              target="_blank" 
              rel="noreferrer"
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex', flexDirection: 'column', gap: '8px', padding: '20px',
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: '16px', color: 'inherit', textDecoration: 'none', transition: 'all 0.2s ease'
              }}
              onClick={() => vibrate(15)}
            >
              <MessageSquare style={{ color: '#25D366' }} size={24} />
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>WhatsApp Us</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Instant assistance on chat</div>
            </motion.a>

            <motion.a 
              href="tel:+919999999999"
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex', flexDirection: 'column', gap: '8px', padding: '20px',
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: '16px', color: 'inherit', textDecoration: 'none', transition: 'all 0.2s ease'
              }}
              onClick={() => vibrate(15)}
            >
              <Phone style={{ color: 'var(--success)' }} size={24} />
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>Call HR</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Emergency phone inquiries</div>
            </motion.a>
          </motion.div>

          {/* FAQs Accordion */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ background: 'var(--bg-surface)', borderRadius: '24px', padding: '24px', border: '1px solid var(--border-subtle)' }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <HelpCircle size={20} style={{ color: 'var(--accent)' }} />
              Frequently Asked Questions
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div 
                    key={index}
                    style={{ 
                      borderRadius: '12px', 
                      background: isOpen ? 'rgba(255,255,255,0.02)' : 'transparent',
                      border: '1px solid',
                      borderColor: isOpen ? 'var(--border-subtle)' : 'transparent',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <button
                      onClick={() => handleToggleFaq(index)}
                      style={{
                        width: '100%', padding: '16px', display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer',
                        color: 'inherit', textAlign: 'left', outline: 'none'
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: '14.5px', color: isOpen ? 'var(--accent)' : 'var(--text-primary)' }}>
                        {faq.q}
                      </span>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={18} style={{ color: 'var(--text-secondary)' }} />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div style={{ padding: '0 16px 16px', fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Ticket Form */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ background: 'var(--bg-surface)', borderRadius: '24px', padding: '24px', border: '1px solid var(--border-subtle)' }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <MessageSquare size={20} style={{ color: 'var(--accent)' }} />
              Open a Support Ticket
            </h3>

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Your Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Enter your name" 
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="name@example.com" 
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Topic / Category</label>
                <select 
                  className="form-input" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange}
                  style={{ appearance: 'none', backgroundPosition: 'right 16px center', backgroundRepeat: 'no-repeat' }}
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Attendance Correction">Attendance Correction / Logs</option>
                  <option value="Leave Questions">Leave Questions</option>
                  <option value="Technical Issue">Technical App Bug</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Describe Your Problem</label>
                <textarea 
                  className="form-textarea" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleInputChange} 
                  placeholder="Tell us what you need help with..."
                  style={{ minHeight: '120px' }}
                />
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>

              <button 
                type="submit" 
                className="submit-btn" 
                disabled={isSubmitting}
                style={{ background: 'var(--accent)', color: '#ffffff', boxShadow: '0 4px 12px var(--accent-glow)', margin: 0 }}
              >
                {isSubmitting ? (
                  <><Loader2 className="spinner" size={20} /> Creating Ticket...</>
                ) : (
                  'Submit Ticket'
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccess && (
            <div className="modal-overlay" onClick={() => setShowSuccess(false)}>
              <motion.div 
                className="modal-content"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{ borderTopColor: 'var(--success)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '50%' }}>
                    <CheckCircle2 size={48} style={{ color: 'var(--success)' }} />
                  </div>
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Ticket Created!
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '24px' }}>
                  Your support ticket has been received. Our team will review your query and contact you at your email address.
                </p>
                <button 
                  onClick={() => { vibrate(15); setShowSuccess(false); }}
                  className="submit-btn"
                  style={{ background: 'var(--text-primary)', color: 'var(--bg-base)', margin: 0 }}
                >
                  Done
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
};

export default HelpSupport;
