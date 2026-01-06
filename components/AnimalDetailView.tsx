
import React, { useState, useRef, useCallback } from 'react';
import { Animal, HealthRecord, MilkRecord, BreedingRecord, WeightRecord } from '../data/animalData';
import AddRecordModal from './AddRecordModal';
// Added PlusIcon to the imported icons list
import { HeartIcon, DropletsIcon, ActivityIcon, Edit2Icon, DnaIcon, ScaleIcon, QrCodeIcon, DownloadIcon, ChevronLeftIcon, SparklesIcon, CalendarIcon, CheckIcon, PlusIcon } from './icons';
import { fileToBase64 } from '../utils/fileUtils';

interface AnimalDetailViewProps {
  animal: Animal;
  onBack: () => void;
  onUpdateAnimal: (updatedAnimal: Animal) => void;
}

type RecordType = 'health' | 'milk' | 'breeding' | 'weight';
type Tab = 'overview' | 'production' | 'medical';

const AnimalDetailView: React.FC<AnimalDetailViewProps> = ({ animal, onBack, onUpdateAnimal }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recordType, setRecordType] = useState<RecordType>('health');
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleOpenModal = (type: RecordType) => {
        setRecordType(type);
        setIsModalOpen(true);
    };

    const handleAddRecord = (newRecord: any) => {
        const recordWithId = { ...newRecord, id: `REC-${Date.now()}` };
        let updatedAnimal = { ...animal };

        if (recordType === 'health') {
            updatedAnimal.healthRecords = [recordWithId as HealthRecord, ...animal.healthRecords];
        } else if (recordType === 'milk') {
            updatedAnimal.milkRecords = [recordWithId as MilkRecord, ...animal.milkRecords];
        } else if (recordType === 'weight') {
            updatedAnimal.weightHistory = [...animal.weightHistory, recordWithId as WeightRecord].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }
        
        onUpdateAnimal(updatedAnimal);
        setIsModalOpen(false);
    };

    const handleFileUpdate = useCallback(async (file: File | null) => {
        if (!file) return;
        try {
            const { base64, mimeType } = await fileToBase64(file);
            onUpdateAnimal({ ...animal, imageUrl: `data:${mimeType};base64,${base64}` });
        } catch (error) { console.error(error); }
    }, [animal, onUpdateAnimal]);

    return (
        <div className="animate-fadeIn max-w-5xl mx-auto space-y-8 pb-12">
            <button onClick={onBack} className="flex items-center text-gray-500 hover:text-primary font-bold transition-all group">
                <div className="p-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 mr-3 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">
                    <ChevronLeftIcon className="w-4 h-4"/>
                </div>
                Back to Herd
            </button>

            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Left Column: ID Passport */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden sticky top-6">
                        <div className="h-64 relative group">
                            <img src={animal.imageUrl} alt={animal.name} className="w-full h-full object-cover"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] to-transparent"></div>
                            <div className="absolute bottom-6 left-8">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary-light mb-1 block">{animal.species}</span>
                                <h1 className="text-3xl font-black text-white tracking-tight">{animal.name}</h1>
                            </div>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute top-4 right-4 p-3 bg-black/40 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Edit2Icon className="w-4 h-4"/>
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpdate(e.target.files?.[0] || null)} />
                        </div>
                        
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</span>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${animal.status === 'Active' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">{animal.status}</span>
                                    </div>
                                </div>
                                <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg">
                                    <QrCodeIcon className="w-10 h-10 text-gray-400"/>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Tag ID</p>
                                    <p className="font-bold font-mono text-sm">{animal.tagId}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Weight</p>
                                    <p className="font-bold text-sm">{animal.weightHistory?.[0]?.weight || '--'} kg</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                        <DnaIcon className="w-5 h-5"/>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Breed</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{animal.breed}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600">
                                        <CalendarIcon className="w-5 h-5"/>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Birth Date</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{new Date(animal.birthDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Analytics & Records */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Navigation Tabs */}
                    <div className="flex space-x-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl">
                        {[
                            { id: 'overview', label: 'Herd Stats' },
                            { id: 'production', label: 'Yield Logs' },
                            { id: 'medical', label: 'Health' }
                        ].map((t) => (
                            <button 
                                key={t.id} 
                                onClick={() => setActiveTab(t.id as Tab)} 
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === t.id ? 'bg-white dark:bg-card-dark text-primary shadow-sm' : 'text-gray-500'}`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'overview' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                                <h3 className="text-2xl font-black mb-6">Biometric History</h3>
                                <div className="h-48 flex items-end justify-between gap-4">
                                    {[60, 65, 75, 80, 85, 90, 88].map((h, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                            <div className="w-full bg-gray-50 dark:bg-slate-800 rounded-2xl relative h-32 overflow-hidden">
                                                <div 
                                                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-1000" 
                                                    style={{ height: `${h}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400">M{i+1}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-green-600 to-emerald-800 rounded-[2.5rem] p-8 text-white shadow-lg flex justify-between items-center">
                                <div>
                                    <h4 className="text-xl font-bold mb-1 flex items-center">
                                        <SparklesIcon className="w-5 h-5 mr-2 text-yellow-300"/> Production Alert
                                    </h4>
                                    <p className="text-green-100 text-sm opacity-90 max-w-xs">Yield is 12% higher than last week. Ideal time for nutrient supplement.</p>
                                </div>
                                <button className="px-5 py-2 bg-white text-green-800 rounded-xl font-bold text-sm">Action</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'production' && (
                        <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 animate-fadeIn">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black">Yield Logs</h3>
                                <button onClick={() => handleOpenModal('milk')} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                                    <PlusIcon className="w-4 h-4"/> Add Entry
                                </button>
                            </div>
                            <div className="space-y-4">
                                {animal.milkRecords.map(rec => (
                                    <div key={rec.id} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-500">
                                                <DropletsIcon className="w-5 h-5"/>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{rec.yield.toFixed(1)} Liters</p>
                                                <p className="text-xs text-gray-500 uppercase tracking-widest">{rec.time} • {new Date(rec.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Normal</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'medical' && (
                        <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 animate-fadeIn">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black">Medical History</h3>
                                <button onClick={() => handleOpenModal('health')} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                                    <PlusIcon className="w-4 h-4"/> Log Visit
                                </button>
                            </div>
                            <div className="space-y-6">
                                {animal.healthRecords.map(rec => (
                                    <div key={rec.id} className="flex gap-6 items-start">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 shadow-sm">
                                                <ActivityIcon className="w-5 h-5"/>
                                            </div>
                                            <div className="w-0.5 flex-grow bg-gray-100 dark:bg-gray-800"></div>
                                        </div>
                                        <div className="pb-6">
                                            <h4 className="font-bold text-lg">{rec.type}</h4>
                                            <p className="text-xs text-gray-500 font-bold uppercase mb-2">{new Date(rec.date).toLocaleDateString()} {rec.vet && `• Dr. ${rec.vet}`}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl">{rec.notes}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            <AddRecordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddRecord={handleAddRecord} animalId={animal.id} recordType={recordType} />
        </div>
    );
};

export default AnimalDetailView;
