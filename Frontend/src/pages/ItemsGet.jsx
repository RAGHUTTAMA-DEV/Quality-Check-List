import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import { 
  Activity, 
  Users, 
  Search, 
  PlusCircle, 
  Calendar, 
  CheckCircle2,
  Clock,
  BarChart2, 
  Filter,
  ChevronDown
} from 'lucide-react';
import axios from 'axios';

// Dashboard component
export default function TrackerDashboard() {
  const { token } = useAuth();
  const [message, setMessage] = useState('');
  const [action, setAction] = useState('');
  const [name, setName] = useState('');
  const [stage, setStage] = useState('');
  const [logs, setLogs] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isErr, setIsErr] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSidebar, setShowSidebar] = useState(true);
  const [activityStats, setActivityStats] = useState({
    total: 0,
    today: 0,
    pending: 0,
    completed: 0
  });

  // Stats for demo
  const generateStats = (logs) => {
    if (!logs || logs.length === 0) return;
    
    const today = new Date().toDateString();
    const total = logs.length;
    
    const todayLogs = logs.filter(log => 
      new Date(log.timestamp).toDateString() === today
    ).length;
    
    const pending = logs.filter(log => 
      log.action.toLowerCase().includes('pending') || 
      log.stage?.toLowerCase().includes('pending')
    ).length;
    
    const completed = logs.filter(log => 
      log.action.toLowerCase().includes('complete') || 
      log.stage?.toLowerCase().includes('complete')
    ).length;
    
    setActivityStats({
      total,
      today: todayLogs,
      pending,
      completed
    });
  };

  useEffect(() => {
    if (activeTab === 'all' || activeTab === 'dashboard') {
      GetAllLogs();
    }
  }, [activeTab]);

  async function CreateCall() {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:3000/api/logs/create', 
      {
        message,
        action,
        name,
        stage
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Reset form fields
      setMessage('');
      setAction('');
      setName('');
      setStage('');
      
      // Refresh logs
      GetAllLogs();
      setActiveTab('dashboard');
    } catch (err) {
      console.error(err);
      setIsErr(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function GetAllLogs() {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3000/api/logs/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setLogs(response.data.logs);
      generateStats(response.data.logs);
    } catch (err) {
      console.error(err);
      setIsErr(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function getLogsByName() {
    try {
      if (!searchName.trim()) {
        setFilteredLogs([]);
        return;
      }
      
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3000/api/logs/${searchName}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setFilteredLogs(response.data.logs);
    } catch (err) {
      console.error(err);
      setIsErr(true);
      setFilteredLogs([]);
    } finally {
      setIsLoading(false);
    }
  }

  // Sample log data for visuals
  const recentActions = [
    { name: 'Production Line A', action: 'Quality Check', stage: 'QA', time: '10 min ago' },
    { name: 'Assembly B2', action: 'Maintenance', stage: 'Operations', time: '45 min ago' },
    { name: 'Packaging Unit', action: 'Material Change', stage: 'Production', time: '1 hour ago' }
  ];

  const renderLogs = (logsToRender) => {
    if (!logsToRender || logsToRender.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No activity logs found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {logsToRender.map((log, index) => (
          <div key={log._id || index} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <span className="text-blue-600 font-medium">
                  {log.action ? log.action.charAt(0).toUpperCase() : 'L'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{log.name}</span>
                  <span className="text-xs text-gray-500">
                    {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs">
                    {log.action}
                  </span>
                  {log.stage && (
                    <span className="rounded-full bg-gray-100 text-gray-800 px-2 py-0.5 text-xs">
                      {log.stage}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600">{log.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTimeline = (logsToRender) => {
    if (!logsToRender || logsToRender.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No activity logs found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {logsToRender.map((log, index) => (
          <div key={log._id || index} className="flex">
            <div className="mr-4 flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground border-4 border-blue-500">
                <span className="text-xs font-bold">{log.action ? log.action.charAt(0).toUpperCase() : 'L'}</span>
              </div>
              {index < logsToRender.length - 1 && <div className="h-full w-0.5 bg-blue-200 mt-3"></div>}
            </div>
            <div className="flex flex-col pb-8">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{log.name}</span>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                  {log.action}
                </span>
                {log.stage && (
                  <span className="rounded-full bg-gray-100 text-gray-800 px-2 py-1 text-xs">
                    {log.stage}
                  </span>
                )}
              </div>
              <p className="mt-1 text-gray-600">{log.message}</p>
              <time className="mt-2 text-xs text-gray-500">
                {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
              </time>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-64' : 'w-20'} bg-blue-600 text-white transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center">
          <Activity className="h-8 w-8" />
          {showSidebar && <span className="ml-3 text-xl font-bold">Tracker</span>}
        </div>
        
        <nav className="mt-6">
          <div 
            className={`flex items-center px-4 py-3 ${activeTab === 'dashboard' ? 'bg-blue-700' : 'hover:bg-blue-700'} cursor-pointer`}
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart2 className="h-5 w-5" />
            {showSidebar && <span className="ml-3">Dashboard</span>}
          </div>
          
          <div 
            className={`flex items-center px-4 py-3 ${activeTab === 'create' ? 'bg-blue-700' : 'hover:bg-blue-700'} cursor-pointer`}
            onClick={() => setActiveTab('create')}
          >
            <PlusCircle className="h-5 w-5" />
            {showSidebar && <span className="ml-3">Create Log</span>}
          </div>
          
          <div 
            className={`flex items-center px-4 py-3 ${activeTab === 'all' ? 'bg-blue-700' : 'hover:bg-blue-700'} cursor-pointer`}
            onClick={() => {
              setActiveTab('all');
              GetAllLogs();
            }}
          >
            <Activity className="h-5 w-5" />
            {showSidebar && <span className="ml-3">All Activities</span>}
          </div>
          
          <div 
            className={`flex items-center px-4 py-3 ${activeTab === 'search' ? 'bg-blue-700' : 'hover:bg-blue-700'} cursor-pointer`}
            onClick={() => setActiveTab('search')}
          >
            <Search className="h-5 w-5" />
            {showSidebar && <span className="ml-3">Search Logs</span>}
          </div>
          
          <div 
            className={`flex items-center px-4 py-3 ${activeTab === 'users' ? 'bg-blue-700' : 'hover:bg-blue-700'} cursor-pointer`}
            onClick={() => setActiveTab('users')}
          >
            <Users className="h-5 w-5" />
            {showSidebar && <span className="ml-3">Team Members</span>}
          </div>
        </nav>

        <div className="absolute bottom-4 left-0 w-full px-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="w-full py-2 bg-blue-700 rounded flex items-center justify-center"
          >
            <ChevronDown className={`h-5 w-5 transform ${showSidebar ? 'rotate-90' : '-rotate-90'}`} />
            {showSidebar && <span className="ml-2">Collapse</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              {activeTab === 'dashboard' && 'Activity Dashboard'}
              {activeTab === 'create' && 'Create New Log'}
              {activeTab === 'all' && 'All Activity Logs'}
              {activeTab === 'search' && 'Search Activity Logs'}
              {activeTab === 'users' && 'Team Activity'}
            </h1>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="pl-8 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
              </div>
              
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Activities</p>
                    <p className="text-2xl font-semibold mt-1">{activityStats.total || logs.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Activities</p>
                    <p className="text-2xl font-semibold mt-1">{activityStats.today || 3}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                    <p className="text-2xl font-semibold mt-1">{activityStats.pending || 2}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-semibold mt-1">{activityStats.completed || 8}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity and Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">Recent Activity</h2>
                </div>
                <div className="p-6">
                  {logs.length > 0 ? renderLogs(logs.slice(0, 4)) : (
                    <div className="space-y-4">
                      {recentActions.map((action, index) => (
                        <div key={index} className="flex items-start">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-medium">{action.action.charAt(0)}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{action.name}</span>
                              <span className="text-xs text-gray-500">{action.time}</span>
                            </div>
                            <div className="mt-1 flex flex-wrap gap-2">
                              <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs">
                                {action.action}
                              </span>
                              <span className="rounded-full bg-gray-100 text-gray-800 px-2 py-0.5 text-xs">
                                {action.stage}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button 
                    className="mt-4 text-blue-600 text-sm font-medium flex items-center"
                    onClick={() => setActiveTab('all')}
                  >
                    View all activities
                    <ChevronDown className="h-4 w-4 ml-1 rotate-270" />
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">Activity Timeline</h2>
                </div>
                <div className="p-6">
                  {logs.length > 0 ? renderTimeline(logs.slice(0, 3)) : (
                    <div className="space-y-8">
                      {recentActions.map((action, index) => (
                        <div key={index} className="flex">
                          <div className="mr-4 flex flex-col items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground border-4 border-blue-500">
                              <span className="text-xs font-bold">{action.action.charAt(0)}</span>
                            </div>
                            {index < recentActions.length - 1 && <div className="h-full w-0.5 bg-blue-200 mt-3"></div>}
                          </div>
                          <div className="flex flex-col pb-8">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{action.name}</span>
                              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                {action.action}
                              </span>
                              <span className="rounded-full bg-gray-100 text-gray-800 px-2 py-1 text-xs">
                                {action.stage}
                              </span>
                            </div>
                            <time className="mt-2 text-xs text-gray-500">{action.time}</time>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Create Log */}
        {activeTab === 'create' && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-6">Create New Activity Log</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                  <input
                    type="text"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    placeholder="Enter action"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stage (Optional)</label>
                  <input
                    type="text"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    placeholder="Enter stage"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter message"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <button
                onClick={CreateCall}
                disabled={!name || !action || !message || isLoading}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Log Entry'}
              </button>
            </div>
          </div>
        )}
        
        {/* All Activities */}
        {activeTab === 'all' && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">All Activity Logs</h2>
                <button className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </button>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  renderLogs(logs)
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Search Logs */}
        {activeTab === 'search' && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Search Activity Logs</h2>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Enter name to search"
                    className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={getLogsByName}
                    disabled={!searchName.trim() || isLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  renderLogs(filteredLogs)
                )}
              </div>
            </div>
          </div>
        )}

        {/* Team Members (Placeholder) */}
        {activeTab === 'users' && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Team Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-3">
                        JD
                      </div>
                      <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-gray-500">Production Supervisor</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">12 activities</p>
                      <p className="text-sm text-green-600">3 today</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium mr-3">
                        AS
                      </div>
                      <div>
                        <p className="font-medium">Alice Smith</p>
                        <p className="text-sm text-gray-500">Quality Inspector</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">9 activities</p>
                      <p className="text-sm text-green-600">1 today</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium mr-3">
                        RJ
                      </div>
                      <div>
                        <p className="font-medium">Robert Johnson</p>
                        <p className="text-sm text-gray-500">Maintenance Lead</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">15 activities</p>
                      <p className="text-sm text-green-600">5 today</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-medium mr-3">
                        EW
                      </div>
                      <div>
                        <p className="font-medium">Emily Wong</p>
                        <p className="text-sm text-gray-500">Process Engineer</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">7 activities</p>
                      <p className="text-sm text-gray-500">None today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isErr && (
          <div className="m-6 p-4 bg-red-50 text-red-500 rounded-md">
            An error occurred while processing your request. Please try again.
          </div>
        )}