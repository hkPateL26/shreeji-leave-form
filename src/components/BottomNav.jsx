import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogIn, LogOut, CalendarRange, PieChart, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { vibrate } from '../utils/haptics';

const BottomNav = () => {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/status', label: 'Status', icon: PieChart },
    { path: '/leave', label: 'Leave', icon: CalendarRange },
    { path: '/support', label: 'Support', icon: HelpCircle },
  ];

  return (
    <nav className="bottom-nav">
      {links.map((link) => {
        const isActive = location.pathname === link.path;
        const Icon = link.icon;
        
        return (
          <NavLink key={link.path} to={link.path} className={`nav-item ${isActive ? 'active' : ''}`} end={link.path === '/'} onClick={() => vibrate(20)}>
            {isActive && (
              <motion.div 
                layoutId="nav-indicator" 
                className="nav-indicator" 
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span>{link.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomNav;
