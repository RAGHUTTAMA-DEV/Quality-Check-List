import { useState, useEffect } from "react"
import { PlusCircle, Trash2, RefreshCw, Edit, CheckCircle, X, Search, User, Calendar, MessageSquare, Menu, ClipboardList, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/hooks/AuthContext"
import {motion} from "framer-motion"
import { cn } from "@/lib/utils"

export default function CheckList() {
  const [error, setError] = useState(false)
  const { token } = useAuth() 
  const [loading, setLoading] = useState(false)
  const [checklists, setChecklists] = useState([])
  const [content, setContent] = useState('')
  const [comments, setComments] = useState('')
  const [checkBy, setCheckBy] = useState('')
  const [image, setImage] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [animation, setAnimation] = useState(false)
  const [assigned, setAssigned] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  
  // Navigation items - matches the common structure across the app
  const navItems = [
    { name: "Dashboard", href: "/", icon: <ClipboardList size={16} /> },
    { name: "Items", href: "/items", icon: <FileText size={16} /> },
    { name: "Users", href: "/users", icon: <User size={16} /> },
    { name: "Checklist", href: "/checklist", icon: <CheckCircle size={16} /> },
  ]
 
  const triggerAnimation = () => {
    setAnimation(true)
    setTimeout(() => setAnimation(false), 1000)
  }

  useEffect(() => {
    GetAllChecklists()
  }, [])

  // Configure axios headers with token
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  async function GetAllChecklists() {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:3000/api/checklist', axiosConfig)
      setChecklists(response.data.checklists || [])
      triggerAnimation()
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  async function CreateCheckList() {
    if (!content.trim()) {
      alert("Content is required!")
      return
    }
    
    setLoading(true)
    try {
      // Create payload
      const checklistData = {
        content,
        comments,
        checkedBy: checkBy,
        isChecked,
        Image: image,
        AssingedTo: assigned // Match backend field name
      }
      
      // Post request to create checklist
      const response = await axios.post(
        'http://localhost:3000/api/checklist',
        checklistData,
        axiosConfig
      )
      
      setChecklists(prev => [...prev, response.data.checklist])
      
      // Reset form and hide it
      resetForm()
      
      triggerAnimation()
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  async function UpdateCheckList() {
    if (!content.trim() || !currentId) {
      alert("Content is required!")
      return
    }
    
    setLoading(true)
    try {
      // Create payload
      const checklistData = {
        content,
        comments,
        checkedBy: checkBy,
        isChecked,
        Image: image,
        AssingedTo: assigned
      }
      
      // Put request to update checklist
      const response = await axios.put(
        `http://localhost:3000/api/checklist?content=${encodeURIComponent(content)}`,
        checklistData,
        axiosConfig
      )
      
      // Update the list with the updated item
      setChecklists(prev => 
        prev.map(item => item._id === currentId ? response.data.checklist : item)
      )
      
      // Reset form and hide it
      resetForm()
      setEditMode(false)
      setCurrentId(null)
      
      triggerAnimation()
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  async function DeleteCheckList(content) {
    if (!content) return
    
    setLoading(true)
    try {
      await axios.delete(
        `http://localhost:3000/api/checklist?content=${encodeURIComponent(content)}`,
        axiosConfig
      )
      
      // Remove the deleted item from the list
      setChecklists(prev => prev.filter(item => item.content !== content))
      
      // If the deleted item was selected, clear selection
      if (selectedItem?.content === content) {
        setSelectedItem(null)
      }
      
      triggerAnimation()
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  async function toggleTaskStatus(id) {
    if (!id) return
    
    try {
      // Find the task
      const task = checklists.find(item => item._id === id)
      if (!task) return
      
      // Prepare data for update
      const updateData = {
        ...task,
        isChecked: !task.isChecked
      }
      
      // Send update request
      const response = await axios.put(
        `http://localhost:3000/api/checklist?content=${encodeURIComponent(task.content)}`,
        updateData,
        axiosConfig
      )
      
      // Update local state
      setChecklists(prev => 
        prev.map(item => item._id === id ? response.data.checklist : item)
      )
      
      // Update selected item if needed
      if (selectedItem?._id === id) {
        setSelectedItem(response.data.checklist)
      }
    } catch (err) {
      console.error(err)
      setError(true)
    }
  }

  function resetForm() {
    setContent('')
    setComments('')
    setCheckBy('')
    setImage('')
    setIsChecked(false)
    setFormVisible(false)
    setAssigned('')
  }

  function toggleForm() {
    if (formVisible && editMode) {
      setEditMode(false)
      setCurrentId(null)
      resetForm()
    }
    setFormVisible(!formVisible)
  }

  function startEditTask(item) {
    setContent(item.content)
    setComments(item.comments || '')
    setCheckBy(item.checkedBy || '')
    setImage(item.Image || '')
    setIsChecked(item.isChecked || false)
    setAssigned(item.AssingedTo || '')
    setCurrentId(item._id)
    setEditMode(true)
    setFormVisible(true)
    setSelectedItem(null)
  }

  function viewTaskDetails(item) {
    setSelectedItem(selectedItem?._id === item._id ? null : item)
  }

  const filteredChecklists = checklists.filter(checklist => 
    checklist.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    checklist.comments?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    checklist.checkedBy?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  function formatDate(dateString) {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-9xl max-w-screen mx-auto p-6 bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen">
      <div className={`bg-white shadow-xl rounded-xl p-6 transition-all duration-500 ${animation ? 'scale-102 shadow-2xl' : ''}`}>
        {/* Navbar with single logo and title */}
        <div className="mb-8">
          {/* Mobile Navigation Header */}
          <div className="flex md:hidden justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white mr-3">
                <CheckCircle size={20} />
              </div>
              <h2 className="text-xl font-bold text-blue-700">Smart Checklist</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mb-4"
            >
              <div className="flex flex-col space-y-3 bg-blue-50 p-4 rounded-lg">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center text-gray-700 hover:text-blue-600 py-2 px-3 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Desktop Navigation */}
          <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex items-center justify-between border-b border-gray-200 pb-4"
          >
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white mr-3">
                <CheckCircle size={20} />
              </div>
              <h2 className="text-xl font-bold text-blue-700">Smart Checklist System</h2>
            </div>
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    window.location.pathname === item.href
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  )}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.nav>
        </div>

        {/* Function Buttons and Search Bar - Improved Layout */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className={`flex items-center ${formVisible ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-blue-300 text-blue-600 hover:bg-blue-50'} rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105`}
                onClick={toggleForm}
              >
                {formVisible ? <X className="mr-2" size={18} /> : <PlusCircle className="mr-2" size={18} />}
                {formVisible ? "Cancel" : "New Task"}
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center border-green-300 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                onClick={GetAllChecklists}
                disabled={loading}
              >
                <RefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} size={18} />
                Refresh
              </Button>
            </div>

            {/* Search bar */}
            <div className="relative group flex-grow md:max-w-md">
              <Search className="absolute left-3 top-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" size={18} />
              <Input 
                placeholder="Search tasks..." 
                className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Create/Edit form */}
        <div
          className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 mb-8 border border-blue-100 transition-all duration-500 ease-in-out ${
            formVisible ? 'block opacity-100' : 'hidden opacity-0 p-0 border-0 mb-0'
          }`}
        >
          <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
            {editMode ? <Edit className="mr-2" size={20} /> : <PlusCircle className="mr-2" size={20} />}
            {editMode ? "Edit Task" : "Create New Task"}
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Assigned To</label>
            <Input 
              placeholder="Who is this task assigned to?" 
              value={assigned}
              onChange={(e) => setAssigned(e.target.value)}
              className="bg-white focus:ring focus:ring-blue-200 transition-all duration-300"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Task Content</label>
              <Input 
                placeholder="What needs to be done?" 
                value={content}
                onChange={(e) => setContent(e.target.value)} 
                className="bg-white focus:ring focus:ring-blue-200 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Checked By</label>
              <Input 
                placeholder="Who's responsible?" 
                value={checkBy}
                onChange={(e) => setCheckBy(e.target.value)} 
                className="bg-white focus:ring focus:ring-blue-200 transition-all duration-300"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Comments</label>
            <Input 
              placeholder="Any additional details?" 
              value={comments}
              onChange={(e) => setComments(e.target.value)} 
              className="bg-white focus:ring focus:ring-blue-200 transition-all duration-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Image URL</label>
            <Input 
              placeholder="Add an image link" 
              value={image}
              onChange={(e) => setImage(e.target.value)} 
              className="bg-white focus:ring focus:ring-blue-200 transition-all duration-300"
            />
          </div>
          <div className="flex items-center mb-4">
            <Checkbox 
              checked={isChecked} 
              onCheckedChange={() => setIsChecked(!isChecked)}
              id="status"
              className="mr-2 text-blue-600 focus:ring focus:ring-blue-200 transition-all duration-300"
            />
            <label htmlFor="status" className="text-sm font-medium text-gray-700">Mark as completed</label>
          </div>
          <div className="flex justify-end mt-4">
            <Button 
              onClick={editMode ? UpdateCheckList : CreateCheckList}
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg px-6 py-2 text-white font-medium"
              disabled={loading}
            >
              {loading ? 
                <span className="flex items-center">
                  <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {editMode ? "Updating..." : "Creating..."}
                </span> : editMode ? "Update Task" : "Create Task"
              }
            </Button>
          </div>
        </div>

        {/* Loading state */}
        {loading && !formVisible && (
          <div className="flex justify-center py-10">
            <div className="w-16 h-16 relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-4 border-transparent border-l-indigo-300 rounded-full animate-spin absolute top-0 left-0" style={{animationDuration: '1.5s'}}></div>
            </div>
          </div>
        )}

        {/* Stats Row */}
        {!loading && checklists.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-700">{checklists.filter(item => item.isChecked).length}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle size={24} />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-700">{checklists.filter(item => !item.isChecked).length}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                <RefreshCw size={24} />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-700">{checklists.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <ClipboardList size={24} />
              </div>
            </div>
          </div>
        )}

        {/* Checklist items */}
        {!loading && (
          <div className="space-y-3">
            {filteredChecklists.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <p className="text-lg font-medium">
                    {searchTerm ? "No matching tasks found" : "No tasks yet. Create your first one!"}
                  </p>
                  {!searchTerm && (
                    <Button 
                      variant="outline" 
                      className="mt-4 text-blue-600"
                      onClick={toggleForm}
                    >
                      <PlusCircle className="mr-2" size={16} />
                      Add First Task
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              filteredChecklists.map((item, idx) => (
                <div key={item._id || idx}>
                  <div 
                    className={`flex items-center justify-between p-4 rounded-lg shadow-sm border-l-4 transition-all duration-300 cursor-pointer hover:shadow-md ${
                      item.isChecked 
                        ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50' 
                        : 'border-yellow-500 bg-white hover:bg-yellow-50'
                    } ${selectedItem?._id === item._id ? 'ring-2 ring-blue-300' : ''}`}
                    onClick={() => viewTaskDetails(item)}
                  >
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`w-6 h-6 p-1 rounded-full ${
                            item.isChecked 
                              ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                              : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTaskStatus(item._id);
                          }}
                        >
                          {item.isChecked ? <CheckCircle size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-yellow-400"></div>}
                        </Button>
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${item.isChecked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {item.content}
                        </h3>
                        {item.comments && !selectedItem && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.comments}</p>
                        )}
                        <div className="flex items-center mt-2 space-x-2">
                          {item.checkedBy && (
                            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              <User size={12} className="mr-1" />
                              {item.checkedBy}
                            </span>
                          )}
                          <span className="inline-flex items-center bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            <Calendar size={12} className="mr-1" />
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditTask(item);
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          DeleteCheckList(item.content);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Expanded task details */}
                  {selectedItem?._id === item._id && (
                    <div className="bg-white p-4 rounded-b-lg shadow-sm border border-t-0 border-blue-100 mt-1 mb-2 transition-all duration-300 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                          <p className="text-gray-800">{item.comments || "No description provided"}</p>
                          
                          <h4 className="text-sm font-medium text-gray-500 mt-4 mb-1">Status</h4>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                            item.isChecked 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.isChecked ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Assigned To</h4>
                          <div className="flex items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-2">
                              <User size={16} />
                            </div>
                            <span>{item.AssingedTo || item.checkedBy || "Unassigned"}</span>
                          </div>
                          
                          <h4 className="text-sm font-medium text-gray-500 mt-4 mb-1">Created On</h4>
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2 text-gray-500" />
                            <span>{formatDate(item.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
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
      </div>
    </div>
  )
}