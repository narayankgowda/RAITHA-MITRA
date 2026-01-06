

import React, { useState } from 'react';
import { Order, OrderStatus } from '../contexts/OrderContext';
import { ChevronDownIcon } from './icons';

interface OrderItemProps {
  order: Order;
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <div className="border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="font-mono text-sm text-gray-600 dark:text-gray-400">#{order.id}</div>
            <div className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</div>
        </div>
        <div className="flex items-center space-x-4">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(order.status)}`}>
            {order.status}
          </span>
          <span className="font-bold text-text-light dark:text-text-dark">₹{order.total.toFixed(2)}</span>
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
          <h4 className="font-semibold mb-2 text-text-light dark:text-text-dark">Items in this order:</h4>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                <div className="flex-grow">
                  <p className="font-semibold text-text-light dark:text-text-dark">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} x ₹{item.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-medium text-text-light dark:text-text-dark">₹{(item.quantity * item.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderItem;