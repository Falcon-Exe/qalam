import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import RegisterAdmin from './pages/RegisterAdmin';
import { Bell, User, ChevronDown, Menu, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from './assets/logo.png';

const Navbar = ({ onMenuClick, user }) => {
  const location = useLocation();
  const getPageTitle = (pathname) => {
    if (pathname === '/') return 'AL QALAM';
    const title = pathname.slice(1).replace(/-/g, ' ');
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const name = user?.fullname || 'Guest';
  const initial = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="h-20 bg-card border-b border-white/5 flex items-center justify-between px-24 lg:px-32 sticky top-0 z-40 shadow-nav">
      <div className="flex items-center gap-16">
        {user && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-8 hover:bg-white/5 rounded-lg text-text-secondary transition-colors"
          >
            <Menu size={20} />
          </button>
        )}
        <Link to="/" className="flex items-center gap-12">
          <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shadow-lg border border-white/10 p-2">
            <img src={logo} alt="Al Qalam Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-white text-xl lg:text-2xl font-black italic uppercase tracking-tighter">{getPageTitle(location.pathname)}</h1>
        </Link>
      </div>

      <div className="flex items-center gap-24">
        {user ? (
          <>
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
                  {user.role === 'admin' ? 'Administrator' : (user?.class_role || 'Student')}
                </p>
              </div>
              <ChevronDown size={14} className="text-text-secondary group-hover:text-white transition-colors" />
            </div>
          </>
        ) : (
          <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-colors flex items-center gap-8 group">
            Portal Entry <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        )}
      </div>
    </header>
  );
};

const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function MainLayout({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isAdmin = user?.role === 'admin';
  const isPublicPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <div className="flex min-h-screen bg-background text-text-primary overflow-hidden">
      {/* Sidebar - Only show if logged in and not on public pages */}
      {user && !isPublicPage && (
        <div className="hidden lg:block w-sidebar flex-shrink-0">
          <Sidebar onLogout={onLogout} />
        </div>
      )}

      {/* Sidebar - Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && user && (
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
              {/* Public Routes */}
              <Route path="/" element={<Home user={user} />} />
              <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={() => window.location.reload()} />} />
              <Route path="/register-admin" element={<RegisterAdmin />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard role={user?.role} /></ProtectedRoute>} />
              <Route path="/announcements" element={<ProtectedRoute user={user}><Announcements isAdmin={isAdmin} /></ProtectedRoute>} />
              <Route path="/events" element={<ProtectedRoute user={user}><Events isAdmin={isAdmin} /></ProtectedRoute>} />
              <Route path="/funds" element={<ProtectedRoute user={user}><Funds isAdmin={isAdmin} /></ProtectedRoute>} />
              <Route path="/polls" element={<ProtectedRoute user={user}><Polls isAdmin={isAdmin} /></ProtectedRoute>} />
              <Route path="/gallery" element={<ProtectedRoute user={user}><Gallery isAdmin={isAdmin} /></ProtectedRoute>} />
              <Route path="/attendance" element={<ProtectedRoute user={user}><Attendance isAdmin={isAdmin} /></ProtectedRoute>} />
              <Route path="/feedback" element={<ProtectedRoute user={user}><Feedback isAdmin={isAdmin} /></ProtectedRoute>} />
              <Route path="/students" element={<ProtectedRoute user={user}><StudentDirectory isAdmin={isAdmin} /></ProtectedRoute>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <MainLayout user={user} onLogout={handleLogout} />
    </Router>
  );
}

export default App;
