import { useState, useEffect } from 'react';
import { Award } from '../types';
import { motion } from 'motion/react';
import { Award as AwardIcon } from 'lucide-react';
import { fetchData } from '../api';

export default function Awards() {
  const [awards, setAwards] = useState<Award[]>([]);

  useEffect(() => {
    fetchData('awards').then(data => {
      if (data) setAwards(data);
    });
  }, []);

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Awards & Achievements</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Recognizing the talent and achievements of our students in sports, arts, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {awards.map((award, index) => (
            <motion.div
              key={award._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 group"
            >
              <div className="h-64 overflow-hidden relative">
                <img
                  src={award.photoUrl}
                  alt={award.studentName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-yellow-500 text-white p-2 rounded-full shadow-lg">
                  <AwardIcon className="h-6 w-6" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{award.studentName}</h3>
                <p className="text-blue-600 font-medium">{award.event}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {awards.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No awards data available yet.
          </div>
        )}
      </div>
    </div>
  );
}
