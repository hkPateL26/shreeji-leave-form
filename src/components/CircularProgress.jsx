import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CircularProgress = ({ 
  percentage = 75, 
  size = 120, 
  strokeWidth = 10, 
  color = '#0ea5e9', 
  trackColor = 'var(--border-subtle)',
  label = 'Progress'
}) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Delay animation slightly for better effect on load
    const timer = setTimeout(() => {
      setProgress(percentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      {/* Centered Text */}
      <div style={{ 
        position: 'absolute', 
        top: 0, left: 0, right: 0, bottom: 0, 
        display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center' 
      }}>
        <span style={{ fontSize: `${size * 0.22}px`, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;
