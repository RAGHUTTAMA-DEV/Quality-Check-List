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


                </div>
            </div>
         </header>
    </div>
   )
}