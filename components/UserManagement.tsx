
import React, { useState } from 'react';
import { allUsersData, User } from '../data/allUsersData';
import { SearchIcon, FilterIcon, UserCircleIcon, CheckCircleIcon, XCircleIcon, ShieldCheckIcon, EyeIcon, XIcon, ActivityIcon, ShoppingCartIcon } from './icons';

// User Details Modal Component
const UserDetailModal: React.FC<{ isOpen: boolean; onClose: () => void; user: User | null }> = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-scaleIn">
                {/* Header */}
                <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600">
                    <button onClick={onClose} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors">
                        <XIcon className="w-5 h-5"/>
                    </button>
                    <div className="absolute -bottom-10 left-6">
                        <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 p-1 shadow-lg">
                            <div className="w-full h-full rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold text-gray-500">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 px-6 pb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                                {user.name}
                                {user.role === 'admin' && <ShieldCheckIcon className="w-5 h-5 text-blue-500 ml-2" />}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                            user.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
                        }`}>
                            {user.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Role</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">{user.role}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Joined</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">May 2024</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-2">Recent Activity</h3>
                        {/* Mock Activity */}
                        <div className="flex gap-4 items-start">
                            <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg text-blue-600">
                                <ActivityIcon className="w-4 h-4"/>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Logged in</p>
                                <p className="text-xs text-gray-500">{new Date(user.lastLogin).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1.5 rounded-lg text-green-600">
                                <ShoppingCartIcon className="w-4 h-4"/>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Updated Profile</p>
                                <p className="text-xs text-gray-500">2 days ago</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-slate-900/50 p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-800">Reset Password</button>
                    <button onClick={onClose} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark">Close</button>
                </div>
            </div>
        </div>
    );
};

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>(allUsersData);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    
    // Modal State
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const toggleStatus = (userId: string) => {
        setUsers(users.map(user => 
            user.id === userId 
            ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
            : user
        ));
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="animate-fadeIn space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">User Base</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor and manage platform users.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex gap-4">
                <div className="relative flex-grow">
                    <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search users by name or email..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all"
                    />
                </div>
                <div className="relative min-w-[180px]">
                    <FilterIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select 
                        value={roleFilter}
                        onChange={e => setRoleFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-gray-900 dark:text-white outline-none cursor-pointer appearance-none font-medium"
                    >
                        <option value="All">All Roles</option>
                        <option value="farmer">Farmers</option>
                        <option value="admin">Admins</option>
                        <option value="buyer">Buyers</option>
                    </select>
                </div>
            </div>

            {/* Users Grid */}
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50 dark:bg-slate-800/50 text-gray-500 font-bold border-b border-gray-100 dark:border-gray-800">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Last Login</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white flex items-center">
                                                {user.name}
                                                {user.role === 'admin' && (
                                                    <span title="Admin">
                                                        <ShieldCheckIcon className="w-3.5 h-3.5 text-blue-500 ml-1" />
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wide border ${
                                        user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' : 
                                        user.role === 'farmer' ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' :
                                        'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">
                                    {new Date(user.lastLogin).toLocaleDateString()} <span className="text-xs opacity-60">{new Date(user.lastLogin).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                        user.status === 'Active' 
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                        {user.status === 'Active' ? <CheckCircleIcon className="w-3 h-3 mr-1"/> : <XCircleIcon className="w-3 h-3 mr-1"/>}
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => setSelectedUser(user)}
                                            className="p-1.5 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors"
                                            title="View Details"
                                        >
                                            <EyeIcon className="w-4 h-4"/>
                                        </button>
                                        <button 
                                            onClick={() => toggleStatus(user.id)} 
                                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${
                                                user.status === 'Active' 
                                                ? 'text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20' 
                                                : 'text-green-600 border-green-200 hover:bg-green-50 dark:border-green-900/50 dark:hover:bg-green-900/20'
                                            }`}
                                        >
                                            {user.status === 'Active' ? 'Ban' : 'Activate'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <UserDetailModal 
                isOpen={!!selectedUser} 
                onClose={() => setSelectedUser(null)} 
                user={selectedUser}
            />
        </div>
    );
};

export default UserManagement;
