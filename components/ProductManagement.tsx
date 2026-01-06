
import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../data/products';
import { PlusIcon, Edit2Icon, TrashIcon, SearchIcon, FilterIcon, TagIcon } from './icons';
import ProductModal from './ProductModal';

const ProductManagement: React.FC = () => {
    const { state, dispatch } = useProducts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    const handleOpenModal = (product: Product | null) => {
        setProductToEdit(product);
        setIsModalOpen(true);
    };

    const handleSaveProduct = (productData: Product) => {
        if (productToEdit) {
            dispatch({ type: 'UPDATE_PRODUCT', payload: productData });
        } else {
            const newProduct = { ...productData, id: Date.now() }; // Simple ID generation
            dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
        }
        setIsModalOpen(false);
    };

    const handleDeleteProduct = (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch({ type: 'DELETE_PRODUCT', payload: { id } });
        }
    };
    
    const toggleInStock = (product: Product) => {
        dispatch({ type: 'UPDATE_PRODUCT', payload: { ...product, inStock: !product.inStock } });
    };

    // Filter Logic
    const filteredProducts = state.products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...Array.from(new Set(state.products.map(p => p.category)))];

    return (
        <div className="animate-fadeIn space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Inventory</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage platform products and listings.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal(null)} 
                    className="flex items-center px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 active:scale-95"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Product
                </button>
            </div>

            {/* Glass Control Bar */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all"
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <FilterIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select 
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-gray-900 dark:text-white outline-none cursor-pointer appearance-none font-medium"
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Professional Table */}
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-gray-50 dark:bg-slate-800/50 text-gray-500 font-bold border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4 text-center">Stock</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredProducts.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover shadow-sm border border-gray-200 dark:border-gray-700" />
                                            <span className="font-bold text-gray-900 dark:text-white">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                                            <TagIcon className="w-3 h-3 mr-1" /> {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-bold text-gray-900 dark:text-white">₹{product.price}</td>
                                    <td className="px-6 py-4 text-center">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={product.inStock} onChange={() => toggleInStock(product)} className="sr-only peer" />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.inStock ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                            {product.inStock ? 'Active' : 'Stock Out'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenModal(product)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors">
                                                <Edit2Icon className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredProducts.length === 0 && (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                        <SearchIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm">Try adjusting your filters.</p>
                    </div>
                )}
            </div>

            <ProductModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProduct}
                productToEdit={productToEdit}
            />
        </div>
    );
};

export default ProductManagement;
