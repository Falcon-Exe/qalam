import { useState, useEffect } from 'react';
import { Megaphone, Search, Plus, Filter, MoreHorizontal, Bell, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Announcements = ({ isAdmin = true }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newAnn, setNewAnn] = useState({ title: '', content: '', priority_tag: 'medium' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const { data } = await api.get('/announcements');
            setAnnouncements(data);
        } catch (err) {
            console.error('Failed to fetch announcements:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await api.post('/announcements', { ...newAnn, created_by: user.id });
            setShowModal(false);
            setNewAnn({ title: '', content: '', priority_tag: 'medium' });
            fetchAnnouncements();
        } catch (err) {
            console.error('Failed to create announcement:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    const filtered = announcements.filter(ann =>
        ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ann.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-16">
                <div className="relative flex-1 max-w-md group">
                    <Search size={18} className="absolute left-16 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-base pl-48 w-full"
                    />
                </div>
                <div className="flex items-center gap-12">
                    <button className="p-12 bg-card hover:bg-white/5 border border-white/5 rounded-xl transition-all"><Filter size={18} /></button>
                    {isAdmin && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn-primary"
                        >
                            <Plus size={18} /> New Broadcast
                        </button>
                    )}
                </div>
            </div>

            <div className="grid gap-16">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="card-base h-32 bg-white/5 animate-pulse rounded-2xl" />
                    ))
                ) : filtered.length === 0 ? (
                    <div className="text-center py-64">
                        <Megaphone size={48} className="mx-auto text-text-secondary mb-16 opacity-20" />
                        <h3 className="text-xl font-bold text-text-secondary">No announcements found</h3>
                        <p className="text-sm text-text-secondary mt-8 italic uppercase tracking-widest text-[10px]">Broadcast center clear</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filtered.map((ann, index) => (
                            <motion.div
                                key={ann.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="card-base card-hover flex gap-24 relative overflow-hidden"
                            >
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${ann.priority_tag === 'high' ? 'bg-danger' :
                                        ann.priority_tag === 'medium' ? 'bg-primary' : 'bg-success'
                                    }`} />

                                <div className="p-12 bg-white/5 rounded-2xl h-fit text-primary flex-shrink-0">
                                    <Bell size={20} />
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <div className="flex items-center gap-8 mb-4">
                                                <h3 className="text-lg font-black tracking-tight">{ann.title}</h3>
                                                <span className={`text-[8px] font-black uppercase px-6 py-2 rounded border ${ann.priority_tag === 'high' ? 'bg-danger/10 text-danger border-danger/20' :
                                                        ann.priority_tag === 'medium' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-success/10 text-success border-success/20'
                                                    }`}>
                                                    {ann.priority_tag}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-8 text-[10px] text-text-secondary uppercase font-bold tracking-widest">
                                                <span>{ann.creator_name || 'Admin'}</span>
                                                <span className="w-1 h-1 bg-white/10 rounded-full" />
                                                <span>{formatDate(ann.created_at || new Date())}</span>
                                            </div>
                                        </div>
                                        <button className="text-text-secondary hover:text-white p-4 rounded-lg hover:bg-white/5 transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </div>
                                    <p className="text-text-secondary text-sm leading-relaxed mt-12 max-w-3xl whitespace-pre-wrap">
                                        {ann.content}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {showModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl z-[110] p-16"
                        >
                            <div className="card-base border-white/10 shadow-3xl bg-card/95 backdrop-blur-xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />

                                <div className="flex justify-between items-center mb-24">
                                    <div>
                                        <h2 className="text-xl font-black italic uppercase tracking-tight text-white">Create Broadcast</h2>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Dispatch Information to Class</p>
                                    </div>
                                    <button onClick={() => setShowModal(false)} className="p-8 hover:bg-white/5 rounded-full text-text-secondary hover:text-white transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleCreate} className="space-y-24">
                                    <div className="space-y-8">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Broadcast Heading</label>
                                        <input
                                            required
                                            type="text"
                                            value={newAnn.title}
                                            onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                                            placeholder="e.g. Exam Schedule Update"
                                            className="input-base w-full"
                                        />
                                    </div>

                                    <div className="space-y-8">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Detailed Content</label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={newAnn.content}
                                            onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                                            placeholder="Write your announcement details here..."
                                            className="input-base w-full resize-none p-16"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-16">
                                        <div className="space-y-8">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Priority Level</label>
                                            <select
                                                value={newAnn.priority_tag}
                                                onChange={(e) => setNewAnn({ ...newAnn, priority_tag: e.target.value })}
                                                className="input-base w-full bg-card"
                                            >
                                                <option value="low">Low Priority</option>
                                                <option value="medium">Medium Priority</option>
                                                <option value="high">High Priority</option>
                                            </select>
                                        </div>
                                        <div className="flex items-end">
                                            <button
                                                disabled={submitting}
                                                type="submit"
                                                className="btn-primary w-full py-14 italic font-black uppercase tracking-tight shadow-lg shadow-primary/20"
                                            >
                                                {submitting ? 'Dispatching...' : <>DISPATCH <Send size={16} className="ml-8" /></>}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Announcements;
