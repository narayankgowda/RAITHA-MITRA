import React from 'react';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { XIcon, HeartIcon, TrashIcon, ShoppingCartIcon } from './icons';
import { Product } from '../data/products';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch: wishlistDispatch } = useWishlist();
  const { dispatch: cartDispatch } = useCart();
  const { items } = state;

  const handleRemove = (id: number) => {
    wishlistDispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };
  
  const handleAddToCart = (product: Product) => {
    cartDispatch({ type: 'ADD_ITEM', payload: product });
    // Optional: remove from wishlist after adding to cart
    handleRemove(product.id); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border-light dark:border-border-dark">
          <h2 className="text-xl font-semibold">My Wishlist</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                <HeartIcon className="w-16 h-16 mx-auto mb-4"/>
                <p className="text-lg">Your wishlist is empty.</p>
                <p>Add items you love to your wishlist to see them here.</p>
            </div>
          ) : (
            <div className="space-y-4">
                {items.map(item => (
                    <div key={item.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/50">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                        <div className="flex-grow">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-lg font-bold text-primary dark:text-primary-light">₹{item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                           <button onClick={() => handleAddToCart(item)} className="p-2 bg-primary-light text-white rounded-full hover:bg-primary transition-colors" title="Add to Cart">
                               <ShoppingCartIcon className="w-5 h-5"/>
                           </button>
                           <button onClick={() => handleRemove(item.id)} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900" title="Remove from Wishlist">
                               <TrashIcon className="w-5 h-5"/>
                           </button>
                        </div>
                    </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistModal;