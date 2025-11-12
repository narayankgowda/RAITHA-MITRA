import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useOrders } from '../hooks/useOrders';
import { useNotifications } from '../hooks/useNotifications';
import { XIcon, CheckCircleIcon } from './icons';
import Spinner from './Spinner';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckoutSuccess: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onCheckoutSuccess }) => {
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { dispatch: orderDispatch } = useOrders();
  const { dispatch: notificationDispatch } = useNotifications();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = cartState.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      const newOrder = {
        id: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        items: cartState.items,
        total: subtotal,
        status: 'Pending' as const,
      };
      orderDispatch({ type: 'ADD_ORDER', payload: newOrder });
      
      setIsProcessing(false);
      setIsSuccess(true);
      
      notificationDispatch({ type: 'ADD_NOTIFICATION', payload: { message: 'Order placed successfully!', type: 'success' }});
      notificationDispatch({ type: 'ADD_NOTIFICATION', payload: { message: 'Email receipt sent.', type: 'info' }});
      notificationDispatch({ type: 'ADD_NOTIFICATION', payload: { message: 'SMS confirmation sent.', type: 'info' }});

      // After a delay, close the modal and clear cart
      setTimeout(() => {
        onCheckoutSuccess(); // This will close the cart panel
        onClose(); // This closes the checkout modal itself
        cartDispatch({ type: 'CLEAR_CART' });
        setIsSuccess(false); // Reset for next time
      }, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-border-light dark:border-border-dark">
          <h2 className="text-xl font-semibold">Checkout</h2>
          <button onClick={onClose} disabled={isProcessing} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">Order Placed!</h3>
            <p className="text-gray-600 dark:text-gray-400">Your order has been confirmed. Thank you for shopping with us!</p>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder}>
            <div className="p-6 space-y-4">
              <div>
                  <h3 className="font-semibold mb-2">Order Summary</h3>
                  <div className="text-sm space-y-1">
                      {cartState.items.map(item => (
                          <div key={item.id} className="flex justify-between">
                              <span>{item.name} x {item.quantity}</span>
                              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                      ))}
                  </div>
                   <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                      <span>Total</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                  </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
                <input type="text" id="name" required className="mt-1 block w-full input-style" defaultValue="Test Farmer" />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium">Shipping Address</label>
                <input type="text" id="address" required className="mt-1 block w-full input-style" defaultValue="123, Farm Lane, Agri Village" />
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border-t border-border-light dark:border-border-dark">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95 flex items-center justify-center disabled:bg-gray-400 disabled:shadow-none disabled:transform-none"
              >
                {isProcessing ? <Spinner /> : `Place Order (₹${subtotal.toFixed(2)})`}
              </button>
            </div>
          </form>
        )}
      </div>
      <style>{`.input-style {padding: 0.5rem 0.75rem; background-color: white; border: 1px solid #e2e8f0; border-radius: 0.375rem;} .dark .input-style {background-color: #334155; border-color: #475569;} .input-style:focus {outline: 2px solid transparent; outline-offset: 2px; --tw-ring-color: #22c55e; border-color: #22c55e;}`}</style>
    </div>
  );
};

export default CheckoutModal;