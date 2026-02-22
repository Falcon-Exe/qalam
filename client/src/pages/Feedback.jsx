import React from 'react';
import { MessageSquare, Send, CheckCircle2, Trash2, User, UserX, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Feedback = ({ isAdmin = true }) => {
    const feedbacks = [
        { id: 1, user: 'Anonymous', content: 'The new canteen menu is a great addition to the campus! Love the budget options.', date: '2 hours ago', status: 'unread' },
        { id: 2, user: 'Adarsh S', content: 'Could we possibly extend the computer lab hours during the internal assessment week?', date: '1 day ago', status: 'resolved' },
        { id: 3, user: 'Anonymous', content: 'The sports equipment in the common room needs some urgent maintenance.', date: '3 days ago', status: 'unread' },
    ];

    return (
        <div className="space-y-32">
            {!isAdmin && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="nav-card bg-primary/5 border-primary/20 relative overflow-hidden"
                >
                    <div className="relative z-10 flex flex-col md:flex-row gap-24 items-start">
                        <div className="flex-1 space-y-12">
                            <h2 className="leading-tight">Submit Feedback</h2>
                            <p className="text-text-secondary text-sm max-w-sm">Your insights help us improve the class environment. Submissions can be anonymous.</p>
                        </div>
                        <div className="w-full md:w-96 space-y-16">
                            <textarea placeholder="Share your thoughts..." className="input-base w-full min-h-[120px] resize-none" />
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-8 cursor-pointer group">
                                    <input type="checkbox" className="hidden" />
                                    <div className="w-4 h-4 rounded border border-white/10 group-hover:border-primary transition-colors" />
                                    <span className="text-xs text-text-secondary font-medium group-hover:text-white">Anonymous</span>
                                </label>
                                <button className="btn-primary py-10 shadow-lg shadow-primary/20"><Send size={14} /> Send Feedback</button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="space-y-24">
                <div className="flex items-center justify-between border-b border-white/5 pb-16">
                    <h2>Recent Submissions</h2>
                    <div className="flex gap-16 text-xs font-bold uppercase tracking-widest">
                        <span className="text-primary border-b-2 border-primary pb-2">All Feed</span>
                        <span className="text-text-secondary hover:text-white cursor-pointer transition-colors">Unresolved</span>
                    </div>
                </div>

                <div className="grid gap-24 lg:grid-cols-2">
                    {feedbacks.map((fb, index) => (
                        <motion.div
                            key={fb.id}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="nav-card card-hover flex flex-col justify-between h-full"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-24">
                                    <div className="flex items-center gap-12">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${fb.user === 'Anonymous' ? 'bg-white/5 text-text-secondary' : 'bg-primary/20 text-primary'}`}>
                                            {fb.user === 'Anonymous' ? <UserX size={16} /> : <User size={16} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm tracking-tight">{fb.user}</h4>
                                            <div className="flex items-center gap-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-2 italic">
                                                <Clock size={10} /> {fb.date}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-10 py-4 rounded-lg text-[10px] font-black uppercase tracking-widest border ${fb.status === 'resolved' ? 'bg-success/20 text-success border-success/30' : 'bg-secondary/20 text-secondary border-secondary/30'
                                        }`}>
                                        {fb.status}
                                    </span>
                                </div>
                                <p className="text-text-secondary text-[13px] leading-relaxed italic">"{fb.content}"</p>
                            </div>

                            {isAdmin && (
                                <div className="flex gap-12 mt-24 pt-24 border-t border-white/5">
                                    <button className="flex-1 btn-primary py-8 text-xs bg-white/5 border border-white/5 hover:bg-success/20 hover:text-success hover:shadow-none text-white shadow-none">
                                        <CheckCircle2 size={12} /> Resolve
                                    </button>
                                    <button className="p-10 hover:bg-danger/10 text-text-secondary hover:text-danger rounded-lg transition-all border border-white/5">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Feedback;
