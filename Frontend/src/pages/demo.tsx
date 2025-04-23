import React, { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Demo(){
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

   return(
    <div className='min-h-screen bg-gray-50'>
         
         <header className='bg-white shadow-md sticky top-0 z-50'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center py-4'>
                    <motion.div 
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className='flex items-center'>
                        <h1 className='text-2xl font-bold text-blue-600'>Quality CheckList</h1>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <motion.nav initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className='hidden md:flex space-x-8'>
                        <a href="features">Feature</a>
                        <a href="#about">about</a>
                        <a href="#contact">contact</a>
                    </motion.nav>

                    {/* Mobile Menu */}
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
            </div>
         </header>
    </div>
   )
}