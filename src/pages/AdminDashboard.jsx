import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  ClipboardList, 
  Plus, 
  Search,
  Filter,
  Trash2
} from 'lucide-react';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, statusFilter, employeeFilter]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch tasks
      const tasksResponse = await fetch('http://localhost:5000/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!tasksResponse.ok) throw new Error('Failed to fetch tasks');
      const tasksData = await tasksResponse.json();
      setTasks(tasksData.data);

      // Fetch employees
      const usersResponse = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!usersResponse.ok) throw new Error('Failed to fetch users');
      const usersData = await usersResponse.json();
      setEmployees(usersData.data.filter(u => u.role === 'employee'));

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedTo?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (employeeFilter !== 'all') {
      filtered = filtered.filter(task => task.assignedTo?._id === employeeFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleTaskCreated = () => {
    setShowTaskForm(false);
    fetchData();
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to delete task');
      
      fetchData();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm sm:text-base">Manage employees and tasks</p>
        </div>
        <button
          onClick={() => setShowTaskForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <Plus size={20} />
          <span>Create Task</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Total Employees</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{employees.length}</p>
            </div>
            <Users className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Total Tasks</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <ClipboardList className="text-purple-500 w-5 h-5 sm:w-6 sm:h-6" />
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="md:col-span-2 relative">
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
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="all">All Employees</option>
            {employees.map(employee => (
              <option key={employee._id} value={employee._id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredTasks.map((task) => (
          <div key={task._id} className="relative group">
            <TaskCard task={task} />
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
              <button
                onClick={() => handleDeleteTask(task._id)}
                className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200"
                title="Delete Task"
              >
                <Trash2 size={14} className="text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg p-8 sm:p-12 text-center">
          <ClipboardList className="mx-auto text-gray-400 w-12 h-12 sm:w-16 sm:h-16 mb-4" />
          <h3 className="text-lg sm:text-xl font-medium text-white mb-2">No tasks found</h3>
          <p className="text-gray-400 text-sm sm:text-base mb-4">
            {tasks.length === 0 ? "No tasks have been created yet." : "No tasks match your filters."}
          </p>
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Create Your First Task</span>
          </button>
        </div>
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          employees={employees}
          onClose={() => setShowTaskForm(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default AdminDashboard;