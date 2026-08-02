import React from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  const bgClass = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  return (
    <div className={`fixed bottom-4 right-4 ${bgClass} text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 z-50 animate-bounce`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-white/80 hover:text-white font-bold">&times;</button>
    </div>
  );
};

export default Toast;
