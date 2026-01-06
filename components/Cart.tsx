

import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { XIcon, TrashIcon, PlusIcon, MinusIcon, ShoppingCartIcon } from './icons';
import CheckoutModal from './CheckoutModal';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const subtotal = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleUpdateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const handleRemoveItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };
  
  const handleCheckout = () => {
      setIsCheckoutOpen(true);
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-card-light dark:bg-card-dark shadow-xl z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-border-light dark:border-border-dark">
            <h2 className="text-xl font-semibold text-text-light dark:text-text-dark">Shopping Cart</h2>
            <button onClick={onClose} className="p-2 rounded-full text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/10">
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {state.items.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
              <ShoppingCartIcon className="w-16 h-16 mb-4"/>
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {state.items.map(item => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                  <div className="flex-grow">
                    <p className="font-semibold text-text-light dark:text-text-dark">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">₹{item.price}</p>
                    <div className="flex items-center mt-2">
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="p-1 border rounded-md border-border-light dark:border-border-dark hover:bg-black/5 dark:hover:bg-white/10"><MinusIcon className="w-4 h-4"/></button>
                      <span className="px-3 font-semibold">{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="p-1 border rounded-md border-border-light dark:border-border-dark hover:bg-black/5 dark:hover:bg-white/10"><PlusIcon className="w-4 h-4"/></button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-text-light dark:text-text-dark">₹{item.price * item.quantity}</p>
                    <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 mt-2">
                      <TrashIcon className="w-5 h-5"/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {state.items.length > 0 && (
            <div className="p-4 border-t border-border-light dark:border-border-dark">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-text-light dark:text-text-dark">Subtotal:</span>
                <span className="text-xl font-bold text-text-light dark:text-text-dark">₹{subtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} onCheckoutSuccess={onClose} />
    </>
  );
};

export default Cart;