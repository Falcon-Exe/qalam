import { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle2, Trash2, User, UserX, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Feedback = ({ isAdmin = true }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isAdmin) {
            fetchFeedback();
        }
    }, []);

    const fetchFeedback = async () => {
        try {
            const { data } = await api.get('/feedback');
            setFeedbacks(data);
        } catch (err) {
            console.error('Failed to fetch feedback:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await api.post('/feedback', {
                type: 'feedback',
                content,
                is_anonymous: isAnonymous,
                user_id: user.id
            });
            setContent('');
            if (isAdmin) fetchFeedback();
            alert('Feedback submitted successfully!');
        } catch (err) {
            console.error('Failed to submit feedback:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleResolve = async (id) => {
        try {
            await api.patch(`/feedback/${id}/resolve`);
            fetchFeedback();
        } catch (err) {
            console.error('Failed to resolve feedback:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this feedback?')) return;
        try {
            await api.delete(`/feedback/${id}`);
            fetchFeedback();
        } catch (err) {
            console.error('Failed to delete feedback:', err);
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

    return (
        <div className="space-y-32">
            {!isAdmin ? (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-base bg-primary/5 border-primary/20 relative overflow-hidden p-32"
                >
                    <div className="relative z-10 flex flex-col md:flex-row gap-24 items-start">
                        <div className="flex-1 space-y-12">
                            <h2 className="text-2xl font-black text-white italic">Submit Feedback</h2>
                            <p className="text-text-secondary text-sm max-w-sm">Your insights help us improve the class environment. Submissions can be anonymous.</p>
                        </div>
                        <div className="w-full md:w-96 space-y-16">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="input-base w-full min-h-[120px] resize-none p-16"
                            />
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-8 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={isAnonymous}
                                        onChange={(e) => setIsAnonymous(e.target.checked)}
                                        className="hidden"
                                    />
                                    <div className={`w-4 h-4 rounded border ${isAnonymous ? 'bg-primary border-primary' : 'border-white/10'} group-hover:border-primary transition-colors`} />
                                    <span className="text-xs text-text-secondary font-medium group-hover:text-white">Anonymous</span>
                                </label>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || !content.trim()}
                                    className="btn-primary py-10 shadow-lg shadow-primary/20"
                                >
                                    <Send size={14} /> {submitting ? 'Sending...' : 'Send Feedback'}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : null}

            {isAdmin && (
                <div className="space-y-24">
                    <div className="flex items-center justify-between border-b border-white/5 pb-16">
                        <h2 className="text-xl font-black text-white italic">AL QALAM Feedback Stream</h2>
                        <div className="flex gap-16 text-xs font-bold uppercase tracking-widest text-text-secondary">
                            <span className="text-primary border-b-2 border-primary pb-2">All Feed</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Unresolved</span>
                        </div>
                    </div>

                    <div className="grid gap-24 lg:grid-cols-2">
                        {loading ? (
                            <div className="col-span-full py-64 text-center text-text-secondary animate-pulse">Syncing feedback records...</div>
                        ) : feedbacks.length === 0 ? (
                            <div className="col-span-full py-64 text-center text-text-secondary italic">No feedback submissions received yet.</div>
                        ) : (
                            feedbacks.map((fb, index) => (
                                <motion.div
                                    key={fb.id}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="card-base card-hover flex flex-col justify-between h-full p-24"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-24">
                                            <div className="flex items-center gap-12">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${fb.is_anonymous ? 'bg-white/5 text-text-secondary' : 'bg-primary/20 text-primary'}`}>
                                                    {fb.is_anonymous ? <UserX size={16} /> : <User size={16} />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm tracking-tight text-white">{fb.is_anonymous ? 'Anonymous' : fb.user_name}</h4>
                                                    <div className="flex items-center gap-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-2 italic">
                                                        <Clock size={10} /> {formatDate(fb.created_at)}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`px-10 py-4 rounded-lg text-[10px] font-black uppercase tracking-widest border ${fb.status === 'resolved' ? 'bg-success/20 text-success border-success/30' : 'bg-secondary/20 text-secondary border-secondary/30'}`}>
                                                {fb.status}
                                            </span>
                                        </div>
                                        <p className="text-text-secondary text-[13px] leading-relaxed italic">"{fb.content}"</p>
                                    </div>

                                    <div className="flex gap-12 mt-24 pt-24 border-t border-white/5">
                                        {fb.status !== 'resolved' && (
                                            <button
                                                onClick={() => handleResolve(fb.id)}
                                                className="flex-1 btn-primary py-8 text-xs bg-white/5 border border-white/5 hover:bg-success/20 hover:text-success hover:shadow-none text-white shadow-none"
                                            >
                                                <CheckCircle2 size={12} /> Resolve
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(fb.id)}
                                            className="p-10 hover:bg-danger/10 text-text-secondary hover:text-danger rounded-lg transition-all border border-white/5"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Feedback;
