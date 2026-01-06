
import React, { useState } from 'react';
import { LifeBuoyIcon, SearchIcon, CheckCircleIcon, ClockIcon, UserCircleIcon, MessageSquareIcon } from './icons';
import { useNotifications } from '../hooks/useNotifications';

interface Ticket {
    id: string;
    subject: string;
    user: string;
    role: 'Farmer' | 'Buyer';
    priority: 'High' | 'Medium' | 'Low';
    status: 'Open' | 'Resolved' | 'Pending';
    date: string;
    message: string;
}

const mockTickets: Ticket[] = [
    { id: 'T-1023', subject: 'Payment not received for Order #ORD-992', user: 'Ramesh Gupta', role: 'Farmer', priority: 'High', status: 'Open', date: '2024-06-25', message: 'I shipped the tomatoes 2 days ago but the payment status is still pending.' },
    { id: 'T-1024', subject: 'Cannot update profile picture', user: 'Sunita Sharma', role: 'Farmer', priority: 'Low', status: 'Pending', date: '2024-06-24', message: 'Every time I try to upload a new photo, it gives an error.' },
    { id: 'T-1022', subject: 'Refund Request for damaged goods', user: 'Retail Buyer', role: 'Buyer', priority: 'Medium', status: 'Resolved', date: '2024-06-23', message: 'The shipment arrived with 20% spoilage.' },
    { id: 'T-1021', subject: 'Account verification issue', user: 'New User', role: 'Farmer', priority: 'High', status: 'Open', date: '2024-06-25', message: 'My KYC documents are pending approval for 3 days.' },
];

const AdminSupport: React.FC = () => {
    const { dispatch: notificationDispatch } = useNotifications();
    const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
    const [filter, setFilter] = useState('Open');
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    const filteredTickets = tickets.filter(t => filter === 'All' || (filter === 'Open' ? t.status !== 'Resolved' : t.status === filter));

    const handleStatusChange = (id: string, newStatus: Ticket['status']) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
        if (selectedTicket && selectedTicket.id === id) {
            setSelectedTicket(prev => prev ? { ...prev, status: newStatus } : null);
        }
        
        notificationDispatch({
            type: 'ADD_NOTIFICATION',
            payload: { message: `Ticket #${id} marked as ${newStatus}`, type: 'success' }
        });
    };

    const getPriorityColor = (p: string) => {
        switch(p) {
            case 'High': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
            case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
            case 'Low': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="animate-fadeIn h-[calc(100vh-140px)] flex flex-col">
            <div className="flex justify-between items-end mb-6 flex-shrink-0">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Helpdesk</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage support tickets and inquiries.</p>
                </div>
            </div>

            <div className="flex gap-6 h-full overflow-hidden">
                {/* Ticket List */}
                <div className="w-1/3 bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col gap-3">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"/>
                            <input 
                                type="text" 
                                placeholder="Search tickets..." 
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div className="flex gap-2">
                            {['Open', 'Resolved', 'All'].map(f => (
                                <button 
                                    key={f} 
                                    onClick={() => setFilter(f)}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${filter === f ? 'bg-primary text-white shadow-md' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto">
                        {filteredTickets.map(ticket => (
                            <div 
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket)}
                                className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${selectedTicket?.id === ticket.id ? 'bg-blue-50 dark:bg-slate-800 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                                    <span className="text-xs text-gray-400">{ticket.date}</span>
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1 mb-1">{ticket.subject}</h4>
                                <p className="text-xs text-gray-500 line-clamp-2">{ticket.message}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                        {ticket.user.charAt(0)}
                                    </div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{ticket.user}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ticket Details */}
                <div className="w-2/3 bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
                    {selectedTicket ? (
                        <>
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{selectedTicket.subject}</h2>
                                    <div className="flex gap-2">
                                        {selectedTicket.status !== 'Resolved' && (
                                            <button 
                                                onClick={() => handleStatusChange(selectedTicket.id, 'Resolved')}
                                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-sm"
                                            >
                                                <CheckCircleIcon className="w-4 h-4 mr-2"/> Mark Resolved
                                            </button>
                                        )}
                                        <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-500">
                                            <ClockIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                                        {selectedTicket.user.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{selectedTicket.user}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span className="bg-gray-200 dark:bg-slate-700 px-2 py-0.5 rounded">{selectedTicket.role}</span>
                                            <span>• ID: {selectedTicket.id}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-grow p-6 overflow-y-auto bg-gray-50/30 dark:bg-black/10">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0 flex items-center justify-center text-xs font-bold text-blue-600">
                                        {selectedTicket.user.charAt(0)}
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm max-w-[80%]">
                                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{selectedTicket.message}</p>
                                        <p className="text-[10px] text-gray-400 mt-2 text-right">{selectedTicket.date}</p>
                                    </div>
                                </div>
                                
                                {selectedTicket.status === 'Resolved' && (
                                    <div className="flex justify-center my-6">
                                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-1 rounded-full text-xs font-bold border border-green-200 dark:border-green-800">
                                            Ticket Resolved
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1e293b]">
                                <div className="relative">
                                    <textarea 
                                        disabled={selectedTicket.status === 'Resolved'}
                                        placeholder={selectedTicket.status === 'Resolved' ? "This ticket is closed." : "Type your reply..."}
                                        className="w-full p-4 pr-12 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none text-sm transition-all"
                                        rows={3}
                                    />
                                    <button 
                                        disabled={selectedTicket.status === 'Resolved'}
                                        className="absolute right-3 bottom-3 p-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <MessageSquareIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <LifeBuoyIcon className="w-20 h-20 mb-4 opacity-20"/>
                            <p className="font-medium">Select a ticket to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSupport;
