import { useState, useEffect } from 'react';
import { TourPhoto } from '../types';
import { motion } from 'motion/react';
import { fetchData } from '../api';

export default function SchoolTour() {
  const [photos, setPhotos] = useState<TourPhoto[]>([]);

  useEffect(() => {
    fetchData('tour-photos').then(data => {
      if (data) setPhotos(data);
    });
  }, []);

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">School Tour</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Take a virtual look at our state-of-the-art facilities designed for optimal learning and growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {photos.length > 0 ? photos.map((photo, index) => (
            <motion.div
              key={photo._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={photo.photoUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <h3 className="text-xl font-bold text-white">{photo.title}</h3>
              </div>
              <div className="p-4 bg-white lg:hidden">
                <h3 className="text-lg font-bold text-gray-900">{photo.title}</h3>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full text-center py-20 text-gray-500">
              No tour photos available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
