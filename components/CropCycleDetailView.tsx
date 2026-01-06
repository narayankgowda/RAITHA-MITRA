import React, { useState } from 'react';
import { Crop, CropStage } from '../data/cropCycleData';
import CropReportModal from './CropReportModal';
// FIX: Added missing CheckCircleIcon to imports
import { CheckIcon, CalendarIcon, DropletsIcon, AlertTriangleIcon, ThermometerIcon, ActivityIcon, ChevronLeftIcon, SparklesIcon, CheckSquareIcon, ClockIcon, CheckCircleIcon } from './icons';

interface CropCycleDetailViewProps {
  crop: Crop;
  onBack: () => void;
}

const statusColors = {
    Good: 'bg-green-500',
    Average: 'bg-yellow-500',
    Critical: 'bg-red-500',
};

const CropCycleDetailView: React.FC<CropCycleDetailViewProps> = ({ crop, onBack }) => {
  const [localCrop, setLocalCrop] = useState<Crop>(crop);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<CropStage | null>(null);
  
  const currentStageTasks = localCrop.stages[localCrop.currentStageIndex]?.tasks || [];
  const [tasks, setTasks] = useState(currentStageTasks.map((t, i) => ({ id: i, text: t, completed: i === 0 })));

  const handleOpenReport = (stage: CropStage) => {
    setSelectedStage(stage);
    setIsReportModalOpen(true);
  };

  const calculateDaysSincePlanting = () => {
      const start = new Date(localCrop.plantingDate);
      const today = new Date();
      return Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const toggleTask = (id: number) => {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const getHealthStatus = (score: number) => {
      if (score > 80) return 'Good';
      if (score > 50) return 'Average';
      return 'Critical';
  };

  const healthStatus = getHealthStatus(localCrop.healthScore);

  return (
    <div className="animate-fadeIn max-w-5xl mx-auto space-y-8 pb-12">
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-primary font-bold transition-all group">
        <div className="p-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 mr-3 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">
            <ChevronLeftIcon className="w-4 h-4"/>
        </div>
        Back to Monitoring
      </button>

      {/* Main Container */}
      <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Health Passport */}
          <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden sticky top-6">
                  <div className="h-64 relative">
                      <img src={localCrop.imageUrl} alt={localCrop.name} className="w-full h-full object-cover"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] to-transparent"></div>
                      <div className="absolute bottom-6 left-8">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary-light mb-1 block">Active Field</span>
                          <h1 className="text-3xl font-black text-white tracking-tight">{localCrop.name}</h1>
                      </div>
                  </div>
                  
                  <div className="p-8 space-y-6">
                      <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Health Status</span>
                              <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${statusColors[healthStatus]} animate-pulse`}></div>
                                  <span className="text-lg font-bold text-gray-900 dark:text-white">{healthStatus}</span>
                              </div>
                          </div>
                          <div className="text-right">
                              <span className="text-3xl font-black text-gray-900 dark:text-white">{localCrop.healthScore}</span>
                              <span className="text-gray-400 font-bold ml-1">/100</span>
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                              <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Acreage</p>
                              <p className="text-xl font-bold">{localCrop.fieldArea} Ac</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                              <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Days Old</p>
                              <p className="text-xl font-bold">{calculateDaysSincePlanting()} D</p>
                          </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-4">
                              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600">
                                  <DropletsIcon className="w-5 h-5"/>
                              </div>
                              <div>
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Soil Moisture</p>
                                  <p className="text-lg font-bold text-gray-900 dark:text-white">{localCrop.moistureLevel}%</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-4">
                              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-2xl text-orange-600">
                                  <ThermometerIcon className="w-5 h-5"/>
                              </div>
                              <div>
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ambient Temp</p>
                                  <p className="text-lg font-bold text-gray-900 dark:text-white">{localCrop.sensorHistory?.[0]?.temp || '--'}°C</p>
                              </div>
                          </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-5 text-white shadow-lg">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Exp. Yield</p>
                          <div className="flex items-baseline gap-2">
                              <h3 className="text-3xl font-black tracking-tight">{(localCrop.expectedYield || 0).toFixed(1)}</h3>
                              <span className="text-sm font-bold opacity-80">Tonnes</span>
                          </div>
                          <p className="text-xs font-medium mt-3 pt-3 border-t border-white/20">Est. Revenue: ₹{localCrop.marketValue?.toLocaleString()}</p>
                      </div>
                  </div>
              </div>
          </div>

          {/* Right Column: Timeline & Tasks */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* Stage Progress */}
              <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center mb-8">
                      <div>
                          <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Growth Timeline</h3>
                          <p className="text-sm text-gray-500 mt-1">Currently in <span className="font-bold text-primary">{localCrop.stages[localCrop.currentStageIndex]?.name}</span></p>
                      </div>
                      <button 
                        onClick={() => handleOpenReport(localCrop.stages[localCrop.currentStageIndex])}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                          <SparklesIcon className="w-4 h-4"/> AI Expert View
                      </button>
                  </div>

                  <div className="relative flex justify-between items-start pt-4 px-2">
                      {/* Timeline Line */}
                      <div className="absolute top-8 left-0 w-full h-1 bg-gray-100 dark:bg-gray-800 -z-10"></div>
                      
                      {localCrop.stages.map((stage, idx) => {
                          const isActive = idx === localCrop.currentStageIndex;
                          const isPast = idx < localCrop.currentStageIndex;
                          return (
                              <div key={idx} className="flex flex-col items-center gap-4 flex-1 group">
                                  <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${
                                      isActive ? 'bg-primary border-primary-light scale-125 shadow-[0_0_15px_rgba(22,163,74,0.4)]' : 
                                      isPast ? 'bg-green-100 dark:bg-green-900 border-primary text-primary' : 
                                      'bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700'
                                  }`}>
                                      {isPast && <CheckIcon className="w-4 h-4"/>}
                                      {isActive && <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>}
                                  </div>
                                  <div className="text-center">
                                      <p className={`text-[10px] font-black uppercase tracking-tighter transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}>{stage.name}</p>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>

              {/* Tasks Checklist */}
              <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center tracking-tight">
                      <CheckSquareIcon className="w-7 h-7 mr-3 text-gray-300"/> Stage Checklist
                  </h3>
                  <div className="grid gap-3">
                      {tasks.map(task => (
                          <div 
                            key={task.id} 
                            onClick={() => toggleTask(task.id)}
                            className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all ${task.completed ? 'bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30' : 'bg-gray-50 dark:bg-slate-800/30 border-transparent hover:border-primary/20'}`}
                          >
                              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mr-4 transition-all ${task.completed ? 'bg-primary border-primary text-white scale-110' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'}`}>
                                  {task.completed && <CheckIcon className="w-4 h-4"/>}
                              </div>
                              <span className={`text-base font-bold transition-all ${task.completed ? 'text-green-800 dark:text-green-300 line-through opacity-60' : 'text-gray-800 dark:text-gray-200'}`}>
                                  {task.text}
                              </span>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Alerts Center */}
              <div className="bg-card-light dark:bg-card-dark p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center tracking-tight">
                      <AlertTriangleIcon className="w-6 h-6 mr-3 text-yellow-500"/> Vital Alerts
                  </h3>
                  <div className="space-y-4">
                      {localCrop.alerts && localCrop.alerts.length > 0 ? (
                          localCrop.alerts.map(alert => (
                              <div key={alert.id} className="p-5 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-start gap-4">
                                  <div className="p-2 bg-red-500 rounded-full mt-1"></div>
                                  <div>
                                      <p className="text-sm font-black text-red-900 dark:text-red-300">{alert.message}</p>
                                      <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest mt-1 opacity-70">{alert.date}</p>
                                  </div>
                              </div>
                          ))
                      ) : (
                          <div className="text-center py-10 flex flex-col items-center">
                               <CheckCircleIcon className="w-12 h-12 text-green-500 mb-3 opacity-20"/>
                               <p className="text-sm text-gray-500 font-bold italic">Systems Normal. No critical issues detected.</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>
      
      <CropReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        crop={localCrop}
        stage={selectedStage}
        variety={localCrop.varieties?.[0]}
      />
    </div>
  );
};

export default CropCycleDetailView;