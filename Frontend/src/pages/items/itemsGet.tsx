import { useState, useEffect } from "react";
import { 
  PlusCircle,Trash2,RefreshCw,Edit,PackageOpen,X, 
  Search,Tag,Layers 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";

export default function ItemsGet() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStageId, setSelectedStageId] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [animation, setAnimation] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  const triggerAnimation = () => {
    setAnimation(true);
    setTimeout(() => setAnimation(false), 1000);
  };

  useEffect(() => {
    getAllItems();
  }, []);

  // Configure axios headers with token
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  async function getAllItems() {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/items/", axiosConfig);
      setItems(response.data.items || []);
      setError(false);
      triggerAnimation();
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function postItem() {
    if (!name.trim() || !selectedStageId.trim()) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/items", {
        title: name,
        items: [], // Empty array for now
        stage: selectedStageId,
        description: description
      }, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Content-Type': 'application/json'
        }
      });
      
      // Add the new item to the state
      setItems(prev => [...prev, response.data.item]);
      
      // Reset form and hide it
      setName('');
      setDescription('');
      setSelectedStageId('');
      setFormVisible(false);
      
      triggerAnimation();
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }
  
  function viewItemDetails(item:any) {
    setSelectedItem(selectedItem?._id === item._id ? null : item);
  }

  function toggleForm() {
    setFormVisible(!formVisible);
  }

  const filteredItems = items.filter(item => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen">
      <div className={`bg-white shadow-xl rounded-xl p-6 transition-all duration-500 ${animation ? 'scale-102 shadow-2xl' : ''}`}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white mr-4">
              <PackageOpen size={24} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Items Management
            </h1>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className={`flex items-center ${formVisible ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-indigo-300 text-indigo-600 hover:bg-indigo-50'} rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105`}
              onClick={toggleForm}
            >
              {formVisible ? <X className="mr-2" size={18} /> : <PlusCircle className="mr-2" size={18} />}
              {formVisible ? "Cancel" : "New Item"}
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center border-green-300 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={getAllItems}
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
            placeholder="Search items..." 
            className="pl-10 bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Create form */}
        <div
          className={`bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-5 mb-8 border border-indigo-100 transition-all duration-500 ease-in-out overflow-hidden ${
            formVisible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 p-0 border-0 mb-0'
          }`}
        >
          <h2 className="text-xl font-semibold mb-4 text-indigo-700 flex items-center">
            <PlusCircle className="mr-2" size={20} />
            Create New Item
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Item Name*</label>
              <Input 
                placeholder="Enter item name" 
                value={name}
                onChange={(e) => setName(e.target.value)} 
                className="bg-white focus:ring focus:ring-indigo-200 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Stage ID*</label>
              <Input 
                placeholder="Enter stage ID" 
                value={selectedStageId}
                onChange={(e) => setSelectedStageId(e.target.value)} 
                className="bg-white focus:ring focus:ring-indigo-200 transition-all duration-300"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
            <Input 
              placeholder="Enter item description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)} 
              className="bg-white focus:ring focus:ring-indigo-200 transition-all duration-300"
            />
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={postItem}
              className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              disabled={loading || !name || !selectedStageId}
            >
              {loading ? 
                <span className="flex items-center">
                  <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span> : "Create Item"
              }
            </Button>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 animate-pulse">
            <p>Error loading items. Please try again.</p>
          </div>
        )}

        {/* Loading state */}
        {loading && !formVisible && (
          <div className="flex justify-center py-10">
            <div className="w-16 h-16 relative">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-4 border-transparent border-l-purple-300 rounded-full animate-spin absolute top-0 left-0" style={{animationDuration: '1.5s'}}></div>
            </div>
          </div>
        )}

        {/* Stats Row */}
        {!loading && items.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-indigo-600 text-sm font-medium">Total Items</p>
                <p className="text-2xl font-bold text-indigo-700">{items.length}</p>
              </div>
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <PackageOpen size={24} />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Stages Used</p>
                <p className="text-2xl font-bold text-purple-700">
                  {new Set(items.map(item => item.stage)).size}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                <Layers size={24} />
              </div>
            </div>
          </div>
        )}

        {/* Items list */}
        {!loading && (
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                    <PackageOpen size={32} />
                  </div>
                  <p className="text-lg font-medium">
                    {searchTerm ? "No matching items found" : "No items yet. Create your first one!"}
                  </p>
                  {!searchTerm && (
                    <Button 
                      variant="outline" 
                      className="mt-4 text-indigo-600"
                      onClick={toggleForm}
                    >
                      <PlusCircle className="mr-2" size={16} />
                      Add First Item
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              filteredItems.map((item, idx) => (
                <div key={item._id || idx}>
                  <div 
                    className={`flex items-center justify-between p-4 rounded-lg shadow-sm border-l-4 transition-all duration-300 cursor-pointer hover:shadow-md border-indigo-500 bg-white hover:bg-indigo-50 ${
                      selectedItem?._id === item._id ? 'ring-2 ring-indigo-300' : ''
                    }`}
                    onClick={() => viewItemDetails(item)}
                  >
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="mt-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                          <PackageOpen size={16} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {item.title || "Unnamed Item"}
                        </h3>
                        {item.description && !selectedItem && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.description}</p>
                        )}
                        <div className="flex items-center mt-2 space-x-2">
                          {item.stage && (
                            <span className="inline-flex items-center bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                              <Layers size={12} className="mr-1" />
                              Stage: {item.stage}
                            </span>
                          )}
                          {item.items && (
                            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              <Tag size={12} className="mr-1" />
                              Sub-items: {item.items.length}
                            </span>
                          )}
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
                          navigate(`/items/update/${item._id}`);
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Expanded item details */}
                  {selectedItem?._id === item._id && (
                    <div className="bg-white p-4 rounded-b-lg shadow-sm border border-t-0 border-indigo-100 mt-1 mb-2 transition-all duration-300 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                          <p className="text-gray-800">{item.description || "No description provided"}</p>
                          
                          <h4 className="text-sm font-medium text-gray-500 mt-4 mb-1">Stage</h4>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                            {item.stage || "No stage assigned"}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Sub-items</h4>
                          {item.items && item.items.length > 0 ? (
                            <ul className="list-disc list-inside text-gray-800">
                              
                              {item.items.map((subitem:any, idx:any) => (
                                <li key={idx}>{subitem}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-600">No sub-items available</p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-indigo-600 border-indigo-200"
                          onClick={() => navigate(`/items/update/${item._id}`)}
                        >
                          <Edit className="mr-2" size={14} />
                          Edit Item
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-gray-700"
                          onClick={() => setSelectedItem(null)}
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
        )}
        
        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="text-gray-600"
          >
            Back
          </Button>
          <Button 
            onClick={() => navigate("/items/update")}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Manage Items
          </Button>
        </div>
      </div>
    </div>
  );
}