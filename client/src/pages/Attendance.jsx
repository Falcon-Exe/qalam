import { useState, useEffect } from 'react';
import { ClipboardCheck, UserCheck, UserX, Download, Calendar, Search, ArrowUp, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Attendance = ({ isAdmin = true }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [myStats, setMyStats] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isAdmin) {
            fetchAttendance();
        } else {
            fetchMyAttendance();
        }
    }, [selectedDate]);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/attendance?date=${selectedDate}`);
            setStudents(data);
        } catch (err) {
            console.error('Failed to fetch attendance:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyAttendance = async () => {
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const { data } = await api.get(`/attendance/my?user_id=${user.id}`);
            setMyStats(data);
        } catch (err) {
            console.error('Failed to fetch personal attendance:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleMark = async (userId, status) => {
        try {
            const admin = JSON.parse(localStorage.getItem('user'));
            await api.post('/attendance/mark', {
                user_id: userId,
                attendance_date: selectedDate,
                status,
                marked_by: admin.id
            });
            fetchAttendance();
        } catch (err) {
            console.error('Failed to mark attendance:', err);
        }
    };

    const attendanceRate = myStats ? Math.round((myStats.stats.present_days / myStats.stats.total_days) * 100) || 0 : 0;
    const filteredStudents = students.filter(s =>
        s.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.roll.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const changeDate = (days) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + days);
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    return (
        <div className="space-y-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                {!isAdmin ? (
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
                                    animate={{ strokeDashoffset: 440 * (1 - attendanceRate / 100) }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="text-primary"
                                />
                            </svg>
                            <div className="absolute">
                                <span className="text-4xl font-black">{attendanceRate}%</span>
                                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mt-4 flex items-center gap-4">
                                    <Zap size={10} className="text-secondary" /> {attendanceRate >= 75 ? 'ELIGIBLE' : 'LOW'}
                                </p>
                            </div>
                        </div>
                        <p className="text-text-secondary text-xs font-bold leading-relaxed max-w-[180px]">
                            {attendanceRate >= 75 ? 'Maintain your attendance for exam eligibility.' : 'Warning: Your attendance is below the 75% threshold.'}
                        </p>
                    </motion.div>
                ) : (
                    <div className="lg:col-span-4 card-base flex flex-col items-center justify-center gap-16 text-center border-primary/20 bg-primary/5">
                        <ClipboardCheck size={48} className="text-primary" />
                        <h3 className="text-xl font-bold text-white">Class Attendance</h3>
                        <p className="text-text-secondary text-xs">Admins can mark and update daily attendance records for all students.</p>
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-8 card-base flex flex-col md:flex-row items-center gap-32"
                >
                    <div className="flex-1 space-y-24">
                        <h2 className="text-2xl font-black text-white italic">Session Tracker</h2>
                        <p className="text-text-secondary text-sm font-medium leading-relaxed max-w-lg">
                            {isAdmin ? 'Select a date to view or mark attendance for the entire class.' : 'View your attendance history and track your consistency.'}
                        </p>
                        <div className="flex gap-16">
                            <div className="bg-success/10 border border-success/20 px-16 py-8 rounded-xl flex items-center gap-8">
                                <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                <span className="text-xs font-black text-white">42 Present Today</span>
                            </div>
                            <div className="bg-danger/10 border border-danger/20 px-16 py-8 rounded-xl flex items-center gap-8">
                                <div className="w-2 h-2 rounded-full bg-danger shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                <span className="text-xs font-black text-white">6 Absent</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-12 w-full md:w-auto min-w-[200px]">
                        <div className="bg-background/40 p-16 rounded-2xl border border-white/5 hover:border-primary/30 transition-all">
                            <label className="text-[8px] font-black uppercase text-text-secondary tracking-widest mb-4 block italic">Track Date</label>
                            <div className="flex items-center justify-between text-sm font-bold text-white">
                                <button onClick={() => changeDate(-1)}><ChevronLeft size={16} /></button>
                                <span>{new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                <button onClick={() => changeDate(1)}><ChevronRight size={16} /></button>
                            </div>
                        </div>
                        <button className="btn-primary w-full py-12 text-xs shadow-soft"><Download size={14} /> Download PDF</button>
                    </div>
                </motion.div>
            </div>

            {isAdmin ? (
                <div className="card-base p-0 overflow-hidden border-none shadow-soft">
                    <div className="p-24 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-16 bg-card">
                        <h3 className="text-lg font-black tracking-tight text-white">Roll Call • {new Date(selectedDate).toLocaleDateString()}</h3>
                        <div className="relative w-full md:w-80 group">
                            <Search size={18} className="absolute left-16 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Filter student..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-base pl-48 w-full"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
                        {loading ? (
                            <div className="col-span-full py-64 text-center text-text-secondary animate-pulse">Syncing class records...</div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="col-span-full py-64 text-center text-text-secondary italic">No students found matching your search.</div>
                        ) : (
                            filteredStudents.map((student) => (
                                <div key={student.id} className="p-24 flex items-center justify-between bg-card transition-all hover:bg-white/3 group">
                                    <div className="flex items-center gap-24 flex-1">
                                        <div className="w-14 h-14 rounded-xl bg-background flex items-center justify-center text-xl font-black border border-white/5 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all text-text-secondary group-hover:text-primary">
                                            {student.fullname[0]}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-lg text-white">{student.fullname}</h4>
                                            <p className="text-xs text-text-secondary font-black uppercase tracking-widest mt-1">{student.roll}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-12">
                                        <button
                                            onClick={() => handleMark(student.id, 'present')}
                                            className={`p-12 rounded-xl transition-all border ${student.status === 'present' ? 'bg-success/10 text-success border-success/30' : 'bg-background text-text-secondary/30 grayscale opacity-40 hover:opacity-100 hover:grayscale-0'}`}
                                        >
                                            <UserCheck size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleMark(student.id, 'absent')}
                                            className={`p-12 rounded-xl transition-all border ${student.status === 'absent' ? 'bg-danger/10 text-danger border-danger/30' : 'bg-background text-text-secondary/30 grayscale opacity-40 hover:opacity-100 hover:grayscale-0'}`}
                                        >
                                            <UserX size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <div className="card-base p-24">
                    <h3 className="text-xl font-black text-white italic mb-24">Last 30 Days History</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-12">
                        {loading ? (
                            <div className="col-span-full text-center py-32 text-text-secondary">Loading history...</div>
                        ) : myStats?.history.length === 0 ? (
                            <div className="col-span-full text-center py-32 text-text-secondary italic">No attendance records found.</div>
                        ) : (
                            myStats?.history.map((day, idx) => (
                                <div key={idx} className={`p-12 rounded-xl border text-center ${day.status === 'present' ? 'bg-success/10 border-success/30 text-success' : 'bg-danger/10 border-danger/30 text-danger'}`}>
                                    <p className="text-[10px] font-black uppercase leading-none">{new Date(day.attendance_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                                    <p className="text-[8px] font-bold mt-4 opacity-60 italic">{day.status}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;
