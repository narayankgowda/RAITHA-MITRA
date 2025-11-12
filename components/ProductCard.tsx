import React from 'react';
import { Product } from '../data/products';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { ShoppingCartIcon, HeartIcon } from './icons';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { dispatch: cartDispatch } = useCart();
    const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();

    const isInWishlist = wishlistState.items.some(item => item.id === product.id);

    const handleAddToCart = () => {
        cartDispatch({ type: 'ADD_ITEM', payload: product });
    };

    const handleToggleWishlist = () => {
        if (isInWishlist) {
            wishlistDispatch({ type: 'REMOVE_ITEM', payload: { id: product.id } });
        } else {
            wishlistDispatch({ type: 'ADD_ITEM', payload: product });
        }
    };

    const renderStars = () => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={i <= product.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
            );
        }
        return stars;
    };


  return (
    <div className="bg-background-light dark:bg-slate-800/50 rounded-lg shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 relative">
      <div className="absolute top-2 right-2 z-10">
          <button 
            onClick={handleToggleWishlist}
            className="p-2 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900"
            aria-label="Toggle Wishlist"
          >
              <HeartIcon className={`w-5 h-5 transition-colors ${isInWishlist ? 'text-red-500 fill-current' : 'text-slate-600 dark:text-slate-300'}`} />
          </button>
      </div>
      <div className="h-48 overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2 truncate">{product.name}</h3>
        <div className="flex items-center mb-2">
            <div className="flex text-sm">{renderStars()}</div>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({product.reviews} reviews)</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 h-10 overflow-hidden">{product.description}</p>
        <div className="mt-auto flex justify-between items-center">
          <p className="text-xl font-bold text-primary dark:text-primary-light">₹{product.price}</p>
          <button
            onClick={handleAddToCart}
            className="flex items-center px-3 py-2 bg-primary text-white text-sm font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
          >
            <ShoppingCartIcon className="w-4 h-4 mr-1"/>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;