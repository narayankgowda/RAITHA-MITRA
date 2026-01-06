
import React from 'react';
import { TrendingUpIcon, UsersIcon, ShoppingCartIcon, DollarSignIcon, ActivityIcon, AlertTriangleIcon, CheckCircleIcon, ServerIcon } from './icons';

const AdminAnalytics: React.FC = () => {
    // Mock Data
    const stats = [
        { label: 'Total Revenue', value: '₹12.4L', sub: '+12% this month', icon: DollarSignIcon, color: 'from-green-500 to-emerald-600', trend: 'up' },
        { label: 'Active Farmers', value: '1,240', sub: '+5% new signups', icon: UsersIcon, color: 'from-blue-500 to-indigo-600', trend: 'up' },
        { label: 'Orders Processed', value: '856', sub: '98% fulfillment rate', icon: ShoppingCartIcon, color: 'from-purple-500 to-violet-600', trend: 'up' },
        { label: 'System Health', value: '99.9%', sub: 'All systems operational', icon: ActivityIcon, color: 'from-orange-500 to-amber-600', trend: 'stable' },
    ];

    const recentActivity = [
        { user: 'Ramesh K.', action: 'Listed 50kg Tomatoes', time: '10 mins ago', type: 'product' },
        { user: 'Suresh P.', action: 'Joined as Farmer', time: '25 mins ago', type: 'user' },
        { user: 'Buyer John', action: 'Placed Order #ORD-992', time: '1 hour ago', type: 'order' },
        { user: 'System', action: 'Daily Backup Completed', time: '2 hours ago', type: 'system' },
    ];

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-2">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Mission Control</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time platform insights and performance metrics.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Live Updates
                </div>
            </div>

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="relative overflow-hidden bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 group hover:shadow-lg transition-all duration-300">
                            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500`}>
                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${stat.color}`}></div>
                            </div>
                            
                            <div className="relative z-10">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg mb-4`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{stat.value}</h3>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                                <div className="mt-3 flex items-center text-xs font-bold text-green-600 dark:text-green-400">
                                    <TrendingUpIcon className="w-3 h-3 mr-1" /> {stat.sub}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Growth</h3>
                            <p className="text-xs text-gray-500">Monthly earnings overview</p>
                        </div>
                        <select className="bg-gray-50 dark:bg-slate-800 border-none text-xs font-bold rounded-lg px-3 py-2 text-gray-600 dark:text-gray-300 outline-none cursor-pointer">
                            <option>This Year</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    
                    <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
                        {[35, 55, 45, 60, 75, 65, 85, 70, 90, 80, 95, 100].map((h, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                                <div className="w-full bg-gray-100 dark:bg-slate-700/50 rounded-t-lg relative h-full overflow-hidden">
                                    <div 
                                        className="absolute bottom-0 w-full bg-primary hover:bg-primary-dark transition-all duration-500 rounded-t-lg group-hover:opacity-80" 
                                        style={{ height: `${h}%` }}
                                    ></div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Demographics */}
                <div className="bg-white dark:bg-[#1e293b] p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">User Base</h3>
                    
                    <div className="flex-1 flex flex-col justify-center items-center relative">
                        <div className="w-48 h-48 rounded-full border-[12px] border-green-500 border-r-blue-500 border-b-orange-500 border-l-green-500 transform rotate-45 relative shadow-xl">
                            <div className="absolute inset-0 flex flex-col items-center justify-center transform -rotate-45">
                                <span className="text-3xl font-black text-gray-900 dark:text-white">2.5k</span>
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Total Users</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Farmers</span>
                            </div>
                            <span className="text-sm font-mono font-bold text-gray-900 dark:text-white">60%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Buyers</span>
                            </div>
                            <span className="text-sm font-mono font-bold text-gray-900 dark:text-white">25%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Experts</span>
                            </div>
                            <span className="text-sm font-mono font-bold text-gray-900 dark:text-white">15%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Activity Feed */}
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentActivity.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm ${
                                        item.type === 'order' ? 'bg-purple-500' : 
                                        item.type === 'user' ? 'bg-blue-500' : 
                                        item.type === 'product' ? 'bg-green-500' : 'bg-gray-500'
                                    }`}>
                                        <span className="text-xs font-bold">{item.user.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{item.action}</p>
                                        <p className="text-xs text-gray-500">{item.user}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ServerIcon className="w-32 h-32" />
                    </div>
                    <h3 className="text-lg font-bold mb-6 flex items-center z-10"><ActivityIcon className="w-5 h-5 mr-2 text-green-400"/> System Status</h3>
                    
                    <div className="space-y-6 z-10">
                        <div>
                            <div className="flex justify-between text-sm font-medium mb-2">
                                <span className="text-gray-300">Server Load</span>
                                <span className="text-green-400">24%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm font-medium mb-2">
                                <span className="text-gray-300">Database Usage</span>
                                <span className="text-blue-400">45%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm font-medium mb-2">
                                <span className="text-gray-300">AI API Quota</span>
                                <span className="text-yellow-400">62%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 flex gap-3 z-10">
                        <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div> API Online
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div> DB Connected
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
