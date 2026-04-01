/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SchoolTour from './pages/SchoolTour';
import TopPerformers from './pages/TopPerformers';
import Teachers from './pages/Teachers';
import Staff from './pages/Staff';
import Vision from './pages/Vision';
import Awards from './pages/Awards';
import Announcements from './pages/Announcements';
import Activities from './pages/Activities';
import YouTube from './pages/YouTube';
import Admin from './pages/Admin';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="tour" element={<SchoolTour />} />
            <Route path="performers" element={<TopPerformers />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="staff" element={<Staff />} />
            <Route path="vision" element={<Vision />} />
            <Route path="awards" element={<Awards />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="activities" element={<Activities />} />
            <Route path="youtube" element={<YouTube />} />
          </Route>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

