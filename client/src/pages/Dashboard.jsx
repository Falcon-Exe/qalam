import { useState, useEffect } from 'react';
import {
    Users, Megaphone, Calendar, Wallet, ArrowUp, ArrowDown,
    ClipboardCheck, Sparkles, Bell, ArrowRight, PlusCircle,
    BarChart3, MessageSquare, ChevronRight, Activity, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, trend, isPositive, color, path }) => (
    <Link to={path} className="block">
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="nav-card relative overflow-hidden group cursor-pointer border-white/5 hover:border-primary/20 transition-all shadow-xl hover:shadow-primary/10"
        >
            <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 blur-3xl -mr-8 -mt-8 group-hover:opacity-20 transition-opacity`} />

            <div className="flex items-center justify-between mb-16 relative z-10">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-[0_0_15px_-5px_white] shadow-white/20`}>
                    <Icon size={20} className="text-white" />
                </div>
                <div className="flex flex-col items-end gap-4">
                    {trend && (
                        <div className={`flex items-center gap-4 text-[10px] font-black uppercase tracking-widest ${isPositive ? 'text-success' : 'text-danger'}`}>
                            {isPositive ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                            {trend}
                        </div>
                    )}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                        <ArrowRight size={12} className="text-white/40" />
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                <h3 className="stat-value text-white h-auto mb-4 tracking-tighter">{value}</h3>
                <p className="stat-label uppercase tracking-[0.2em] text-[10px] font-black opacity-60 group-hover:opacity-100 transition-opacity">{label}</p>
            </div>
        </motion.div>
    </Link>
);

const ActivityItem = ({ icon: Icon, title, desc, time, color }) => (
    <div className="flex gap-16 items-start group">
        <div className={`w-10 h-10 rounded-lg ${color}/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
            <Icon size={16} className={color.replace('bg-', 'text-')} />
        </div>
        <div className="border-b border-white/5 pb-16 flex-1">
            <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors leading-snug">{title}</h4>
            <div className="flex items-center gap-8 mt-4">
                <span className="text-[10px] text-text-secondary font-medium italic line-clamp-1">{desc}</span>
                <span className="w-1 h-1 rounded-full bg-white/10 shrink-0" />
                <span className="text-[10px] text-text-secondary/60 font-black uppercase tracking-tighter shrink-0">{time}</span>
            </div>
        </div>
    </div>
);

const Dashboard = ({ role }) => {
    const isAdmin = role === 'admin';
    const [stats, setStats] = useState({
        studentCount: 0,
        announcementCount: 0,
        eventCount: 0,
        totalFunds: 0
    });
    const [recentActiviy, setRecentActivity] = useState([]);
    const [myAttendance, setMyAttendance] = useState('0%');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const [statsRes, annRes, eventRes, attendanceRes] = await Promise.all([
                    api.get('/dashboard/stats'),
                    api.get('/announcements'),
                    api.get('/events'),
                    !isAdmin ? api.get(`/attendance/my?user_id=${user.id}`) : Promise.resolve({ data: null })
                ]);

                setStats(statsRes.data);

                // Process recent activity
                const combined = [
                    ...annRes.data.slice(0, 3).map(a => ({ ...a, type: 'announcement' })),
                    ...eventRes.data.slice(0, 2).map(e => ({ ...e, type: 'event' }))
                ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

                setRecentActivity(combined);

                if (attendanceRes?.data) {
                    const rate = Math.round((attendanceRes.data.stats.present_days / attendanceRes.data.stats.total_days) * 100) || 0;
                    setMyAttendance(`${rate}%`);
                }
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [isAdmin]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 3600) return 'Just now';
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <div className="space-y-32">
            {/* Header section with Welcome text */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-16">
                <div>
                    <div className="flex items-center gap-8 mb-4">
                        <Sparkles size={14} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Live Operations</span>
                    </div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                        AL QALAM <span className="text-primary not-italic">PORTAL</span>
                    </h1>
                </div>
                {isAdmin && (
                    <div className="flex gap-12 w-full md:w-auto">
                        <Link to="/announcements" className="flex-1 md:flex-none">
                            <button className="btn-primary py-10 px-20 text-[10px] font-black uppercase tracking-widest w-full">
                                <PlusCircle size={14} /> NEW UPDATE
                            </button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-24">
                {isAdmin ? (
                    <StatCard icon={Users} label="Total Students" value={loading ? "..." : stats.studentCount} trend="Active" isPositive={true} color="bg-primary" path="/students" />
                ) : (
                    <StatCard icon={ClipboardCheck} label="My Attendance" value={loading ? "..." : myAttendance} trend="Tracked" isPositive={true} color="bg-success" path="/attendance" />
                )}
                <StatCard icon={Megaphone} label="Announcements" value={loading ? "..." : stats.announcementCount} trend="Syncing" isPositive={true} color="bg-indigo-500" path="/announcements" />
                <StatCard icon={Calendar} label="Active Events" value={loading ? "..." : stats.eventCount} trend="Projected" isPositive={true} color="bg-cyan-500" path="/events" />
                <StatCard icon={Wallet} label={isAdmin ? "Total Funds" : "Class Balance"} value={loading ? "..." : formatCurrency(isAdmin ? stats.totalFunds : stats.totalFunds)} trend={isAdmin ? "Balanced" : "Available"} isPositive={true} color="bg-rose-500" path="/funds" />
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
                {/* Left: Activity Feed */}
                <div className="lg:col-span-8 nav-card border-white/5 bg-background/50 relative overflow-hidden flex flex-col min-h-[450px]">
                    <div className="p-24 md:p-32 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-12">
                            <Activity size={18} className="text-primary" />
                            <h2 className="text-xl font-black italic uppercase tracking-tight text-white">Recent Activity</h2>
                        </div>
                        <div className="hidden sm:flex items-center gap-16 text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-40">
                            <span>Live Sync</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_white] shadow-success" />
                        </div>
                    </div>

                    <div className="flex-1 p-24 md:p-32 space-y-24">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="flex gap-16 items-start animate-pulse">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 shrink-0" />
                                    <div className="flex-1 space-y-8">
                                        <div className="h-4 bg-white/5 rounded-md w-1/3" />
                                        <div className="h-3 bg-white/5 rounded-md w-2/3" />
                                    </div>
                                </div>
                            ))
                        ) : recentActiviy.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-64 relative overflow-hidden">
                                <motion.div
                                    animate={{
                                        opacity: [0.1, 0.3, 0.1],
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                >
                                    <div className="w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />
                                </motion.div>
                                <Clock size={40} className="mb-16 text-primary/40 animate-pulse" />
                                <p className="text-[10px] font-black italic uppercase tracking-[0.4em] text-text-secondary opacity-40">Awaiting Batch Intelligence</p>
                                <div className="mt-24 flex gap-4">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [8, 16, 8] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                            className="w-1 bg-primary/20 rounded-full"
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            recentActiviy.map((item, idx) => (
                                <ActivityItem
                                    key={idx}
                                    icon={item.type === 'announcement' ? Megaphone : Calendar}
                                    color={item.type === 'announcement' ? 'bg-indigo-500' : 'bg-cyan-500'}
                                    title={item.title}
                                    desc={item.content || item.description}
                                    time={getTimeAgo(item.created_at)}
                                />
                            ))
                        )}
                    </div>

                    <Link to="/announcements" className="p-16 text-center border-t border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary hover:text-primary hover:bg-white/5 transition-all">
                        View All Activity <ChevronRight size={10} className="inline ml-4" />
                    </Link>
                </div>

                {/* Right: Quick Context */}
                <div className="lg:col-span-4 space-y-24">
                    {/* Poll Shortcut */}
                    <div className="nav-card bg-gradient-to-br from-card to-background border-white/5 p-24 md:p-32 group">
                        <div className="flex items-center justify-between mb-24">
                            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                                <BarChart3 size={18} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Decision Engine</span>
                        </div>
                        <h3 className="text-lg font-black italic text-white mb-8 leading-tight">Class Democracy</h3>
                        <p className="text-xs text-text-secondary font-medium mb-24">Cast your vote on active polls and shape our batch's legacy.</p>
                        <Link to="/polls">
                            <button className="w-full py-12 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-secondary hover:border-secondary transition-all flex items-center justify-center gap-8 group">
                                GO TO POLLS <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </Link>
                    </div>

                    {/* Feedback Shortcut */}
                    <div className="nav-card bg-background border border-dashed border-white/10 p-24 md:p-32 text-center group">
                        <MessageSquare size={24} className="mx-auto text-text-secondary mb-12 group-hover:text-primary group-hover:scale-110 transition-all" />
                        <h4 className="text-sm font-black italic text-white uppercase tracking-tighter mb-4">Have an Idea?</h4>
                        <p className="text-[10px] text-text-secondary font-medium mb-16 leading-relaxed">Your feedback drives the Union. Submit anonymously or attributed.</p>
                        <Link to="/feedback" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">
                            Submit Feedback
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
