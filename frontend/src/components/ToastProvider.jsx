// src/components/ToastProvider.jsx
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const ToastContext = createContext(null);
export function useToast() { return useContext(ToastContext); }

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((msg, type = 'info', ttl = 3500) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2,7);
    setToasts((t) => [...t, { id, msg: String(msg), type }]);
    if (ttl > 0) {
      setTimeout(() => setToasts((t) => t.filter(x => x.id !== id)), ttl);
    }
  }, []);

  useEffect(() => {
    // expose small global helper (for mechanical replacements)
    window.__toastPush = (msg, type='info', ttl=3500) => push(msg, type, ttl);
    return () => { try { delete window.__toastPush; } catch(e){}; };
  }, [push]);

  const value = { push };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} role="status" className={`px-4 py-2 rounded shadow text-sm ${t.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
