
import React, { useState } from 'react';
import { allOrdersData, AdminOrder } from '../data/allOrdersData';
import OrderDetailsModal from './OrderDetailsModal';
import { SearchIcon, PackageIcon, EyeIcon } from './icons';

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<AdminOrder[]>(allOrdersData);
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleViewDetails = (order: AdminOrder) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const getStatusClasses = (status: string) => {
        switch (status) {
          case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800';
          case 'Shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
          case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800';
          case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800';
          default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border border-gray-200';
        }
    };

    const filteredOrders = orders.filter(o => 
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-fadeIn space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Order Management</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Track fulfillment and manage customer orders.</p>
                </div>
            </div>

            {/* Filter */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by Order ID or Customer Name..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-gray-50 dark:bg-slate-800/50 text-gray-500 font-bold border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4">Order Details</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4 text-right">Total</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                <PackageIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-mono font-bold text-gray-900 dark:text-white text-xs">{order.id}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{new Date(order.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">
                                        {order.customerName}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-bold text-gray-900 dark:text-white">₹{order.total.toFixed(2)}</span>
                                        <p className="text-xs text-gray-500">{order.items.length} items</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusClasses(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => handleViewDetails(order)} 
                                            className="inline-flex items-center px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-primary hover:text-white dark:hover:bg-primary transition-all shadow-sm group-hover:shadow-md"
                                        >
                                            <EyeIcon className="w-3.5 h-3.5 mr-1.5" />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <OrderDetailsModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                order={selectedOrder}
            />
        </div>
    );
};

export default OrderManagement;
