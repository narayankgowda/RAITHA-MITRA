
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ShoppingCartIcon, PackageIcon, TrendingUpIcon, 
    SearchIcon, MapPinIcon, StarIcon, ArrowRightIcon,
    LeafIcon, QrCodeIcon, ClockIcon, FilterIcon
} from './icons';
import { initialProducts } from '../data/products';

const BuyerDashboardHome: React.FC = () => {
    const navigate = useNavigate();
    
    // Derived Data
    const trendingProducts = initialProducts.filter(p => p.rating >= 4.8).slice(0, 3);
    const recentCategories = ['Vegetables', 'Fruits', 'Grains', 'Spices'];

    const ActionCard = ({ title, sub, icon: Icon, color, onClick, delay }: any) => (
        <button 
            onClick={onClick}
            className={`relative overflow-hidden p-6 rounded-2xl border border-white/10 shadow-lg group text-left transition-all duration-300 hover:scale-[1.02] ${color}`}
            style={{ animationDelay: delay }}
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Icon className="w-20 h-20 text-white"/>
            </div>
            <div className="relative z-10">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                    <Icon className="w-5 h-5 text-white"/>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
                <p className="text-white/80 text-sm font-medium">{sub}</p>
            </div>
        </button>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn pb-10">
            
            {/* 1. Hero Section */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-green-900 to-emerald-800 shadow-2xl min-h-[300px] flex items-center">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80" 
                        alt="Fresh Produce" 
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                </div>
                
                <div className="relative z-10 p-8 md:p-12 max-w-2xl">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-bold uppercase tracking-wider mb-4 border border-green-500/30 backdrop-blur-md">
                        <LeafIcon className="w-3 h-3 mr-2"/> Premium Sourcing
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                        Source Fresh, <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Buy Direct.</span>
                    </h1>
                    <p className="text-lg text-gray-300 mb-8 max-w-lg">
                        Connect directly with certified farmers. Trace the origin of your food and ensure quality from farm to table.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={() => navigate('../marketplace')}
                            className="px-8 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center justify-center"
                        >
                            Browse Marketplace <ArrowRightIcon className="w-5 h-5 ml-2"/>
                        </button>
                        <button 
                            onClick={() => navigate('../traceability')}
                            className="px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl backdrop-blur-md transition-all flex items-center justify-center"
                        >
                            <QrCodeIcon className="w-5 h-5 mr-2"/> Trace Source
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Quick Search Bar */}
            <div className="relative -mt-8 mx-4 md:mx-12 z-20">
                <div className="bg-white dark:bg-card-dark p-2 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                    <SearchIcon className="w-6 h-6 text-gray-400 ml-4"/>
                    <input 
                        type="text" 
                        placeholder="What are you looking for today? (e.g. Organic Tomatoes, Wheat...)" 
                        className="flex-grow bg-transparent border-none focus:ring-0 text-lg py-3 text-text-light dark:text-text-dark placeholder-gray-400"
                        onKeyDown={(e) => e.key === 'Enter' && navigate('../marketplace')}
                    />
                    <button className="hidden md:flex items-center px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                        <FilterIcon className="w-5 h-5 mr-2"/> Filters
                    </button>
                    <button onClick={() => navigate('../marketplace')} className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-md">
                        Search
                    </button>
                </div>
            </div>

            {/* 3. Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ActionCard 
                    title="Active Orders" 
                    sub="2 shipments in transit" 
                    icon={PackageIcon} 
                    color="bg-gradient-to-br from-blue-500 to-indigo-600"
                    onClick={() => navigate('../orders')}
                    delay="0.1s"
                />
                <ActionCard 
                    title="Market Insights" 
                    sub="Price trends & forecast" 
                    icon={TrendingUpIcon} 
                    color="bg-gradient-to-br from-purple-500 to-fuchsia-600"
                    onClick={() => navigate('../insights')}
                    delay="0.2s"
                />
                <ActionCard 
                    title="Bulk Request" 
                    sub="Post a buying requirement" 
                    icon={ShoppingCartIcon} 
                    color="bg-gradient-to-br from-orange-500 to-red-500"
                    onClick={() => navigate('../marketplace')} // Could go to a specific form
                    delay="0.3s"
                />
            </div>

            {/* 4. Trending & Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Featured Products */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark flex items-center">
                            <StarIcon className="w-6 h-6 text-yellow-500 mr-2 fill-current"/> Top Rated Produce
                        </h2>
                        <button onClick={() => navigate('../marketplace')} className="text-primary font-semibold hover:underline text-sm">View All</button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {trendingProducts.map((product) => (
                            <div key={product.id} className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex gap-4 group cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('../marketplace')}>
                                <img src={product.image} alt={product.name} className="w-24 h-24 rounded-lg object-cover group-hover:scale-105 transition-transform duration-500"/>
                                <div className="flex flex-col justify-between py-1">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">{product.category}</span>
                                        <h4 className="font-bold text-lg text-text-light dark:text-text-dark mt-1 line-clamp-1">{product.name}</h4>
                                        <div className="flex items-center mt-1">
                                            <StarIcon className="w-3 h-3 text-yellow-400 fill-current"/>
                                            <span className="text-xs font-bold ml-1">{product.rating}</span>
                                            <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-lg font-bold text-text-light dark:text-text-dark">₹{product.price}<span className="text-xs font-normal text-gray-500">/kg</span></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div onClick={() => navigate('../marketplace')} className="bg-gray-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors p-6">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                                <ArrowRightIcon className="w-6 h-6"/>
                            </div>
                            <span className="font-bold text-gray-500">Explore More</span>
                        </div>
                    </div>
                </div>

                {/* Categories & Activity */}
                <div className="space-y-6">
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-md border border-border-light dark:border-border-dark">
                        <h3 className="font-bold text-lg mb-4">Browse Categories</h3>
                        <div className="flex flex-wrap gap-2">
                            {recentCategories.map((cat, i) => (
                                <button key={i} className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary text-gray-600 dark:text-gray-300 rounded-lg text-sm font-semibold transition-colors border border-transparent hover:border-primary/20">
                                    {cat}
                                </button>
                            ))}
                            <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-500 hover:text-primary transition-colors">
                                + More
                            </button>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                        <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                            <ClockIcon className="w-5 h-5 mr-2"/> Recent Activity
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 items-start">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Order #ORD-2894 Delivered</p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </li>
                            <li className="flex gap-3 items-start">
                                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Price alert: <strong>Tomato</strong> dropped by 5% in Hubli Mandi.
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerDashboardHome;
