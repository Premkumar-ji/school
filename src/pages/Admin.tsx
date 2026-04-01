import React, { useState, useEffect } from 'react';
import { SchoolInfo, TourPhoto, TopPerformer, Teacher, Staff, VisionQuote, Award, Announcement, Activity, YoutubeLink } from '../types';
import { motion } from 'motion/react';
import { LogIn, LogOut, Plus, Trash2, Edit2, Save, X, Settings, Users, Image as ImageIcon, Award as AwardIcon, Megaphone, Video, Lightbulb, UserPlus, Menu, Phone } from 'lucide-react';
import { fetchData } from '../api';
import { Toaster, toast } from 'sonner';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schoolInfo');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data states
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
  const [tourPhotos, setTourPhotos] = useState<TourPhoto[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [visionQuotes, setVisionQuotes] = useState<VisionQuote[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [youtubeLinks, setYoutubeLinks] = useState<YoutubeLink[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const loadAllData = async () => {
    if (!isAuthenticated) return;
    try {
      const [
        schoolData, tourData, topperData, teacherData, staffData, 
        visionData, awardData, announceData, activityData, youtubeData
      ] = await Promise.all([
        fetchData('school-info'),
        fetchData('tour-photos'),
        fetchData('top-performers'),
        fetchData('teachers'),
        fetchData('staff'),
        fetchData('vision-quotes'),
        fetchData('awards'),
        fetchData('announcements'),
        fetchData('activities'),
        fetchData('youtube-links')
      ]);

      if (schoolData) setSchoolInfo(schoolData);
      if (tourData) setTourPhotos(tourData);
      if (topperData) setTopPerformers(topperData);
      if (teacherData) setTeachers(teacherData);
      if (staffData) setStaff(staffData);
      if (visionData) setVisionQuotes(visionData);
      if (awardData) setAwards(awardData);
      if (announceData) setAnnouncements(announceData);
      if (activityData) setActivities(activityData);
      if (youtubeData) setYoutubeLinks(youtubeData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [isAuthenticated]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem('admin_token', token);
        setIsAuthenticated(true);
        toast.success('Logged in successfully');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Invalid credentials');
      }
    } catch (err) {
      toast.error('Login failed. Server might be offline.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_token');
    toast.info('Logged out');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-600 p-4 rounded-full mb-4">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-500">Excellence Public School</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter admin email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-gray-400">
            Authorized access only. Credentials managed via environment variables.
          </p>
        </motion.div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Toaster position="top-right" richColors />
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          <TabButton id="schoolInfo" icon={<Settings />} label="School Info" active={activeTab} onClick={(id: string) => { setActiveTab(id); setIsSidebarOpen(false); }} />
          <TabButton id="contactInfo" icon={<Phone />} label="Contact Info" active={activeTab} onClick={(id: string) => { setActiveTab(id); setIsSidebarOpen(false); }} />
          <TabButton id="tourPhotos" icon={<ImageIcon />} label="Tour Photos" active={activeTab} onClick={(id: string) => { setActiveTab(id); setIsSidebarOpen(false); }} />
          <TabButton id="topPerformers" icon={<AwardIcon />} label="Top Performers" active={activeTab} onClick={(id: string) => { setActiveTab(id); setIsSidebarOpen(false); }} />
          <TabButton id="teachers" icon={<Users />} label="Teachers" active={activeTab} onClick={(id: string) => { setActiveTab(id); setIsSidebarOpen(false); }} />
          <TabButton id="staff" icon={<Users />} label="Staff" active={activeTab} onClick={(id: string) => { setActiveTab(id); setIsSidebarOpen(false); }} />
          <TabButton id="visionQuotes" icon={<Lightbulb />} label="Vision Quotes" active={activeTab} onClick={(id: string) => { setActiveTab(id); setIsSidebarOpen(false); }} />
          <TabButton id="awards" icon={<AwardIcon />} label="Awards" active={activeTab} onClick={(id: string) => { setActiveTab(id); setIsSidebarOpen(false); }} />
          <TabButton id="announcements" icon={<Megaphone />} label="Announcements" active={activeTab} onClick={(id: string) => { setActiveTab(id); setIsSidebarOpen(false); }} />
          <TabButton id="activities" icon={<ImageIcon />} label="Activities" active={activeTab} onClick={(id: string) => { setActiveTab(id); setIsSidebarOpen(false); }} />
          <TabButton id="youtubeLinks" icon={<Video />} label="YouTube Links" active={activeTab} onClick={(id: string) => { setActiveTab(id); setIsSidebarOpen(false); }} />
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full p-2">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto h-screen w-full">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {activeTab.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </h1>
          </div>
          <div className="lg:hidden">
            <button onClick={handleLogout} className="text-red-600 font-bold">Logout</button>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-8">
          {activeTab === 'schoolInfo' && <SchoolInfoEditor data={schoolInfo} onSave={loadAllData} />}
          {activeTab === 'contactInfo' && <ContactInfoEditor data={schoolInfo} onSave={loadAllData} />}
          {activeTab === 'tourPhotos' && <GenericListEditor collectionName="tourPhotos" data={tourPhotos} onSave={loadAllData} fields={[{name: 'title', type: 'text'}, {name: 'photoUrl', type: 'text'}]} />}
          {activeTab === 'topPerformers' && <TopPerformersEditor data={topPerformers} onSave={loadAllData} />}
          {activeTab === 'teachers' && <GenericListEditor collectionName="teachers" data={teachers} onSave={loadAllData} fields={[{name: 'name', type: 'text'}, {name: 'qualification', type: 'text'}, {name: 'bio', type: 'textarea'}, {name: 'photoUrl', type: 'text'}]} />}
          {activeTab === 'staff' && <GenericListEditor collectionName="staff" data={staff} onSave={loadAllData} fields={[{name: 'name', type: 'text'}, {name: 'photoUrl', type: 'text'}]} />}
          {activeTab === 'visionQuotes' && <GenericListEditor collectionName="visionQuotes" data={visionQuotes} onSave={loadAllData} fields={[{name: 'text', type: 'textarea'}]} />}
          {activeTab === 'awards' && <GenericListEditor collectionName="awards" data={awards} onSave={loadAllData} fields={[{name: 'studentName', type: 'text'}, {name: 'event', type: 'text'}, {name: 'photoUrl', type: 'text'}]} />}
          {activeTab === 'announcements' && <GenericListEditor collectionName="announcements" data={announcements} onSave={loadAllData} fields={[{name: 'message', type: 'textarea'}, {name: 'createdAt', type: 'datetime-local'}]} />}
          {activeTab === 'activities' && <GenericListEditor collectionName="activities" data={activities} onSave={loadAllData} fields={[{name: 'title', type: 'text'}, {name: 'category', type: 'text'}, {name: 'date', type: 'date'}, {name: 'photoUrl', type: 'text'}]} />}
          {activeTab === 'youtubeLinks' && <GenericListEditor collectionName="youtubeLinks" data={youtubeLinks} onSave={loadAllData} fields={[{name: 'title', type: 'text'}, {name: 'videoUrl', type: 'text'}]} />}
        </div>
      </main>
    </div>
  );
}

function TabButton({ id, icon, label, active, onClick }: any) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active === id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SchoolInfoEditor({ data, onSave }: { data: SchoolInfo | null, onSave: () => void }) {
  const [formData, setFormData] = useState<SchoolInfo>(data || {
    logoUrl: '', heroImageUrl: '', name: '', slogan: '', motivationalLine: '', principalPhoto: '', principalBio: '', principalSlogan: '', address: '', phone: '', email: '', footerDescription: '', facebookUrl: '', twitterUrl: '', instagramUrl: '', youtubeUrl: ''
  });

  useEffect(() => { if (data) setFormData(data); }, [data]);

  const handleSave = async () => {
    try {
      await fetchData('school-info', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      toast.success('School info updated successfully!');
      onSave();
    } catch (e) { 
      toast.error(e instanceof Error ? e.message : 'Error updating info'); 
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="School Name" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
        <InputField label="Logo URL" value={formData.logoUrl} onChange={v => setFormData({...formData, logoUrl: v})} />
        <InputField label="Hero Image URL" value={formData.heroImageUrl || ''} onChange={v => setFormData({...formData, heroImageUrl: v})} />
        <InputField label="Slogan" value={formData.slogan} onChange={v => setFormData({...formData, slogan: v})} />
        <InputField label="Motivational Line" value={formData.motivationalLine} onChange={v => setFormData({...formData, motivationalLine: v})} />
        <InputField label="Principal Photo URL" value={formData.principalPhoto} onChange={v => setFormData({...formData, principalPhoto: v})} />
        <InputField label="Principal Slogan" value={formData.principalSlogan} onChange={v => setFormData({...formData, principalSlogan: v})} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Principal Bio</label>
        <textarea
          value={formData.principalBio}
          onChange={e => setFormData({...formData, principalBio: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button onClick={handleSave} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700">Save Changes</button>
    </div>
  );
}

function ContactInfoEditor({ data, onSave }: { data: SchoolInfo | null, onSave: () => void }) {
  const [formData, setFormData] = useState<SchoolInfo>(data || {
    logoUrl: '', heroImageUrl: '', name: '', slogan: '', motivationalLine: '', principalPhoto: '', principalBio: '', principalSlogan: '', address: '', phone: '', email: '', footerDescription: '', facebookUrl: '', twitterUrl: '', instagramUrl: '', youtubeUrl: ''
  });

  useEffect(() => { if (data) setFormData(data); }, [data]);

  const handleSave = async () => {
    try {
      await fetchData('school-info', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      toast.success('Contact info updated successfully!');
      onSave();
    } catch (e) { 
      toast.error(e instanceof Error ? e.message : 'Error updating contact info'); 
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Address" value={formData.address || ''} onChange={v => setFormData({...formData, address: v})} />
        <InputField label="Phone" value={formData.phone || ''} onChange={v => setFormData({...formData, phone: v})} />
        <InputField label="Email" value={formData.email || ''} onChange={v => setFormData({...formData, email: v})} />
        <InputField label="Footer Description" value={formData.footerDescription || ''} onChange={v => setFormData({...formData, footerDescription: v})} />
        <InputField label="Facebook URL" value={formData.facebookUrl || ''} onChange={v => setFormData({...formData, facebookUrl: v})} />
        <InputField label="Twitter URL" value={formData.twitterUrl || ''} onChange={v => setFormData({...formData, twitterUrl: v})} />
        <InputField label="Instagram URL" value={formData.instagramUrl || ''} onChange={v => setFormData({...formData, instagramUrl: v})} />
        <InputField label="YouTube URL" value={formData.youtubeUrl || ''} onChange={v => setFormData({...formData, youtubeUrl: v})} />
      </div>
      <button onClick={handleSave} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700">Save Changes</button>
    </div>
  );
}

function TopPerformersEditor({ data, onSave }: { data: TopPerformer[], onSave: () => void }) {
  const [newItem, setNewItem] = useState<Partial<TopPerformer>>({
    class: '',
    rank: 1,
    name: '',
    marks: '',
    bio: '',
    photoUrl: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newItem.class || !newItem.rank || !newItem.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await fetchData(`top-performers/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(newItem),
        });
        toast.success('Top performer updated successfully!');
      } else {
        await fetchData('top-performers', {
          method: 'POST',
          body: JSON.stringify(newItem),
        });
        toast.success('Top performer added successfully!');
      }
      setNewItem({ class: '', rank: 1, name: '', marks: '', bio: '', photoUrl: '' });
      setEditingId(null);
      onSave();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error saving topper');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this topper?')) {
      try {
        await fetchData(`top-performers/${id}`, { method: 'DELETE' });
        toast.success('Topper deleted successfully!');
        onSave();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Error deleting topper');
      }
    }
  };

  const startEdit = (item: TopPerformer) => {
    setNewItem(item);
    setEditingId(item._id!);
    // Scroll to top of the editor
    const editorElement = document.getElementById('topper-editor');
    if (editorElement) {
      editorElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get ranks already taken for the selected class, excluding the one being edited
  const takenRanks = data
    .filter(tp => tp.class === newItem.class && tp._id !== editingId)
    .map(tp => Number(tp.rank));

  return (
    <div className="space-y-8" id="topper-editor">
      {/* Form */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          {editingId ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {editingId ? 'Edit Topper' : 'Add New Topper'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Class</label>
            <input
              type="text"
              value={newItem.class || ''}
              onChange={e => setNewItem({...newItem, class: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="e.g. Class 10"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rank</label>
            <select
              value={newItem.rank || ''}
              onChange={e => setNewItem({...newItem, rank: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="" disabled>Select Rank</option>
              {[1, 2, 3].map(r => (
                <option 
                  key={r} 
                  value={r} 
                  disabled={takenRanks.includes(r)}
                >
                  {r}{r === 1 ? 'st' : r === 2 ? 'nd' : 'rd'} Rank {takenRanks.includes(r) ? '(Already Taken)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Student Name</label>
            <input
              type="text"
              value={newItem.name || ''}
              onChange={e => setNewItem({...newItem, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Marks/Percentage</label>
            <input
              type="text"
              value={newItem.marks || ''}
              onChange={e => setNewItem({...newItem, marks: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bio</label>
            <textarea
              value={newItem.bio || ''}
              onChange={e => setNewItem({...newItem, bio: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-20"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Photo URL</label>
            <input
              type="text"
              value={newItem.photoUrl || ''}
              onChange={e => setNewItem({...newItem, photoUrl: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleAdd} className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-bold">
            {editingId ? 'Update Topper' : 'Add Topper'}
          </button>
          {editingId && (
            <button 
              onClick={() => { setEditingId(null); setNewItem({ class: '', rank: 1, name: '', marks: '', bio: '', photoUrl: '' }); }} 
              className="bg-gray-500 text-white px-6 py-2 rounded-lg text-sm font-bold"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {data.map((item: TopPerformer) => (
          <div key={item._id} className="border border-gray-200 rounded-xl p-4 flex justify-between items-start gap-4">
            <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-2">
              <div><span className="text-xs font-bold text-gray-400 uppercase mr-2">Class:</span><span className="text-sm text-gray-700">{item.class}</span></div>
              <div><span className="text-xs font-bold text-gray-400 uppercase mr-2">Rank:</span><span className="text-sm text-gray-700">{item.rank}</span></div>
              <div><span className="text-xs font-bold text-gray-400 uppercase mr-2">Name:</span><span className="text-sm text-gray-700">{item.name}</span></div>
              <div><span className="text-xs font-bold text-gray-400 uppercase mr-2">Marks:</span><span className="text-sm text-gray-700">{item.marks}</span></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="h-5 w-5" /></button>
              <button onClick={() => handleDelete(item._id!)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-5 w-5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericListEditor({ collectionName, data, fields, onSave }: any) {
  const [newItem, setNewItem] = useState<any>({});

  // Map collection names to API endpoints
  const apiMap: Record<string, string> = {
    tourPhotos: 'tour-photos',
    topPerformers: 'top-performers',
    teachers: 'teachers',
    staff: 'staff',
    visionQuotes: 'vision-quotes',
    awards: 'awards',
    announcements: 'announcements',
    activities: 'activities',
    youtubeLinks: 'youtube-links'
  };

  const endpoint = apiMap[collectionName];

  const handleAdd = async () => {
    try {
      await fetchData(endpoint, {
        method: 'POST',
        body: JSON.stringify(newItem),
      });
      setNewItem({});
      toast.success('Item added successfully!');
      if (onSave) onSave();
    } catch (e) { 
      toast.error(e instanceof Error ? e.message : 'Error adding item'); 
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await fetchData(`${endpoint}/${id}`, { method: 'DELETE' });
        toast.success('Item deleted successfully!');
        if (onSave) onSave();
      } catch (e) { 
        toast.error(e instanceof Error ? e.message : 'Error deleting item'); 
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Add New Form */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="h-5 w-5" /> Add New</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((f: any) => (
            <div key={f.name}>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{f.name}</label>
              {f.type === 'textarea' ? (
                <textarea
                  value={newItem[f.name] || ''}
                  onChange={e => setNewItem({...newItem, [f.name]: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              ) : (
                <input
                  type={f.type}
                  value={newItem[f.name] || ''}
                  onChange={e => setNewItem({...newItem, [f.name]: f.type === 'number' ? Number(e.target.value) : e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              )}
            </div>
          ))}
        </div>
        <button onClick={handleAdd} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-bold">Add Item</button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {data.map((item: any) => (
          <div key={item._id} className="border border-gray-200 rounded-xl p-4 flex justify-between items-start gap-4">
            <div className="flex-grow">
              {fields.map((f: any) => (
                <div key={f.name} className="mb-1">
                  <span className="text-xs font-bold text-gray-400 uppercase mr-2">{f.name}:</span>
                  <span className="text-sm text-gray-700">{item[f.name]}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-5 w-5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InputField({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
