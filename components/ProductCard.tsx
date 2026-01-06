
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
                <span key={i} className={i <= product.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}>★</span>
            );
        }
        return stars;
    };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col transition-all duration-300 transform hover:-translate-y-1 group relative">
      
      {/* Image Container */}
      <div className="h-52 overflow-hidden relative bg-gray-100 dark:bg-gray-800">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <button 
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm shadow-sm hover:scale-110 transition-all z-10"
            aria-label="Toggle Wishlist"
          >
              <HeartIcon className={`w-5 h-5 transition-colors ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-400 dark:text-gray-300'}`} />
          </button>

          {!product.inStock && (
              <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-0">
                  <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg transform -rotate-12">Out of Stock</span>
              </div>
          )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">{product.category}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
        
        <div className="flex items-center mb-3 space-x-2">
            <div className="flex text-sm">{renderStars()}</div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">({product.reviews})</span>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed flex-grow">{product.description}</p>
        
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
          <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Price</p>
              <p className="text-xl font-black text-gray-900 dark:text-white">₹{product.price}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex items-center px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all duration-300 transform active:scale-95 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
          >
            <ShoppingCartIcon className="w-4 h-4 mr-2"/>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
