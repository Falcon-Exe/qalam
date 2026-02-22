import React from 'react';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Filter, Download, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

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
    const transactions = [
        { id: 1, desc: 'Class Picnic Fund', type: 'credit', amount: 5000, date: '2026-02-21' },
        { id: 2, desc: 'Stationery Purchase', type: 'debit', amount: 850, date: '2026-02-20' },
        { id: 3, desc: 'Project Donation', type: 'credit', amount: 1500, date: '2026-02-18' },
    ];

    return (
        <div className="space-y-32">
            <div className="flex flex-wrap gap-24">
                <SummaryCard label="Available Balance" value="₹12,450" trend="+15%" isPositive={true} color="text-primary bg-primary/10" />
                <SummaryCard label="Monthly Income" value="₹8,200" trend="+8%" isPositive={true} color="text-secondary bg-secondary/10" />
                <SummaryCard label="Monthly Expense" value="₹3,400" trend="-12%" isPositive={false} color="text-danger bg-danger/10" />
            </div>

            <div className="card-base p-0 overflow-hidden border-none shadow-soft">
                <div className="p-24 border-b border-white/5 flex justify-between items-center bg-card">
                    <h3 className="text-lg font-black tracking-tight">Financial Records</h3>
                    <div className="flex items-center gap-12">
                        <button className="p-12 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-text-secondary"><Filter size={18} /></button>
                        <button className="btn-primary py-8 px-16 text-xs shadow-soft"><Download size={16} /> Export CSV</button>
                        {isAdmin && <button className="p-8 bg-primary rounded-xl text-white hover:scale-105 transition-all"><Plus size={24} /></button>}
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
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/3 transition-all">
                                    <td className="px-32 py-20 font-bold">{tx.desc}</td>
                                    <td className="px-32 py-20 text-center text-xs text-text-secondary font-medium">{tx.date}</td>
                                    <td className={`px-32 py-20 text-right font-black ${tx.type === 'credit' ? 'text-success' : 'text-danger'}`}>
                                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Funds;
