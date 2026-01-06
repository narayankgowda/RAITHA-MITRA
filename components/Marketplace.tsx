
import React, { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../data/products';
import ProductCard from './ProductCard';
import { SearchIcon, FilterIcon, ShoppingCartIcon, TagIcon, SproutIcon } from './icons';

type StoreType = 'input' | 'produce' | 'vetmed';
type Availability = 'all' | 'inStock' | 'outOfStock';
type SortOrder = 'default' | 'priceLowToHigh' | 'priceHighToLow';

const Marketplace: React.FC = () => {
    const { state } = useProducts();
    const { products } = state;
    const [activeStore, setActiveStore] = useState<StoreType>('produce');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [availabilityFilter, setAvailabilityFilter] = useState<Availability>('all');
    const [sortOrder, setSortOrder] = useState<SortOrder>('default');

    const categories = useMemo(() => {
        const storeProducts = products.filter(p => p.type === activeStore);
        return ['All', ...Array.from(new Set(storeProducts.map(p => p.category)))];
    }, [activeStore, products]);

    const filteredAndSortedProducts = useMemo(() => {
        let tempProducts = products.filter(product => {
            const matchesStore = product.type === activeStore;
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStore && matchesCategory && matchesSearch;
        });

        if (availabilityFilter === 'inStock') {
            tempProducts = tempProducts.filter(p => p.inStock);
        } else if (availabilityFilter === 'outOfStock') {
            tempProducts = tempProducts.filter(p => !p.inStock);
        }

        if (sortOrder === 'priceLowToHigh') {
            tempProducts.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'priceHighToLow') {
            tempProducts.sort((a, b) => b.price - a.price);
        }

        return tempProducts;
    }, [activeStore, searchTerm, selectedCategory, availabilityFilter, sortOrder, products]);

    const StoreButton: React.FC<{
        storeType: StoreType;
        label: string;
        icon: React.FC<any>;
    }> = ({ storeType, label, icon: Icon }) => (
        <button
            onClick={() => {
                setActiveStore(storeType);
                setSelectedCategory('All');
            }}
            className={`flex-1 flex items-center justify-center py-4 text-center font-bold border-b-4 transition-all duration-300 ${activeStore === storeType ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:border-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'}`}
        >
            <Icon className="w-5 h-5 mr-2"/> {label}
        </button>
    );

    return (
        <div className="flex flex-col space-y-6 max-w-7xl mx-auto animate-fadeIn">
            
            {/* Store Tabs */}
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden flex flex-col md:flex-row">
                <StoreButton storeType="produce" label="Agri-Produce Store" icon={SproutIcon} />
                <StoreButton storeType="input" label="Agri-Inputs Store" icon={TagIcon} />
                <StoreButton storeType="vetmed" label="Vet Med Store" icon={ShoppingCartIcon} />
            </div>

            {/* Sticky Glass Filters */}
            <div className="sticky top-0 z-30 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-4 bg-gray-50/80 dark:bg-black/80 backdrop-blur-md border-b border-border-light dark:border-border-dark transition-all">
                <div className="flex flex-col lg:flex-row gap-4 max-w-7xl mx-auto">
                    <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"/>
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium transition-all"
                        />
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        <div className="relative min-w-[140px]">
                            <FilterIcon className="absolute left-3 top-3.5 w-4 h-4 text-gray-400"/>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-10 pr-8 py-3 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer text-sm font-medium"
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <select
                            value={availabilityFilter}
                            onChange={(e) => setAvailabilityFilter(e.target.value as Availability)}
                            className="px-4 py-3 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer text-sm font-medium"
                        >
                            <option value="all">All Status</option>
                            <option value="inStock">In Stock</option>
                            <option value="outOfStock">Out of Stock</option>
                        </select>

                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                            className="px-4 py-3 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer text-sm font-medium min-w-[150px]"
                        >
                            <option value="default">Relevance</option>
                            <option value="priceLowToHigh">Price: Low to High</option>
                            <option value="priceHighToLow">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {filteredAndSortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
                    {filteredAndSortedProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm">
                    <ShoppingCartIcon className="w-16 h-16 mx-auto mb-4 text-gray-300"/>
                    <h3 className="text-xl font-bold text-gray-500">No Products Found</h3>
                    <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
