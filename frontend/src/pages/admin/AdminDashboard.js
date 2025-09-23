// // src/pages/admin/AdminDashboard.jsx
// import React, { useEffect, useState } from 'react';
// import API from '../../api/apiClient';
// import { Link } from 'react-router-dom';
// import { useToast } from '../../components/ToastProvider';
// import { useDispatch, useSelector } from 'react-redux';
// import { updateLeaveBalance } from '../../redux/slices/authSlice'; // ensure exported

// export default function AdminDashboard() {
//   const [summary, setSummary] = useState({
//     totalEmployees: 0,
//     pending: 0,
//     employees: []
//   });
//   const toast = useToast();
//   const dispatch = useDispatch();
//   const currentUser = useSelector(s => s.auth.user);

//   const load = async () => {
//     try {
//       const [res1, res2] = await Promise.all([
//         API.get('/admin/employees'),
//         API.get('/admin/leaves/pending')
//       ]);
//       setSummary({
//         totalEmployees: Array.isArray(res1.data.users) ? res1.data.users.length : 0,
//         pending: Array.isArray(res2.data.leaves) ? res2.data.leaves.length : 0,
//         employees: res1.data.users || []
//       });
//     } catch (err) {
//       console.error('load dashboard error', err);
//       toast.push('Failed to load dashboard data', 'error');
//     }
//   };

//   useEffect(() => { load(); }, []);

//   // increment/decrement helper: sends absolute values expected by backend
//   const changeBalance = async (emp, kind, delta) => {
//     try {
//       // safety: ensure leaveBalance object exists
//       const casual = Number(emp.leaveBalance?.casual ?? 0);
//       const privilege = Number(emp.leaveBalance?.privilege ?? 0);

//       // compute new absolute values
//       const newCasual = kind === 'casual' ? Math.max(0, casual + delta) : casual;
//       const newPrivilege = kind === 'privilege' ? Math.max(0, privilege + delta) : privilege;

//       // call backend with absolute numbers (matches adminController.adjustBalance)
//       const res = await API.patch(`/admin/employees/${emp._id}/balance`, {
//         casual: newCasual,
//         privilege: newPrivilege
//       });

//       toast.push('Balance updated', 'info');

//       // optimistic local update: update employees state
//       setSummary(prev => ({
//         ...prev,
//         employees: prev.employees.map(e => e._id === emp._id
//           ? { ...e, leaveBalance: { casual: newCasual, privilege: newPrivilege } }
//           : e)
//       }));

//       // if the updated employee is the currently logged-in user, also update redux + localStorage
//       if (currentUser && String(currentUser.id || currentUser._id) === String(emp._id)) {
//         const updatedBalance = { casual: newCasual, privilege: newPrivilege };
//         try {
//           dispatch(updateLeaveBalance(updatedBalance));
//         } catch (e) {
//           // fallback: update localStorage directly
//           const stored = localStorage.getItem('user');
//           if (stored) {
//             try {
//               const u = JSON.parse(stored);
//               u.leaveBalance = updatedBalance;
//               localStorage.setItem('user', JSON.stringify(u));
//             } catch (err) { /* ignore */ }
//           }
//         }
//       }
//     } catch (err) {
//       console.error('changeBalance error', err);
//       const msg = err?.response?.data?.message || err?.message || 'Failed to update balance';
//       toast.push(msg, 'error');
//       // reload on error to re-sync UI
//       await load();
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-white p-4 rounded shadow">
//           <div className="text-sm text-gray-500">Total employees</div>
//           <div className="text-2xl font-semibold">{summary.totalEmployees}</div>
//         </div>

//         <div className="bg-white p-4 rounded shadow">
//           <div className="text-sm text-gray-500">Pending leaves</div>
//           <div className="text-2xl font-semibold">{summary.pending}</div>
//         </div>

//         <div className="bg-white p-4 rounded shadow flex items-center justify-center">
//           <Link to="/admin/requests" className="px-4 py-2 bg-brand-500 text-white rounded">
//             Review Requests
//           </Link>
//         </div>
//       </div>

//       {/* Employee Table */}
//       <div className="bg-white p-4 rounded shadow">
//         <h2 className="text-lg font-semibold mb-4">Employee Details</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full border text-sm">
//             <thead>
//               <tr className="bg-gray-100 text-left">
//                 <th className="p-2 border">Name</th>
//                 <th className="p-2 border">Email</th>
//                 <th className="p-2 border">Department</th>
//                 <th className="p-2 border">Casual</th>
//                 <th className="p-2 border">Privilege</th>
//               </tr>
//             </thead>

//             <tbody>
//               {summary.employees.map(emp => {
//                 const casual = Number(emp.leaveBalance?.casual ?? 0);
//                 const privilege = Number(emp.leaveBalance?.privilege ?? 0);
//                 return (
//                   <tr key={emp._id} className="border-b">
//                     <td className="p-2 border">{emp.name}</td>
//                     <td className="p-2 border">{emp.email}</td>
//                     <td className="p-2 border">{emp.department}</td>

//                     {/* Casual cell */}
//                     <td className="p-2 border">
//                       <div className="flex items-center gap-3">
//                         <div className="font-medium">{casual}</div>
//                         <div className="flex gap-2">
//                           <button
//                             className="px-2 py-1 text-xs bg-green-500 text-white rounded"
//                             onClick={() => changeBalance(emp, 'casual', +1)}
//                           >
//                             +1
//                           </button>
//                           <button
//                             className="px-2 py-1 text-xs bg-red-500 text-white rounded"
//                             onClick={() => changeBalance(emp, 'casual', -1)}
//                           >
//                             -1
//                           </button>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Privilege cell */}
//                     <td className="p-2 border">
//                       <div className="flex items-center gap-3">
//                         <div className="font-medium">{privilege}</div>
//                         <div className="flex gap-2">
//                           <button
//                             className="px-2 py-1 text-xs bg-green-500 text-white rounded"
//                             onClick={() => changeBalance(emp, 'privilege', +1)}
//                           >
//                             +1
//                           </button>
//                           <button
//                             className="px-2 py-1 text-xs bg-red-500 text-white rounded"
//                             onClick={() => changeBalance(emp, 'privilege', -1)}
//                           >
//                             -1
//                           </button>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}

//               {summary.employees.length === 0 && (
//                 <tr>
//                   <td colSpan="5" className="p-4 text-center text-gray-500">
//                     No employees found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../../api/apiClient';
import { Link } from 'react-router-dom';
import { useToast } from '../../components/ToastProvider';
import { useDispatch, useSelector } from 'react-redux';
import { updateLeaveBalance } from '../../redux/slices/authSlice';
import EmployeeTable from '../../components/EmployeeTable';
import CreateUserModal from '../../components/CreateUserModal';

export default function AdminDashboard() {
  const [summary, setSummary] = useState({ totalEmployees: 0, pending: 0, employees: [] });
  const [createOpen, setCreateOpen] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const currentUser = useSelector(s => s.auth.user);

  const load = async () => {
    try {
      const [res1, res2] = await Promise.all([API.get('/admin/employees'), API.get('/admin/leaves/pending')]);
      setSummary({
        totalEmployees: Array.isArray(res1.data.users) ? res1.data.users.length : 0,
        pending: Array.isArray(res2.data.leaves) ? res2.data.leaves.length : 0,
        employees: res1.data.users || []
      });
    } catch (err) {
      console.error('load dashboard error', err);
      toast.push('Failed to load dashboard data', 'error');
    }
  };

  useEffect(() => { load(); }, []);

  const changeBalance = async (emp, kind, delta) => {
    try {
      const casual = Number(emp.leaveBalance?.casual ?? 0);
      const privilege = Number(emp.leaveBalance?.privilege ?? 0);
      const newCasual = kind === 'casual' ? Math.max(0, casual + delta) : casual;
      const newPrivilege = kind === 'privilege' ? Math.max(0, privilege + delta) : privilege;

      await API.patch(`/admin/employees/${emp._1d || emp._id}/balance`.replace('_1d', '_id'), { casual: newCasual, privilege: newPrivilege });

      // note: above replace is a harmless no-op if emp._id exists; some devs had typos earlier
      toast.push('Balance updated', 'info');

      // local update
      setSummary(prev => ({ ...prev, employees: prev.employees.map(e => e._id === emp._id ? { ...e, leaveBalance: { casual: newCasual, privilege: newPrivilege } } : e) }));

      if (currentUser && String(currentUser.id || currentUser._id) === String(emp._id)) {
        const updatedBalance = { casual: newCasual, privilege: newPrivilege };
        try { dispatch(updateLeaveBalance(updatedBalance)); } catch (e) { /* fallback handled elsewhere */ }
      }
    } catch (err) {
      console.error('changeBalance error', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to update balance';
      toast.push(msg, 'error');
      await load();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total employees</div>
          <div className="text-2xl font-semibold">{summary.totalEmployees}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Pending leaves</div>
          <div className="text-2xl font-semibold">{summary.pending}</div>
        </div>

        <div className="bg-white p-4 rounded shadow flex items-center justify-center">
          <Link to="/admin/requests" className="px-4 py-2 bg-brand-500 text-white rounded">Review Requests</Link>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Employee Details</h2>
        <div>
          <button onClick={() => setCreateOpen(true)} className="px-4 py-2 bg-brand-500 text-white rounded">Create User</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <EmployeeTable employees={summary.employees} onChangeBalance={changeBalance} showActions={true} />
      </div>

      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        employees={summary.employees}
        onCreated={() => { setCreateOpen(false); load(); }}
      />
    </div>
  );
}
