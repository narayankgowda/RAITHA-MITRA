
import React, { useState, useRef } from 'react';
import { mockFarmerData, FarmerPortfolioData } from '../data/userData';
import { UserIcon, PhoneIcon, MapPinIcon, Edit2Icon, CameraIcon, LeafIcon, CheckIcon, XIcon, SproutIcon } from './icons';

const FarmerProfile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState<FarmerPortfolioData>(mockFarmerData);
    const [tempData, setTempData] = useState<FarmerPortfolioData>(mockFarmerData);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTempData({ ...tempData, [e.target.name]: e.target.value });
    };

    const handleCropsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempData({ ...tempData, mainCrops: e.target.value.split(',').map(c => c.trim()) });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'profilePicture' | 'coverImage') => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setProfileData(prev => ({...prev, [field]: result }));
                setTempData(prev => ({...prev, [field]: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setProfileData(tempData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempData(profileData);
        setIsEditing(false);
    };

    return (
        <div className="max-w-5xl mx-auto pb-12 animate-fadeIn">
            {/* Header Section */}
            <div className="relative mb-24">
                {/* Cover Image */}
                <div className="h-64 w-full rounded-2xl overflow-hidden relative shadow-md group">
                    <img src={profileData.coverImage} alt="Farm Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all"></div>
                    <button 
                        onClick={() => coverInputRef.current?.click()}
                        className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center backdrop-blur-sm"
                    >
                        <CameraIcon className="w-4 h-4 mr-2"/> Change Cover
                    </button>
                    <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'coverImage')} />
                </div>

                {/* Profile Info Overlay */}
                <div className="absolute -bottom-16 left-8 flex items-end w-[calc(100%-4rem)]">
                    <div className="relative group/pfp shrink-0">
                        <img 
                            src={profileData.profilePicture} 
                            alt={profileData.name} 
                            className="w-40 h-40 rounded-full border-[6px] border-background-light dark:border-black shadow-2xl object-cover"
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-2 right-2 p-2.5 bg-primary text-white rounded-full shadow-lg opacity-0 group-hover/pfp:opacity-100 transition-all hover:scale-110 border-2 border-white dark:border-black"
                        >
                            <Edit2Icon className="w-4 h-4"/>
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'profilePicture')} />
                    </div>
                    
                    <div className="mb-4 ml-6 flex-grow flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-extrabold text-text-light dark:text-text-dark drop-shadow-md">{profileData.name}</h1>
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-200 flex items-center mt-1">
                                <SproutIcon className="w-5 h-5 mr-1 text-primary"/> {profileData.farmName}
                            </p>
                        </div>
                        
                        <div className="hidden md:block">
                            {!isEditing ? (
                                <button 
                                    onClick={() => setIsEditing(true)} 
                                    className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 flex items-center"
                                >
                                    <Edit2Icon className="w-4 h-4 mr-2"/> Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    <button onClick={handleCancel} className="px-5 py-2.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors flex items-center">
                                        <XIcon className="w-4 h-4 mr-2"/> Cancel
                                    </button>
                                    <button onClick={handleSave} className="px-5 py-2.5 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-colors flex items-center">
                                        <CheckIcon className="w-4 h-4 mr-2"/> Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Action Button */}
            <div className="md:hidden px-4 mb-8">
                 {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-md"
                    >
                        Edit Profile
                    </button>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleCancel} className="py-3 bg-gray-200 dark:bg-slate-700 font-bold rounded-xl">Cancel</button>
                        <button onClick={handleSave} className="py-3 bg-green-600 text-white font-bold rounded-xl">Save</button>
                    </div>
                )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 md:px-0">
                
                {/* Left Column: Contact & Details */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Contact Info */}
                    <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-6">
                        <h3 className="text-lg font-bold mb-4 text-text-light dark:text-text-dark border-b border-border-light dark:border-border-dark pb-2">Contact Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                                {isEditing ? (
                                    <input type="email" name="email" value={tempData.email} onChange={handleInputChange} className="w-full p-2 bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"/>
                                ) : (
                                    <div className="flex items-center text-text-light dark:text-text-dark">
                                        <UserIcon className="w-4 h-4 mr-3 text-gray-400"/> {profileData.email}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                                {isEditing ? (
                                    <input type="tel" name="phone" value={tempData.phone} onChange={handleInputChange} className="w-full p-2 bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"/>
                                ) : (
                                    <div className="flex items-center text-text-light dark:text-text-dark">
                                        <PhoneIcon className="w-4 h-4 mr-3 text-gray-400"/> {profileData.phone}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                                {isEditing ? (
                                    <input type="text" name="location" value={tempData.location} onChange={handleInputChange} className="w-full p-2 bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"/>
                                ) : (
                                    <div className="flex items-center text-text-light dark:text-text-dark">
                                        <MapPinIcon className="w-4 h-4 mr-3 text-gray-400"/> {profileData.location}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Farm Stats */}
                    <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-6">
                        <h3 className="text-lg font-bold mb-4 text-text-light dark:text-text-dark border-b border-border-light dark:border-border-dark pb-2">Farm Overview</h3>
                        <div>
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-center border border-green-100 dark:border-green-900/30">
                                {isEditing ? (
                                    <input type="number" name="farmSize" value={tempData.farmSize} onChange={handleInputChange} className="w-full text-center bg-white dark:bg-black border border-green-200 rounded p-1 text-lg font-bold text-green-700"/>
                                ) : (
                                    <p className="text-2xl font-extrabold text-green-700 dark:text-green-400">{profileData.farmSize}</p>
                                )}
                                <p className="text-xs font-bold text-green-600 dark:text-green-300 uppercase mt-1">Acres Cultivated</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Bio & Crops */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Bio */}
                    <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-8">
                        <h3 className="text-xl font-bold mb-4 flex items-center text-text-light dark:text-text-dark">
                            <LeafIcon className="w-5 h-5 mr-2 text-primary"/> About The Farm
                        </h3>
                        {isEditing ? (
                            <textarea 
                                name="farmStory" 
                                rows={6} 
                                value={tempData.farmStory} 
                                onChange={handleInputChange} 
                                className="w-full p-4 bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary outline-none leading-relaxed"
                            />
                        ) : (
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                {profileData.farmStory}
                            </p>
                        )}
                    </div>

                    {/* Crops */}
                    <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-8">
                        <h3 className="text-xl font-bold mb-4 flex items-center text-text-light dark:text-text-dark">
                            <SproutIcon className="w-5 h-5 mr-2 text-primary"/> Primary Crops
                        </h3>
                        {isEditing ? (
                            <div>
                                <input 
                                    type="text" 
                                    name="mainCrops" 
                                    value={tempData.mainCrops.join(', ')} 
                                    onChange={handleCropsChange} 
                                    className="w-full p-3 bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Enter crops separated by commas"
                                />
                                <p className="text-xs text-gray-500 mt-2">Separate crops with commas (e.g. Rice, Wheat, Cotton)</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                {profileData.mainCrops.map((crop, i) => (
                                    <div key={i} className="px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold flex items-center">
                                        <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                                        {crop}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerProfile;