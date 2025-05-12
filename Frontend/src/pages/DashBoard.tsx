import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  FileText,
  User,
  CheckSquare,
  Menu,
  X,
} from 'lucide-react';
import { cn } from "@/lib/utils";

export default function DashBoard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", href: "/", icon: <ClipboardList size={16} /> },
    { name: "Items", href: "/items", icon: <FileText size={16} /> },
    { name: "Users", href: "/users", icon: <User size={16} /> },
    { name: "Checklist", href: "/checklist", icon: <CheckSquare size={16} /> },
  ];

  useEffect(() => {
    // For animations using Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.animate-on-scroll');
    hiddenElements.forEach(el => observer.observe(el));

    return () => {
      hiddenElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with UserDash-style Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex md:hidden justify-between items-center py-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white mr-3">
                  <ClipboardList size={20} />
                </div>
                <h2 className="text-xl font-bold text-blue-700">Quality Check</h2>
              </div>
              <button
                className="text-gray-700 hover:text-blue-600 focus:outline-none p-1"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {isMenuOpen && (
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
                  <div className="flex space-x-4 pt-2">
                    <Link to="/login" className="w-1/2">
                      <button className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                        Login
                      </button>
                    </Link>
                    <Link to="/signup" className="w-1/2">
                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Sign Up
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="hidden md:flex items-center justify-between border-b border-gray-200 py-4"
            >
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white mr-3">
                  <ClipboardList size={20} />
                </div>
                <h2 className="text-xl font-bold text-blue-700">
                  Quality Check System
                </h2>
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
              <div className="flex space-x-4">
                <Link to="/login">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            </motion.nav>
          </div>
        </div>
      </header>

      {/* Main Content - Keeping the existing content */}
      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div 
                className="md:w-1/2 mb-10 md:mb-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Streamline Your Quality Control Process</h1>
                <p className="text-xl text-gray-600 mb-8">Manage, track, and improve your quality checklists with our intuitive platform</p>
                <motion.button 
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }} onClick={()=>navigate('/signup')}
                >
                  Get Started
                </motion.button>
              </motion.div>
              <motion.div 
                className="md:w-1/2"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1586282391129-76a6df230234?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Quality Checklist Dashboard" 
                  className="rounded-lg shadow-xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-md animate-on-scroll opacity-0 translate-y-10 transition-all duration-700"
                whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              >
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Customizable Checklists</h3>
                <p className="text-gray-600">Create and customize quality checklists tailored to your specific needs and workflows.</p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-md animate-on-scroll opacity-0 translate-y-10 transition-all duration-700"
                whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              >
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Real-time Analytics</h3>
                <p className="text-gray-600">Track quality metrics and performance with intuitive dashboards and reports.</p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-md animate-on-scroll opacity-0 translate-y-10 transition-all duration-700"
                whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              >
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Team Collaboration</h3>
                <p className="text-gray-600">Collaborate with team members in real-time, assign tasks, and track progress.</p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-md animate-on-scroll opacity-0 translate-y-10 transition-all duration-700"
                whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              >
                <div className="text-4xl mb-4">🔔</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Notifications & Alerts</h3>
                <p className="text-gray-600">Stay informed with timely notifications about checklist updates and deadlines.</p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-md animate-on-scroll opacity-0 translate-y-10 transition-all duration-700"
                whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              >
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Mobile Friendly</h3>
                <p className="text-gray-600">Access your checklists on the go with our responsive mobile interface.</p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-md animate-on-scroll opacity-0 translate-y-10 transition-all duration-700"
                whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              >
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Secure Data Storage</h3>
                <p className="text-gray-600">Your quality data is securely stored and backed up regularly.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">How It Works</h2>
            
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0 md:space-x-4">
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-md max-w-xs w-full animate-on-scroll opacity-0 translate-y-10 transition-all duration-700"
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex justify-center items-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4 mx-auto">
                  <span className="font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">Create Your Account</h3>
                <p className="text-gray-600 text-center">Sign up and set up your organization profile in minutes.</p>
              </motion.div>
              
              <div className="hidden md:block w-24 h-0.5 bg-blue-200 mt-10"></div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-md max-w-xs w-full animate-on-scroll opacity-0 translate-y-10 transition-all duration-700"
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex justify-center items-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4 mx-auto">
                  <span className="font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">Design Your Checklists</h3>
                <p className="text-gray-600 text-center">Create custom checklists or use our templates to get started quickly.</p>
              </motion.div>
              
              <div className="hidden md:block w-24 h-0.5 bg-blue-200 mt-10"></div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-md max-w-xs w-full animate-on-scroll opacity-0 translate-y-10 transition-all duration-700"
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex justify-center items-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4 mx-auto">
                  <span className="font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">Implement & Monitor</h3>
                <p className="text-gray-600 text-center">Deploy checklists to your team and track quality metrics in real-time.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Rest of the sections remain unchanged... */}
        {/* Testimonials Section */}
        {/* Animated Stats Section */}
        {/* CTA Section */}
      </main>

      {/* Footer Section - Keeping the existing footer */}
      <footer className="bg-gray-800 text-white pt-12 pb-6">
        {/* Footer content remains unchanged */}
      </footer>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <motion.button 
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </motion.button>
      </div>

      {/* Animation for page transitions */}
      <motion.div
        className="fixed top-0 left-0 w-full h-screen bg-blue-600 z-50 flex items-center justify-center"
        initial={{ y: 0 }}
        animate={{ y: '-100vh' }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <motion.h1 
          className="text-4xl font-bold text-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          Quality CheckList
        </motion.h1>
      </motion.div>
    </div>
  );
}