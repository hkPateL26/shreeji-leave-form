import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { addActivity, setCheckInStatus } from '../utils/activityService';
import { Loader2, AlertCircle, Clock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import Skeleton from '../components/Skeleton';
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

const CheckIn = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    technology: '',
    domain: '',
    yesterdayProgress: '',
    todayPlan: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    setCurrentTime(timeString);
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

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.technology.trim()) newErrors.technology = 'Technology is required';
    if (!formData.domain.trim()) newErrors.domain = 'Domain is required';
    if (!formData.yesterdayProgress.trim()) newErrors.yesterdayProgress = 'Progress is required';
    if (!formData.todayPlan.trim()) newErrors.todayPlan = 'Plan is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('Type', 'Check-In');
      submitData.append('Time', currentTime);
      submitData.append('Name', formData.name);
      submitData.append('Email', formData.email);
      submitData.append('Technology', formData.technology);
      submitData.append('Domain', formData.domain);
      submitData.append('Yesterday Progress', formData.yesterdayProgress);
      submitData.append('Today Plan', formData.todayPlan);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: submitData
      });

      if (response.ok) {
        addActivity({
          type: 'checkin',
          name: formData.name,
          details: formData
        });
        setCheckInStatus(true);
        
        navigate('/', { replace: true });
      } else {
        throw new Error('Check In submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your Check In. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="glass-container form-container">
        <motion.div className="header-section" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="form-title">Daily Check In</h2>
          <div className="badge">
            <Clock size={16} />
            <span>{currentTime}</span>
          </div>
        </motion.div>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Skeleton height="70px" borderRadius="12px" />
            <Skeleton height="70px" borderRadius="12px" />
            <Skeleton height="70px" borderRadius="12px" />
            <Skeleton height="70px" borderRadius="12px" />
            <Skeleton height="50px" borderRadius="12px" />
          </div>
        ) : (
        <motion.form onSubmit={handleSubmit} noValidate variants={containerVariants} initial="hidden" animate="show">
          <motion.div className="form-group" variants={itemVariants}>
            <label className="form-label">Name <span className="required-asterisk">*</span></label>
            <input type="text" className="form-input" name="name" value={formData.name} onChange={(e) => handleChange(e.target)} placeholder="Your full name" />
            {errors.name && <span className="error-message"><AlertCircle size={14} /> {errors.name}</span>}
          </motion.div>

          <motion.div className="form-group" variants={itemVariants}>
            <label className="form-label">Email <span className="required-asterisk">*</span></label>
            <input type="email" className="form-input" name="email" value={formData.email} onChange={(e) => handleChange(e.target)} placeholder="Your corporate email" />
            {errors.email && <span className="error-message"><AlertCircle size={14} /> {errors.email}</span>}
          </motion.div>

          <motion.div className="form-group" variants={itemVariants}>
            <label className="form-label">Technology <span className="required-asterisk">*</span></label>
            <input type="text" className="form-input" name="technology" value={formData.technology} onChange={(e) => handleChange(e.target)} placeholder="e.g. React, Python" />
            {errors.technology && <span className="error-message"><AlertCircle size={14} /> {errors.technology}</span>}
          </motion.div>

          <motion.div className="form-group" variants={itemVariants}>
            <label className="form-label">Domain <span className="required-asterisk">*</span></label>
            <input type="text" className="form-input" name="domain" value={formData.domain} onChange={(e) => handleChange(e.target)} placeholder="e.g. Web Development" />
            {errors.domain && <span className="error-message"><AlertCircle size={14} /> {errors.domain}</span>}
          </motion.div>

          <motion.div className="form-group" variants={itemVariants}>
            <label className="form-label">Yesterday's Progress <span className="required-asterisk">*</span></label>
            <textarea className="form-textarea" name="yesterdayProgress" value={formData.yesterdayProgress} onChange={(e) => handleChange(e.target)} placeholder="What did you work on yesterday?" />
            {errors.yesterdayProgress && <span className="error-message"><AlertCircle size={14} /> {errors.yesterdayProgress}</span>}
          </motion.div>

          <motion.div className="form-group" variants={itemVariants}>
            <label className="form-label">Today's Plan <span className="required-asterisk">*</span></label>
            <textarea className="form-textarea" name="todayPlan" value={formData.todayPlan} onChange={(e) => handleChange(e.target)} placeholder="What are you planning to do today?" />
            {errors.todayPlan && <span className="error-message"><AlertCircle size={14} /> {errors.todayPlan}</span>}
          </motion.div>

          <motion.button 
            type="submit" 
            className="submit-btn" 
            disabled={isSubmitting} 
            variants={itemVariants} 
            whileTap={{ scale: 0.98 }}
            onClick={() => { 
              import('../utils/haptics').then(m => {
                m.vibrate(30);
                m.playCheckInSound();
              });
            }}
          >
            {isSubmitting ? <><Loader2 className="spinner" size={20} /> Checking In...</> : <><LogIn size={20} /> Check In</>}
          </motion.button>
        </motion.form>
        )}
      </div>
    </PageTransition>
  );
};

export default CheckIn;
