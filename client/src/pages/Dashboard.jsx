import { useState, useEffect } from 'react';
import { Users, Megaphone, Calendar, Wallet, ArrowUp, ArrowDown, ClipboardCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const StatCard = ({ icon: Icon, label, value, trend, isPositive, color }) => (
    <div className="nav-card hover:bg-white/5 transition-colors cursor-default">
        <div className="flex items-center justify-between mb-16 font-medium">
            <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
                <Icon size={20} className="text-white" />
            </div>
            {trend && (
                <div className={`flex items-center gap-4 text-xs ${isPositive ? 'text-success' : 'text-danger'}`}>
                    {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    {trend}
                </div>
            )}
        </div>
        <div className="">
            <p className="stat-value text-white h-auto mb-4">{value}</p>
            <p className="stat-label uppercase tracking-widest text-[11px] font-black">{label}</p>
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
    const [myAttendance, setMyAttendance] = useState('0%');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, attendanceRes] = await Promise.all([
                    api.get('/dashboard/stats'),
                    !isAdmin ? api.get(`/attendance/my?user_id=${JSON.parse(localStorage.getItem('user')).id}`) : Promise.resolve({ data: null })
                ]);

                setStats(statsRes.data);
                if (attendanceRes.data) {
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

    return (
        <div className="space-y-32 h-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24 h-auto">
                {isAdmin ? (
                    <StatCard icon={Users} label="Total Students" value={loading ? "..." : stats.studentCount} trend="Live" isPositive={true} color="bg-primary" />
                ) : (
                    <StatCard icon={ClipboardCheck} label="My Attendance" value={loading ? "..." : myAttendance} trend="Tracked" isPositive={true} color="bg-success" />
                )}
                <StatCard icon={Megaphone} label="Announcements" value={loading ? "..." : stats.announcementCount} trend="Active" isPositive={true} color="bg-indigo-400" />
                <StatCard icon={Calendar} label="Active Events" value={loading ? "..." : (stats.eventCount < 10 ? `0${stats.eventCount}` : stats.eventCount)} trend="Upcoming" isPositive={true} color="bg-cyan-500" />
                <StatCard icon={Wallet} label={isAdmin ? "Total Funds" : "My Balance"} value={loading ? "..." : formatCurrency(isAdmin ? stats.totalFunds : 0)} trend={isAdmin ? "Balanced" : null} isPositive={true} color="bg-rose-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
                <div className="lg:col-span-8 nav-card space-y-24 min-h-[400px] flex flex-col">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black italic uppercase italic underline decoration-primary/30 decoration-4 underline-offset-8">
                            {isAdmin ? "AL QALAM Activity Flow" : "My Recent Performance"}
                        </h2>
                        <div className="flex gap-12 font-bold text-xs text-text-secondary">
                            <span className="text-primary border-b-2 border-primary pb-2 uppercase tracking-widest">Growth</span>
                            <span className="hover:text-white cursor-pointer transition-colors uppercase tracking-widest opacity-50">Impact</span>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-text-secondary text-sm italic p-32 text-center">
                        <div>
                            <p className="mb-16">Intelligence Engine is monitoring class trends...</p>
                            <div className="flex gap-12 justify-center">
                                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                                <div className="w-2 h-2 rounded-full bg-secondary animate-bounce delay-75" />
                                <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-150" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 nav-card space-y-24">
                    <h2 className="line-clamp-1 border-b border-white/5 pb-16 text-white font-black italic">Active Deadlines</h2>
                    <div className="space-y-16">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-16 items-start group">
                                <div className="w-1 h-12 bg-primary rounded-full self-center group-hover:h-16 transition-all" />
                                <div>
                                    <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                                        {i === 1 ? "Semester Exam Reg" : i === 2 ? "Science Fair Abstract" : "Union General Body"}
                                    </p>
                                    <p className="text-[10px] text-text-secondary mt-2 uppercase font-black tracking-widest opacity-60">
                                        {i === 1 ? "Closing in 2 days" : i === 2 ? "Final call tomorrow" : "At Central Hall"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full text-center text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-white transition-colors pt-16 border-t border-white/5">
                        Expand Schedule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
