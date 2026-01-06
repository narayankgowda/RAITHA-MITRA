

import React, { useState, useMemo } from 'react';
import { useOrders } from '../hooks/useOrders';
import { XIcon, PackageIcon } from './icons';
import OrderItem from './OrderItem';
import { OrderStatus } from '../contexts/OrderContext';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ isOpen, onClose }) => {
  const { state } = useOrders();
  const { orders } = state;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const orderStatuses: (OrderStatus | 'All')[] = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (searchTerm && !order.id.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (statusFilter !== 'All' && order.status !== statusFilter) {
        return false;
      }
      const orderDate = new Date(order.date);
      if (startDate && orderDate < new Date(startDate)) {
        return false;
      }
      if (endDate) {
          const endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999);
          if (orderDate > endOfDay) {
            return false;
          }
      }
      return true;
    });
  }, [orders, searchTerm, statusFilter, startDate, endDate]);
  
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setStartDate('');
    setEndDate('');
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border-light dark:border-border-dark">
          <h2 className="text-xl font-semibold text-text-light dark:text-text-dark">My Orders</h2>
          <button onClick={onClose} className="p-2 rounded-full text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/10">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-4">
            <div className="p-4 mb-4 bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div>
                        <label htmlFor="order-search" className="block text-sm font-medium text-text-light dark:text-text-dark">Search by Order ID</label>
                        <input id="order-search" type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="e.g., ORD-..." className="mt-1 block w-full input-style" />
                    </div>
                    <div>
                        <label htmlFor="status-filter" className="block text-sm font-medium text-text-light dark:text-text-dark">Status</label>
                        <select id="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value as OrderStatus | 'All')} className="mt-1 block w-full input-style">
                            {orderStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                    </div>
                    <div className="lg:col-span-2 grid grid-cols-2 gap-2">
                         <div>
                            <label htmlFor="start-date" className="block text-sm font-medium text-text-light dark:text-text-dark">From</label>
                            <input id="start-date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full input-style" />
                        </div>
                        <div>
                            <label htmlFor="end-date" className="block text-sm font-medium text-text-light dark:text-text-dark">To</label>
                            <input id="end-date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full input-style" />
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <button onClick={handleResetFilters} className="text-sm font-semibold text-primary dark:text-primary-light hover:underline">
                        Reset Filters
                    </button>
                </div>
            </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                <PackageIcon className="w-16 h-16 mx-auto mb-4"/>
                <p className="text-lg">You have no past orders.</p>
                <p>Your orders will appear here once you make a purchase.</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                <p className="text-lg font-semibold">No Orders Found</p>
                <p>No orders match your current filter criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
                {filteredOrders.map(order => (
                    <OrderItem key={order.id} order={order} />
                ))}
            </div>
          )}
        </div>
      </div>
       <style>{`.input-style {padding: 0.5rem 0.75rem; background-color: var(--color-input-light); border: 1px solid var(--color-border-light); border-radius: 0.375rem; color: var(--color-text-light);} .dark .input-style {background-color: var(--color-input-dark); border-color: var(--color-border-dark); color: var(--color-text-dark);}`}</style>
    </div>
  );
};

export default OrderHistoryModal;