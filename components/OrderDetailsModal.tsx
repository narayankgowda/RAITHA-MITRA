import React from 'react';
import { AdminOrder } from '../data/allOrdersData';
import { XIcon } from './icons';

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: AdminOrder | null;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

    const getStatusClasses = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            case 'Shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-border-light dark:border-border-dark">
                    <h2 className="text-xl font-semibold text-text-light dark:text-text-dark">Order Details</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/10"><XIcon className="w-6 h-6" /></button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div><strong>Order ID:</strong> <span className="font-mono">{order.id}</span></div>
                        <div><strong>Customer:</strong> {order.customerName}</div>
                        <div><strong>Date:</strong> {new Date(order.date).toLocaleString()}</div>
                        <div><strong>Total:</strong> <span className="font-bold">₹{order.total.toFixed(2)}</span></div>
                        <div className="col-span-2">
                            <strong>Status:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(order.status)}`}>{order.status}</span>
                        </div>
                    </div>

                    <h3 className="font-semibold text-lg mb-2 mt-6 text-text-light dark:text-text-dark border-t border-border-light dark:border-border-dark pt-4">Items Ordered</h3>
                    <div className="space-y-3">
                        {order.items.map(item => (
                            <div key={item.id} className="flex items-center space-x-4 p-2 bg-background-light dark:bg-background-dark rounded-md">
                                <div className="flex-grow">
                                    <p className="font-semibold text-text-light dark:text-text-dark">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.quantity} x ₹{item.price.toFixed(2)}</p>
                                </div>
                                <p className="font-medium text-text-light dark:text-text-dark">₹{(item.quantity * item.price).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
