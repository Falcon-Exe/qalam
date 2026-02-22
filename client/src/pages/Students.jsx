import React from 'react';
import { Users, Search, Plus, Mail, Phone, Edit3, Trash2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentDirectory = ({ isAdmin = true }) => {
    const students = [
        { id: 1, name: 'Adarsh S', roll: 'CS01', email: 'adarsh@college.edu', phone: '9876543210', role: 'Chairman' },
        { id: 2, name: 'Anjali P', roll: 'CS02', email: 'anjali@college.edu', phone: '9876543211', role: 'Secretary' },
        { id: 3, name: 'Arjun K', roll: 'CS03', email: 'arjun@college.edu', phone: '9876543212', role: 'Treasurer' },
        { id: 4, name: 'Bhavya R', roll: 'CS04', email: 'bhavya@college.edu', phone: '9876543213', role: 'Member' },
    ];

    return (
        <div className="space-y-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-16">
                <div className="flex-1 max-w-sm relative group">
                    <Search size={18} className="absolute left-16 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
                    <input type="text" placeholder="Search students..." className="input-base pl-48 w-full" />
                </div>
                {isAdmin && <button className="btn-primary py-8 px-16 text-xs"><Plus size={16} /> Register Student</button>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-24">
                {students.map((student, index) => (
                    <motion.div
                        key={student.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="nav-card card-hover flex flex-col group h-full"
                    >
                        <div className="flex items-center gap-16 mb-24">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
                                {student.name[0]}
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="font-bold text-base truncate">{student.name}</h4>
                                <p className="text-[11px] font-black text-text-secondary uppercase tracking-widest mt-2">{student.roll}</p>
                            </div>
                        </div>

                        <div className="space-y-16 flex-1">
                            <div className="flex justify-between items-center">
                                <span className={`px-8 py-4 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/5 ${student.role !== 'Member' ? 'bg-primary/20 text-primary border-primary/20' : 'bg-white/5 text-text-secondary'
                                    }`}>
                                    {student.role}
                                </span>
                                <div className="flex gap-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-8 hover:bg-white/5 rounded-lg text-text-secondary hover:text-white transition-colors"><Edit3 size={14} /></button>
                                    <button className="p-8 hover:bg-danger/10 rounded-lg text-text-secondary hover:text-danger animate-pulse-slow"><Trash2 size={14} /></button>
                                </div>
                            </div>

                            <div className="space-y-8 pt-16 border-t border-white/5 text-[13px]">
                                <div className="flex items-center gap-8 text-text-secondary hover:text-white transition-colors truncate">
                                    <Mail size={12} className="text-primary flex-shrink-0" /> {student.email}
                                </div>
                                <div className="flex items-center gap-8 text-text-secondary hover:text-white transition-colors">
                                    <Phone size={12} className="text-secondary flex-shrink-0" /> {student.phone}
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-24 py-10 rounded-lg bg-background border border-white/5 text-[11px] font-black uppercase tracking-widest text-text-secondary hover:text-white hover:border-primary/30 transition-all flex items-center justify-center gap-4">
                            View Profile <ChevronRight size={12} />
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default StudentDirectory;
