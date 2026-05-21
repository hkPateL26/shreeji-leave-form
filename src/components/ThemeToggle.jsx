import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ inline = false }) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('app-theme') || 'dark';
    setTheme(saved);
    document.body.classList.toggle('light-mode', saved === 'light');
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('app-theme', next);
    document.body.classList.toggle('light-mode', next === 'light');
  };

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      style={{
        position: inline ? 'relative' : undefined,
        background: 'transparent',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--text-primary)',
        flexShrink: 0,
      }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180, scale: theme === 'dark' ? 1 : 0 }}
        style={{ position: 'absolute' }}
        transition={{ duration: 0.28, type: 'spring' }}
      >
        <Moon size={18} />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'light' ? 0 : -180, scale: theme === 'light' ? 1 : 0 }}
        style={{ position: 'absolute' }}
        transition={{ duration: 0.28, type: 'spring' }}
      >
        <Sun size={18} color="#f59e0b" />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
