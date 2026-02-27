import { useState, useEffect } from 'react';
import { BarChart3, Clock, CheckCircle2, MoreVertical, Plus, X, Send, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const PollCard = ({ poll, index, onVote, onRemoveVote, onDelete, onEdit, isAdmin, activeDropdown, setActiveDropdown }) => {
    const calculatePercent = (votes) => {
        if (poll.total_votes === 0) return 0;
        return Math.round((votes / poll.total_votes) * 100);
    };

    const isOpen = activeDropdown === poll.id;
    const hasVoted = poll.user_voted_option !== null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`card-base card-hover p-24 md:p-32 overflow-visible relative group/poll ${isOpen ? 'z-50' : 'z-auto'} ${hasVoted ? 'border-primary/20 bg-primary/5' : ''}`}
        >
            <div className="mb-24 relative">
                <div className="flex flex-col gap-6 pr-48">
                    {hasVoted && (
                        <div className="flex">
                            <span className="px-8 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-4">
                                <CheckCircle2 size={8} /> Signal Locked & Registered
                            </span>
                        </div>
                    )}
                    <h3 className="text-xl font-black text-white leading-tight break-words">{poll.question}</h3>
                </div>

                <div className="absolute top-0 right-0 flex items-center gap-4">
                    {hasVoted && (
                        <button
                            onClick={() => onRemoveVote(poll.id)}
                            className="p-8 text-[9px] font-black uppercase tracking-widest text-text-secondary hover:text-danger transition-colors bg-white/5 rounded-lg border border-white/5 flex items-center gap-6"
                            title="Undo Vote"
                        >
                            <X size={10} /> Retract
                        </button>
                    )}
                    {isAdmin && (
                        <div className="relative">
                            <button
                                onClick={() => setActiveDropdown(isOpen ? null : poll.id)}
                                className={`text-text-secondary hover:text-white transition-colors p-8 rounded-lg ${isOpen ? 'bg-white/10 text-primary' : 'hover:bg-white/5'}`}
                            >
                                <MoreVertical size={18} />
                            </button>

                            <AnimatePresence>
                                {isOpen && (
                                    <>
                                        <div className="fixed inset-0 z-20" onClick={() => setActiveDropdown(null)} />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            className="absolute right-0 top-full mt-4 w-36 bg-card border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-30 overflow-hidden backdrop-blur-2xl"
                                        >
                                            <button
                                                onClick={() => { onDelete(poll.id); setActiveDropdown(null); }}
                                                className="w-full px-16 py-12 text-left text-[10px] font-black uppercase tracking-widest text-danger hover:bg-danger/10 transition-colors flex items-center gap-10"
                                            >
                                                <Trash2 size={12} /> Delete Poll
                                            </button>
                                            <button
                                                onClick={() => { onEdit(poll); setActiveDropdown(null); }}
                                                className="w-full px-16 py-12 text-left text-[10px] font-black uppercase tracking-widest text-secondary hover:bg-white/5 transition-colors flex items-center gap-10 border-t border-white/5"
                                            >
                                                <Edit2 size={12} /> Modify Signal
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-16">
                {poll.options.map((opt) => {
                    const percent = calculatePercent(opt.votes);
                    const isUserChoice = poll.user_voted_option === opt.id;

                    return (
                        <div key={opt.id} onClick={() => !hasVoted && onVote(poll.id, opt.id)} className={`block transition-all ${hasVoted ? 'cursor-default opacity-80' : 'cursor-pointer group hover:translate-x-4'}`}>
                            <div className={`flex justify-between text-xs font-bold uppercase tracking-widest mb-6 transition-colors ${isUserChoice ? 'text-primary' : 'text-text-secondary group-hover:text-primary'}`}>
                                <span className="break-words pr-8 leading-tight flex-1 flex items-center gap-8">
                                    {isUserChoice && <CheckCircle2 size={12} className="text-primary" />}
                                    {opt.option_text}
                                </span>
                                <span className={`shrink-0 ${isUserChoice ? 'text-primary' : 'text-text-secondary'}`}>{percent}% ({opt.votes})</span>
                            </div>
                            <div className={`h-12 w-full rounded-full overflow-hidden border transition-all ${isUserChoice ? 'bg-primary/20 border-primary/30 h-14' : 'bg-white/5 border-white/5'}`}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`h-full rounded-full relative ${isUserChoice ? 'bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto]' : 'bg-gradient-to-r from-primary to-secondary opacity-60'}`}
                                >
                                    {isUserChoice && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                                </motion.div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-between mt-24 border-t border-white/5 pt-12 font-bold text-[9px] text-text-secondary uppercase tracking-[0.2em]">
                <div className="flex items-center gap-6">
                    <Clock size={12} className="text-primary" /> {poll.deadline ? `Ends ${new Date(poll.deadline).toLocaleDateString()}` : 'Live'}
                </div>
                <div className="flex items-center gap-6">
                    <CheckCircle2 size={12} className="text-success" /> {poll.total_votes} votes
                </div>
            </div>
        </motion.div>
    );
};

const Polls = ({ isAdmin = true }) => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [newPoll, setNewPoll] = useState({ question: '', options: ['', ''], deadline: '' });

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const { data } = await api.get(`/polls?user_id=${user.id}`);
            setPolls(data);
        } catch (err) {
            console.error('Failed to fetch polls:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this poll?')) return;
        try {
            await api.delete(`/polls/${id}`);
            fetchPolls();
        } catch (err) {
            console.error('Failed to delete poll:', err);
        }
    };

    const handleOpenEdit = (poll) => {
        setNewPoll({
            ...poll,
            options: poll.options.map(o => o.option_text),
            deadline: poll.deadline ? new Date(poll.deadline).toISOString().slice(0, 16) : ''
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleOpenCreate = () => {
        setNewPoll({ question: '', options: ['', ''], deadline: '' });
        setIsEditing(false);
        setShowModal(true);
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

    const handleRemoveVote = async (pollId) => {
        if (!window.confirm('Retract your vote? You can vote again after this.')) return;
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await api.delete(`/polls/${pollId}/vote?user_id=${user.id}`);
            fetchPolls();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to remove vote');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const filteredOptions = newPoll.options.filter(opt => opt.trim() !== '');

            if (isEditing) {
                await api.put(`/polls/${newPoll.id}`, { ...newPoll, options: filteredOptions });
            } else {
                await api.post('/polls', { ...newPoll, options: filteredOptions, created_by: user.id });
            }

            setShowModal(false);
            setNewPoll({ question: '', options: ['', ''], deadline: '' });
            setIsEditing(false);
            fetchPolls();
        } catch (err) {
            console.error('Failed to save poll:', err);
            alert(err.response?.data?.message || 'Failed to save poll');
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
        <div className="space-y-24 md:space-y-32">
            <div className="flex flex-col gap-16 md:gap-24">
                <div className="flex justify-between items-center gap-16">
                    <div>
                        <div className="flex items-center gap-6 mb-2">
                            <BarChart3 size={12} className="text-secondary" />
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Opinions</span>
                        </div>
                        <h1 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter text-white">
                            BATCH <span className="text-primary not-italic">POLLS</span>
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
                            <span className="hidden sm:inline">INITIATE POLL</span>
                            <span className="sm:hidden">NEW</span>
                        </motion.button>
                    )}
                </div>
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
                        <PollCard
                            key={poll.id}
                            poll={poll}
                            index={index}
                            onVote={handleVote}
                            onRemoveVote={handleRemoveVote}
                            onDelete={handleDelete}
                            onEdit={handleOpenEdit}
                            isAdmin={isAdmin}
                            activeDropdown={activeDropdown}
                            setActiveDropdown={setActiveDropdown}
                        />
                    ))
                )}
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-16 md:p-32">
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
                            className="relative w-full max-w-xl bg-card/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-[110]"
                        >
                            <div className="max-h-[85vh] overflow-y-auto custom-scrollbar p-24 md:p-40">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

                                <div className="flex justify-between items-start mb-24 md:mb-32">
                                    <div>
                                        <div className="flex items-center gap-6 md:gap-8 mb-2 md:mb-4">
                                            <BarChart3 size={12} className="text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Poll Dispatch</span>
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white">
                                            {isEditing ? 'Modify' : 'New'} <span className="text-primary not-italic">Poll</span>
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-8 md:p-12 hover:bg-white/5 rounded-full text-text-secondary hover:text-white transition-all bg-white/5"
                                    >
                                        <X size={20} className="md:size-24" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-24">
                                    <div className="space-y-8">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Poll Query</label>
                                        <input
                                            required
                                            type="text"
                                            value={newPoll.question}
                                            onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                                            placeholder="What is the objective?"
                                            className="input-base w-full bg-white/5 border-white/5 focus:border-primary/50 text-base md:text-lg font-bold italic py-12 px-16"
                                        />
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex justify-between items-center px-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary italic">Response Options</label>
                                            <button type="button" onClick={addOption} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">
                                                + ADD
                                            </button>
                                        </div>
                                        <div className="space-y-12 max-h-48 overflow-y-auto pr-8 custom-scrollbar">
                                            {newPoll.options.map((option, index) => (
                                                <input
                                                    key={index}
                                                    required
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => updateOption(index, e.target.value)}
                                                    placeholder={`Option ${index + 1}`}
                                                    className="input-base w-full bg-white/5 border-white/5 text-sm py-10 px-12"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Exp Date (Optional)</label>
                                        <input
                                            type="datetime-local"
                                            value={newPoll.deadline}
                                            onChange={(e) => setNewPoll({ ...newPoll, deadline: e.target.value })}
                                            className="input-base w-full bg-white/5 border-white/5 text-xs text-text-secondary"
                                        />
                                    </div>

                                    <button
                                        disabled={submitting}
                                        type="submit"
                                        className="btn-primary w-full py-16 italic font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-12 group"
                                    >
                                        {submitting ? 'PROCESSING...' : (
                                            <>
                                                {isEditing ? 'UPDATE' : 'INITIATE'} POLL <Send size={16} className="group-hover:translate-x-2 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Polls;
