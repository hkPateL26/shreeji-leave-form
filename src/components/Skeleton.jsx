import React from 'react';
import '../index.css';

const Skeleton = ({ width, height, borderRadius = '12px', className = '' }) => {
  return (
    <div
      className={`skeleton-box ${className}`}
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius: borderRadius,
      }}
    />
  );
};

export default Skeleton;
