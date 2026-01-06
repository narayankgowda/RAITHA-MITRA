
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { initialTransactionData, Transaction, ExpenseCategory, IncomeCategory } from '../data/expenseData';
import { 
    PlusIcon, XIcon, Edit2Icon, TrashIcon, 
    PieChartIcon, FileTextIcon, TrendingUpIcon, TrendingDownIcon, 
    UploadIcon, DownloadIcon, ActivityIcon, WalletIcon,
    SearchIcon, CalculatorIcon, SparklesIcon, CalendarIcon, ArrowRightIcon
} from './icons';
import { fileToBase64 } from '../utils/fileUtils';
import { getFinanceAdvice } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import Spinner from './Spinner';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const expenseCategories: ExpenseCategory[] = ['Seeds', 'Fertilizers', 'Labor', 'Machinery', 'Livestock Feed', 'Utilities', 'Other'];
const incomeCategories: IncomeCategory[] = ['Crop Sales', 'Dairy Sales', 'Machinery Rental', 'Govt Scheme', 'Scrap/By-product', 'Other'];

const categoryColors: Record<string, string> = {
    'Seeds': '#10b981', 'Fertilizers': '#f59e0b', 'Labor': '#3b82f6', 'Machinery': '#ef4444',
    'Livestock Feed': '#8b5cf6', 'Utilities': '#06b6d4', 'Other': '#64748b',
    'Crop Sales': '#059669', 'Dairy Sales': '#38bdf8', 'Machinery Rental': '#fbbf24',
    'Govt Scheme': '#c084fc', 'Scrap/By-product': '#71717a'
};

const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

const TransactionModal: React.FC<{
    isOpen: boolean; onClose: () => void; onSave: (transaction: Omit<Transaction, 'id'> | Transaction) => void; transactionToEdit: Transaction | null;
}> = ({ isOpen, onClose, onSave, transactionToEdit }) => {
    const [transaction, setTransaction] = useState<Omit<Transaction, 'id'>>({
        date: new Date().toISOString().split('T')[0], type: 'expense', category: 'Other', description: '', amount: 0, receiptUrl: ''
    });
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (transactionToEdit) setTransaction(transactionToEdit);
        else setTransaction({ date: new Date().toISOString().split('T')[0], type: 'expense', category: 'Other', description: '', amount: 0, receiptUrl: '' });
        setReceiptFile(null);
    }, [transactionToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let finalReceiptUrl = transaction.receiptUrl;
        if (receiptFile) {
            try {
                const { base64, mimeType } = await fileToBase64(receiptFile);
                finalReceiptUrl = `data:${mimeType};base64,${base64}`;
            } catch (err) { console.error(err); }
        }
        onSave({ ...transaction, receiptUrl: finalReceiptUrl });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] shadow-2xl w-full max-w-lg border border-white/10 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-white/5">
                    <h2 className="text-xl font-black tracking-tight">{transactionToEdit ? 'Adjust Entry' : 'New Transaction'}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5"><XIcon className="w-5 h-5" /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-2xl">
                        <button type="button" onClick={() => setTransaction(t=>({...t, type:'income', category:'Crop Sales'}))} className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${transaction.type === 'income' ? 'bg-white dark:bg-green-600 text-green-600 dark:text-white shadow-sm' : 'text-gray-400'}`}>INCOME</button>
                        <button type="button" onClick={() => setTransaction(t=>({...t, type:'expense', category:'Other'}))} className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${transaction.type === 'expense' ? 'bg-white dark:bg-red-600 text-red-600 dark:text-white shadow-sm' : 'text-gray-400'}`}>EXPENSE</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Date</label>
                            <input type="date" value={transaction.date} onChange={e => setTransaction({...transaction, date: e.target.value})} required className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Amount (₹)</label>
                            <input type="number" value={transaction.amount} onChange={e => setTransaction({...transaction, amount: parseFloat(e.target.value) || 0})} required className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary outline-none font-bold" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Category</label>
                        <select value={transaction.category} onChange={e => setTransaction({...transaction, category: e.target.value as any})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary outline-none">
                            {(transaction.type === 'income' ? incomeCategories : expenseCategories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    
                    <textarea value={transaction.description} onChange={e => setTransaction({...transaction, description: e.target.value})} placeholder="Notes/Description..." rows={2} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary outline-none resize-none" />

                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl text-xs font-bold text-gray-400 hover:border-primary hover:text-primary transition-all flex flex-col items-center gap-2">
                        <UploadIcon className="w-5 h-5"/>
                        {receiptFile ? receiptFile.name : "Attach Receipt/Invoice Snapshot"}
                        <input type="file" ref={fileInputRef} onChange={e => setReceiptFile(e.target.files?.[0] || null)} className="hidden" accept="image/*" />
                    </button>
                    
                    <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl hover:shadow-primary/30 active:scale-95 transition-all uppercase tracking-widest">Post Transaction</button>
                </form>
            </div>
        </div>
    );
};

const SimpleAreaChart = ({ data, color }: { data: number[], color: string }) => {
    const max = Math.max(...data, 1);
    const height = 60;
    const width = 200;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - (v / max) * height}`).join(' ');
    
    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16 opacity-50" preserveAspectRatio="none">
            <path d={`M0,${height} ${points} L${width},${height} Z`} fill={color} fillOpacity="0.1" />
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

const ExpenseTracker: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        try {
            const saved = localStorage.getItem('farm_transactions');
            return saved ? JSON.parse(saved) : initialTransactionData;
        } catch { return initialTransactionData; }
    });

    const isOnline = useNetworkStatus();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => { localStorage.setItem('farm_transactions', JSON.stringify(transactions)); }, [transactions]);

    const summary = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const cats = expenseCategories.reduce((acc, c) => {
            acc[c] = transactions.filter(t => t.type === 'expense' && t.category === c).reduce((s, t) => s + t.amount, 0);
            return acc;
        }, {} as Record<string, number>);
        
        // Mock trend data
        const trend = [3000, 4500, 2800, 5200, 4800, income/10];
        
        return { income, expense, balance: income - expense, cats, trend };
    }, [transactions]);

    const handleSave = (data: any) => {
        if (data.id) setTransactions(prev => prev.map(t => t.id === data.id ? data : t));
        else setTransactions(prev => [{ ...data, id: `T${Date.now()}` }, ...prev]);
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    const requestAiStrategy = async () => {
        if (!isOnline) return;
        setIsGenerating(true);
        try {
            const advice = await getFinanceAdvice(transactions.slice(0, 10), summary.income, summary.expense);
            setAiInsight(advice);
        } catch { setAiInsight("Advice currently unavailable. Please check your data connectivity."); }
        finally { setIsGenerating(false); }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn pb-24 p-4 md:p-6">
            
            {/* 1. Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Smart Ledger</h2>
                    <p className="text-gray-500 font-medium italic mt-1">Holistic view of your farm's economic health.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }} className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        <PlusIcon className="w-5 h-5 mr-2" /> Log Activity
                    </button>
                    <button onClick={() => window.print()} className="p-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm text-gray-400 hover:text-primary transition-colors">
                        <DownloadIcon className="w-6 h-6"/>
                    </button>
                </div>
            </div>

            {/* 2. Vital Metrics Bento */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Main Balance Card */}
                <div className="md:col-span-4 bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                        <WalletIcon className="w-32 h-32"/>
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Net Seasonal Liquidity</p>
                        <h3 className="text-5xl font-black tracking-tighter mb-8">{formatCurrency(summary.balance)}</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Cash In</p>
                                <p className="text-lg font-bold text-green-400">+{formatCurrency(summary.income)}</p>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Cash Out</p>
                                <p className="text-lg font-bold text-red-400">-{formatCurrency(summary.expense)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Growth Chart Bento */}
                <div className="md:col-span-5 bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Revenue Trend</p>
                            <h4 className="text-2xl font-black text-gray-900 dark:text-white">Active Growth</h4>
                        </div>
                        <span className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-black rounded-lg">+14.2%</span>
                    </div>
                    <div className="mt-8">
                        <SimpleAreaChart data={summary.trend} color="#16a34a" />
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-black text-gray-400 uppercase">
                        <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
                    </div>
                </div>

                {/* AI Finance Assistant */}
                <div className="md:col-span-3 bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 h-full flex flex-col">
                        <h4 className="text-xl font-black flex items-center mb-3">
                            <SparklesIcon className="w-5 h-5 mr-2 text-yellow-300"/> Wealth Advisor
                        </h4>
                        {isGenerating ? (
                            <div className="flex-grow flex flex-col items-center justify-center">
                                <Spinner className="w-8 h-8 text-white mb-2"/>
                                <span className="text-[10px] font-black uppercase opacity-60">Auditing Books...</span>
                            </div>
                        ) : aiInsight ? (
                            <div className="flex-grow text-xs text-indigo-100 leading-relaxed overflow-y-auto no-scrollbar">
                                <MarkdownRenderer content={aiInsight} />
                            </div>
                        ) : (
                            <div className="flex-grow flex flex-col">
                                <p className="text-sm opacity-90 leading-snug mb-4">I can analyze your spending to find tax breaks and subsidy opportunities.</p>
                                <button onClick={requestAiStrategy} className="mt-auto w-full py-3 bg-white text-indigo-600 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all">Audit My Finances</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. Operational Analysis & Ledger */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Ledger Table */}
                <div className="lg:col-span-8 bg-white dark:bg-[#1e293b] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-50 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                        <h3 className="text-xl font-black tracking-tight flex items-center">
                            <ActivityIcon className="w-5 h-5 mr-3 text-primary"/> Journal Entries
                        </h3>
                        <div className="relative group">
                            <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary w-48 transition-all" />
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-50 dark:border-white/5">
                                <tr>
                                    <th className="px-8 py-5">Transaction Details</th>
                                    <th className="px-8 py-5">Classification</th>
                                    <th className="px-8 py-5 text-right">Value</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                {transactions.map(trx => (
                                    <tr key={trx.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-2xl ${trx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    {trx.type === 'income' ? <TrendingUpIcon className="w-5 h-5"/> : <TrendingDownIcon className="w-5 h-5"/>}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{trx.description}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <CalendarIcon className="w-3 h-3 text-gray-400"/>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{new Date(trx.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10">
                                                {trx.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className={`text-xl font-black ${trx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                {trx.type === 'income' ? '+' : '-'}{formatCurrency(trx.amount)}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => {setEditingTransaction(trx); setIsModalOpen(true);}} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"><Edit2Icon className="w-4 h-4"/></button>
                                                <button onClick={() => setTransactions(t => t.filter(x=>x.id!==trx.id))} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><TrashIcon className="w-4 h-4"/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Breakdown */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#0f172a] p-8 rounded-[2.5rem] text-white shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black">Capital Flow</h3>
                            <PieChartIcon className="w-6 h-6 text-primary opacity-50"/>
                        </div>
                        <div className="space-y-6">
                            {(Object.entries(summary.cats) as [string, number][]).filter(e => e[1] > 0).map(([cat, val]) => (
                                <div key={cat} className="group">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 group-hover:text-white transition-colors">
                                        <span>{cat}</span>
                                        <span>{((val / (summary.expense || 1)) * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full transition-all duration-1000 ease-out" 
                                            style={{ 
                                                width: `${(val / (summary.expense || 1)) * 100}%`,
                                                backgroundColor: categoryColors[cat] || '#fff'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Gross Outflow</span>
                            <span className="text-2xl font-black">{formatCurrency(summary.expense)}</span>
                        </div>
                    </div>

                    {/* Planning Card */}
                    <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6 text-primary shadow-inner">
                            <CalculatorIcon className="w-8 h-8" />
                        </div>
                        <h4 className="text-xl font-black mb-2">Subsidy Tracker</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">You've logged ₹14k in fertilizer costs. You may be eligible for the PM-KISAN rebate on these purchases.</p>
                        <button className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 group">
                            Explore Schemes <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                        </button>
                    </div>
                </div>
            </div>

            <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} transactionToEdit={editingTransaction} />
        </div>
    );
};

export default ExpenseTracker;
