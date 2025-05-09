import { useState } from 'react'
import { 
  PieChart, 
  BarChart, 
  FileText, 
  RefreshCw, 
  Send, 
  AlertTriangle, 
  ChevronDown, 
  CheckCircle,
  Thermometer,
  Droplets,
  Clock,
  Package,
  User,
  Factory
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"

export default function DefectForm() {
  const [formData, setFormData] = useState({
    Product_ID: '',
    Product_Type: '',
    Production_Volume: '',
    Shift: '',
    Operator_Experience_Level: '',
    Machine_Usage_Hours: '',
    Temperature: '',
    Humidity: '',
    Previous_Day_Defects: ''
  })

  const [prediction, setPrediction] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [animation, setAnimation] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)

  // Helper icons for each field
  const fieldIcons = {
    Product_ID: <Package size={18} />,
    Product_Type: <Factory size={18} />,
    Production_Volume: <BarChart size={18} />,
    Shift: <Clock size={18} />,
    Operator_Experience_Level: <User size={18} />,
    Machine_Usage_Hours: <Clock size={18} />,
    Temperature: <Thermometer size={18} />,
    Humidity: <Droplets size={18} />,
    Previous_Day_Defects: <AlertTriangle size={18} />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const triggerAnimation = () => {
    setAnimation(true)
    setTimeout(() => setAnimation(false), 1000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPrediction(null)
    setError(null)
    setLoading(true)
    
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setPrediction(data.predicted_defects)
        setFormSuccess(true)
        setTimeout(() => setFormSuccess(false), 3000)
        triggerAnimation()
      } else {
        setError(data.error || 'Something went wrong.')
      }
    } catch (err) {
      console.error(err)
      setError('Server not reachable or internal error.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      Product_ID: '',
      Product_Type: '',
      Production_Volume: '',
      Shift: '',
      Operator_Experience_Level: '',
      Machine_Usage_Hours: '',
      Temperature: '',
      Humidity: '',
      Previous_Day_Defects: ''
    })
    setPrediction(null)
    setError(null)
  }

  const getShiftOptions = () => {
    return ['Morning', 'Afternoon', 'Night']
  }

  const getExperienceOptions = () => {
    return ['Low', 'Medium', 'High', 'Expert']
  }

  const getProductTypeOptions = () => {
    return ['A', 'B', 'C', 'Custom']
  }

  const getFieldLabel = (key) => {
    // Convert camelCase or snake_case to Title Case with spaces
    return key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()
  }

  // Helper function to determine if field is numeric
  const isNumericField = (key) => {
    return ['Production_Volume', 'Machine_Usage_Hours', 'Temperature', 'Humidity', 'Previous_Day_Defects'].includes(key)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen">
      <div className={`bg-white shadow-xl rounded-xl p-6 transition-all duration-500 ${animation ? 'scale-102 shadow-2xl' : ''}`}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white mr-4">
              <PieChart size={24} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Defect Prediction
            </h1>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex items-center border-blue-300 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={resetForm}
            >
              <RefreshCw className="mr-2" size={18} />
              Reset
            </Button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 mb-8 border border-blue-100">
          <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
            <FileText className="mr-2" size={20} />
            Production Parameters
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 flex items-center">
                  {fieldIcons.Product_ID}
                  <span className="ml-2">{getFieldLabel('Product_ID')}*</span>
                </label>
                <Input 
                  name="Product_ID"
                  placeholder="Enter product identifier" 
                  value={formData.Product_ID}
                  onChange={handleChange}
                  required
                  className="bg-white focus:ring focus:ring-blue-200 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 flex items-center">
                  {fieldIcons.Product_Type}
                  <span className="ml-2">{getFieldLabel('Product_Type')}*</span>
                </label>
                <select
                  name="Product_Type"
                  value={formData.Product_Type}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 focus:ring focus:ring-opacity-50 transition-all duration-300"
                >
                  <option value="">Select product type</option>
                  {getProductTypeOptions().map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 flex items-center">
                  {fieldIcons.Production_Volume}
                  <span className="ml-2">{getFieldLabel('Production_Volume')}*</span>
                </label>
                <Input 
                  name="Production_Volume"
                  type="number"
                  placeholder="Units produced" 
                  value={formData.Production_Volume}
                  onChange={handleChange}
                  required
                  className="bg-white focus:ring focus:ring-blue-200 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 flex items-center">
                  {fieldIcons.Shift}
                  <span className="ml-2">{getFieldLabel('Shift')}*</span>
                </label>
                <select
                  name="Shift"
                  value={formData.Shift}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 focus:ring focus:ring-opacity-50 transition-all duration-300"
                >
                  <option value="">Select shift</option>
                  {getShiftOptions().map(shift => (
                    <option key={shift} value={shift}>{shift}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 flex items-center">
                  {fieldIcons.Operator_Experience_Level}
                  <span className="ml-2">{getFieldLabel('Operator_Experience_Level')}*</span>
                </label>
                <select
                  name="Operator_Experience_Level"
                  value={formData.Operator_Experience_Level}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 focus:ring focus:ring-opacity-50 transition-all duration-300"
                >
                  <option value="">Select experience level</option>
                  {getExperienceOptions().map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 flex items-center">
                  {fieldIcons.Machine_Usage_Hours}
                  <span className="ml-2">{getFieldLabel('Machine_Usage_Hours')}*</span>
                </label>
                <Input 
                  name="Machine_Usage_Hours"
                  type="number"
                  placeholder="Hours of usage" 
                  value={formData.Machine_Usage_Hours}
                  onChange={handleChange}
                  required
                  className="bg-white focus:ring focus:ring-blue-200 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 flex items-center">
                  {fieldIcons.Temperature}
                  <span className="ml-2">{getFieldLabel('Temperature')}*</span>
                </label>
                <Input 
                  name="Temperature"
                  type="number"
                  placeholder="°C" 
                  value={formData.Temperature}
                  onChange={handleChange}
                  required
                  className="bg-white focus:ring focus:ring-blue-200 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 flex items-center">
                  {fieldIcons.Humidity}
                  <span className="ml-2">{getFieldLabel('Humidity')}*</span>
                </label>
                <Input 
                  name="Humidity"
                  type="number"
                  placeholder="% relative humidity" 
                  value={formData.Humidity}
                  onChange={handleChange}
                  required
                  className="bg-white focus:ring focus:ring-blue-200 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 flex items-center">
                  {fieldIcons.Previous_Day_Defects}
                  <span className="ml-2">{getFieldLabel('Previous_Day_Defects')}*</span>
                </label>
                <Input 
                  name="Previous_Day_Defects"
                  type="number"
                  placeholder="Number of defects" 
                  value={formData.Previous_Day_Defects}
                  onChange={handleChange}
                  required
                  className="bg-white focus:ring focus:ring-blue-200 transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                disabled={loading}
              >
                {loading ? 
                  <span className="flex items-center">
                    <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculating...
                  </span> : 
                  <span className="flex items-center">
                    <Send className="mr-2" size={16} />
                    Predict Defects
                  </span>
                }
              </Button>
            </div>
          </form>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 animate-pulse">
            <div className="flex">
              <AlertTriangle className="mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Success state with prediction */}
        {prediction !== null && (
          <div className={`transition-all duration-500 ${formSuccess ? 'scale-105' : ''}`}>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-green-800 flex items-center">
                  <CheckCircle className="mr-2" size={20} />
                  Prediction Results
                </h3>
                <span className="text-sm text-green-600 font-medium">Analysis Complete</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Predicted Defects</div>
                  <div className="text-2xl font-bold text-blue-700">{prediction}</div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Defect Rate</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {formData.Production_Volume ? 
                      `${((prediction / parseFloat(formData.Production_Volume)) * 100).toFixed(2)}%` : 
                      'N/A'}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Quality Score</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {formData.Production_Volume ? 
                      `${(100 - ((prediction / parseFloat(formData.Production_Volume)) * 100)).toFixed(2)}%` : 
                      'N/A'}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-2">Production Insights</h4>
                <ul className="space-y-2 text-sm">
                  {parseFloat(formData.Temperature) > 30 && (
                    <li className="flex items-start">
                      <AlertTriangle size={16} className="mr-2 text-yellow-500 mt-0.5" />
                      <span>High temperature may contribute to increased defects.</span>
                    </li>
                  )}
                  {parseFloat(formData.Humidity) >= 60 && (
                    <li className="flex items-start">
                      <AlertTriangle size={16} className="mr-2 text-yellow-500 mt-0.5" />
                      <span>High humidity levels detected, consider environmental controls.</span>
                    </li>
                  )}
                  {parseFloat(formData.Machine_Usage_Hours) > 15 && (
                    <li className="flex items-start">
                      <AlertTriangle size={16} className="mr-2 text-yellow-500 mt-0.5" />
                      <span>Extended machine usage may require maintenance check.</span>
                    </li>
                  )}
                  {parseFloat(formData.Previous_Day_Defects) > prediction && (
                    <li className="flex items-start">
                      <CheckCircle size={16} className="mr-2 text-green-500 mt-0.5" />
                      <span>Predicted improvement from previous day's defect count.</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}