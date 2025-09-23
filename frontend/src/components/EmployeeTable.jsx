// src/components/EmployeeTable.jsx
import React from 'react';
// import { Link } from 'react-router-dom';   // not needed anymore if View is removed

/**
 * EmployeeTable
 * props:
 * - employees: array
 * - onChangeBalance(emp, kind, delta) : function
 * - showActions (boolean)
 */
export default function EmployeeTable({ employees = [], onChangeBalance = () => {}, showActions = true }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Casual</th>
            <th className="p-2 border">Privilege</th>
            {/* {showActions && <th className="p-2 border">Actions</th>} */}
          </tr>
        </thead>

        <tbody>
          {employees.map(emp => {
            const casual = Number(emp.leaveBalance?.casual ?? 0);
            const privilege = Number(emp.leaveBalance?.privilege ?? 0);

            return (
              <tr key={emp._id} className="border-b">
                <td className="p-2 border">{emp.name}</td>
                <td className="p-2 border">{emp.email}</td>
                <td className="p-2 border">{emp.department}</td>

                <td className="p-2 border">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{casual}</div>
                    <div className="flex gap-2">
                      <button
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded"
                        onClick={() => onChangeBalance(emp, 'casual', +1)}
                        aria-label={`Increase casual for ${emp.name}`}
                      >
                        +1
                      </button>
                      <button
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                        onClick={() => onChangeBalance(emp, 'casual', -1)}
                        aria-label={`Decrease casual for ${emp.name}`}
                      >
                        -1
                      </button>
                    </div>
                  </div>
                </td>

                <td className="p-2 border">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{privilege}</div>
                    <div className="flex gap-2">
                      <button
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded"
                        onClick={() => onChangeBalance(emp, 'privilege', +1)}
                        aria-label={`Increase privilege for ${emp.name}`}
                      >
                        +1
                      </button>
                      <button
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                        onClick={() => onChangeBalance(emp, 'privilege', -1)}
                        aria-label={`Decrease privilege for ${emp.name}`}
                      >
                        -1
                      </button>
                    </div>
                  </div>
                </td>

                {/* {showActions && (
                  <td className="p-2 border">
                    <div className="flex gap-2">
                      <Link to={`/admin/employee/${emp._id}`} className="px-2 py-1 border rounded text-xs">
                        View
                      </Link>
                    </div>
                  </td>
                )} */}
              </tr>
            );
          })}

          {employees.length === 0 && (
            <tr>
              {/* <td colSpan={showActions ? 6 : 5} className="p-4 text-center text-gray-500"> */}
              <td colSpan={5} className="p-4 text-center text-gray-500">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
