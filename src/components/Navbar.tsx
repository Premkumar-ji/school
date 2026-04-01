import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { SchoolInfo } from '../types';
import { fetchData } from '../api';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const location = useLocation();

  useEffect(() => {
    fetchData('school-info').then(data => {
      if (data) setSchoolInfo(data);
    });
    fetchData('announcements').then(data => {
      if (data) setAnnouncements(data);
    });
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'School Tour', path: '/tour' },
    { name: 'Top Performers', path: '/performers' },
    { name: 'Teachers', path: '/teachers' },
    { name: 'Staff', path: '/staff' },
    { name: 'Vision', path: '/vision' },
    { name: 'Awards', path: '/awards' },
    { name: 'Announcements', path: '/announcements' },
    { name: 'Activities', path: '/activities' },
    { name: 'YouTube', path: '/youtube' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Announcement Ticker */}
      {announcements.length > 0 && (
        <div className="bg-primary text-white py-2 overflow-hidden border-b border-primary-dark">
          <div className="ticker-text">
            {announcements.map((a, i) => (
              <span key={i} className="mx-8 font-medium">
                📢 {a.message}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              {schoolInfo?.logoUrl ? (
                <img src={schoolInfo.logoUrl} alt="Logo" className="h-12 w-12 object-contain" referrerPolicy="no-referrer" />
              ) : (
                <GraduationCap className="h-10 w-10 text-blue-600" />
              )}
              <span className="font-bold text-xl text-gray-900 hidden sm:block">
                {schoolInfo?.name || 'Excellence Public School'}
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out",
                  location.pathname === link.path
                    ? "text-primary bg-blue-50"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/admin"
              className="ml-4 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === link.path
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 bg-blue-600 text-white rounded-md text-base font-medium"
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
