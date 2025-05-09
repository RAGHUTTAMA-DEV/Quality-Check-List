import { useAuth } from "@/hooks/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { 
  CheckCircle, RefreshCw, Eye, CheckSquare, 
  Search, Calendar, Layers, ClipboardList, AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Stage {
  _id: string;
  stage: {
    name: string;
  };
  status: string;
  createdAt: string;
  description?: string;
  // Add any other fields you expect
}

export default function UserDash(): JSX.Element {
  const { token, user } = useAuth();
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [animation, setAnimation] = useState(false);

  const triggerAnimation = () => {
    setAnimation(true);
    setTimeout(() => setAnimation(false), 1000);
  };

  useEffect(() => {
    if (!user || !token) return;
    fetchAssignedStages();
  }, [user, token]);

  // Configure axios headers with token
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  async function fetchAssignedStages() {
    if (!user || !token) return;
    
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/checklist/assigned?userId=${user._id}`,
        axiosConfig
      );
      
      setStages(res.data.stages || []);
      setError(false);
      triggerAnimation();
    } catch (error) {
      console.error("Error fetching assigned stages:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }
  
  function viewStageDetails(stage: Stage) {
    setSelectedStage(selectedStage?._id === stage._id ? null : stage);
  }

  const filteredStages = stages.filter(stage => 
    stage.stage?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stage.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date 
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading && stages.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-transparent border-l-purple-300 rounded-full animate-spin absolute top-0 left-0" style={{animationDuration: '1.5s'}}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen">
      <div className={`bg-white shadow-xl rounded-xl p-6 transition-all duration-500 ${animation ? 'scale-102 shadow-2xl' : ''}`}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white mr-4">
              <ClipboardList size={24} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Your Assigned Checklists
            </h1>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex items-center border-green-300 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={fetchAssignedStages}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} size={18} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-6 relative group">
          <Search className="absolute left-3 top-3 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300" size={18} />
          <Input 
            placeholder="Search checklists..." 
            className="pl-10 bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Error state */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 animate-pulse">
            <div className="flex items-center">
              <AlertCircle className="mr-2" size={18} />
              <p>Error loading assigned checklists. Please try again.</p>
            </div>
          </div>
        )}

        {/* Loading state for refresh */}
        {loading && stages.length > 0 && (
          <div className="flex justify-center py-6">
            <div className="w-12 h-12 relative">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {/* Stats Row */}
        {!loading && stages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-indigo-600 text-sm font-medium">Total Checklists</p>
                <p className="text-2xl font-bold text-indigo-700">{stages.length}</p>
              </div>
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <ClipboardList size={24} />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-lg border border-green-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-700">
                  {stages.filter(stage => stage.status?.toLowerCase() === 'completed').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle size={24} />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold text-blue-700">
                  {stages.filter(stage => stage.status?.toLowerCase() === 'in progress').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Layers size={24} />
              </div>
            </div>
          </div>
        )}

        {/* Stages list */}
        <div className="space-y-3">
          {filteredStages.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <ClipboardList size={32} />
                </div>
                <p className="text-lg font-medium">
                  {searchTerm ? "No matching checklists found" : "No checklists assigned to you yet"}
                </p>
              </div>
            </div>
          ) : (
            filteredStages.map((stage) => (
              <div key={stage._id}>
                <div 
                  className={`flex items-center justify-between p-4 rounded-lg shadow-sm border-l-4 transition-all duration-300 cursor-pointer hover:shadow-md border-indigo-500 bg-white hover:bg-indigo-50 ${
                    selectedStage?._id === stage._id ? 'ring-2 ring-indigo-300' : ''
                  }`}
                  onClick={() => viewStageDetails(stage)}
                >
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        <CheckSquare size={16} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">
                        {stage.stage?.name ?? "Unnamed"}
                      </h3>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className={`inline-flex items-center text-xs px-2 py-1 rounded ${getStatusColor(stage.status)}`}>
                          {stage.status || "Unknown Status"}
                        </span>
                        <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          <Calendar size={12} className="mr-1" />
                          {formatDate(stage.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Additional view action if needed
                      }}
                    >
                      <Eye size={16} />
                    </Button>
                  </div>
                </div>
                
                {/* Expanded stage details */}
                {selectedStage?._id === stage._id && (
                  <div className="bg-white p-4 rounded-b-lg shadow-sm border border-t-0 border-indigo-100 mt-1 mb-2 transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Stage Details</h4>
                        <p className="text-gray-800">{stage.description || "No description provided"}</p>
                        
                        <h4 className="text-sm font-medium text-gray-500 mt-4 mb-1">Status</h4>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(stage.status)}`}>
                          {stage.status || "No status assigned"}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Created</h4>
                        <p className="text-gray-800">{new Date(stage.createdAt).toLocaleString()}</p>
                        
                        <h4 className="text-sm font-medium text-gray-500 mt-4 mb-1">ID</h4>
                        <p className="text-gray-600 text-sm font-mono">{stage._id}</p>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-indigo-600 border-indigo-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Navigate to detail view or other action
                        }}
                      >
                        <Eye className="mr-2" size={14} />
                        View Checklist
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-700"
                        onClick={() => setSelectedStage(null)}
                      >
                        Close Details
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
           
          )}
        </div>
      </div>
    </div>
  );
}