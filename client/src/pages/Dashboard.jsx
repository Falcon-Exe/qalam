import React from 'react';
import { Users, Megaphone, Calendar, Wallet, ArrowUp, ArrowDown, ClipboardCheck } from 'lucide-react';
import { motion } from 'framer-motion';

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

    return (
        <div className="space-y-32 h-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24 h-auto">
                {isAdmin ? (
                    <StatCard icon={Users} label="Total Students" value="48" trend="12%" isPositive={true} color="bg-primary" />
                ) : (
                    <StatCard icon={ClipboardCheck} label="My Attendance" value="92%" trend="2%" isPositive={true} color="bg-success" />
                )}
                <StatCard icon={Megaphone} label="Announcements" value="12" trend="0%" isPositive={true} color="bg-indigo-400" />
                <StatCard icon={Calendar} label="Active Events" value="05" trend="2" isPositive={true} color="bg-cyan-500" />
                <StatCard icon={Wallet} label={isAdmin ? "Total Funds" : "My Balance"} value={isAdmin ? "₹12.5k" : "₹450"} trend={isAdmin ? "2.4%" : null} isPositive={!isAdmin} color="bg-rose-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
                <div className="lg:col-span-8 nav-card space-y-24 min-h-[400px]">
                    <div className="flex items-center justify-between">
                        <h2>{isAdmin ? "Recent Activity Performance" : "My Recent Activity"}</h2>
                        <div className="flex gap-12 font-bold text-xs text-text-secondary">
                            <span className="text-primary border-b-2 border-primary pb-2">Weekly</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Monthly</span>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-text-secondary text-sm italic">
                        {isAdmin ? "Visual Analytics Placeholder" : "Academic Progress Placeholder"}
                    </div>
                </div>

                <div className="lg:col-span-4 nav-card space-y-24">
                    <h2 className="line-clamp-1">Upcoming Deadlines</h2>
                    <div className="space-y-16">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-16 items-start">
                                <div className="w-px h-12 bg-primary self-center" />
                                <div>
                                    <p className="text-sm font-bold text-text-primary">
                                        {i === 1 ? "Semester Payment Due" : i === 2 ? "Lab Record Submission" : "Union Meeting"}
                                    </p>
                                    <p className="text-xs text-text-secondary mt-2">
                                        {i === 1 ? "Due in 3 days" : i === 2 ? "Due in 5 days" : "Tomorrow at 4 PM"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full text-center text-xs font-black uppercase tracking-widest text-primary hover:text-white transition-colors pt-16 border-t border-white/5">
                        View Full Schedule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
