// src/pages/admin/AdminEmployees.jsx
import React, { useEffect, useState } from 'react';
import API from '../../api/apiClient';
import { useToast } from '../../components/ToastProvider';
import EmployeeTable from '../../components/EmployeeTable';
import CreateUserModal from '../../components/CreateUserModal';

export default function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/employees');
      setEmployees(res.data.users || []);
    } catch (err) {
      console.error('Failed to load employees', err);
      toast.push('Failed to load employees', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const changeBalance = async (emp, kind, delta) => {
    try {
      const casual = Number(emp.leaveBalance?.casual ?? 0);
      const privilege = Number(emp.leaveBalance?.privilege ?? 0);
      const newCasual = kind === 'casual' ? Math.max(0, casual + delta) : casual;
      const newPrivilege = kind === 'privilege' ? Math.max(0, privilege + delta) : privilege;

      await API.patch(`/admin/employees/${emp._id}/balance`, { casual: newCasual, privilege: newPrivilege });
      toast.push('Balance updated', 'info');

      // optimistic UI update
      setEmployees(prev => prev.map(e => e._id === emp._id ? { ...e, leaveBalance: { casual: newCasual, privilege: newPrivilege } } : e));
    } catch (err) {
      console.error('changeBalance error', err);
      toast.push(err?.response?.data?.message || 'Failed to update balance', 'error');
      await load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin — Employees</h1>
        <button onClick={() => setCreateOpen(true)} className="px-4 py-2 bg-brand-500 text-white rounded">Create User</button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <EmployeeTable employees={employees} onChangeBalance={changeBalance} showActions={true} />
      </div>

      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        employees={employees}
        onCreated={() => { setCreateOpen(false); load(); }}
      />
    </div>
  );
}
