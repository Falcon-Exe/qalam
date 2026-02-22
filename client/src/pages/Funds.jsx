import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Filter, Download, Plus, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const SummaryCard = ({ label, value, trend, isPositive, color }) => (
    <div className="card-base card-hover flex-1 min-w-[200px]">
        <div className="flex justify-between items-start mb-16">
            <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">{label}</p>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 border-white/5 ${color}`}>
                <Wallet size={14} />
            </div>
        </div>
        <div className="flex items-end justify-between">
            <h3 className="text-2xl font-black">{value}</h3>
            <div className={`flex items-center gap-1 text-[10px] font-bold ${isPositive ? 'text-success' : 'text-danger'}`}>
                {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {trend}
            </div>
        </div>
    </div>
);

const Funds = ({ isAdmin = true }) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ total_balance: 0, monthly_income: 0, monthly_expense: 0 });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newTx, setNewTx] = useState({ description: '', amount: '', type: 'expense', transaction_date: new Date().toISOString().split('T')[0] });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await api.get('/funds');
            setTransactions(data.transactions);
            setSummary(data.summary);
        } catch (err) {
            console.error('Failed to fetch funds data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await api.post('/funds', { ...newTx, created_by: user.id });
            setShowModal(false);
            setNewTx({ description: '', amount: '', type: 'expense', transaction_date: new Date().toISOString().split('T')[0] });
            fetchData();
        } catch (err) {
            console.error('Failed to record transaction:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-32">
            <div className="flex flex-wrap gap-24">
                <SummaryCard label="Available Balance" value={formatCurrency(summary.total_balance)} trend="+15%" isPositive={true} color="text-primary bg-primary/10" />
                <SummaryCard label="Monthly Income" value={formatCurrency(summary.monthly_income)} trend="+8%" isPositive={true} color="text-secondary bg-secondary/10" />
                <SummaryCard label="Monthly Expense" value={formatCurrency(summary.monthly_expense)} trend="-12%" isPositive={false} color="text-danger bg-danger/10" />
            </div>

            <div className="card-base p-0 overflow-hidden border-none shadow-soft">
                <div className="p-24 border-b border-white/5 flex justify-between items-center bg-card">
                    <h3 className="text-lg font-black tracking-tight text-white">Financial Records</h3>
                    <div className="flex items-center gap-12">
                        <button className="p-12 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-text-secondary"><Filter size={18} /></button>
                        <button className="btn-primary py-8 px-16 text-xs shadow-soft"><Download size={16} /> Export CSV</button>
                        {isAdmin && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="p-8 bg-primary rounded-xl text-white hover:scale-105 transition-all"
                            >
                                <Plus size={24} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/3 text-text-secondary text-[10px] uppercase font-black tracking-[0.2em]">
                                <th className="px-32 py-16">Description</th>
                                <th className="px-32 py-16 text-center">Date</th>
                                <th className="px-32 py-16 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="3" className="px-32 py-20 h-16 bg-white/5" />
                                    </tr>
                                ))
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-32 py-40 text-center text-text-secondary italic">No transactions recorded yet</td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/3 transition-all">
                                        <td className="px-32 py-20 font-bold text-white">{tx.description}</td>
                                        <td className="px-32 py-20 text-center text-xs text-text-secondary font-medium">{formatDate(tx.transaction_date)}</td>
                                        <td className={`px-32 py-20 text-right font-black ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
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
                                        <h2 className="text-xl font-black italic uppercase tracking-tight text-white">Record Transaction</h2>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Class Financial Management</p>
                                    </div>
                                    <button onClick={() => setShowModal(false)} className="p-8 hover:bg-white/5 rounded-full text-text-secondary hover:text-white transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleCreate} className="space-y-24">
                                    <div className="space-y-8">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Description</label>
                                        <input
                                            required
                                            type="text"
                                            value={newTx.description}
                                            onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                                            placeholder="e.g. Picnic Collection"
                                            className="input-base w-full"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-16">
                                        <div className="space-y-8">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Amount (₹)</label>
                                            <input
                                                required
                                                type="number"
                                                value={newTx.amount}
                                                onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                                                placeholder="0.00"
                                                className="input-base w-full"
                                            />
                                        </div>
                                        <div className="space-y-8">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Type</label>
                                            <select
                                                required
                                                value={newTx.type}
                                                onChange={(e) => setNewTx({ ...newTx, type: e.target.value })}
                                                className="input-base w-full bg-card"
                                            >
                                                <option value="income">Income</option>
                                                <option value="expense">Expense</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Date</label>
                                        <input
                                            required
                                            type="date"
                                            value={newTx.transaction_date}
                                            onChange={(e) => setNewTx({ ...newTx, transaction_date: e.target.value })}
                                            className="input-base w-full bg-card"
                                        />
                                    </div>

                                    <button
                                        disabled={submitting}
                                        type="submit"
                                        className="btn-primary w-full py-14 italic font-black uppercase tracking-tight shadow-lg shadow-primary/20 flex items-center justify-center gap-12"
                                    >
                                        {submitting ? 'Recording...' : <>RECORD TRANSACTION <Send size={16} /></>}
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

export default Funds;
