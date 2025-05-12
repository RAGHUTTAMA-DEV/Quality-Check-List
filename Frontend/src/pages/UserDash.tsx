import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/AuthContext";
import axios from "axios";
import {
  ClipboardList,
  RefreshCw,
  ImageDown,
  CheckSquare,
  CheckCircle,
  MessageSquare,
  Layers,
  FileText,
  Clock,
  BarChart2,
  User,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function UserDash() {
  const { user, token } = useAuth();
  const [stages, setStages] = useState([]);
  const [assignedItems, setAssignedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [animation, setAnimation] = useState(false);
  const [refreshed, setRefreshed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", href: "/", icon: <ClipboardList size={16} /> },
    { name: "Items", href: "/items", icon: <FileText size={16} /> },
    { name: "Users", href: "/users", icon: <User size={16} /> },
    { name: "Checklist", href: "/checklist", icon: <CheckSquare size={16} /> },
  ];

  useEffect(() => {
    if (user && token) {
      getStages();
    }
  }, [user, token]);

  async function getStages() {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:3000/api/items/user-assignments?userId=${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStages(response.data.assignedStages || []);
      setAssignedItems(response.data.assignedItems || []);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setError("Failed to load assignments. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  const triggerAnimation = () => {
    setAnimation(true);
    setTimeout(() => setAnimation(false), 1000);
  };

  const handleRefresh = async () => {
    await getStages();
    triggerAnimation();
    setRefreshed(true);
    setTimeout(() => setRefreshed(false), 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusClass = (isChecked) => {
    return isChecked ? "text-green-600" : "text-amber-600";
  };

  const getStatusText = (isChecked) => {
    return isChecked ? "Completed" : "Pending";
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen">
      <div
        className={`bg-white shadow-xl rounded-xl p-6 transition-all duration-500 ${
          animation ? "scale-102 shadow-2xl" : ""
        }`}
      >
        {/* Unified Navigation */}
        <div className="mb-8">
          {/* Mobile Header */}
          <div className="flex md:hidden justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white mr-3">
                <ClipboardList size={20} />
              </div>
              <h1 className="text-xl font-bold text-blue-700">Quality Check Dashboard</h1>
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

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mb-4"
            >
              <nav className="flex flex-col space-y-1 bg-blue-50 p-4 rounded-lg">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center py-2 px-3 rounded-md transition-colors",
                      window.location.pathname === item.href
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-100"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}

          {/* Desktop Navigation */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="hidden md:block border-b border-gray-200 pb-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white mr-3">
                  <ClipboardList size={20} />
                </div>
                <h1 className="text-xl font-bold text-blue-700">
                  Quality Check Dashboard
                </h1>
              </div>
              <nav className="flex space-x-1">
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
              </nav>
            </div>
          </motion.header>
        </div>

        {/* Main Dashboard Content */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center">
            <ClipboardList size={24} className="text-blue-600 mr-3" />
            Your Assignments
          </h2>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex items-center border-blue-300 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw
                className={`mr-2 ${loading ? "animate-spin" : ""}`}
                size={18}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              className="flex items-center border-blue-300 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={() => navigate("/ml")}
              disabled={loading}
            >
              <ImageDown className="mr-2" size={18} />
              Predict Defect
            </Button>
            <Button
              variant="outline"
              className="flex items-center border-blue-300 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={() => navigate("/image")}
              disabled={loading}
            >
              <ImageDown className="mr-2" size={18} />
              Image Defect Analysis
            </Button>
          </div>
        </div>

        {/* Error and Success Notifications */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 animate-pulse">
            <div className="flex">
              <CheckCircle className="mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}
        {refreshed && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 animate-pulse">
            <div className="flex">
              <CheckCircle className="mr-2" />
              <p>Assignments refreshed successfully!</p>
            </div>
          </div>
        )}

        {/* Assigned Stages */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 mb-8 border border-blue-100">
          <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
            <Layers className="mr-2" size={20} />
            Assigned Stages
          </h2>
          {stages.length === 0 ? (
            <div className="bg-white p-6 rounded-lg border border-blue-200 text-center text-gray-500">
              No stages assigned to you.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stages.map((stage) => (
                <div
                  key={stage._id}
                  className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <FileText className="text-blue-600" size={16} />
                      </div>
                      <h3 className="font-semibold text-blue-800">
                        {stage.title}
                      </h3>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {stage.stage?.name ?? "N/A"}
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={14} className="mr-2 text-gray-400" />
                      <span>Created: {formatDate(stage.createdAt)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <BarChart2 size={14} className="mr-2 text-gray-400" />
                      <span>Items: {stage.items?.length ?? 0}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <Button
                      variant="outline"
                      className="w-full text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assigned Checklist Items */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 border border-green-100">
          <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center">
            <CheckSquare className="mr-2" size={20} />
            Assigned Checklist Items
          </h2>
          {assignedItems.length === 0 ? (
            <div className="bg-white p-6 rounded-lg border border-green-200 text-center text-gray-500">
              No checklist items assigned to you.
            </div>
          ) : (
            <div className="space-y-4">
              {assignedItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white p-4 rounded-lg border border-green-200 shadow-sm"
                >
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <div className="font-medium mb-2">{item.content}</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">
                            Status
                          </div>
                          <div
                            className={`text-lg font-bold ${getStatusClass(
                              item.isChecked
                            )}`}
                          >
                            {getStatusText(item.isChecked)}
                          </div>
                        </div>
                        {item.comments && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1 flex items-center">
                              <MessageSquare size={14} className="mr-1" />
                              Comments
                            </div>
                            <div className="text-gray-700 text-sm">
                              {item.comments}
                            </div>
                          </div>
                        )}
                      </div>
                      {item.Image && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm text-blue-600 mb-1 flex items-center">
                            <ImageDown size={14} className="mr-1" />
                            Attached Image
                          </div>
                          <div className="text-blue-800 text-sm font-medium">
                            {item.Image}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button className="bg-green-600 hover:bg-green-700 text-sm text-white hover:shadow-md transition-all duration-300">
                      <CheckCircle className="mr-1" size={14} />
                      {item.isChecked ? "View Details" : "Mark Complete"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Profile Badge */}
      {user && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="fixed bottom-4 right-4 bg-white rounded-full shadow-lg p-2 flex items-center"
        >
          <div className="bg-blue-100 text-blue-700 h-8 w-8 rounded-full flex items-center justify-center mr-2">
            <User size={16} />
          </div>
          <div className="pr-3">
            <div className="text-sm font-medium">
              {user.name || user.username || "User"}
            </div>
            <div className="text-xs text-gray-500">{user.role || "Operator"}</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}