import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function DashBoard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      {/* Header Section */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex items-center"
            >
              <h1 className="text-2xl font-bold text-blue-600">Quality CheckList</h1>
            </motion.div>
            
            {/* Desktop Navigation */}
            <motion.nav
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:flex space-x-8"
            >
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </motion.nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
            
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="hidden md:flex space-x-4"
            >
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
            </motion.div>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
                <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
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
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
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
                  whileTap={{ scale: 0.95 }}
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
                  src="https://via.placeholder.com/600x400?text=Quality+Checklist+Dashboard" 
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

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">What Our Users Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-600 italic mb-4">"This platform has transformed how we manage our quality control processes. Highly recommended!"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-4">
                    <img src="https://via.placeholder.com/48" alt="User Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Sarah Johnson</h4>
                    <p className="text-gray-500 text-sm">Quality Manager, TechCorp</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-gray-600 italic mb-4">"The analytics and reporting features have given us insights we never had before. Game changer!"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-4">
                    <img src="https://via.placeholder.com/48" alt="User Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Michael Chen</h4>
                    <p className="text-gray-500 text-sm">Operations Director, GlobalManufacturing</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Animated Stats Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <motion.div 
                className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl font-bold mb-2">98%</div>
                <p className="text-blue-100">Customer Satisfaction</p>
              </motion.div>
              
              <motion.div 
                className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl font-bold mb-2">10k+</div>
                <p className="text-blue-100">Checklists Created</p>
              </motion.div>
              
              <motion.div 
                className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl font-bold mb-2">500+</div>
                <p className="text-blue-100">Companies</p>
              </motion.div>
              
              <motion.div 
                className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl font-bold mb-2">35%</div>
                <p className="text-blue-100">Quality Improvement</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="bg-white p-8 md:p-12 rounded-xl shadow-lg text-center max-w-4xl mx-auto animate-on-scroll opacity-0 translate-y-10 transition-all duration-700"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Improve Your Quality Control?</h2>
              <p className="text-xl text-gray-600 mb-8">Join thousands of companies that trust our platform for their quality management needs.</p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.button 
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Free Trial
                </motion.button>
                <motion.button 
                  className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Schedule Demo
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white pt-12 pb-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Quality CheckList</h2>
              <p className="text-gray-400 mb-4">Streamlining quality control processes for businesses of all sizes. Our platform helps you create, manage, and optimize your quality checklists.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#integrations" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#updates" className="text-gray-400 hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#careers" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#documentation" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#tutorials" className="text-gray-400 hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#support" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                <li><a href="#api" className="text-gray-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} Quality CheckList. All rights reserved.</p>
              <div className="flex space-x-6">
                <a href="#terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="#privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="#cookies" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
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
