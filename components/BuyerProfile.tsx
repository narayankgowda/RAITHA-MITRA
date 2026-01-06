
import React, { useState } from 'react';
import { mockBuyerData, BuyerProfileData } from '../data/userData';
import { UserIcon, PhoneIcon } from './icons';

const BuyerProfile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState<BuyerProfileData>(mockBuyerData);
    const [tempData, setTempData] = useState<BuyerProfileData>(mockBuyerData);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempData({ ...tempData, [e.target.name]: e.target.value });
    };

    const handleCategoriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempData({ ...tempData, preferredCategories: e.target.value.split(',').map(c => c.trim()) });
    };

    const handleSave = () => {
        setProfileData(tempData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempData(profileData);
        setIsEditing(false);
    };

    const DetailItem: React.FC<{ label: string; value: string | React.ReactNode; isEditing: boolean; children?: React.ReactNode }> = ({ label, value, isEditing, children }) => (
        <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{label}</label>
            {isEditing ? children : <div className="mt-1 text-lg text-text-light dark:text-text-dark">{value}</div>}
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto animate-fadeIn">
            <div className="bg-card-light dark:bg-card-dark shadow-lg rounded-2xl p-8 border border-border-light dark:border-border-dark">
                <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
                    <div className="flex-shrink-0 mb-6 md:mb-0 relative group">
                        <img className="h-32 w-32 rounded-full object-cover border-4 border-primary shadow-xl" src={profileData.profilePicture} alt="Buyer Profile" />
                    </div>
                    <div className="flex-grow text-center md:text-left">
                        <h2 className="text-3xl font-black text-text-light dark:text-text-dark">{profileData.name}</h2>
                        <p className="text-lg font-bold text-primary">{profileData.companyName}</p>
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-4">
                             <span className="flex items-center text-sm font-medium text-gray-500 bg-gray-50 dark:bg-slate-800 px-3 py-1 rounded-full"><UserIcon className="w-4 h-4 mr-2"/>{profileData.email}</span>
                             <span className="flex items-center text-sm font-medium text-gray-500 bg-gray-50 dark:bg-slate-800 px-3 py-1 rounded-full"><PhoneIcon className="w-4 h-4 mr-2"/>{profileData.phone}</span>
                        </div>
                    </div>
                     <div className="mt-6 md:mt-0">
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-all">Edit Profile</button>
                        ) : (
                            <div className="flex space-x-3">
                                <button onClick={handleSave} className="px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-all">Save</button>
                                <button onClick={handleCancel} className="px-6 py-2.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-300 transition-all">Cancel</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-10 border-t border-border-light dark:border-border-dark pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <DetailItem label="Full Name" value={profileData.name} isEditing={isEditing}>
                        <input type="text" name="name" value={tempData.name} onChange={handleInputChange} className="mt-1 block w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-primary" />
                    </DetailItem>
                    <DetailItem label="Company Name" value={profileData.companyName} isEditing={isEditing}>
                         <input type="text" name="companyName" value={tempData.companyName} onChange={handleInputChange} className="mt-1 block w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-primary" />
                    </DetailItem>
                    <DetailItem label="Email Address" value={profileData.email} isEditing={isEditing}>
                         <input type="email" name="email" value={tempData.email} onChange={handleInputChange} className="mt-1 block w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-primary" />
                    </DetailItem>
                     <DetailItem label="Phone Number" value={profileData.phone} isEditing={isEditing}>
                         <input type="tel" name="phone" value={tempData.phone} onChange={handleInputChange} className="mt-1 block w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-primary" />
                    </DetailItem>
                     <div className="md:col-span-2">
                        <DetailItem label="Preferred Categories" value={
                            <div className="flex flex-wrap gap-2 mt-2">
                                {profileData.preferredCategories.map(cat => (
                                    <span key={cat} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold border border-primary/20">{cat}</span>
                                ))}
                            </div>
                        } isEditing={isEditing}>
                             <input type="text" name="preferredCategories" value={tempData.preferredCategories.join(', ')} onChange={handleCategoriesChange} className="mt-1 block w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. Vegetables, Fruits, Grains" />
                             <p className="text-xs text-gray-500 mt-2">Separate with commas</p>
                        </DetailItem>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerProfile;
