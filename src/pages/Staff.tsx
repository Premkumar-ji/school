import { useState, useEffect } from 'react';
import { Staff } from '../types';
import { motion } from 'motion/react';
import { fetchData } from '../api';

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);

  useEffect(() => {
    fetchData('staff').then(data => {
      if (data) setStaff(data);
    });
  }, []);

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Supporting Staff</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The backbone of our institution, ensuring everything runs smoothly every day.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {staff.map((member, index) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group hover-lift p-4 rounded-2xl bg-white border border-gray-50 shadow-sm"
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-xl transition-all duration-300">
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover hover-scale"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-center font-bold text-gray-900 group-hover:text-primary transition-colors">{member.name}</h3>
            </motion.div>
          ))}
        </div>

        {staff.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No staff data available yet.
          </div>
        )}
      </div>
    </div>
  );
}
