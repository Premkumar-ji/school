import { useState, useEffect } from 'react';
import { TopPerformer } from '../types';
import { motion } from 'motion/react';
import { Trophy, Award, Star } from 'lucide-react';
import { fetchData } from '../api';

export default function TopPerformers() {
  const [performers, setPerformers] = useState<TopPerformer[]>([]);

  useEffect(() => {
    fetchData('top-performers').then(data => {
      if (data) setPerformers(data);
    });
  }, []);

  const groupedPerformers = performers.reduce((acc, curr) => {
    if (!acc[curr.class]) acc[curr.class] = [];
    acc[curr.class].push(curr);
    return acc;
  }, {} as Record<string, TopPerformer[]>);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 2: return <Award className="h-8 w-8 text-gray-400" />;
      case 3: return <Star className="h-8 w-8 text-amber-600" />;
      default: return null;
    }
  };

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-up">Top Performers</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Celebrating the academic excellence and hard work of our brilliant students.
          </p>
        </div>

        {Object.entries(groupedPerformers).map(([className, classPerformers]) => (
          <div key={className} className="mb-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 flex items-center gap-4">
              <span className="bg-primary text-white px-4 py-1 rounded-lg text-xl shadow-md">{className}</span>
              <div className="h-px flex-grow bg-gray-100" />
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {(classPerformers as TopPerformer[]).sort((a,b) => a.rank - b.rank).map((student) => (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="bg-white rounded-3xl p-8 pt-16 text-center shadow-card hover-lift border border-gray-100">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                      <img
                        src={student.photoUrl}
                        alt={student.name}
                        className="w-full h-full object-cover hover-scale"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    <div className="absolute top-4 right-4">
                      {getRankIcon(student.rank)}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{student.name}</h3>
                    <div className="inline-block px-4 py-1 bg-blue-50 text-primary rounded-full font-bold text-sm mb-4">
                      Marks: {student.marks}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed italic">
                      "{student.bio}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {performers.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No toppers data available yet.
          </div>
        )}
      </div>
    </div>
  );
}
