export default function TaskTable({ isManager = false }) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Tasks</h2>
          {isManager && (
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              + Create Task
            </button>
          )}
        </div>
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-200 text-sm">
            <tr>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Due Date</th>
              <th className="p-2 text-left">Priority</th>
              <th className="p-2 text-left">Status</th>
              {isManager && <th className="p-2 text-left">Assignee</th>}
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-2">Sample Task</td>
              <td className="p-2">2025-05-10</td>
              <td className="p-2">High</td>
              <td className="p-2">In Progress</td>
              {isManager && <td className="p-2">john@example.com</td>}
              <td className="p-2 space-x-2">
                <button className="text-blue-600 hover:underline">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  