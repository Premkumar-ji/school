import { useState, useEffect } from 'react';
import { YoutubeLink } from '../types';
import { motion } from 'motion/react';
import { Youtube, PlayCircle } from 'lucide-react';
import { fetchData } from '../api';

export default function YouTube() {
  const [links, setLinks] = useState<YoutubeLink[]>([]);

  useEffect(() => {
    fetchData('youtube-links').then(data => {
      if (data) setLinks(data);
    });
  }, []);

  const getEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-block p-4 bg-red-100 rounded-full mb-6">
            <Youtube className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">School Video Gallery</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch our latest events, performances, and educational content on our official YouTube channel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {links.map((link, index) => (
            <motion.div
              key={link._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-3xl overflow-hidden shadow-lg border border-gray-100"
            >
              <div className="aspect-video">
                <iframe
                  src={getEmbedUrl(link.videoUrl)}
                  title={link.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">{link.title}</h3>
                <PlayCircle className="h-8 w-8 text-red-600 opacity-50" />
              </div>
            </motion.div>
          ))}
        </div>

        {links.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No video links available yet.
          </div>
        )}
      </div>
    </div>
  );
}
