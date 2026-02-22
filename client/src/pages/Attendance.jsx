import React from 'react';
import { ClipboardCheck, UserCheck, UserX, Download, Calendar, Search, ArrowUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Attendance = ({ isAdmin = true }) => {
    const attendanceData = [
        { id: 1, name: 'Adarsh S', roll: 'CS01', status: 'present', overall: 85 },
        { id: 2, name: 'Anjali P', roll: 'CS02', status: 'absent', overall: 92 },
        { id: 3, name: 'Arjun K', roll: 'CS03', status: 'present', overall: 78 },
        { id: 4, name: 'Bhavya R', roll: 'CS04', status: 'present', overall: 88 },
    ];

    return (
        <div className="space-y-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-4 card-base flex flex-col items-center justify-center gap-16 text-center border-primary/20 bg-gradient-to-b from-primary/5 to-transparent"
                >
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                            <motion.circle
                                cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent"
                                strokeDasharray="440"
                                initial={{ strokeDashoffset: 440 }}
                                animate={{ strokeDashoffset: 440 * (1 - 0.85) }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="text-primary"
                            />
                        </svg>
                        <div className="absolute">
                            <span className="text-4xl font-black">85%</span>
                            <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mt-4 flex items-center gap-4"><Zap size={10} className="text-secondary" /> Excellent</p>
                        </div>
                    </div>
                    <p className="text-text-secondary text-xs font-bold leading-relaxed max-w-[180px]">Keep attending to maintain your eligibility for exams.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-8 card-base flex flex-col md:flex-row items-center gap-32"
                >
                    <div className="flex-1 space-y-24">
                        <h2 className="text-2xl font-black">Attendance Tracker</h2>
                        <p className="text-text-secondary text-sm font-medium leading-relaxed max-w-lg">Monitor daily presence and overall academic consistency with our real-time tracking engine.</p>
                        <div className="flex gap-16">
                            <div className="bg-success/10 border border-success/20 px-16 py-8 rounded-xl flex items-center gap-8">
                                <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                <span className="text-xs font-black">42 Present Today</span>
                            </div>
                            <div className="bg-danger/10 border border-danger/20 px-16 py-8 rounded-xl flex items-center gap-8">
                                <div className="w-2 h-2 rounded-full bg-danger shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                <span className="text-xs font-black">6 Absent</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-12 w-full md:w-auto min-w-[200px]">
                        <div className="bg-background/40 p-16 rounded-2xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer">
                            <label className="text-[8px] font-black uppercase text-text-secondary tracking-widest mb-4 block italic">Track Date</label>
                            <div className="flex items-center justify-between text-sm font-bold">
                                <span>Feb 22, 2026</span>
                                <Calendar size={14} className="text-primary" />
                            </div>
                        </div>
                        <button className="btn-primary w-full py-12 text-xs shadow-soft"><Download size={14} /> Download PDF</button>
                    </div>
                </motion.div>
            </div>

            <div className="card-base p-0 overflow-hidden border-none shadow-soft">
                <div className="p-24 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-16 bg-card">
                    <h3 className="text-lg font-black tracking-tight">Active Roll Call</h3>
                    <div className="relative w-full md:w-80 group">
                        <Search size={18} className="absolute left-16 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
                        <input type="text" placeholder="Filter student..." className="input-base pl-48 w-full" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
                    {attendanceData.map((student) => (
                        <div key={student.id} className="p-24 flex items-center justify-between bg-card transition-all hover:bg-white/3 group">
                            <div className="flex items-center gap-24 flex-1">
                                <div className="w-14 h-14 rounded-xl bg-background flex items-center justify-center text-xl font-black border border-white/5 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all text-text-secondary group-hover:text-primary">
                                    {student.name[0]}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-lg">{student.name}</h4>
                                    <div className="flex items-center gap-8 text-xs text-text-secondary font-black uppercase tracking-widest mt-1">
                                        <span>{student.roll}</span>
                                        <div className="w-1 h-1 rounded-full bg-white/10" />
                                        <span className={student.overall >= 75 ? 'text-success' : 'text-danger'}>{student.overall}% Rate</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-12">
                                <button className={`p-12 rounded-xl transition-all border ${student.status === 'present' ? 'bg-success/10 text-success border-success/30' : 'bg-background text-text-secondary/30 grayscale opacity-40 hover:opacity-100 hover:grayscale-0'}`}>
                                    <UserCheck size={20} />
                                </button>
                                <button className={`p-12 rounded-xl transition-all border ${student.status === 'absent' ? 'bg-danger/10 text-danger border-danger/30' : 'bg-background text-text-secondary/30 grayscale opacity-40 hover:opacity-100 hover:grayscale-0'}`}>
                                    <UserX size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Attendance;
