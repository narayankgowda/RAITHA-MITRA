
import React, { useState, useMemo, useEffect } from 'react';
import { learningData, VideoTutorial } from '../data/learningData';
/* FIX: Added missing MessageCircleIcon to the imports from icons.tsx */
import { 
    PlayCircleIcon, SearchIcon, FilterIcon, BookOpenIcon, 
    ClockIcon, UserCircleIcon, XIcon, InfoIcon, GlobeIcon,
    SparklesIcon, LayersIcon, GraduationCapIcon, ChevronRightIcon,
    CheckCircleIcon, StarIcon, TrendingUpIcon, SendIcon, MessageCircleIcon
} from './icons';
import { getAcademyTutorResponse } from '../services/geminiService';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import Spinner from './Spinner';
import MarkdownRenderer from './MarkdownRenderer';

const LearningHub: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);
    const [activePath, setActivePath] = useState<string | null>(null);
    const isOnline = useNetworkStatus();

    // AI Tutor State
    const [aiQuestion, setAiQuestion] = useState('');
    const [aiAnswer, setAiAnswer] = useState<string | null>(null);
    const [isAiThinking, setIsAiThinking] = useState(false);

    // Mock progress tracking
    const [completedVideos, setCompletedVideos] = useState<string[]>([]);

    const categories = ['All', ...Array.from(new Set(learningData.map(v => v.category)))];
    
    // Group videos into "Paths"
    const learningPaths = [
        { id: 'path-1', name: 'Digital Agriculture 101', videos: ['v1', 'v2', 'v4'], desc: 'Master drones and data tools.' },
        { id: 'path-2', name: 'Organic Farming Transition', videos: ['v5', 'v3'], desc: 'Move from chemical to organic.' }
    ];

    const filteredVideos = useMemo(() => {
        return learningData.filter(video => {
            const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) || video.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);

    const handleAskTutor = async () => {
        if (!selectedVideo || !aiQuestion.trim() || !isOnline) return;
        setIsAiThinking(true);
        setAiAnswer(null);
        try {
            const response = await getAcademyTutorResponse(selectedVideo.title, aiQuestion);
            setAiAnswer(response);
        } catch (e) {
            setAiAnswer("I'm having trouble connecting to the textbook. Try again shortly.");
        } finally {
            setIsAiThinking(false);
        }
    };

    const toggleComplete = (videoId: string) => {
        setCompletedVideos(prev => 
            prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId]
        );
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn pb-24">
            
            {/* 1. Cinematic Header */}
            <div className="relative h-64 md:h-80 rounded-[3rem] overflow-hidden shadow-2xl flex items-center">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200" 
                        alt="Hero" 
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                </div>
                <div className="relative z-10 px-8 md:px-12 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-light text-[10px] font-black uppercase tracking-widest border border-primary/30 mb-6 backdrop-blur-md">
                        <GraduationCapIcon className="w-4 h-4"/> Certified Knowledge
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight mb-4">Master The Earth with <br/><span className="text-primary-light">Agri-Academy Masterclasses</span></h2>
                    <p className="text-gray-300 font-medium text-lg">Curated expertise from India's top agricultural scientists and innovators.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* LEFT CONTENT: Feed & Categories */}
                <div className="lg:col-span-8 space-y-12">
                    
                    {/* Learning Paths Row */}
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center mb-6 tracking-tight">
                            <LayersIcon className="w-6 h-6 mr-3 text-primary"/> Featured Learning Paths
                        </h3>
                        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                            {learningPaths.map(path => (
                                <button 
                                    key={path.id}
                                    onClick={() => setActivePath(activePath === path.id ? null : path.id)}
                                    className={`flex-shrink-0 w-80 p-6 rounded-[2.5rem] border text-left transition-all relative overflow-hidden group ${activePath === path.id ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' : 'bg-white dark:bg-[#1e293b] border-gray-100 dark:border-white/5 hover:border-primary/50 shadow-sm'}`}
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                        <LayersIcon className="w-20 h-20"/>
                                    </div>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${activePath === path.id ? 'text-white/70' : 'text-primary'}`}>
                                        {path.videos.length} Lectures • Masterclass
                                    </p>
                                    <h4 className="text-xl font-black leading-tight mb-2 pr-4">{path.name}</h4>
                                    <p className={`text-xs font-medium leading-relaxed ${activePath === path.id ? 'text-white/80' : 'text-gray-500'}`}>{path.desc}</p>
                                    <div className="mt-6 flex items-center gap-2">
                                        <div className="flex-grow h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${activePath === path.id ? 'bg-white' : 'bg-primary'}`} style={{ width: '40%' }}></div>
                                        </div>
                                        <span className="text-[10px] font-black">40%</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* All Tutorials Section */}
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Technical Library</h3>
                                <p className="text-sm text-gray-500 font-medium">Browse individual modules and specialized deep-dives.</p>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <div className="relative flex-grow md:w-64">
                                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search topics..." 
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1e293b] rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {filteredVideos.map(video => (
                                <div 
                                    key={video.id}
                                    onClick={() => setSelectedVideo(video)}
                                    className="bg-white dark:bg-[#1e293b] rounded-[2rem] shadow-sm hover:shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col group transition-all duration-500 hover:-translate-y-1.5 cursor-pointer"
                                >
                                    <div className="h-48 relative overflow-hidden bg-black">
                                        <img src={`https://img.youtube.com/vi/${video.videoUrl}/hqdefault.jpg`} className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                                                <PlayCircleIcon className="w-10 h-10 ml-1"/>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-4 left-6 flex items-center gap-2">
                                            <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[9px] font-black text-white uppercase tracking-widest">{video.duration}</span>
                                            {completedVideos.includes(video.id) && <CheckCircleIcon className="w-5 h-5 text-green-400 drop-shadow-md"/>}
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase text-primary tracking-widest">{video.category}</span>
                                            <div className="flex gap-1 text-yellow-400"><StarIcon className="w-3 h-3 fill-current"/><StarIcon className="w-3 h-3 fill-current"/><StarIcon className="w-3 h-3 fill-current"/></div>
                                        </div>
                                        <h4 className="text-lg font-black text-gray-900 dark:text-white leading-snug line-clamp-2">{video.title}</h4>
                                        <div className="flex items-center gap-3 pt-2 border-t border-gray-50 dark:border-white/5">
                                            <UserCircleIcon className="w-5 h-5 text-gray-400"/>
                                            <span className="text-xs font-bold text-gray-500">{video.author}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR: Community Synergy & Stats */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* Student Progress */}
                    <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5"><TrendingUpIcon className="w-24 h-24 text-primary"/></div>
                        <h3 className="text-xl font-black mb-6 flex items-center tracking-tight">Personal Dashboard</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                                    <span>Courses Finished</span>
                                    <span className="text-primary">{completedVideos.length} / {learningData.length}</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${(completedVideos.length/learningData.length)*100}%` }}></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-3xl border border-gray-100 dark:border-white/5 text-center">
                                    <p className="text-2xl font-black text-gray-900 dark:text-white">12.5h</p>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Learning Time</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-3xl border border-gray-100 dark:border-white/5 text-center">
                                    <p className="text-2xl font-black text-gray-900 dark:text-white">4</p>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Badges Earned</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Community Buzz Sidebar Integration */}
                    <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><MessageCircleIcon className="w-24 h-24"/></div>
                        <h3 className="text-lg font-black mb-4 flex items-center tracking-tight"><GlobeIcon className="w-5 h-5 mr-2 text-indigo-300"/> Academy Hot Topic</h3>
                        <p className="text-sm opacity-90 leading-snug mb-6">"15 farmers in Hubli are currently discussing <strong>Biological Pest Control</strong>. Join the talk!"</p>
                        <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all">Go to Community</button>
                    </div>

                    {/* Daily Quiz Engagement */}
                    <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5">
                        <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl flex items-center justify-center text-yellow-600 mb-6">
                            <SparklesIcon className="w-6 h-6"/>
                        </div>
                        <h4 className="text-lg font-black mb-2">Farmer's Daily Trivia</h4>
                        <p className="text-xs text-gray-500 leading-relaxed mb-6">Test your knowledge on Soil Health and win 50 community reputation points.</p>
                        <button className="w-full py-3.5 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all rounded-2xl font-black text-[10px] uppercase tracking-widest">Start Challenge</button>
                    </div>
                </div>
            </div>

            {/* Immersive Video & AI Classroom Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center md:p-8 backdrop-blur-2xl animate-fadeIn">
                    <div className="bg-white dark:bg-[#0f172a] rounded-[3rem] w-full max-w-7xl h-full flex flex-col lg:flex-row overflow-hidden border border-white/10 shadow-2xl">
                        
                        {/* Main Lecture Area */}
                        <div className="flex-grow flex flex-col bg-black">
                            <div className="p-6 flex justify-between items-center bg-black/40 backdrop-blur-md absolute top-0 w-full lg:w-[calc(100%-24rem)] z-20">
                                <div className="flex items-center gap-4">
                                    <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Lecture {selectedVideo.id}</span>
                                    <h3 className="text-white font-bold text-lg truncate pr-4">{selectedVideo.title}</h3>
                                </div>
                                <button onClick={() => setSelectedVideo(null)} className="lg:hidden p-2 text-white/50 hover:text-white transition-colors"><XIcon className="w-6 h-6"/></button>
                            </div>
                            
                            <div className="flex-grow relative pt-12">
                                <iframe 
                                    src={`https://www.youtube.com/embed/${selectedVideo.videoUrl}?autoplay=1&rel=0&modestbranding=1`}
                                    title="Tutorial" 
                                    className="w-full h-full border-none"
                                    allowFullScreen
                                />
                            </div>

                            <div className="p-8 bg-white dark:bg-[#0f172a] border-t border-gray-100 dark:border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center"><UserCircleIcon className="w-6 h-6 text-gray-400"/></div>
                                        <div>
                                            <p className="font-black text-sm">{selectedVideo.author}</p>
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Curated Expert</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => toggleComplete(selectedVideo.id)}
                                        className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${completedVideos.includes(selectedVideo.id) ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}
                                    >
                                        {completedVideos.includes(selectedVideo.id) ? 'Completed' : 'Mark Finished'}
                                    </button>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-3xl">{selectedVideo.description}</p>
                            </div>
                        </div>

                        {/* AI Tutor Sidebar */}
                        <div className="w-full lg:w-96 flex flex-col bg-gray-50 dark:bg-[#0b1120] border-l border-gray-100 dark:border-white/5">
                            <div className="p-8 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#0f172a]">
                                <div>
                                    <h4 className="text-lg font-black tracking-tight flex items-center"><SparklesIcon className="w-5 h-5 mr-2 text-indigo-500"/> AI Classroom</h4>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ask about this lesson</p>
                                </div>
                                <button onClick={() => setSelectedVideo(null)} className="hidden lg:block p-3 bg-gray-100 dark:bg-white/5 rounded-full hover:bg-gray-200 transition-colors"><XIcon className="w-5 h-5"/></button>
                            </div>

                            <div className="flex-grow p-8 overflow-y-auto no-scrollbar space-y-6">
                                {aiAnswer ? (
                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800 animate-fadeIn">
                                        <div className="prose prose-sm dark:prose-invert text-indigo-800 dark:text-indigo-200 font-medium italic">
                                            <MarkdownRenderer content={aiAnswer} />
                                        </div>
                                        <button onClick={() => setAiAnswer(null)} className="mt-4 text-[10px] font-black uppercase text-indigo-500 hover:underline tracking-widest">Ask another question</button>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 space-y-4">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-gray-400">
                                            <BookOpenIcon className="w-8 h-8"/>
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium leading-relaxed px-4">I can help you apply these video techniques specifically to your soil type or crop variety. What's your question?</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 bg-white dark:bg-[#0f172a] border-t border-gray-100 dark:border-white/5">
                                <div className="flex gap-4 p-2 bg-gray-100 dark:bg-white/10 rounded-3xl border border-transparent focus-within:border-indigo-500 transition-all">
                                    <input 
                                        type="text" 
                                        value={aiQuestion}
                                        onChange={e => setAiQuestion(e.target.value)}
                                        placeholder="Ask your tutor..." 
                                        className="flex-grow bg-transparent border-none outline-none px-4 py-2 text-sm font-medium"
                                        onKeyDown={(e) => e.key === 'Enter' && handleAskTutor()}
                                    />
                                    <button 
                                        onClick={handleAskTutor}
                                        disabled={isAiThinking || !aiQuestion.trim()}
                                        className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {isAiThinking ? <Spinner className="w-5 h-5 text-white"/> : <SendIcon className="w-5 h-5"/>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LearningHub;
