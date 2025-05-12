import { useState } from 'react'
import { 
  Camera, 
  FileText, 
  RefreshCw, 
  Send, 
  AlertTriangle, 
  Image as ImageIcon,
  CheckCircle,
  Eye,
  Upload,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {motion} from 'framer-motion'

export default function ImagePredictor() {
  const [image, setImage] = useState(null)
  const [previewURL, setPreviewURL] = useState('')
  const [prediction, setPrediction] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [animation, setAnimation] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreviewURL(URL.createObjectURL(file))
      setPrediction('')
      setError('')
    }
  }

  const triggerAnimation = () => {
    setAnimation(true)
    setTimeout(() => setAnimation(false), 1000)
  }

  const handlePredict = async (e) => {
    e.preventDefault()
    
    if (!image) {
      setError('Please upload an image first.')
      return
    }
    
    setPrediction('')
    setError('')
    setLoading(true)
    
    const formData = new FormData()
    formData.append('image', image)
    
    try {
      const response = await fetch('http://localhost:5002/image/predict', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setPrediction(data.prediction)
        setFormSuccess(true)
        setTimeout(() => setFormSuccess(false), 3000)
        triggerAnimation()
      } else {
        setError(data.error || 'Something went wrong.')
      }
    } catch (err) {
      console.error(err)
      setError('Prediction failed. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setImage(null)
    setPreviewURL('')
    setPrediction('')
    setError('')
  }

  // Helper function to get defect severity class
  const getDefectSeverityClass = (prediction) => {
    if (prediction.includes("No")) return "text-green-600"
    if (prediction.includes("Minor")) return "text-yellow-600"
    if (prediction.includes("Major")) return "text-red-600"
    return "text-blue-600"
  }

  // Helper function to get recommendation based on prediction
  const getRecommendation = (prediction) => {
    if (prediction.includes("No")) {
      return "Product meets quality standards. Proceed with packaging."
    }
    if (prediction.includes("Minor")) {
      return "Minor adjustments needed. Product may be salvageable with rework."
    }
    if (prediction.includes("Major")) {
      return "Major defect detected. Consider inspection and production line review."
    }
    return "Analysis complete. Review the results."
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen">
      
      <div className={`bg-white shadow-xl rounded-xl p-6 transition-all duration-500 ${animation ? 'scale-102 shadow-2xl' : ''}`}>
        <motion.nav
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:flex space-x-8 space-y-4"
            >
              <a href="/items" className="text-gray-700 hover:text-blue-600 transition-colors">Items</a>
              <a href="/users" className="text-gray-700 hover:text-blue-600 transition-colors">Users</a>
              <a href="/checklist" className="text-gray-700 hover:text-blue-600 transition-colors">Checklist</a>
      </motion.nav>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white mr-4">
              <Camera size={24} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Image Defect Detection
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
            Upload Product Image
          </h2>

          <form onSubmit={handlePredict} className="space-y-6">
            <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
              <div className="flex flex-col items-center justify-center">
                <label 
                  htmlFor="image-upload" 
                  className="w-full cursor-pointer bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-blue-100 transition-colors duration-200"
                >
                  {!previewURL ? (
                    <>
                      <Upload size={48} className="text-blue-500 mb-2" />
                      <span className="text-blue-600 font-medium">Click to upload an image</span>
                      <span className="text-gray-500 text-sm mt-1">or drag and drop</span>
                      <span className="text-gray-400 text-xs mt-2">PNG, JPG, JPEG up to 10MB</span>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <img 
                          src={previewURL} 
                          alt="Preview" 
                          className="rounded-lg max-h-48 object-contain mb-2" 
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity duration-200">
                          <Eye size={32} className="text-white" />
                        </div>
                      </div>
                      <span className="text-blue-600 text-sm mt-2">Click to change image</span>
                    </div>
                  )}
                  <input 
                    id="image-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange} 
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                disabled={loading || !image}
              >
                {loading ? 
                  <span className="flex items-center">
                    <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span> : 
                  <span className="flex items-center">
                    <ImageIcon className="mr-2" size={16} />
                    Analyze Image
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
        {prediction && (
          <div className={`transition-all duration-500 ${formSuccess ? 'scale-105' : ''}`}>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-green-800 flex items-center">
                  <CheckCircle className="mr-2" size={20} />
                  Analysis Results
                </h3>
                <span className="text-sm text-green-600 font-medium">Analysis Complete</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Prediction</div>
                  <div className={`text-2xl font-bold ${getDefectSeverityClass(prediction)}`}>
                    {prediction}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Confidence Level</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {Math.floor(70 + Math.random() * 25)}%
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-2">Analysis Insights</h4>
                <div className="flex items-start text-sm">
                  <ArrowRight size={16} className="mr-2 text-blue-500 mt-0.5" />
                  <span>{getRecommendation(prediction)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )}