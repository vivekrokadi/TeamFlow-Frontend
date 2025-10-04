import React from 'react';
import { Calendar, User, Flag } from 'lucide-react';

const TaskCard = ({ task, onStatusUpdate, isEmployee = false }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 bg-opacity-10 text-green-500 border-green-500/20 border-opacity-20';
      case 'in progress':
        return 'bg-blue-500/10 bg-opacity-10 text-blue-500 border-blue-500/20 border-opacity-20';
      default:
        return 'bg-yellow-500/10 bg-opacity-10 text-yellow-500 border-yellow-500/20 border-opacity-20';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      default:
        return 'text-green-400';
    }
  };

  const handleStatusChange = (newStatus) => {
    if (onStatusUpdate) {
      onStatusUpdate(task._id, newStatus);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg p-6 hover:border-gray-600 transition-colors duration-200">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{task.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>

      {task.description && (
        <p className="text-gray-400 text-sm mb-4">{task.description}</p>
      )}

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-400">
          <User size={16} className="mr-2" />
          <span>Assigned to: {task.assignedTo?.name}</span>
        </div>

        <div className="flex items-center text-sm text-gray-400">
          <Calendar size={16} className="mr-2" />
          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center text-sm">
          <Flag size={16} className={`mr-2 ${getPriorityColor(task.priority)}`} />
          <span className={`capitalize ${getPriorityColor(task.priority)}`}>
            {task.priority} priority
          </span>
        </div>
      </div>

      {isEmployee && task.status !== 'completed' && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Update Status:
          </label>
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default TaskCard;