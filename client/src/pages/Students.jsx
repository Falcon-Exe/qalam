import { useState, useEffect } from 'react';
import { Users, Search, Plus, Mail, Phone, Edit3, Trash2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const StudentDirectory = ({ isAdmin = true }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data } = await api.get('/students');
                setStudents(data);
            } catch (err) {
                console.error('Failed to fetch students:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const filtered = students.filter(s =>
        s.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-16">
                <div className="flex-1 max-w-sm relative group">
                    <Search size={18} className="absolute left-16 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-base pl-48 w-full"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-24">
                {loading ? (
                    [1, 2, 3, 4].map(i => (
                        <div key={i} className="nav-card h-64 bg-white/5 animate-pulse rounded-2xl" />
                    ))
                ) : filtered.length === 0 ? (
                    <div className="col-span-full py-64 text-center">
                        <Users size={48} className="mx-auto text-text-secondary mb-16 opacity-20" />
                        <h3 className="text-xl font-bold text-text-secondary">No students matching your search</h3>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filtered.map((student, index) => (
                            <motion.div
                                key={student.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="nav-card card-hover flex flex-col group h-full"
                            >
                                <div className="flex items-center gap-16 mb-24">
                                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
                                        {(student.fullname || student.username)[0].toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="font-bold text-base truncate">{student.fullname}</h4>
                                        <p className="text-[11px] font-black text-text-secondary uppercase tracking-widest mt-2">@{student.username}</p>
                                    </div>
                                </div>

                                <div className="space-y-16 flex-1">
                                    <div className="flex justify-between items-center">
                                        <span className={`px-8 py-4 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/5 ${student.class_role && student.class_role !== 'Member' ? 'bg-primary/20 text-primary border-primary/20' : 'bg-white/5 text-text-secondary'
                                            }`}>
                                            {student.class_role || 'Member'}
                                        </span>
                                    </div>
                                </div>

                                <button className="w-full mt-24 py-10 rounded-lg bg-background border border-white/5 text-[11px] font-black uppercase tracking-widest text-text-secondary hover:text-white hover:border-primary/30 transition-all flex items-center justify-center gap-4">
                                    View Profile <ChevronRight size={12} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default StudentDirectory;
