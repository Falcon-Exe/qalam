import React from 'react';
import { Megaphone, Search, Plus, Filter, MoreHorizontal, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const Announcements = ({ isAdmin = true }) => {
    const announcements = [
        { id: 1, title: 'Exam Schedule Out', content: 'Final semester exam timetable has been released. Please check the university portal.', date: '2 hours ago', priority: 'high' },
        { id: 2, title: 'Cultural Fest 2026', content: 'Auditions for the class group dance will begin tomorrow at 4 PM.', date: 'Yesterday', priority: 'medium' },
        { id: 3, title: 'Lab Record Submission', content: 'Submit your OS lab records by Friday without fail.', date: '2 days ago', priority: 'low' },
    ];

    return (
        <div className="space-y-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-16">
                <div className="relative flex-1 max-w-md group">
                    <Search size={18} className="absolute left-16 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        className="input-base pl-48 w-full"
                    />
                </div>
                <div className="flex items-center gap-12">
                    <button className="p-12 bg-card hover:bg-white/5 border border-white/5 rounded-xl transition-all"><Filter size={18} /></button>
                    {isAdmin && (
                        <button className="btn-primary">
                            <Plus size={18} /> New Broadcast
                        </button>
                    )}
                </div>
            </div>

            <div className="grid gap-16">
                {announcements.map((ann, index) => (
                    <motion.div
                        key={ann.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card-base card-hover flex gap-24 relative overflow-hidden"
                    >
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${ann.priority === 'high' ? 'bg-danger' : ann.priority === 'medium' ? 'bg-primary' : 'bg-success'
                            }`} />

                        <div className="p-12 bg-white/5 rounded-2xl h-fit text-primary">
                            <Bell size={20} />
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-lg font-black tracking-tight">{ann.title}</h3>
                                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mt-4">{ann.date}</p>
                                </div>
                                <button className="text-text-secondary hover:text-white"><MoreHorizontal size={18} /></button>
                            </div>
                            <p className="text-text-secondary text-sm leading-relaxed mt-12 max-w-2xl">
                                {ann.content}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Announcements;
