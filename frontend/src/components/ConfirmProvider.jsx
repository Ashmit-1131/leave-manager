// src/components/ConfirmProvider.jsx
import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import ConfirmModal from './ConfirmModal';

const ConfirmContext = createContext(null);
export function useConfirm() { return useContext(ConfirmContext); }

export default function ConfirmProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('Confirm');
  const [message, setMessage] = useState('');
  const resolveRef = useRef(null);

  const confirm = (msg, opts = {}) => {
    setTitle(opts.title || 'Confirm');
    setMessage(String(msg || 'Are you sure?'));
    setOpen(true);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const onCancel = () => {
    setOpen(false);
    if (resolveRef.current) { resolveRef.current(false); resolveRef.current = null; }
  };

  const onConfirm = () => {
    setOpen(false);
    if (resolveRef.current) { resolveRef.current(true); resolveRef.current = null; }
  };

  useEffect(() => {
    // export global confirm so legacy code can call window.__confirm(...) and get a Promise
    window.__confirm = (msg, opts = {}) => confirm(msg, opts);
    return () => { try { delete window.__confirm; } catch(e) {} };
  }, []); // eslint-disable-line

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmModal open={open} title={title} message={message} onCancel={onCancel} onConfirm={onConfirm} />
    </ConfirmContext.Provider>
  );
}
