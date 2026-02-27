import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Filter, Download, Plus, X, Send, Edit2, Trash2, Search, Calendar as CalendarIcon } from 'lucide-react';
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
    const [isEditing, setIsEditing] = useState(false);
    const [currentTx, setCurrentTx] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [newTx, setNewTx] = useState({ description: '', amount: '', type: 'expense', transaction_date: new Date().toISOString().split('T')[0] });
    const [filterText, setFilterText] = useState('');
    const [filterType, setFilterType] = useState('all');

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

    const handleOpenCreate = () => {
        setIsEditing(false);
        setNewTx({ description: '', amount: '', type: 'expense', transaction_date: new Date().toISOString().split('T')[0] });
        setShowModal(true);
    };

    const handleOpenEdit = (tx) => {
        setIsEditing(true);
        setCurrentTx(tx);
        setNewTx({
            description: tx.description,
            amount: tx.amount,
            type: tx.type,
            transaction_date: new Date(tx.transaction_date).toISOString().split('T')[0]
        });
        setShowModal(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (isEditing) {
                await api.put(`/funds/${currentTx.id}`, newTx);
            } else {
                const user = JSON.parse(localStorage.getItem('user'));
                await api.post('/funds', { ...newTx, created_by: user.id });
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error('Failed to save transaction:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this transaction record? This cannot be undone.')) return;
        try {
            await api.delete(`/funds/${id}`);
            fetchData();
        } catch (err) {
            console.error('Failed to delete transaction:', err);
        }
    };

    const handleExportCSV = () => {
        if (transactions.length === 0) return;

        const headers = ['Description', 'Date', 'Type', 'Amount'];
        const rows = transactions.map(tx => [
            tx.description,
            tx.transaction_date,
            tx.type,
            tx.amount
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(e => e.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `financial_report_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.description.toLowerCase().includes(filterText.toLowerCase());
        const matchesType = filterType === 'all' || tx.type === filterType;
        return matchesSearch && matchesType;
    });

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
        <div className="space-y-24 sm:space-y-32">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16 lg:gap-24">
                <SummaryCard label="Available Balance" value={formatCurrency(summary.total_balance)} trend="+15%" isPositive={true} color="text-primary bg-primary/10" />
                <SummaryCard label="Monthly Income" value={formatCurrency(summary.monthly_income)} trend="+8%" isPositive={true} color="text-secondary bg-secondary/10" />
                <SummaryCard label="Monthly Expense" value={formatCurrency(summary.monthly_expense)} trend="-12%" isPositive={false} color="text-danger bg-danger/10" />
            </div>

            <div className="card-base p-0 overflow-hidden border-none shadow-soft">
                <div className="p-16 border-b border-white/5 bg-card/50">
                    <div className="flex justify-between items-center mb-16">
                        <div>
                            <h3 className="text-sm font-black tracking-tight text-white uppercase italic">Financial Ledger</h3>
                            <p className="text-[8px] font-black uppercase tracking-widest text-text-secondary">Audit-ready intelligence</p>
                        </div>
                        <div className="flex gap-8">
                            {isAdmin && (
                                <button
                                    onClick={handleOpenCreate}
                                    className="w-32 h-32 bg-primary rounded-lg text-white hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-primary/20"
                                >
                                    <Plus size={18} />
                                </button>
                            )}
                            <button
                                onClick={handleExportCSV}
                                className="w-32 h-32 bg-white/5 border border-white/10 rounded-lg text-text-secondary hover:text-white transition-all flex items-center justify-center"
                                title="Export CSV"
                            >
                                <Download size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-text-secondary" size={12} />
                            <input
                                type="text"
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                                placeholder="Search records..."
                                className="input-base w-full pl-32 py-0 h-32 text-[10px] font-medium bg-white/5 border-white/5"
                            />
                        </div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="input-base py-0 px-8 text-[10px] font-bold h-32 bg-white/5 border-white/5 cursor-pointer min-w-[100px]"
                        >
                            <option value="all">Global</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-hidden">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead>
                            <tr className="bg-white/2 text-text-secondary font-black uppercase tracking-widest text-[8px] sm:text-[10px]">
                                <th className="px-16 sm:px-32 py-10 sm:py-16 w-[55%] sm:w-auto">Description</th>
                                <th className="px-4 sm:px-32 py-10 sm:py-16 text-center w-[20%] sm:w-auto">Date</th>
                                <th className="px-8 sm:px-32 py-10 sm:py-16 text-right w-[25%] sm:w-auto">Magnitude</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="3" className="px-16 py-16 h-12 bg-white/5" />
                                    </tr>
                                ))
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-32 py-64 text-center">
                                        <p className="text-text-secondary italic text-[9px] font-medium uppercase tracking-widest">No matching records</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/3 transition-all group active:bg-white/5">
                                        <td className="px-16 sm:px-32 py-12 sm:py-20">
                                            <div className="flex flex-col pr-12">
                                                <span className="font-bold text-white tracking-tight text-[10px] sm:text-base break-words leading-tight">{tx.description}</span>
                                                <span className="hidden sm:block text-[8px] font-black uppercase tracking-widest text-text-secondary mt-1 opacity-50"># {tx.id.toString().padStart(4, '0')}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-32 py-12 sm:py-20 text-center text-[9px] sm:text-xs text-text-secondary font-medium whitespace-nowrap">
                                            {new Date(tx.transaction_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                        </td>
                                        <td className={`px-8 sm:px-32 py-12 sm:py-20 text-right font-black text-[11px] sm:text-base ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                                            <div className="flex items-center justify-end gap-2 sm:gap-12 group/amount relative">
                                                <span className="hidden sm:inline opacity-30 group-hover:opacity-100 transition-opacity">
                                                    {tx.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                                </span>
                                                <span>{tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount).replace('₹', '')}</span>

                                                {/* Admin Actions (Stacked on mobile) */}
                                                {isAdmin && (
                                                    <div className="flex flex-col sm:flex-row ml-6 sm:ml-12 gap-2 sm:gap-8 items-center">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(tx.id); }}
                                                            className="p-3 text-danger hover:text-white sm:opacity-0 group-hover:opacity-100 transition-all bg-danger/5 sm:bg-transparent rounded-md"
                                                        >
                                                            <Trash2 size={11} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleOpenEdit(tx); }}
                                                            className="p-3 text-secondary hover:text-white sm:opacity-0 group-hover:opacity-100 transition-all bg-white/5 sm:bg-transparent rounded-md"
                                                        >
                                                            <Edit2 size={11} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
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
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000]"
                        />
                        <div className="fixed inset-0 flex items-center justify-center z-[1001] p-16 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="w-full max-w-xl pointer-events-auto"
                            >
                                <div className="card-base border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-[#0a0a0c]/98 backdrop-blur-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary z-10" />

                                    <div className="p-24 pb-0">
                                        <div className="flex justify-between items-center mb-24">
                                            <div>
                                                <h2 className="text-xl font-black italic uppercase tracking-tight text-white">{isEditing ? 'Modify Record' : 'Record Transaction'}</h2>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Class Financial Management</p>
                                            </div>
                                            <button onClick={() => setShowModal(false)} className="p-8 hover:bg-white/5 rounded-full text-text-secondary hover:text-white transition-all">
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-24 pt-0 overflow-y-auto custom-scrollbar">
                                        <form onSubmit={handleFormSubmit} className="space-y-24 pb-8">
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
                                                {submitting ? (isEditing ? 'Updating...' : 'Recording...') : <>{isEditing ? 'UPDATE RECORD' : 'RECORD TRANSACTION'} <Send size={16} /></>}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Funds;
