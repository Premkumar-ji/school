import { useState, useEffect } from 'react';
import { Announcement } from '../types';
import { motion } from 'motion/react';
import { Megaphone, Calendar, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { fetchData } from '../api';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetchData('announcements').then(data => {
      if (data) setAnnouncements(data);
    });
  }, []);

  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-blue-50 rounded-full mb-6 animate-pulse">
            <Megaphone className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-up">Universal Announcements</h1>
          <p className="text-lg text-gray-600">
            Stay informed with the latest updates and notices from the school administration.
          </p>
        </div>

        <div className="space-y-8">
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 border-l-8 border-primary shadow-card hover-lift relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Bell className="h-24 w-24 spinner" />
              </div>
              
              <div className="flex items-center gap-2 text-primary font-bold text-sm mb-4 uppercase tracking-widest">
                <Calendar className="h-4 w-4" />
                <span>{announcement.createdAt ? format(new Date(announcement.createdAt), 'MMMM dd, yyyy - hh:mm a') : 'Recent'}</span>
              </div>
              
              <p className="text-xl text-gray-800 leading-relaxed font-medium">
                {announcement.message}
              </p>
            </motion.div>
          ))}

          {announcements.length === 0 && (
            <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              No recent announcements.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
