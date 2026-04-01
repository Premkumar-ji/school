import React, { useState, useEffect } from 'react';
import { Activity } from '../types';
import { motion } from 'motion/react';
import { Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { fetchData } from '../api';

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchData('activities').then(data => {
      if (data) setActivities(data);
    });
  }, []);

  const groupedActivities = activities.reduce((acc, curr) => {
    const dateKey = curr.date ? format(new Date(curr.date), 'MMMM yyyy') : 'Other';
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(curr);
    return acc;
  }, {} as Record<string, Activity[]>);

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Activity Photos</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Capturing the vibrant life and memorable events at Excellence Public School.
          </p>
        </div>

        {Object.entries(groupedActivities).map(([month, monthActivities]) => (
          <div key={month} className="mb-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <Calendar className="h-6 w-6 text-blue-600" />
              {month}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(monthActivities as Activity[]).map((activity) => (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={activity.photoUrl}
                      alt={activity.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
                      <Tag className="h-3 w-3" />
                      <span>{activity.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h3>
                    <p className="text-sm text-gray-500">
                      {activity.date ? format(new Date(activity.date), 'PPP') : ''}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No activity photos available yet.
          </div>
        )}
      </div>
    </div>
  );
}
