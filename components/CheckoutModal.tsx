

import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useOrders } from '../hooks/useOrders';
import { useNotifications } from '../hooks/useNotifications';
import { XIcon, CheckCircleIcon, CreditCardIcon, DollarSignIcon, PackageIcon } from './icons';
import Spinner from './Spinner';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckoutSuccess: () => void;
}

type PaymentMethod = 'card' | 'upi' | 'cod';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onCheckoutSuccess }) => {
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { dispatch: orderDispatch } = useOrders();
  const { dispatch: notificationDispatch } = useNotifications();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [contactInfo, setContactInfo] = useState({ name: 'Test Farmer', address: '123, Farm Lane, Agri Village', email: 'farmer@example.com', phone: '9876543210' });

  const subtotal = cartState.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setContactInfo({...contactInfo, [e.target.name]: e.target.value });
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

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
      notificationDispatch({ type: 'ADD_NOTIFICATION', payload: { message: `Email receipt sent to ${contactInfo.email}`, type: 'info' }});
      notificationDispatch({ type: 'ADD_NOTIFICATION', payload: { message: `SMS confirmation sent to ${contactInfo.phone}`, type: 'info' }});

      setTimeout(() => {
        onCheckoutSuccess();
        onClose();
        cartDispatch({ type: 'CLEAR_CART' });
        setIsSuccess(false);
      }, 2000);
    }, 1500);
  };

  const PaymentMethodButton: React.FC<{method: PaymentMethod, icon: React.ReactNode, label: string}> = ({ method, icon, label }) => (
      <button type="button" onClick={() => setPaymentMethod(method)} className={`flex-1 p-3 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${paymentMethod === method ? 'bg-primary/10 border-primary text-primary' : 'border-border-light dark:border-border-dark hover:bg-black/5 dark:hover:bg-white/5'}`}>
          {icon}
          <span className="font-semibold">{label}</span>
      </button>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border-light dark:border-border-dark">
          <h2 className="text-xl font-semibold text-text-light dark:text-text-dark">Checkout</h2>
          <button onClick={onClose} disabled={isProcessing} className="p-2 rounded-full text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/10">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">Order Placed!</h3>
            <p className="text-gray-600 dark:text-gray-400">Your order has been confirmed. Thank you!</p>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="flex-grow overflow-y-auto">
            <div className="p-6 space-y-4">
              
              <div className="border-b border-border-light dark:border-border-dark pb-4">
                  <h3 className="font-semibold mb-2 text-text-light dark:text-text-dark">Order Summary</h3>
                   <div className="flex justify-between font-bold text-lg text-text-light dark:text-text-dark">
                      <span>Total</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                  </div>
              </div>
            
              <div>
                <h3 className="font-semibold mb-2 text-text-light dark:text-text-dark">Shipping & Contact</h3>
                <div className="space-y-2">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-light dark:text-text-dark">Full Name</label>
                        <input type="text" id="name" name="name" value={contactInfo.name} onChange={handleInputChange} required className="mt-1 block w-full input-style"/>
                    </div>
                     <div>
                        <label htmlFor="address" className="block text-sm font-medium text-text-light dark:text-text-dark">Shipping Address</label>
                        <input type="text" id="address" name="address" value={contactInfo.address} onChange={handleInputChange} required className="mt-1 block w-full input-style"/>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-light dark:text-text-dark">Email</label>
                            <input type="email" id="email" name="email" value={contactInfo.email} onChange={handleInputChange} required className="mt-1 block w-full input-style"/>
                        </div>
                         <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-text-light dark:text-text-dark">Phone</label>
                            <input type="tel" id="phone" name="phone" value={contactInfo.phone} onChange={handleInputChange} required className="mt-1 block w-full input-style"/>
                        </div>
                    </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-text-light dark:text-text-dark">Payment Details</h3>
                <div className="flex space-x-2 mb-4">
                    <PaymentMethodButton method="card" icon={<CreditCardIcon className="w-5 h-5"/>} label="Card" />
                    <PaymentMethodButton method="upi" icon={<DollarSignIcon className="w-5 h-5"/>} label="UPI" />
                    <PaymentMethodButton method="cod" icon={<PackageIcon className="w-5 h-5"/>} label="COD" />
                </div>
                {paymentMethod === 'card' && (
                    <div className="space-y-2">
                        <div>
                             <label className="block text-sm font-medium text-text-light dark:text-text-dark">Card Number</label>
                             <input type="text" placeholder="•••• •••• •••• ••••" required className="mt-1 block w-full input-style"/>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-text-light dark:text-text-dark">Expiry</label>
                                <input type="text" placeholder="MM / YY" required className="mt-1 block w-full input-style"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-light dark:text-text-dark">CVC</label>
                                <input type="text" placeholder="•••" required className="mt-1 block w-full input-style"/>
                            </div>
                        </div>
                    </div>
                )}
                 {paymentMethod === 'upi' && (
                    <div>
                         <label className="block text-sm font-medium text-text-light dark:text-text-dark">UPI ID</label>
                         <input type="text" placeholder="yourname@bank" required className="mt-1 block w-full input-style"/>
                    </div>
                )}
                 {paymentMethod === 'cod' && (
                    <div className="p-3 text-center bg-background-light dark:bg-background-dark rounded-md">
                        <p className="text-sm font-medium text-text-light dark:text-text-dark">You will pay in cash upon delivery.</p>
                    </div>
                )}
              </div>
            </div>
            <div className="p-4 bg-background-light dark:bg-slate-900/50 border-t border-border-light dark:border-border-dark sticky bottom-0">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300 flex items-center justify-center disabled:bg-gray-400"
              >
                {isProcessing ? <Spinner /> : `Place Order (₹${subtotal.toFixed(2)})`}
              </button>
            </div>
          </form>
        )}
      </div>
      <style>{`.input-style {padding: 0.5rem 0.75rem; background-color: var(--color-input-light); border: 1px solid var(--color-border-light); border-radius: 0.375rem; color: var(--color-text-light);} .dark .input-style {background-color: var(--color-input-dark); border-color: var(--color-border-dark); color: var(--color-text-dark);} .input-style:focus {outline: 2px solid transparent; outline-offset: 2px; --tw-ring-color: #16a34a; border-color: #16a34a;}`}</style>
    </div>
  );
};

export default CheckoutModal;