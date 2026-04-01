import { useState, useEffect } from 'react';
import { Teacher } from '../types';
import { motion } from 'motion/react';
import { GraduationCap, BookOpen } from 'lucide-react';
import { fetchData } from '../api';

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    fetchData('teachers').then(data => {
      if (data) setTeachers(data);
    });
  }, []);

  return (
    <div className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Dedicated Teachers</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the mentors who guide our students with passion and expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {teachers.map((teacher, index) => (
            <motion.div
              key={teacher._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-card hover-lift border border-gray-100 group"
            >
              <div className="h-72 overflow-hidden relative">
                <img
                  src={teacher.photoUrl}
                  alt={teacher.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <h3 className="text-2xl font-bold text-white">{teacher.name}</h3>
                  <div className="flex items-center gap-2 text-blue-100 text-sm mt-1">
                    <GraduationCap className="h-4 w-4" />
                    <span>{teacher.qualification}</span>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-start gap-4">
                  <BookOpen className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <p className="text-gray-600 leading-relaxed italic">
                    {teacher.bio}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {teachers.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No teachers data available yet.
          </div>
        )}
      </div>
    </div>
  );
}
