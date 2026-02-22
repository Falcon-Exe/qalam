import { useState, useEffect } from 'react';
import { BarChart3, Clock, CheckCircle2, MoreVertical, Plus, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const PollCard = ({ poll, index, onVote }) => {
    const calculatePercent = (votes) => {
        if (poll.total_votes === 0) return 0;
        return Math.round((votes / poll.total_votes) * 100);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="card-base card-hover"
        >
            <div className="flex justify-between items-start mb-24">
                <h3 className="text-xl font-black max-w-md text-white">{poll.question}</h3>
                <button className="text-text-secondary hover:text-white transition-colors"><MoreVertical size={18} /></button>
            </div>

            <div className="space-y-16">
                {poll.options.map((opt) => {
                    const percent = calculatePercent(opt.votes);
                    return (
                        <div key={opt.id} onClick={() => onVote(poll.id, opt.id)} className="block cursor-pointer group">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-text-secondary mb-4 group-hover:text-primary transition-colors">
                                <span>{opt.option_text}</span>
                                <span>{percent}% ({opt.votes})</span>
                            </div>
                            <div className="h-10 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full relative"
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                </motion.div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-between mt-32 border-t border-white/5 pt-16 font-bold text-xs text-text-secondary uppercase tracking-[0.2em]">
                <div className="flex items-center gap-8">
                    <Clock size={14} className="text-primary" /> {poll.deadline ? `Ends ${new Date(poll.deadline).toLocaleDateString()}` : 'No Deadline'}
                </div>
                <div className="flex items-center gap-8">
                    <CheckCircle2 size={14} className="text-success" /> {poll.total_votes} total votes
                </div>
            </div>
        </motion.div>
    );
};

const Polls = ({ isAdmin = true }) => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newPoll, setNewPoll] = useState({ question: '', options: ['', ''], deadline: '' });

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        try {
            const { data } = await api.get('/polls');
            setPolls(data);
        } catch (err) {
            console.error('Failed to fetch polls:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (pollId, optionId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await api.post(`/polls/${pollId}/vote`, { option_id: optionId, user_id: user.id });
            fetchPolls();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit vote');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const filteredOptions = newPoll.options.filter(opt => opt.trim() !== '');
            await api.post('/polls', { ...newPoll, options: filteredOptions, created_by: user.id });
            setShowModal(false);
            setNewPoll({ question: '', options: ['', ''], deadline: '' });
            fetchPolls();
        } catch (err) {
            console.error('Failed to create poll:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const addOption = () => {
        setNewPoll({ ...newPoll, options: [...newPoll.options, ''] });
    };

    const updateOption = (index, value) => {
        const updatedOptions = [...newPoll.options];
        updatedOptions[index] = value;
        setNewPoll({ ...newPoll, options: updatedOptions });
    };

    return (
        <div className="space-y-32">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-white italic underline decoration-secondary/30 decoration-4 underline-offset-8">Active Polls</h2>
                    <p className="text-xs text-text-secondary mt-12 font-medium">Cast your vote to decide the class direction</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary"
                    >
                        <Plus size={18} /> Create Poll
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
                {loading ? (
                    [1, 2].map(i => <div key={i} className="card-base h-64 bg-white/5 animate-pulse rounded-2xl" />)
                ) : polls.length === 0 ? (
                    <div className="col-span-full text-center py-64">
                        <BarChart3 size={48} className="mx-auto text-text-secondary mb-16 opacity-20" />
                        <h3 className="text-xl font-bold text-text-secondary">No active polls</h3>
                    </div>
                ) : (
                    polls.map((poll, index) => (
                        <PollCard key={poll.id} poll={poll} index={index} onVote={handleVote} />
                    ))
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
                                        <h2 className="text-xl font-black italic uppercase tracking-tight text-white">New Class Poll</h2>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Democratic Decision Making</p>
                                    </div>
                                    <button onClick={() => setShowModal(false)} className="p-8 hover:bg-white/5 rounded-full text-text-secondary hover:text-white transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleCreate} className="space-y-24">
                                    <div className="space-y-8">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Question</label>
                                        <input
                                            required
                                            type="text"
                                            value={newPoll.question}
                                            onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                                            placeholder="What would you like to ask?"
                                            className="input-base w-full"
                                        />
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Options</label>
                                            <button type="button" onClick={addOption} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">
                                                Add Option
                                            </button>
                                        </div>
                                        <div className="space-y-12 max-h-40 overflow-y-auto pr-8 no-scrollbar">
                                            {newPoll.options.map((option, index) => (
                                                <input
                                                    key={index}
                                                    required
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => updateOption(index, e.target.value)}
                                                    placeholder={`Option ${index + 1}`}
                                                    className="input-base w-full"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Deadline (Optional)</label>
                                        <input
                                            type="datetime-local"
                                            value={newPoll.deadline}
                                            onChange={(e) => setNewPoll({ ...newPoll, deadline: e.target.value })}
                                            className="input-base w-full bg-card"
                                        />
                                    </div>

                                    <button
                                        disabled={submitting}
                                        type="submit"
                                        className="btn-primary w-full py-14 italic font-black uppercase tracking-tight shadow-lg shadow-primary/20 flex items-center justify-center gap-12"
                                    >
                                        {submitting ? 'Creating...' : <>INITIATE POLL <Send size={16} /></>}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Polls;
