import React, { useState } from 'react';

export default function LeaveForm({ onSubmit }) {
  const [form, setForm] = useState({
    type: 'Casual', category: 'Sick', startDate: '', endDate: '', reason: ''
  });

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      type: form.type,
      category: form.category,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason
    });
  };

  return (
    <form onSubmit={submit}>
      <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
        <option value="Casual">Casual</option>
        <option value="Privilege">Privilege</option>
      </select>
      <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
        <option value="Sick">Sick</option>
        <option value="Vacation">Vacation</option>
      </select>
      <input type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})}/>
      <input type="date" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})}/>
      <input placeholder="Reason" value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})}/>
      <button type="submit">Apply</button>
    </form>
  );
}
