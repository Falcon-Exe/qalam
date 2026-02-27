import { useState, useEffect } from 'react';
import { Megaphone, Search, Plus, Filter, MoreHorizontal, Bell, X, Send, Sparkles, Clock, ShieldCheck, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Announcements = ({ isAdmin = true }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newAnn, setNewAnn] = useState({ title: '', content: '', priority_tag: 'medium' });
    const [isEditing, setIsEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (isEditing) {
                await api.put(`/announcements/${newAnn.id}`, newAnn);
            } else {
                await api.post('/announcements', { ...newAnn, created_by: user.id });
            }
            setShowModal(false);
            setNewAnn({ title: '', content: '', priority_tag: 'medium' });
            setIsEditing(false);
            fetchAnnouncements();
        } catch (err) {
            console.error('Failed to save announcement:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenEdit = (ann) => {
        setNewAnn(ann);
        setIsEditing(true);
        setShowModal(true);
        setActiveDropdown(null);
    };

    const handleOpenCreate = () => {
        setNewAnn({ title: '', content: '', priority_tag: 'medium' });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this broadcast?')) return;
        try {
            await api.delete(`/announcements/${id}`);
            fetchAnnouncements();
            setActiveDropdown(null);
        } catch (err) {
            console.error('Failed to delete announcement:', err);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const filtered = announcements.filter(ann =>
        ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ann.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-24 md:space-y-32 h-full pb-80 md:pb-0">
            {/* Header Section */}
            <div className="flex flex-col gap-20 md:gap-24">
                <div className="flex justify-between items-center gap-16">
                    <div>
                        <div className="flex items-center gap-6 mb-2">
                            <Megaphone size={12} className="text-secondary" />
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Broadcaster</span>
                        </div>
                        <h1 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter text-white">
                            BATCH <span className="text-primary not-italic">INTEL</span>
                        </h1>
                    </div>
                    {isAdmin && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleOpenCreate}
                            className="btn-primary py-8 px-16 md:py-12 md:px-24 text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-6 md:gap-8 shadow-lg shadow-primary/20 shrink-0"
                        >
                            <Plus size={14} className="md:w-4 md:h-4" />
                            <span className="hidden sm:inline">NEW BROADCAST</span>
                            <span className="sm:hidden">NEW</span>
                        </motion.button>
                    )}
                </div>

                {/* Toolbar */}
                <div className="relative group">
                    <Search className="absolute left-12 md:left-16 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors w-4 h-4 md:w-5 md:h-5" />
                    <input
                        type="text"
                        placeholder="Scan broadcasts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-base pl-40 md:pl-48 w-full bg-white/5 border-white/5 focus:border-primary/50 transition-all text-xs md:text-sm font-medium italic py-10 md:py-12"
                    />
                </div>
            </div>

            {/* Announcements Grid */}
            <div className="grid gap-16 md:gap-24">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="nav-card h-40 bg-white/5 animate-pulse rounded-2xl border-white/5" />
                    ))
                ) : filtered.length === 0 ? (
                    <div className="nav-card border-dashed border-white/10 py-64 md:py-80 text-center flex flex-col items-center justify-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 flex items-center justify-center mb-16">
                            <ShieldCheck size={24} className="text-text-secondary opacity-20 md:size-32" />
                        </div>
                        <h3 className="text-base md:text-lg font-black italic uppercase tracking-tight text-text-secondary">Broadcast Center Clear</h3>
                        <p className="text-[9px] md:text-[10px] text-text-secondary/50 font-black uppercase tracking-widest mt-8 px-24">Checking for incoming signals...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filtered.map((ann, index) => (
                            <motion.div
                                key={ann.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ delay: index * 0.05 }}
                                className={`nav-card group relative overflow-visible border-white/5 hover:border-primary/20 transition-all bg-card/40 backdrop-blur-md ${activeDropdown === ann.id ? 'z-50' : 'z-auto'}`}
                            >
                                {/* Compact Priority Tag (Absolute) */}
                                <div className={`absolute top-0 right-0 px-12 py-4 rounded-bl-xl text-[8px] font-black uppercase tracking-widest border-l border-b border-white/5 z-10 ${ann.priority_tag === 'high' ? 'bg-danger/20 text-danger border-danger/20' :
                                    ann.priority_tag === 'medium' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20' :
                                        'bg-success/20 text-success border-success/20'
                                    }`}>
                                    {ann.priority_tag}
                                </div>

                                {/* Priority Sidebar (Minimal) */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${ann.priority_tag === 'high' ? 'bg-danger' :
                                    ann.priority_tag === 'medium' ? 'bg-indigo-500' : 'bg-success'
                                    }`} />

                                <div className="p-16 md:p-20">
                                    <div className="flex flex-col gap-10">
                                        <div className="flex justify-between items-start gap-12">
                                            <div className="space-y-2 flex-1 min-w-0 pr-24">
                                                <h3 className="text-sm md:text-lg font-black italic tracking-tight text-white group-hover:text-primary transition-colors leading-tight">
                                                    {ann.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-text-secondary/60">
                                                    <span className="flex items-center gap-3">
                                                        <ShieldCheck size={8} className="text-secondary" /> {ann.creator_name || 'Admin'}
                                                    </span>
                                                    <span className="opacity-20">|</span>
                                                    <span className="flex items-center gap-3">
                                                        <Clock size={8} /> {formatDate(ann.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="relative shrink-0">
                                                <button
                                                    onClick={() => setActiveDropdown(activeDropdown === ann.id ? null : ann.id)}
                                                    className={`p-6 hover:bg-white/5 rounded-lg transition-all ${activeDropdown === ann.id ? 'text-primary bg-white/5' : 'text-text-secondary opacity-40 hover:opacity-100'}`}
                                                >
                                                    <MoreHorizontal size={16} />
                                                </button>

                                                <AnimatePresence>
                                                    {activeDropdown === ann.id && (
                                                        <>
                                                            <div
                                                                className="fixed inset-0 z-20"
                                                                onClick={() => setActiveDropdown(null)}
                                                            />
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                                                className="absolute right-0 top-full mt-4 w-36 bg-card/98 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl z-30 overflow-hidden"
                                                            >
                                                                {isAdmin && (
                                                                    <button
                                                                        onClick={() => handleDelete(ann.id)}
                                                                        className="w-full px-12 py-10 text-left text-[9px] font-bold uppercase tracking-widest text-danger hover:bg-danger/10 transition-colors flex items-center gap-8"
                                                                    >
                                                                        <Trash2 size={10} /> Delete
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(ann.content);
                                                                        setActiveDropdown(null);
                                                                    }}
                                                                    className="w-full px-12 py-10 text-left text-[9px] font-bold uppercase tracking-widest text-text-secondary hover:bg-white/5 transition-colors flex items-center gap-8 border-t border-white/5"
                                                                >
                                                                    <Sparkles size={10} /> Copy Clip
                                                                </button>
                                                                {isAdmin && (
                                                                    <button
                                                                        onClick={() => handleOpenEdit(ann)}
                                                                        className="w-full px-12 py-10 text-left text-[9px] font-bold uppercase tracking-widest text-secondary hover:bg-secondary/10 transition-colors flex items-center gap-8 border-t border-white/5"
                                                                    >
                                                                        <Edit2 size={10} /> Modify
                                                                    </button>
                                                                )}
                                                            </motion.div>
                                                        </>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        <div className="pl-8 md:pl-12 border-l-2 border-white/5 py-2">
                                            <p className="text-text-secondary text-[11px] md:text-sm leading-relaxed font-medium">
                                                {ann.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Create Modal - Fixed with Centering */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] overflow-hidden flex items-center justify-center p-16 md:p-32">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-xl pointer-events-auto"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-2xl bg-card/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-[110]"
                        >
                            <div className="max-h-[85vh] overflow-y-auto custom-scrollbar p-24 md:p-40">
                                {/* Decorative elements */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

                                <div className="flex justify-between items-start mb-24 md:mb-32">
                                    <div>
                                        <div className="flex items-center gap-6 md:gap-8 mb-2 md:mb-4">
                                            <Sparkles size={12} className="text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Dispatch Module</span>
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white">New <span className="text-primary not-italic">Broadcast</span></h2>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-8 md:p-12 hover:bg-white/5 rounded-full text-text-secondary hover:text-white transition-all bg-white/5"
                                    >
                                        <X size={20} className="md:size-24" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-24 md:space-y-32">
                                    <div className="space-y-8 md:space-y-12">
                                        <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-text-secondary ml-4 italic">Broadcast Heading</label>
                                        <input
                                            required
                                            type="text"
                                            value={newAnn.title}
                                            onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                                            placeholder="e.g. Sessional Exam Update"
                                            className="input-base w-full bg-white/5 border-white/5 focus:border-primary/50 text-base md:text-lg font-bold italic py-12 px-16"
                                        />
                                    </div>

                                    <div className="space-y-8 md:space-y-12">
                                        <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-text-secondary ml-4 italic">Intelligence Content</label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={newAnn.content}
                                            onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                                            placeholder="Specify the full details of this broadcast..."
                                            className="input-base w-full bg-white/5 border-white/5 focus:border-primary/50 text-sm md:text-base font-medium leading-relaxed resize-none p-16 md:p-20"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                                        <div className="space-y-10 md:space-y-12">
                                            <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-text-secondary ml-4 italic">Priority Level</label>
                                            <div className="grid grid-cols-3 gap-8 md:gap-12">
                                                {['low', 'medium', 'high'].map(lvl => (
                                                    <button
                                                        key={lvl}
                                                        type="button"
                                                        onClick={() => setNewAnn({ ...newAnn, priority_tag: lvl })}
                                                        className={`py-8 md:py-10 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-xl border transition-all ${newAnn.priority_tag === lvl
                                                            ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10'
                                                            : 'bg-white/5 border-white/5 text-text-secondary hover:bg-white/10'
                                                            }`}
                                                    >
                                                        {lvl}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-end">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                disabled={submitting}
                                                type="submit"
                                                className="btn-primary w-full py-16 text-[10px] md:text-xs italic font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-10 md:gap-12 group"
                                            >
                                                {submitting ? 'DISPATCHING...' : (
                                                    <>
                                                        TRANSMIT SIGNAL <Send size={16} className="md:size-18 group-hover:translate-x-2 -translate-y-1 transition-transform" />
                                                    </>
                                                )}
                                            </motion.button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Announcements;
