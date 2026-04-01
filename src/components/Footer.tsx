import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { SchoolInfo } from '../types';
import { useState, useEffect } from 'react';
import { fetchData } from '../api';

export default function Footer() {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);

  useEffect(() => {
    fetchData('school-info').then(data => {
      if (data) setSchoolInfo(data);
    });
  }, []);

  const contactInfo = {
    email: schoolInfo?.email || 'info@excellencepublicschool.edu',
    phone: schoolInfo?.phone || '+91 98765 43210',
    address: schoolInfo?.address || '123 Education Lane, Knowledge City, State - 400001',
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* School Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              {schoolInfo?.logoUrl && (
                <img src={schoolInfo.logoUrl} alt="Logo" className="h-10 w-10 object-contain" referrerPolicy="no-referrer" />
              )}
              <span className="font-bold text-xl">{schoolInfo?.name || 'Excellence Public School'}</span>
            </div>
            <p className="text-gray-400 mb-6 italic">
              "{schoolInfo?.footerDescription || schoolInfo?.slogan || 'Empowering Minds, Shaping Futures'}"
            </p>
            <div className="flex space-x-4">
              <a href={schoolInfo?.facebookUrl || '#'} className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer"><Facebook className="h-5 w-5" /></a>
              <a href={schoolInfo?.twitterUrl || '#'} className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer"><Twitter className="h-5 w-5" /></a>
              <a href={schoolInfo?.instagramUrl || '#'} className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer"><Instagram className="h-5 w-5" /></a>
              <a href={schoolInfo?.youtubeUrl || '#'} className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-gray-400">
              <li><a href="/" className="hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="/tour" className="hover:text-blue-400 transition-colors">School Tour</a></li>
              <li><a href="/performers" className="hover:text-blue-400 transition-colors">Top Performers</a></li>
              <li><a href="/teachers" className="hover:text-blue-400 transition-colors">Our Teachers</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-400 shrink-0 mt-1" />
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {contactInfo.address}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-400 shrink-0" />
                <a 
                  href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400 shrink-0" />
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Universal Announcement</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Stay updated with our latest news and announcements.
            </p>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-2">Latest Notice</p>
              <p className="text-sm text-gray-300">New admission open for session 2026-27. Contact office for details.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {schoolInfo?.name || 'Excellence Public School'}. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Designed with ❤️ for Education
          </p>
        </div>
      </div>
    </footer>
  );
}
