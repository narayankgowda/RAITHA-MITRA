
import React, { useState } from 'react';
import { SettingsIcon, CheckCircleIcon, AlertTriangleIcon, DollarSignIcon, BellIcon, ShieldCheckIcon } from './icons';

const AdminSettings: React.FC = () => {
    const [config, setConfig] = useState({
        platformName: 'Raitha Mitra',
        supportEmail: 'admin@raitha-mitra.com',
        maintenanceMode: false,
        transactionFee: 2.5,
        enableNewRegistrations: true,
        autoApproveProducts: false,
        systemBroadcast: ''
    });

    const [isSaved, setIsSaved] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const Toggle: React.FC<{ label: string; name: string; checked: boolean; description?: string }> = ({ label, name, checked, description }) => (
        <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div className="pr-4">
                <label className="text-sm font-bold text-gray-900 dark:text-white block">{label}</label>
                {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name={name} checked={checked} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
        </div>
    );

    return (
        <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Platform Configuration</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage global settings and system preferences.</p>
                </div>
                <button 
                    onClick={handleSave}
                    className="flex items-center px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 active:scale-95"
                >
                    {isSaved ? <CheckCircleIcon className="w-5 h-5 mr-2"/> : <SettingsIcon className="w-5 h-5 mr-2"/>}
                    {isSaved ? 'Changes Saved' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* General Settings */}
                <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center border-b border-gray-100 dark:border-gray-800 pb-4">
                        <SettingsIcon className="w-5 h-5 mr-2 text-blue-500"/> General
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Platform Name</label>
                            <input 
                                type="text" 
                                name="platformName"
                                value={config.platformName} 
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Support Email</label>
                            <input 
                                type="email" 
                                name="supportEmail"
                                value={config.supportEmail} 
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Financials */}
                <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center border-b border-gray-100 dark:border-gray-800 pb-4">
                        <DollarSignIcon className="w-5 h-5 mr-2 text-green-500"/> Financials
                    </h3>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Transaction Fee (%)</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                name="transactionFee"
                                value={config.transactionFee} 
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                            <div className="absolute right-3 top-2.5 text-gray-400 font-bold">%</div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Applied to all marketplace transactions.</p>
                    </div>
                </div>

                {/* Controls & Security */}
                <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center border-b border-gray-100 dark:border-gray-800 pb-4">
                        <ShieldCheckIcon className="w-5 h-5 mr-2 text-purple-500"/> Controls & Security
                    </h3>
                    <div className="space-y-1">
                        <Toggle 
                            label="Maintenance Mode" 
                            name="maintenanceMode" 
                            checked={config.maintenanceMode} 
                            description="Disable platform access for non-admins."
                        />
                        <Toggle 
                            label="New Registrations" 
                            name="enableNewRegistrations" 
                            checked={config.enableNewRegistrations} 
                            description="Allow new users to sign up."
                        />
                        <Toggle 
                            label="Auto-Approve Products" 
                            name="autoApproveProducts" 
                            checked={config.autoApproveProducts} 
                            description="Products go live without manual review."
                        />
                    </div>
                </div>

                {/* System Broadcast */}
                <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center border-b border-gray-100 dark:border-gray-800 pb-4">
                        <BellIcon className="w-5 h-5 mr-2 text-orange-500"/> System Broadcast
                    </h3>
                    <div className="space-y-3">
                        <textarea 
                            name="systemBroadcast"
                            value={config.systemBroadcast}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Enter a message to display to all users..."
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                        />
                        <div className="flex items-start p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg text-xs text-orange-700 dark:text-orange-300">
                            <AlertTriangleIcon className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5"/>
                            This message will appear as a banner on the user dashboard.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminSettings;
