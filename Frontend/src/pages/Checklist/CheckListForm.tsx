import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/AuthContext"
import { motion } from "framer-motion"
import axios from "axios"
import { 
  CheckCircle, 
  Trash2, 
  Edit, 
  X, 
  AlertTriangle,
  Save,
  ArrowLeft
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function CheckListForm() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [checkedBy, setCheckedBy] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [comments, setComments] = useState('')
  const [image, setImage] = useState('')
  const [updated, setUpdated] = useState(false)
  const [isErr, setIsErr] = useState(false)
  const [loading, setLoading] = useState(false)

  async function updatecall() {
    setLoading(true)
    try {
      const response = await axios.put(
        `http://localhost:3000/api/checklist?content=${content}`, 
        {
          checkedBy,
          isChecked,
          comments,
          image,
        }, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log(response.data)
      setUpdated(true)
      setIsErr(false)
      setTimeout(() => setUpdated(false), 3000)
    } catch (err) {
      console.log(err)
      setIsErr(true)
      setUpdated(false)
      setTimeout(() => setIsErr(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  async function deletecall() {
    setLoading(true)
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/checklist?content=${content}`, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log(response.data)
      setUpdated(true)
      setIsErr(false)
      setTimeout(() => {
        setUpdated(false)
        navigate('/') // Redirect to main checklist after successful deletion
      }, 2000)
    } catch (err) {
      console.log(err)
      setIsErr(true)
      setUpdated(false)
      setTimeout(() => setIsErr(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-9xl max-w-screen mx-auto p-6 bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen">
      <div className="bg-white shadow-xl rounded-xl p-6 transition-all duration-500">
          <motion.nav
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="hidden md:flex space-x-8"
                    >
                      <a href="/items" className="text-gray-700 hover:text-blue-600 transition-colors">Items</a>
                      <a href="/users" className="text-gray-700 hover:text-blue-600 transition-colors">Users</a>
                      <a href="/checklist" className="text-gray-700 hover:text-blue-600 transition-colors">Checklist</a>
                    </motion.nav>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white mr-4">
              <Edit size={24} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Manage Task
            </h1>
          </div>
          
          <Button
            variant="outline"
            className="flex items-center border-blue-300 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Tasks
          </Button>
        </div>

        <motion.div 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 mb-8 border border-blue-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
            <Edit className="mr-2" size={20} />
            Update or Delete Task
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Task Content</label>
              <Input 
                placeholder="Enter content title of task to update/delete" 
                value={content}
                onChange={(e) => setContent(e.target.value)} 
                className="bg-white focus:ring focus:ring-blue-200 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Assigned To</label>
              <Input 
                placeholder="Who's responsible?" 
                value={checkedBy}
                onChange={(e) => setCheckedBy(e.target.value)} 
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
          
          <div className="flex items-center mb-6">
            <Checkbox 
              checked={isChecked} 
              onCheckedChange={(checked) => setIsChecked(!!checked)}
              id="status"
              className="mr-2 text-blue-600 focus:ring focus:ring-blue-200 transition-all duration-300"
            />
            <label htmlFor="status" className="text-sm font-medium text-gray-700">Mark as completed</label>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <Button 
              onClick={updatecall}
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center"
              disabled={loading || !content.trim()}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                <>
                  <Save className="mr-2" size={18} />
                  Update Task
                </>
              )}
            </Button>
            
            <Button 
              onClick={deletecall}
              className="bg-red-600 hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center"
              disabled={loading || !content.trim()}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </span>
              ) : (
                <>
                  <Trash2 className="mr-2" size={18} />
                  Delete Task
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Status messages */}
        {isErr && (
          <motion.div 
            className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-r-lg shadow-md"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertTriangle className="mr-3" size={20} />
            <span>Error updating or deleting task. Please check the content title and try again.</span>
          </motion.div>
        )}
        
        {updated && (
          <motion.div 
            className="flex items-center bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-r-lg shadow-md"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle className="mr-3" size={20} />
            <span>Operation completed successfully!</span>
          </motion.div>
        )}
      </div>
    </div>
  )
}