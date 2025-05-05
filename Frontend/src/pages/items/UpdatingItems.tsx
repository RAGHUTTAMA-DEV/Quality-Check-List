import { useState, useEffect } from "react";
import { 
  RefreshCw, 
  Edit, 
  PackageOpen, 
  Trash2, 
  Save, 
  X,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";

export default function UpdatingItems() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [stage, setStage] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isErr, setIsErr] = useState(false);
  const [animation, setAnimation] = useState(false);

  const triggerAnimation = () => {
    setAnimation(true);
    setTimeout(() => setAnimation(false), 1000);
  };

  useEffect(() => {
    if (id) {
      getItemDetails();
    }
  }, [id]);

  // Configure axios headers with token
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  async function getItemDetails() {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/items/${id}`, axiosConfig);
      const itemData = response.data.item;
      
      setItem(itemData);
      setTitle(itemData.title || "");
      setDescription(itemData.description || "");
      setStatus(itemData.status || "");
      setStage(itemData.stage || "");
      setIsCompleted(itemData.completed || false);
      
      setIsErr(false);
      triggerAnimation();
    } catch (err) {
      console.log(err);
      setIsErr(true);
      setMessage("Failed to load item details");
    } finally {
      setLoading(false);
    }
  }

  async function updateItem() {
    if (!title.trim()) {
      setIsErr(true);
      setMessage("Title is required");
      return;
    }

    setActionLoading(true);
    try {
      const updateData = {
        title,
        description,
        status,
        stage
      };
      
      const response = await axios.put(
        `http://localhost:3000/api/items/update/${id || title}`, 
        updateData,
        axiosConfig
      );
      
      setMessage("Item updated successfully");
      setIsErr(false);
      triggerAnimation();
      
      // If we were using a local ID, update to the new item
      if (!id && response.data.item) {
        setItem(response.data.item);
      }
    } catch (err) {
      console.log(err);
      setIsErr(true);
      setMessage("Failed to update item");
    } finally {
      setActionLoading(false);
    }
  }

  async function deleteItem() {
    if (!id && !title.trim()) {
      setIsErr(true);
      setMessage("No item selected for deletion");
      return;
    }

    setActionLoading(true);
    try {
      await axios.delete(
        `http://localhost:3000/api/items/delete/${id || title}`, 
        axiosConfig
      );
      
      setMessage("Item deleted successfully");
      setIsErr(false);
      
      // Navigate after short delay to show success message
      setTimeout(() => navigate("/items"), 1500);
    } catch (err) {
      console.log(err);
      setIsErr(true);
      setMessage("Failed to delete item");
      setActionLoading(false);
    }
  }

  async function markItemComplete(checked) {
    if (!id && !title.trim()) {
      setIsErr(true);
      setMessage("No item selected");
      return;
    }

    setIsCompleted(checked);
    setActionLoading(true);
    
    try {
      await axios.post(
        `http://localhost:3000/api/items/mark/${id || title}`,
        { mark: checked },
        axiosConfig
      );
      
      setMessage(`Item marked as ${checked ? "completed" : "incomplete"}`);
      setIsErr(false);
      triggerAnimation();
    } catch (err) {
      console.log(err);
      setIsErr(true);
      setMessage("Failed to update item status");
      // Revert the UI change if the API call failed
      setIsCompleted(!checked);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen">
      <div className={`bg-white shadow-xl rounded-xl p-6 transition-all duration-500 ${animation ? 'scale-102 shadow-2xl' : ''}`}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white mr-4">
              <Edit size={24} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {id ? "Update Item" : "Manage Item"}
            </h1>
          </div>
          
          <div className="flex space-x-3">
            {id && (
              <Button
                variant="outline"
                className="flex items-center border-green-300 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                onClick={getItemDetails}
                disabled={loading}
              >
                <RefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} size={18} />
                Refresh
              </Button>
            )}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-16 h-16 relative">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-4 border-transparent border-l-purple-300 rounded-full animate-spin absolute top-0 left-0" style={{animationDuration: '1.5s'}}></div>
            </div>
          </div>
        )}

        {/* Error/Success Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            isErr 
              ? 'bg-red-50 border-red-200 text-red-700' 
              : 'bg-green-50 border-green-200 text-green-700'
          } transition-all duration-300 animate-fadeIn`}>
            <div className="flex items-center">
              {isErr ? 
                <X size={20} className="mr-2 text-red-500" /> : 
                <CheckCircle size={20} className="mr-2 text-green-500" />
              }
              <p>{message}</p>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {!loading && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-5 mb-8 border border-indigo-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Item Title*</label>
                <Input 
                  placeholder="Enter item title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)} 
                  className="bg-white focus:ring focus:ring-indigo-200 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Stage ID</label>
                <Input 
                  placeholder="Enter stage ID" 
                  value={stage}
                  onChange={(e) => setStage(e.target.value)} 
                  className="bg-white focus:ring focus:ring-indigo-200 transition-all duration-300"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                <Input 
                  placeholder="Enter item description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} 
                  className="bg-white focus:ring focus:ring-indigo-200 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Status</label>
                <Input 
                  placeholder="Enter item status" 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)} 
                  className="bg-white focus:ring focus:ring-indigo-200 transition-all duration-300"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-6 p-3 bg-white rounded-lg border border-gray-200">
              <Checkbox 
                id="completed"
                checked={isCompleted}
                onCheckedChange={markItemComplete}
                disabled={actionLoading}
                className="border-indigo-300 text-indigo-600 focus:ring-indigo-200"
              />
              <label 
                htmlFor="completed" 
                className="text-sm font-medium text-gray-700 cursor-pointer select-none"
              >
                Mark as Completed
              </label>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-end">
              <Button
                variant="outline"
                className="flex items-center border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                onClick={deleteItem}
                disabled={actionLoading || (!id && !title.trim())}
              >
                <Trash2 className="mr-2" size={16} />
                Delete Item
              </Button>
              
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center"
                onClick={updateItem}
                disabled={actionLoading || !title.trim()}
              >
                {actionLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save className="mr-2" size={16} />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Item Preview */}
        {!loading && item && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
              <PackageOpen size={18} className="mr-2 text-indigo-600" />
              Item Preview
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Title</p>
                <p className="font-medium">{item.title || title || "Untitled Item"}</p>
                
                <p className="text-sm text-gray-500 mt-3 mb-1">Status</p>
                <p>{item.status || status || "No status"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p>{item.description || description || "No description"}</p>
                
                <p className="text-sm text-gray-500 mt-3 mb-1">Stage</p>
                <div className="inline-flex items-center bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                  {item.stage || stage || "No stage assigned"}
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Completion Status</p>
              <div className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                isCompleted 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {isCompleted ? "Completed" : "In Progress"}
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          <Button 
            onClick={() => navigate("/items")}
            variant="outline"
            className="text-gray-600 flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Items
          </Button>
        </div>
      </div>
    </div>
  );
}