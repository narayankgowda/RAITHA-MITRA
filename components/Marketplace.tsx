import React, { useState, useMemo } from 'react';
import { products, Product } from '../data/products';
import ProductCard from './ProductCard';

type StoreType = 'input' | 'produce';

const Marketplace: React.FC = () => {
    const [activeStore, setActiveStore] = useState<StoreType>('produce');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = useMemo(() => {
        const storeProducts = products.filter(p => p.type === activeStore);
        return ['All', ...Array.from(new Set(storeProducts.map(p => p.category)))];
    }, [activeStore]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesStore = product.type === activeStore;
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStore && matchesCategory && matchesSearch;
        });
    }, [activeStore, searchTerm, selectedCategory]);

    const StoreButton: React.FC<{
        storeType: StoreType;
        children: React.ReactNode;
    }> = ({ storeType, children }) => (
        <button
            onClick={() => {
                setActiveStore(storeType);
                setSelectedCategory('All');
            }}
            className={`w-1/2 py-3 text-center font-semibold border-b-4 transition-all duration-300 ${activeStore === storeType ? 'border-primary text-primary dark:text-primary-light' : 'border-transparent text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="flex flex-col space-y-6">
            <div className="border-b border-border-light dark:border-border-dark flex">
                <StoreButton storeType="produce">Agri-Produce Store</StoreButton>
                <StoreButton storeType="input">Agri-Inputs Store</StoreButton>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow px-4 py-2 bg-white dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 bg-white dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-gray-500 dark:text-gray-400">No products found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
