import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, ClipboardList } from 'lucide-react';
import TaskCard from '../components/TaskCard';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, statusFilter]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch tasks');
      
      const data = await response.json();
      setTasks(data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) throw new Error('Failed to update task');
      
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in progress').length;
    const pending = tasks.filter(task => task.status === 'pending').length;

    return { total, completed, inProgress, pending };
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm sm:text-base">Welcome back, {user?.name}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Total Tasks</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <ClipboardList className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-500">{stats.pending}</p>
            </div>
            <ClipboardList className="text-yellow-500 w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">In Progress</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-500">{stats.inProgress}</p>
            </div>
            <ClipboardList className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Completed</p>
              <p className="text-xl sm:text-2xl font-bold text-green-500">{stats.completed}</p>
            </div>
            <ClipboardList className="text-green-500 w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onStatusUpdate={handleStatusUpdate}
            isEmployee={true}
          />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg p-8 sm:p-12 text-center">
          <ClipboardList className="mx-auto text-gray-400 w-12 h-12 sm:w-16 sm:h-16 mb-4" />
          <h3 className="text-lg sm:text-xl font-medium text-white mb-2">No tasks found</h3>
          <p className="text-gray-400 text-sm sm:text-base">
            {tasks.length === 0 ? "You don't have any tasks assigned yet." : "No tasks match your filters."}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;