const ACTIVITY_KEY = 'shreeji_activities';
const STATUS_KEY = 'shreeji_checkin_status';

export const getActivities = () => {
  try {
    const data = localStorage.getItem(ACTIVITY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error parsing activities', e);
    return [];
  }
};

export const addActivity = (activity) => {
  try {
    const activities = getActivities();
    const newActivity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    // Keep only last 50 activities to avoid huge local storage
    const updated = [newActivity, ...activities].slice(0, 50);
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(updated));
    return newActivity;
  } catch (e) {
    console.error('Error saving activity', e);
  }
};

export const getCheckInStatus = () => {
  return localStorage.getItem(STATUS_KEY) === 'true';
};

export const setCheckInStatus = (status) => {
  localStorage.setItem(STATUS_KEY, status ? 'true' : 'false');
};

const LEAVE_KEY = 'shreeji_leaves';

export const getLeaves = () => {
  try {
    const data = localStorage.getItem(LEAVE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error parsing leaves', e);
    return [];
  }
};

export const addLeave = (leave) => {
  try {
    const leaves = getLeaves();
    const newLeave = {
      ...leave,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'PENDING'
    };
    
    const updated = [newLeave, ...leaves].slice(0, 50);
    localStorage.setItem(LEAVE_KEY, JSON.stringify(updated));
    return newLeave;
  } catch (e) {
    console.error('Error saving leave', e);
  }
};
