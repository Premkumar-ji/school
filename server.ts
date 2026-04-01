import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

console.log('Environment variables loaded:');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('- ADMIN_EMAIL_1:', process.env.ADMIN_EMAIL_1 ? 'Set' : 'Not set');
console.log('- ADMIN_SESSION_SECRET:', process.env.ADMIN_SESSION_SECRET ? 'Set' : 'Not set');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'default_secret';

// Disable buffering globally so queries fail immediately if not connected
mongoose.set('bufferCommands', false);

if (!MONGODB_URI) {
  console.error('CRITICAL: MONGODB_URI environment variable is missing.');
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err.message));
}

// Auth Login
app.post('/api/login', (req, res) => {
  const { email: inputEmail, password: inputPassword } = req.body;
  const email = inputEmail?.trim();
  const password = inputPassword?.trim();
  
  const admin1 = { email: process.env.ADMIN_EMAIL_1?.trim(), password: process.env.ADMIN_PASSWORD_1?.trim() };
  const admin2 = { email: process.env.ADMIN_EMAIL_2?.trim(), password: process.env.ADMIN_PASSWORD_2?.trim() };

  console.log('Login attempt for:', email);
  if (!admin1.email && !admin2.email) {
    console.warn('WARNING: No admin credentials set in environment variables.');
  }

  if ((email?.toLowerCase() === admin1.email?.toLowerCase() && password === admin1.password) ||
      (email?.toLowerCase() === admin2.email?.toLowerCase() && password === admin2.password)) {
    console.log('Login successful for:', email);
    res.json({ token: ADMIN_SESSION_SECRET });
  } else {
    console.warn('Login failed for:', email);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Middleware to check DB connection
app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      error: 'Database not connected. Please check your MONGODB_URI in the Settings menu.' 
    });
  }
  next();
});

// Auth Middleware
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers['x-admin-token'];
  if (token === ADMIN_SESSION_SECRET) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Schemas with basic validation
const SchoolInfoSchema = new mongoose.Schema({
  logoUrl: String,
  heroImageUrl: String,
  name: { type: String, required: true },
  slogan: String,
  motivationalLine: String,
  principalPhoto: String,
  principalBio: String,
  principalSlogan: String,
  address: String,
  phone: String,
  email: String,
  footerDescription: String,
  facebookUrl: String,
  twitterUrl: String,
  instagramUrl: String,
  youtubeUrl: String,
});
const SchoolInfo = mongoose.model('SchoolInfo', SchoolInfoSchema);

const TourPhotoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  photoUrl: { type: String, required: true },
});
const TourPhoto = mongoose.model('TourPhoto', TourPhotoSchema);

const TopPerformerSchema = new mongoose.Schema({
  class: { type: String, required: true },
  rank: { type: Number, required: true },
  name: { type: String, required: true },
  marks: String,
  bio: String,
  photoUrl: String,
});
const TopPerformer = mongoose.model('TopPerformer', TopPerformerSchema);

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qualification: String,
  bio: String,
  photoUrl: String,
});
const Teacher = mongoose.model('Teacher', TeacherSchema);

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photoUrl: String,
});
const Staff = mongoose.model('Staff', StaffSchema);

const VisionQuoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
});
const VisionQuote = mongoose.model('VisionQuote', VisionQuoteSchema);

const AwardSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  event: { type: String, required: true },
  photoUrl: String,
});
const Award = mongoose.model('Award', AwardSchema);

const AnnouncementSchema = new mongoose.Schema({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Announcement = mongoose.model('Announcement', AnnouncementSchema);

const ActivitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: String,
  date: String,
  photoUrl: String,
});
const Activity = mongoose.model('Activity', ActivitySchema);

const YoutubeLinkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
});
const YoutubeLink = mongoose.model('YoutubeLink', YoutubeLinkSchema);

// API Routes
const createRoutes = (model: any, path: string) => {
  app.get(`/api/${path}`, async (req, res) => {
    try {
      const data = await model.find().sort({ createdAt: -1 });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.post(`/api/${path}`, authenticate, async (req, res) => {
    try {
      const newItem = new model(req.body);
      await newItem.save();
      res.status(201).json(newItem);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  app.put(`/api/${path}/:id`, authenticate, async (req, res) => {
    try {
      const updatedItem = await model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
      res.json(updatedItem);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  app.delete(`/api/${path}/:id`, authenticate, async (req, res) => {
    try {
      const deletedItem = await model.findByIdAndDelete(req.params.id);
      if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });
};

createRoutes(TourPhoto, 'tour-photos');
createRoutes(TopPerformer, 'top-performers');
createRoutes(Teacher, 'teachers');
createRoutes(Staff, 'staff');
createRoutes(VisionQuote, 'vision-quotes');
createRoutes(Award, 'awards');
createRoutes(Announcement, 'announcements');
createRoutes(Activity, 'activities');
createRoutes(YoutubeLink, 'youtube-links');

// School Info is special (single document)
app.get('/api/school-info', async (req, res) => {
  try {
    let info = await SchoolInfo.findOne();
    if (!info) {
      info = new SchoolInfo({
        name: 'My School',
        slogan: 'Excellence in Education',
        motivationalLine: 'Learning for Life',
        logoUrl: '',
        principalPhoto: '',
        principalBio: '',
        principalSlogan: '',
      });
      await info.save();
    }
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.put('/api/school-info', authenticate, async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id; // Remove _id to prevent immutable field error
    const info = await SchoolInfo.findOneAndUpdate({}, updateData, { new: true, upsert: true, runValidators: true });
    res.json(info);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Catch-all for unmatched API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

// Vite middleware for development
async function setupVite() {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Starting Vite in development mode...');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      console.log('Starting server in production mode...');
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

setupVite();
