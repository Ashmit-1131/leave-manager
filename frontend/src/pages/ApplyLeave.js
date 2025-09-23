// src/pages/ApplyLeave.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { applyLeave } from '../redux/slices/leavesSlice';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../components/ToastProvider';

export default function ApplyLeave() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({
    type: 'Casual',
    category: 'Sick',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(applyLeave(form)).unwrap();
      toast.push('Leave applied', 'info');
      navigate('/dashboard');
    } catch (err) {
      const msg = err?.payload?.message || err?.response?.data?.message || err?.message || 'Error';
      toast.push('Failed: ' + msg, 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Apply for Leave</h2>
      <form onSubmit={submit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full rounded border p-2">
              <option value="Casual">Casual</option>
              <option value="Privilege">Privilege</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full rounded border p-2">
              <option value="Sick">Sick</option>
              <option value="Vacation">Vacation</option>
            </select>
          </div>
          <Input label="Start Date" type="date" name="startDate" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} />
          <Input label="End Date" type="date" name="endDate" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})} />
        </div>

        <Input label="Reason" name="reason" value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} />

        <div className="flex justify-end mt-4">
          <Button type="submit">Apply</Button>
        </div>
      </form>
    </div>
  );
}
