
import React, { useState, useMemo } from 'react';
import { useOrders } from '../hooks/useOrders';
import { OrderStatus } from '../contexts/OrderContext';
import { PackageIcon, SearchIcon, FilterIcon, ChevronDownIcon } from './icons';

const BuyerOrders: React.FC = () => {
  const { state } = useOrders();
  const { orders } = state;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const orderStatuses: (OrderStatus | 'All')[] = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (searchTerm && !order.id.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (statusFilter !== 'All' && order.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [orders, searchTerm, statusFilter]);

  const getStatusClasses = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'Delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const toggleExpand = (id: string) => {
      setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark">My Orders</h2>
                <p className="text-gray-600 dark:text-gray-400">Track and manage your purchases.</p>
            </div>
            <div className="flex gap-2 bg-card-light dark:bg-card-dark p-2 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"/>
                    <input 
                        type="text" 
                        placeholder="Search Order ID..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-transparent focus:outline-none text-sm w-40 md:w-64"
                    />
                </div>
                <div className="border-l border-gray-200 dark:border-gray-700 mx-2"></div>
                <div className="relative">
                    <FilterIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"/>
                    <select 
                        value={statusFilter} 
                        onChange={e => setStatusFilter(e.target.value as any)}
                        className="pl-9 pr-8 py-2 bg-transparent focus:outline-none text-sm appearance-none cursor-pointer"
                    >
                        {orderStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
            </div>
        </div>

        {orders.length === 0 ? (
            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PackageIcon className="w-10 h-10 text-gray-400"/>
                </div>
                <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                <p className="text-gray-500">Start shopping in the marketplace to see your orders here.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {filteredOrders.map(order => (
                    <div key={order.id} className="bg-card-light dark:bg-card-dark rounded-lg shadow-md border border-border-light dark:border-border-dark overflow-hidden transition-all duration-300 hover:shadow-lg">
                        <div 
                            className="p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                            onClick={() => toggleExpand(order.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-full text-primary">
                                    <PackageIcon className="w-6 h-6"/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-text-light dark:text-text-dark">Order #{order.id}</h4>
                                    <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()} • {order.items.length} Items</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="font-bold text-lg text-text-light dark:text-text-dark">₹{order.total.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusClasses(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${expandedOrderId === order.id ? 'rotate-180' : ''}`}/>
                                </div>
                            </div>
                        </div>

                        {expandedOrderId === order.id && (
                            <div className="border-t border-border-light dark:border-border-dark bg-gray-50 dark:bg-slate-800/50 p-6 animate-fadeIn">
                                <h5 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500">Order Items</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {order.items.map(item => (
                                        <div key={item.id} className="flex items-center gap-4 bg-card-light dark:bg-card-dark p-3 rounded-lg border border-border-light dark:border-border-dark">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover"/>
                                            <div className="flex-grow">
                                                <p className="font-semibold text-text-light dark:text-text-dark line-clamp-1">{item.name}</p>
                                                <p className="text-sm text-gray-500">{item.category}</p>
                                                <div className="flex justify-between mt-1">
                                                    <p className="text-xs font-medium">Qty: {item.quantity}</p>
                                                    <p className="text-sm font-bold text-primary">₹{(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 flex justify-end gap-3">
                                    <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                                        Request Support
                                    </button>
                                    <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
                                        Download Invoice
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};

export default BuyerOrders;
