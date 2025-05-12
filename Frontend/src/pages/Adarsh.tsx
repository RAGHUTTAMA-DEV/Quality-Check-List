import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';
import { 
  Calendar, ClipboardCheck, AlertTriangle, CheckCircle, 
  Activity, BarChart2, Download, Filter, ChevronDown, 
  ChevronUp, RefreshCw
} from 'lucide-react';

// Define TypeScript interfaces for data structures
interface CompletionStat {
  name: string;
  value: number;
  color: string;
}

interface StageDistribution {
  name: string;
  value: number;
  color: string;
}

interface CompletionByStage {
  name: string;
  complete: number;
  incomplete: number;
}

interface CompletionTrend {
  date: string;
  complete: number;
  incomplete: number;
}

interface Contributor {
  name: string;
  completed: number;
}

interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
}

interface ChecklistItem {
  id: number;
  content: string;
  isChecked: boolean;
  checkedBy: string | null;
  createdAt: string;
  comments: string;
}

interface DashboardData {
  completionStats: CompletionStat[];
  stageDistribution: StageDistribution[];
  completionByStage: CompletionByStage[];
  completionTrend: CompletionTrend[];
  topContributors: Contributor[];
  recentActivity: Activity[];
  checklistItems: ChecklistItem[];
}

// Transforms the seeded data into the format needed for the dashboard
const transformSeedData = (): DashboardData => {
  // Simulating fetching from MongoDB based on the seed data structure
  return {
    // Calculated from CheckListItem collection - 5 checked out of 8 total items
    completionStats: [
      { name: 'Complete', value: 5, color: '#4ade80' },
      { name: 'Incomplete', value: 3, color: '#f87171' }
    ],
    
    // Calculated from ProductStage collection - distribution of stages
    stageDistribution: [
      { name: 'Initial Inspection', value: 1, color: '#3b82f6' },
      { name: 'Assembly Line', value: 1, color: '#10b981' },
      { name: 'Quality Check', value: 1, color: '#f59e0b' },
      { name: 'Packaging', value: 1, color: '#8b5cf6' },
      { name: 'Final Inspection', value: 1, color: '#ec4899' }
    ],
    
    // Calculated from CheckListStage and CheckListItem collections
    completionByStage: [
      { name: 'Raw Materials', complete: 1, incomplete: 1 }, // 1 of 2 items complete
      { name: 'Assembly', complete: 2, incomplete: 1 }, // 2 of 3 items complete
      { name: 'Quality', complete: 2, incomplete: 0 }, // 2 of 2 items complete
      { name: 'Packaging', complete: 0, incomplete: 1 } // 0 of 1 items complete
    ],
    
    // Simulated trend data based on Tracker timestamps
    completionTrend: [
      { date: '05/04', complete: 0, incomplete: 8 },
      { date: '05/05', complete: 1, incomplete: 7 },
      { date: '05/06', complete: 2, incomplete: 6 },
      { date: '05/07', complete: 3, incomplete: 5 },
      { date: '05/08', complete: 4, incomplete: 4 },
      { date: '05/09', complete: 5, incomplete: 3 },
      { date: '05/10', complete: 5, incomplete: 3 }
    ],
    
    // Derived from checkedBy field in CheckListItem collection
    topContributors: [
      { name: 'operator_one', completed: 1 },
      { name: 'operator_two', completed: 2 },
      { name: 'supervisor_one', completed: 2 },
      { name: 'operator_three', completed: 0 },
      { name: 'supervisor_two', completed: 0 }
    ],
    
    // Derived from Tracker collection
    recentActivity: [
      { id: 1, user: 'supervisor_one', action: 'Inspected and approved surface finish', time: '2 hours ago' },
      { id: 2, user: 'supervisor_one', action: 'Successfully tested product functionality', time: '3 hours ago' },
      { id: 3, user: 'operator_two', action: 'Ensured proper screw tightness', time: '1 day ago' },
      { id: 4, user: 'operator_two', action: 'Completed component alignment check', time: '1 day ago' },
      { id: 5, user: 'operator_one', action: 'Verified material dimensions', time: '2 days ago' }
    ],
    
    // Derived from actual CheckListItem collection
    checklistItems: [
      { id: 1, content: 'Inspect raw material quality', isChecked: false, checkedBy: null, createdAt: '2025-05-08T10:30:00Z', comments: '' },
      { id: 2, content: 'Verify material dimensions', isChecked: true, checkedBy: 'operator_one', createdAt: '2025-05-08T11:15:00Z', comments: 'All dimensions within tolerance' },
      { id: 3, content: 'Check component alignment', isChecked: true, checkedBy: 'operator_two', createdAt: '2025-05-08T12:00:00Z', comments: '' },
      { id: 4, content: 'Ensure screw tightness', isChecked: true, checkedBy: 'operator_two', createdAt: '2025-05-08T13:30:00Z', comments: '' },
      { id: 5, content: 'Verify electrical connections', isChecked: false, checkedBy: null, createdAt: '2025-05-08T14:00:00Z', comments: '' },
      { id: 6, content: 'Test functionality', isChecked: true, checkedBy: 'supervisor_one', createdAt: '2025-05-08T15:30:00Z', comments: 'Passed all functional tests' },
      { id: 7, content: 'Inspect surface finish', isChecked: true, checkedBy: 'supervisor_one', createdAt: '2025-05-08T16:00:00Z', comments: '' },
      { id: 8, content: 'Verify product labeling', isChecked: false, checkedBy: null, createdAt: '2025-05-08T16:30:00Z', comments: '' }
    ]
  };
};

// Mock API call to simulate fetching data from MongoDB
const getChecklistData = (): Promise<DashboardData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(transformSeedData());
    }, 500);
  });
};

export default function AdminDashboard(): JSX.Element {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isStatsExpanded, setIsStatsExpanded] = useState<boolean>(true);
  const [isActivityExpanded, setIsActivityExpanded] = useState<boolean>(true);
  const [isItemsExpanded, setIsItemsExpanded] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const result = await getChecklistData();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const printChecklist = (): void => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 mx-auto text-blue-600 animate-spin" />
          <p className="mt-4 text-xl font-semibold text-gray-700">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-600" />
          <p className="mt-4 text-xl font-semibold text-gray-700">No data available</p>
        </div>
      </div>
    );
  }

  // Calculate total completion percentage
  const totalItems = data.completionStats.reduce((acc, curr) => acc + curr.value, 0);
  const completedItems = data.completionStats.find(item => item.name === 'Complete')?.value || 0;
  const completionPercentage = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quality Checklist Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Analytics and management interface for your quality control process</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={printChecklist}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Print Report
              </button>
              <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="mb-6 bg-white rounded-lg shadow">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setIsStatsExpanded(!isStatsExpanded)}
          >
            <h2 className="text-lg font-medium text-gray-900">Dashboard Overview</h2>
            {isStatsExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          
          {isStatsExpanded && (
            <div className="p-4">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-3">
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <ClipboardCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Total Checklists</h3>
                      <p className="text-2xl font-semibold text-gray-900">4</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Completed Items</h3>
                      <p className="text-2xl font-semibold text-gray-900">{completionPercentage}%</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Calendar className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Active Stages</h3>
                      <p className="text-2xl font-semibold text-gray-900">5</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-5 mt-5 lg:grid-cols-3">
                {/* Completion Status */}
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">Completion Status</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.completionStats}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }: {name: string, percent: number}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {data.completionStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                
                {/* Completed Items by User */}
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">Completed Items by User</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.topContributors}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="completed" fill="#4ade80" name="Completed Items" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              {/* Additional Chart Row */}
              <div className="grid grid-cols-1 gap-5 mt-5 lg:grid-cols-2">
                {/* Completion by Stage */}
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">Completion by Stage</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.completionByStage}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="complete" stackId="a" fill="#4ade80" name="Complete" />
                        <Bar dataKey="incomplete" stackId="a" fill="#f87171" name="Incomplete" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Completion Trend */}
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">7-Day Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.completionTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="complete" stroke="#4ade80" name="Complete" />
                        <Line type="monotone" dataKey="incomplete" stroke="#f87171" name="Incomplete" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Activity Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Activity Feed */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => setIsActivityExpanded(!isActivityExpanded)}
            >
              <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
              {isActivityExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
            
            {isActivityExpanded && (
              <div className="p-4">
                <div className="flow-root">
                  <ul className="divide-y divide-gray-200">
                    {data.recentActivity.map((item) => (
                      <li key={item.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                              <span className="text-lg font-medium text-blue-600">
                                {item.user.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.user}</p>
                            <p className="text-sm text-gray-500 truncate">{item.action}</p>
                          </div>
                          <div className="text-sm text-gray-500">{item.time}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    View all activity →
                  </a>
                </div>
              </div>
            )}
          </div>
          
          {/* Top Contributors */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Top Contributors</h2>
            </div>
            <div className="p-4">
              <ul className="divide-y divide-gray-200">
                {data.topContributors.map((contributor, index) => (
                  <li key={index} className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 mr-3 bg-blue-100 rounded-full">
                          <span className="text-sm font-medium text-blue-600">
                            {contributor.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{contributor.name}</span>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {contributor.completed} items
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Checklist Items */}
        <div className="mt-6 bg-white rounded-lg shadow">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setIsItemsExpanded(!isItemsExpanded)}
          >
            <h2 className="text-lg font-medium text-gray-900">Current Checklist Items</h2>
            {isItemsExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          
          {isItemsExpanded && (
            <div className="p-4">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Content</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Checked By</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date Created</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Comments</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.checklistItems.map((item) => {
                      const createdDate = new Date(item.createdAt);
                      const formattedDate = createdDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      });
                      
                      return (
                        <tr key={item.id}>
                          <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{item.content}</td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            {item.isChecked ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Complete
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">{item.checkedBy || '-'}</td>
                          <td className="px-3 py-4 text-sm text-gray-500">{formattedDate}</td>
                          <td className="px-3 py-4 text-sm text-gray-500">{item.comments || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">8</span> of <span className="font-medium">8</span> items
                </div>
                <div>
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    View all items →
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}