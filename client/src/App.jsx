import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Announcements from './pages/Announcements';
import Events from './pages/Events';
import Funds from './pages/Funds';
import Polls from './pages/Polls';
import Gallery from './pages/Gallery';
import Home from './pages/Home';
import Attendance from './pages/Attendance';
import Feedback from './pages/Feedback';
import StudentDirectory from './pages/Students';
import Login from './pages/Login';
import { Bell, User, ChevronDown, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onMenuClick, user }) => {
  const location = useLocation();
  const getPageTitle = (pathname) => {
    if (pathname === '/') return 'AL QALAM';
    const title = pathname.slice(1).replace(/-/g, ' ');
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const role = user?.role || 'student';
  const name = user?.fullname || 'Student User';
  const initial = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="h-20 bg-card border-b border-white/5 flex items-center justify-between px-24 lg:px-32 sticky top-0 z-40 shadow-nav">
      <div className="flex items-center gap-16">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-8 hover:bg-white/5 rounded-lg text-text-secondary transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-text-primary text-xl lg:text-[28px]">{getPageTitle(location.pathname)}</h1>
      </div>

      <div className="flex items-center gap-24">
        <button className="text-text-secondary hover:text-white relative p-8 rounded-lg hover:bg-white/5 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-card" />
        </button>

        <div className="flex items-center gap-12 pl-12 border-l border-white/10 group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            {initial}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-text-primary leading-none">
              {name}
            </p>
            <p className="text-[12px] text-text-secondary mt-2">
              {role === 'admin' ? 'Administrator' : (user?.class_role || 'Student')}
            </p>
          </div>
          <ChevronDown size={14} className="text-text-secondary group-hover:text-white transition-colors" />
        </div>
      </div>
    </header>
  );
};

function MainLayout({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex min-h-screen bg-background text-text-primary overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block w-sidebar flex-shrink-0">
        <Sidebar onLogout={onLogout} />
      </div>

      {/* Sidebar - Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-sidebar z-[70] lg:hidden"
            >
              <Sidebar onSelect={() => setSidebarOpen(false)} onLogout={onLogout} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden relative">
        <Navbar onMenuClick={() => setSidebarOpen(true)} user={user} />

        <main className="flex-1 w-full max-w-[1200px] mx-auto p-24 lg:p-32">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard role={user?.role} />} />
              <Route path="/announcements" element={<Announcements isAdmin={isAdmin} />} />
              <Route path="/events" element={<Events isAdmin={isAdmin} />} />
              <Route path="/funds" element={<Funds isAdmin={isAdmin} />} />
              <Route path="/polls" element={<Polls isAdmin={isAdmin} />} />
              <Route path="/gallery" element={<Gallery isAdmin={isAdmin} />} />
              <Route path="/attendance" element={<Attendance isAdmin={isAdmin} />} />
              <Route path="/feedback" element={<Feedback isAdmin={isAdmin} />} />
              <Route path="/students" element={<StudentDirectory isAdmin={isAdmin} />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (role) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <MainLayout user={user} onLogout={handleLogout} />
    </Router>
  );
}

export default App;
