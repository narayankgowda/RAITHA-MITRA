import React, { useState, useRef, useEffect } from 'react';
import { Crop, CropStage } from '../data/cropCycleData';
import CropReportModal from './CropReportModal';
import { ActivityIcon, GripVerticalIcon, CheckIcon } from './icons';

interface CropCycleDetailViewProps {
  crop: Crop;
  onBack: () => void;
}

interface Task {
    id: string;
    text: string;
    completed: boolean;
}

const CropCycleDetailView: React.FC<CropCycleDetailViewProps> = ({ crop, onBack }) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<CropStage | null>(null);

  const handleOpenReport = (stage: CropStage) => {
    setSelectedStage(stage);
    setIsReportModalOpen(true);
  };
  
  // Component to manage tasks for a single stage
  const StageTasks: React.FC<{stage: CropStage}> = ({ stage }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    const dragTask = useRef<number | null>(null);
    const draggedOverTask = useRef<number | null>(null);

    useEffect(() => {
        setTasks(stage.tasks.map((taskText, index) => ({
            id: `${stage.name}-${index}`,
            text: taskText,
            completed: false
        })));
    }, [stage]);
    
    const handleSort = () => {
        if (dragTask.current === null || draggedOverTask.current === null) return;
        
        let _tasks = [...tasks];
        const draggedItemContent = _tasks.splice(dragTask.current, 1)[0];
        _tasks.splice(draggedOverTask.current, 0, draggedItemContent);
        
        dragTask.current = null;
        draggedOverTask.current = null;
        
        setTasks(_tasks);
    };

    const handleToggleComplete = (taskId: string) => {
        setTasks(currentTasks => 
            currentTasks.map(task => 
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
    };

    return (
        <ul className="space-y-1 text-sm">
            {tasks.map((task, i) => (
                <li
                    key={task.id}
                    draggable
                    onDragStart={() => {
                        dragTask.current = i;
                        setDraggingIndex(i);
                    }}
                    onDragEnter={() => (draggedOverTask.current = i)}
                    onDragEnd={() => {
                        handleSort();
                        setDraggingIndex(null);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    className={`flex items-center p-2 rounded-md transition-all duration-300
                        ${draggingIndex === i 
                            ? 'opacity-50 bg-primary/20' 
                            : 'bg-gray-50 dark:bg-slate-700/50'
                        }
                        ${task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}
                    `}
                >
                    <GripVerticalIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 cursor-grab flex-shrink-0" />
                    <div 
                        onClick={() => handleToggleComplete(task.id)}
                        className="w-5 h-5 mr-3 flex-shrink-0 rounded border-2 border-gray-300 dark:border-gray-500 flex items-center justify-center cursor-pointer"
                    >
                       {task.completed && <CheckIcon className="w-4 h-4 text-primary" />}
                    </div>
                    <span className={`flex-grow transition-all duration-300 ${task.completed ? 'line-through' : ''}`}>
                        {task.text}
                    </span>
                </li>
            ))}
        </ul>
    );
  };

  return (
    <>
      <div>
        <button onClick={onBack} className="mb-4 text-primary dark:text-primary-light font-semibold hover:underline">
          &larr; Back to All Crops
        </button>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
            <img src={crop.imageUrl} alt={crop.name} className="w-32 h-32 object-cover rounded-lg shadow-md"/>
            <div>
                <h2 className="text-2xl md:text-3xl font-bold">{crop.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">{crop.family}</p>
                <p className="mt-2 text-sm">{crop.idealClimate}</p>
            </div>
        </div>

        <div className="space-y-4">
          {crop.stages.map((stage, index) => (
            <div key={index} className="bg-background-light dark:bg-slate-800/50 p-4 rounded-lg border border-border-light dark:border-border-dark flex flex-col md:flex-row gap-4">
                <img src={stage.imageUrl} alt={stage.name} className="w-full md:w-40 h-32 object-cover rounded-md" />
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg">{index + 1}. {stage.name}</h3>
                            <p className="text-sm font-semibold text-primary dark:text-primary-light">{stage.duration}</p>
                        </div>
                        <button 
                            onClick={() => handleOpenReport(stage)}
                            className="text-xs flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-semibold rounded-md hover:bg-green-200 dark:hover:bg-green-900"
                        >
                            <ActivityIcon className="w-3 h-3 mr-1" />
                            Get Report
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 my-2">{stage.description}</p>
                    <StageTasks stage={stage} />
                </div>
            </div>
          ))}
        </div>
      </div>
      
      <CropReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        crop={crop}
        stage={selectedStage}
      />
    </>
  );
};

export default CropCycleDetailView;