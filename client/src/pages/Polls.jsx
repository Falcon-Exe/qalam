import React from 'react';
import { BarChart3, Clock, CheckCircle2, MoreVertical, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const PollCard = ({ poll, index }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className="card-base card-hover"
    >
        <div className="flex justify-between items-start mb-24">
            <h3 className="text-xl font-black max-w-md">{poll.question}</h3>
            <button className="text-text-secondary hover:text-white transition-colors"><MoreVertical size={18} /></button>
        </div>

        <div className="space-y-16">
            {poll.options.map((opt) => (
                <label key={opt.id} className="block cursor-pointer group">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-text-secondary mb-4 group-hover:text-primary transition-colors">
                        <span>{opt.label}</span>
                        <span>{opt.percent}%</span>
                    </div>
                    <div className="h-10 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${opt.percent}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full relative"
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                    </div>
                </label>
            ))}
        </div>

        <div className="flex items-center justify-between mt-32 border-t border-white/5 pt-16 font-bold text-xs text-text-secondary uppercase tracking-[0.2em]">
            <div className="flex items-center gap-8">
                <Clock size={14} className="text-primary" /> End in 2 days
            </div>
            <div className="flex items-center gap-8">
                <CheckCircle2 size={14} className="text-success" /> {poll.voted} Votes
            </div>
        </div>
    </motion.div>
);

const Polls = ({ isAdmin = true }) => {
    const polls = [
        {
            id: 1,
            question: 'Where should we go for the industrial visit 2026?',
            voted: 42,
            options: [
                { id: 1, label: 'Bangalore (IT Hub)', percent: 65 },
                { id: 2, label: 'Hyderabad (Tech City)', percent: 35 }
            ]
        },
        {
            id: 2,
            question: 'Preferred programming language for Hackathon?',
            voted: 38,
            options: [
                { id: 1, label: 'Python', percent: 45 },
                { id: 2, label: 'JavaScript/React', percent: 55 }
            ]
        }
    ];

    return (
        <div className="space-y-32">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-white italic underline decoration-secondary/30 decoration-4 underline-offset-8">Active Polls</h2>
                    <p className="text-xs text-text-secondary mt-12 font-medium">Cast your vote to decide the class direction</p>
                </div>
                {isAdmin && <button className="btn-primary"><Plus size={18} /> Create Poll</button>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
                {polls.map((poll, index) => (
                    <PollCard key={poll.id} poll={poll} index={index} />
                ))}
            </div>
        </div>
    );
};

export default Polls;
