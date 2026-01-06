
import React, { useState, useEffect } from 'react';
import { Product } from '../data/products';
import { XIcon } from './icons';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Product) => void;
    productToEdit: Product | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, productToEdit }) => {
    // FIX: Updated emptyProduct to include all properties from Product except 'id' to match the state type.
    const emptyProduct: Omit<Product, 'id'> = {
        name: '', price: 0, image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/product_placeholder.png', category: 'Seeds', type: 'input',
        description: '', inStock: true, rating: 0, reviews: 0,
    };

    const [product, setProduct] = useState<Omit<Product, 'id'> | Product>(emptyProduct);

    useEffect(() => {
        if (productToEdit) {
            setProduct(productToEdit);
        } else {
            // FIX: Use the complete emptyProduct object directly as it now matches the required type.
            setProduct(emptyProduct);
        }
    }, [productToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(product as Product);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = (e.target as HTMLInputElement).type === 'checkbox';
        const checked = (e.target as HTMLInputElement).checked;
        
        setProduct(prev => ({...prev, [name]: isCheckbox ? checked : (type === 'number' ? parseFloat(value) || 0 : value) }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-border-light dark:border-border-dark">
                    <h2 className="text-xl font-semibold">{productToEdit ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"><XIcon className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-sm font-medium">Name</label><input type="text" name="name" value={product.name} onChange={handleChange} required className="input-style w-full mt-1" /></div>
                        <div><label className="text-sm font-medium">Price (₹)</label><input type="number" name="price" value={product.price} onChange={handleChange} required className="input-style w-full mt-1" /></div>
                        <div>
                            <label className="text-sm font-medium">Category</label>
                            <select name="category" value={product.category} onChange={handleChange} className="input-style w-full mt-1">
                                <option>Seeds</option><option>Fertilizers</option><option>Tools</option><option>Vegetables</option><option>Fruits</option><option>Grains</option><option>Livestock Feed</option><option>Vet Meds</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Type</label>
                            <select name="type" value={product.type} onChange={handleChange} className="input-style w-full mt-1">
                                <option value="input">Agri-Input</option><option value="produce">Agri-Produce</option><option value="vetmed">Vet Medicine</option>
                            </select>
                        </div>
                        <div className="md:col-span-2"><label className="text-sm font-medium">Description</label><textarea name="description" value={product.description} onChange={handleChange} rows={3} required className="input-style w-full mt-1" /></div>
                        <div><label className="text-sm font-medium">Image URL</label><input type="text" name="image" value={product.image} onChange={handleChange} required className="input-style w-full mt-1" /></div>
                        <div className="flex items-center self-end">
                            <input type="checkbox" name="inStock" checked={product.inStock} onChange={handleChange} id="inStockCheckbox" className="h-4 w-4 rounded" />
                            <label htmlFor="inStockCheckbox" className="ml-2 text-sm font-medium">In Stock</label>
                        </div>
                    </div>
                    <div className="p-4 bg-background-light dark:bg-background-dark border-t flex justify-end space-x-2 sticky bottom-0">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 font-semibold rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white font-bold rounded-lg">Save Product</button>
                    </div>
                </form>
            </div>
            <style>{`.input-style {padding: 0.5rem 0.75rem; background-color: var(--color-input-light); border: 1px solid var(--color-border-light); border-radius: 0.375rem; color: var(--color-text-light);} .dark .input-style {background-color: var(--color-input-dark); border-color: var(--color-border-dark); color: var(--color-text-dark);}`}</style>
        </div>
    );
};

export default ProductModal;
