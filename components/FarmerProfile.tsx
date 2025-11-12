import React, { useState } from 'react';
import { mockFarmerData, FarmerProfileData } from '../data/userData';
import { UserIcon, PhoneIcon } from './icons';

const FarmerProfile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState<FarmerProfileData>(mockFarmerData);
    const [tempData, setTempData] = useState<FarmerProfileData>(mockFarmerData);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempData({ ...tempData, [e.target.name]: e.target.value });
    };

    const handleCropsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempData({ ...tempData, mainCrops: e.target.value.split(',').map(c => c.trim()) });
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
            {isEditing ? children : <div className="mt-1 text-lg">{value}</div>}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-card-light dark:bg-card-dark shadow-lg rounded-lg p-6 border border-border-light dark:border-border-dark">
                <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
                    <div className="flex-shrink-0 mb-4 md:mb-0">
                        <img className="h-32 w-32 rounded-full object-cover border-4 border-primary" src={profileData.profilePicture} alt="Farmer Profile" />
                    </div>
                    <div className="flex-grow text-center md:text-left">
                        <h2 className="text-3xl font-bold">{profileData.name}</h2>
                        <p className="text-gray-600 dark:text-gray-400">{profileData.farmName}</p>
                        <div className="flex justify-center md:justify-start items-center space-x-4 mt-2">
                             <span className="flex items-center text-sm text-gray-500"><UserIcon className="w-4 h-4 mr-1"/>{profileData.email}</span>
                             <span className="flex items-center text-sm text-gray-500"><PhoneIcon className="w-4 h-4 mr-1"/>{profileData.phone}</span>
                        </div>
                    </div>
                     <div className="mt-4 md:mt-0">
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark">Edit Profile</button>
                        ) : (
                            <div className="flex space-x-2">
                                <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">Save</button>
                                <button onClick={handleCancel} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 font-semibold rounded-lg hover:bg-gray-400">Cancel</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 border-t border-border-light dark:border-border-dark pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailItem label="Full Name" value={profileData.name} isEditing={isEditing}>
                        <input type="text" name="name" value={tempData.name} onChange={handleInputChange} className="mt-1 block w-full input-style" />
                    </DetailItem>
                    <DetailItem label="Email Address" value={profileData.email} isEditing={isEditing}>
                         <input type="email" name="email" value={tempData.email} onChange={handleInputChange} className="mt-1 block w-full input-style" />
                    </DetailItem>
                     <DetailItem label="Phone Number" value={profileData.phone} isEditing={isEditing}>
                         <input type="tel" name="phone" value={tempData.phone} onChange={handleInputChange} className="mt-1 block w-full input-style" />
                    </DetailItem>
                     <DetailItem label="Farm Name" value={profileData.farmName} isEditing={isEditing}>
                         <input type="text" name="farmName" value={tempData.farmName} onChange={handleInputChange} className="mt-1 block w-full input-style" />
                    </DetailItem>
                     <DetailItem label="Farm Size (Acres)" value={`${profileData.farmSize} acres`} isEditing={isEditing}>
                         <input type="number" name="farmSize" value={tempData.farmSize} onChange={handleInputChange} className="mt-1 block w-full input-style" />
                    </DetailItem>
                     <DetailItem label="Main Crops" value={profileData.mainCrops.join(', ')} isEditing={isEditing}>
                         <input type="text" name="mainCrops" value={tempData.mainCrops.join(', ')} onChange={handleCropsChange} className="mt-1 block w-full input-style" />
                    </DetailItem>
                </div>
            </div>
            <style>{`.input-style {padding: 0.5rem 0.75rem; background-color: white; border: 1px solid #e2e8f0; border-radius: 0.375rem;} .dark .input-style {background-color: #334155; border-color: #475569;} .input-style:focus {outline: 2px solid transparent; outline-offset: 2px; --tw-ring-color: #22c55e; border-color: #22c55e;}`}</style>
        </div>
    );
};

export default FarmerProfile;