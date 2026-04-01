import { useState, useEffect } from 'react';
import { SchoolInfo } from '../types';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { fetchData } from '../api';

export default function Home() {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);

  useEffect(() => {
    fetchData('school-info').then(data => {
      if (data) setSchoolInfo(data);
    });
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={schoolInfo?.heroImageUrl || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"}
            alt="School Building"
            className="w-full h-full object-cover scale-105 animate-pulse"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary-dark/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center animate-fade-up"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
              <div className="text-center md:text-left">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight drop-shadow-lg">
                  {schoolInfo?.name || 'Excellence Public School'}
                </h1>
                <p className="text-xl md:text-2xl font-light italic text-blue-200 drop-shadow-md">
                  {schoolInfo?.slogan || 'Empowering Minds, Shaping Futures'}
                </p>
              </div>
              {schoolInfo?.logoUrl && (
                <img 
                  src={schoolInfo.logoUrl} 
                  alt="Logo" 
                  className="h-32 w-32 object-contain bg-white/20 p-2 rounded-full backdrop-blur-md hidden md:block border border-white/30 shadow-2xl hover:rotate-12 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            
            <div className="max-w-2xl mx-auto mt-8 p-6 border-l-4 border-blue-400 bg-white/10 backdrop-blur-lg rounded-r-xl shadow-2xl">
              <p className="text-lg md:text-xl font-medium leading-relaxed italic">
                "{schoolInfo?.motivationalLine || 'Education is the most powerful weapon which you can use to change the world.'}"
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src={schoolInfo?.principalPhoto || "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1887&auto=format&fit=crop"}
                  alt="Principal"
                  className="w-full h-full object-cover hover-scale"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-primary text-white p-8 rounded-3xl shadow-2xl max-w-xs hidden md:block border-4 border-white animate-fade-up">
                <Quote className="h-8 w-8 mb-4 opacity-50" />
                <p className="text-lg font-medium italic leading-snug">
                  {schoolInfo?.principalSlogan || 'Leadership is the capacity to translate vision into reality.'}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="animate-fade-up"
            >
              <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">Message from the Desk</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Principal's Vision</h2>
              <div className="prose prose-lg text-gray-600 max-w-none">
                <p className="whitespace-pre-line leading-relaxed">
                  {schoolInfo?.principalBio || 'Welcome to Excellence Public School. Our mission is to provide a nurturing environment where every student can achieve their full potential. We believe in holistic education that balances academic excellence with character development and creative expression.'}
                </p>
              </div>
              <div className="mt-12 pt-8 border-t border-gray-100">
                <p className="text-2xl font-bold text-gray-900">Dr. Sarah Johnson</p>
                <p className="text-primary font-medium">Principal, Excellence Public School</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
