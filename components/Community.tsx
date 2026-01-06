
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { communityPosts, Post, communityGroups, communityUsers, mockMessages, Message, CommunityUser } from '../data/communityData';
/* FIX: Added missing CalendarIcon and InfoIcon to the imports from icons.tsx */
import {
    MessageCircleIcon, ThumbsUpIcon, ShareIcon, UserCircleIcon, PlusIcon,
    SearchIcon, FilterIcon, MapPinIcon, CheckCircleIcon, SendIcon, StarIcon,
    AwardIcon, ChevronLeftIcon, UsersIcon, TagIcon, FlagIcon, SparklesIcon,
    TrendingUpIcon, ShieldCheckIcon, LayoutGridIcon, CalendarIcon, InfoIcon
} from './icons';
import CreatePostModal from './CreatePostModal';
import MarkdownRenderer from './MarkdownRenderer';
import { getCommunitySummary } from '../services/geminiService';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import Spinner from './Spinner';

const Community: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>(communityPosts);
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const isOnline = useNetworkStatus();
    
    // Navigation & View State
    const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'messages'>('feed');
    const [viewingUser, setViewingUser] = useState<CommunityUser | null>(null);
    const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null);
    const [summarizedPostId, setSummarizedPostId] = useState<string | null>(null);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [postSummaries, setPostSummaries] = useState<Record<string, string>>({});

    // Filters
    const [filters, setFilters] = useState({
        search: '',
        category: 'All',
        sortBy: 'Recent',
        filterBy: 'All',
        location: '',
        tags: ''
    });

    const currentUserId = 'currentUser';

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                                  post.content.toLowerCase().includes(filters.search.toLowerCase());
            const matchesCategory = filters.category === 'All' || post.category === filters.category;
            const matchesLocation = !filters.location || (post.location && post.location.toLowerCase().includes(filters.location.toLowerCase()));
            
            let matchesFilterBy = true;
            if (filters.filterBy === 'Solved') matchesFilterBy = post.comments.some(c => c.isBestAnswer);
            if (filters.filterBy === 'Unsolved') matchesFilterBy = !post.comments.some(c => c.isBestAnswer);
            
            const matchesTags = !filters.tags || post.tags.some(tag => tag.toLowerCase().includes(filters.tags.toLowerCase()));

            return matchesSearch && matchesCategory && matchesLocation && matchesFilterBy && matchesTags;
        }).sort((a, b) => {
            if (filters.sortBy === 'Popular') return b.upvotes - a.upvotes;
            if (filters.sortBy === 'Unanswered') return a.comments.length - b.comments.length;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [posts, filters]);

    const chatUsers = useMemo(() => {
        const userIds = new Set<string>();
        messages.forEach(m => {
            if (m.senderId === currentUserId) userIds.add(m.receiverId);
            else if (m.receiverId === currentUserId) userIds.add(m.senderId);
        });
        return Array.from(userIds).map(id => communityUsers.find(u => u.id === id)).filter(Boolean) as CommunityUser[];
    }, [messages]);

    const currentChatMessages = useMemo(() => {
        if (!selectedChatUser) return [];
        return messages.filter(m => 
            (m.senderId === currentUserId && m.receiverId === selectedChatUser) ||
            (m.senderId === selectedChatUser && m.receiverId === currentUserId)
        ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [messages, selectedChatUser]);

    const handleCreatePost = (newPostData: any) => {
        const newPost: Post = {
            ...newPostData,
            id: `p-${Date.now()}`,
            authorId: currentUserId,
            createdAt: new Date().toISOString(),
            comments: [],
            viewCount: 0,
            upvotes: 0
        };
        setPosts([newPost, ...posts]);
    };

    const handleSendMessage = (text: string) => {
        if (!selectedChatUser || !text.trim()) return;
        const newMessage: Message = {
            id: `m-${Date.now()}`,
            senderId: currentUserId,
            receiverId: selectedChatUser,
            content: text,
            timestamp: new Date().toISOString(),
            read: false
        };
        setMessages([...messages, newMessage]);
    };

    const handleUserClick = (userId: string) => {
        const user = communityUsers.find(u => u.id === userId);
        if (user) setViewingUser(user);
    };

    const getAuthor = (authorId: string) => communityUsers.find(u => u.id === authorId) || communityUsers[0];

    const handleSummarize = async (post: Post) => {
        if (!isOnline) return;
        setSummaryLoading(true);
        setSummarizedPostId(post.id);
        try {
            const commentTexts = post.comments.map(c => c.content);
            const summary = await getCommunitySummary(post.title, post.content, commentTexts);
            setPostSummaries(prev => ({ ...prev, [post.id]: summary }));
        } catch (e) {
            console.error(e);
        } finally {
            setSummaryLoading(false);
        }
    };

    const UserProfileView = ({ user, onBack }: { user: CommunityUser, onBack: () => void }) => (
        <div className="bg-card-light dark:bg-[#0b1120] rounded-[2.5rem] shadow-xl border border-border-light dark:border-white/5 p-8 animate-fadeIn">
            <button onClick={onBack} className="mb-6 flex items-center text-primary font-bold hover:scale-105 transition-transform">
                <ChevronLeftIcon className="w-5 h-5 mr-1" /> Back
            </button>
            
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-shrink-0 text-center lg:text-left">
                    <div className="relative inline-block">
                        <div className="w-40 h-40 rounded-full border-[6px] border-primary p-1">
                            <img src={user.profileImage} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white text-sm font-black px-4 py-1.5 rounded-full shadow-lg border-4 border-white dark:border-black">
                            LVL {Math.floor(user.reputationPoints / 100) + 1}
                        </div>
                    </div>
                    <h2 className="text-3xl font-black mt-6 text-gray-900 dark:text-white">{user.name}</h2>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1"><MapPinIcon className="w-4 h-4 inline mr-1 text-red-500"/>{user.farmLocation}</p>
                    
                    <div className="mt-6 flex flex-wrap gap-2 justify-center lg:justify-start">
                        {user.badges.map((badge, i) => (
                            <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-[10px] rounded-lg font-black uppercase tracking-widest border border-primary/20">
                                {badge}
                            </span>
                        ))}
                    </div>

                    <div className="mt-8 flex gap-3 justify-center lg:justify-start">
                        <button className="flex-1 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                            Follow
                        </button>
                        <button onClick={() => { setSelectedChatUser(user.id); setActiveTab('messages'); setViewingUser(null); }} className="flex-1 py-3 bg-gray-100 dark:bg-white/5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">
                            Message
                        </button>
                    </div>
                </div>

                <div className="flex-grow space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Farm Size', val: user.farmSize, icon: MapPinIcon, color: 'blue' },
                            { label: 'Exp.', val: `${user.experienceYears}y`, icon: CalendarIcon, color: 'green' },
                            { label: 'Followers', val: user.followers, icon: UsersIcon, color: 'purple' },
                            { label: 'Reputation', val: user.reputationPoints, icon: StarIcon, color: 'yellow' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-white/5 p-4 rounded-3xl border border-gray-100 dark:border-white/5 text-center">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-xl font-black text-gray-900 dark:text-white">{stat.val}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white dark:bg-black/20 p-8 rounded-[2rem] border border-gray-100 dark:border-white/5">
                        <h3 className="text-xl font-black mb-4 flex items-center"><InfoIcon className="w-5 h-5 mr-2 text-primary"/> Farmer Story</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                            {user.about || "No bio available."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] space-y-6">
            {/* Community Navbar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Farmer's Plaza</h2>
                    <p className="text-gray-500 font-medium mt-1">Connect with {communityUsers.length * 12}+ certified growers across India.</p>
                </div>
                <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl w-full md:w-auto">
                    {['feed', 'groups', 'messages'].map((tab) => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-1 gap-8 overflow-hidden">
                {activeTab === 'feed' && (
                    <>
                        {/* Feed Main */}
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-20">
                            {/* Search & Post Bar */}
                            <div className="bg-white dark:bg-[#1e293b] p-4 rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5 flex gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                                    <img src={communityUsers[2].profileImage} className="w-full h-full object-cover" />
                                </div>
                                <button 
                                    onClick={() => setCreateModalOpen(true)}
                                    className="flex-grow text-left px-6 py-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-400 font-bold hover:bg-gray-100 transition-colors"
                                >
                                    Ask the community a question...
                                </button>
                                <button onClick={() => setCreateModalOpen(true)} className="p-3 bg-primary text-white rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                                    <PlusIcon className="w-6 h-6"/>
                                </button>
                            </div>

                            {/* Posts Feed */}
                            {filteredPosts.map(post => {
                                const author = getAuthor(post.authorId);
                                const isSummarized = postSummaries[post.id];
                                
                                return (
                                    <div key={post.id} className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] shadow-sm hover:shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden transition-all duration-300">
                                        <div className="p-8">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-4 cursor-pointer group" onClick={() => handleUserClick(author.id)}>
                                                    <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden group-hover:scale-110 transition-transform">
                                                        <img src={author.profileImage} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">{author.name}</h4>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString()} • {post.location}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20">{post.category}</span>
                                                    {post.issueType && <span className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-red-100 dark:border-red-900/30">{post.issueType}</span>}
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{post.title}</h3>
                                            
                                            {/* AI Summary Section */}
                                            {isSummarized && (
                                                <div className="mb-6 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800/50 animate-fadeIn">
                                                    <div className="flex items-center gap-2 mb-3 text-indigo-700 dark:text-indigo-300">
                                                        <SparklesIcon className="w-4 h-4"/>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Intelligence Summary</span>
                                                    </div>
                                                    <div className="text-sm font-medium leading-relaxed italic text-indigo-900 dark:text-indigo-200">
                                                        <MarkdownRenderer content={postSummaries[post.id]} />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="prose dark:prose-invert text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6 max-w-none font-medium">
                                                <MarkdownRenderer content={post.content} />
                                            </div>

                                            {post.images && post.images.length > 0 && (
                                                <div className="rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 mb-6 max-h-[400px]">
                                                    <img src={post.images[0]} className="w-full h-full object-cover" />
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-2 mb-8">
                                                {post.tags.map(t => <span key={t} className="text-[10px] font-bold text-gray-400 bg-gray-50 dark:bg-white/5 px-3 py-1 rounded-full border border-gray-100 dark:border-white/5">#{t}</span>)}
                                            </div>

                                            <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
                                                <div className="flex gap-8">
                                                    <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors font-black text-xs uppercase tracking-widest">
                                                        <ThumbsUpIcon className="w-5 h-5"/> {post.upvotes} 
                                                    </button>
                                                    <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors font-black text-xs uppercase tracking-widest">
                                                        <MessageCircleIcon className="w-5 h-5"/> {post.comments.length}
                                                    </button>
                                                </div>
                                                <div className="flex gap-4">
                                                    <button 
                                                        onClick={() => handleSummarize(post)}
                                                        disabled={summaryLoading && summarizedPostId === post.id}
                                                        className="flex items-center gap-2 text-indigo-500 hover:text-indigo-600 transition-colors font-black text-xs uppercase tracking-widest disabled:opacity-50"
                                                    >
                                                        {summaryLoading && summarizedPostId === post.id ? <Spinner className="w-4 h-4"/> : <SparklesIcon className="w-5 h-5"/>}
                                                        Smart View
                                                    </button>
                                                    <button className="text-gray-400 hover:text-primary transition-colors">
                                                        <ShareIcon className="w-5 h-5"/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Community Sidebar */}
                        <div className="w-80 hidden xl:flex flex-col gap-6 overflow-y-auto pr-2 no-scrollbar pb-20">
                             {/* Stats Card */}
                             <div className="bg-gradient-to-br from-primary to-green-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700"><UsersIcon className="w-32 h-32"/></div>
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">My Reputation</p>
                                    <h3 className="text-4xl font-black mb-6">450 <span className="text-sm font-bold opacity-60">pts</span></h3>
                                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/20">
                                        <AwardIcon className="w-8 h-8 text-yellow-300"/>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest">Active Level</p>
                                            <p className="text-sm font-bold">Pioneer Farmer</p>
                                        </div>
                                    </div>
                                </div>
                             </div>

                             {/* Trending Topics */}
                             <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] p-6 shadow-sm border border-gray-100 dark:border-white/5">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 px-2">Market Pulse</h3>
                                <div className="space-y-4">
                                    {[
                                        { tag: 'TomatoBlight', count: 124, trend: 'up' },
                                        { tag: 'PaddyRates', count: 89, trend: 'up' },
                                        { tag: 'DripSubsidy', count: 56, trend: 'stable' },
                                        { tag: 'OrganicWheat', count: 42, trend: 'down' }
                                    ].map((t, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">#{t.tag}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-black text-gray-400">{t.count} posts</span>
                                                <TrendingUpIcon className={`w-3 h-3 ${t.trend === 'up' ? 'text-green-500' : t.trend === 'down' ? 'text-red-500' : 'text-gray-400'}`}/>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </div>

                             {/* Suggested Experts */}
                             <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] p-6 shadow-sm border border-gray-100 dark:border-white/5">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 px-2">Top Mentors</h3>
                                <div className="space-y-5">
                                    {communityUsers.slice(0, 2).map(user => (
                                        <div key={user.id} className="flex items-center gap-4">
                                            <img src={user.profileImage} className="w-10 h-10 rounded-full object-cover border-2 border-primary" />
                                            <div className="flex-grow">
                                                <p className="text-sm font-bold">{user.name}</p>
                                                <p className="text-[9px] text-gray-500 uppercase font-black">{user.farmLocation}</p>
                                            </div>
                                            <button className="p-2 bg-gray-50 dark:bg-white/5 rounded-xl hover:text-primary transition-colors">
                                                <PlusIcon className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </div>
                    </>
                )}

                {activeTab === 'messages' && (
                    <div className="flex-1 flex bg-white dark:bg-[#0b1120] rounded-[3rem] shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden animate-fadeIn mb-20">
                         <div className="w-80 border-r border-gray-100 dark:border-white/5 flex flex-col">
                            <div className="p-8 border-b border-gray-50 dark:border-white/5 flex justify-between items-center">
                                <h3 className="text-xl font-black tracking-tight">Direct</h3>
                                <button className="p-2 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-400"><SearchIcon className="w-4 h-4"/></button>
                            </div>
                            <div className="flex-grow overflow-y-auto no-scrollbar p-4 space-y-2">
                                {chatUsers.map(user => (
                                    <button 
                                        key={user.id}
                                        onClick={() => setSelectedChatUser(user.id)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${selectedChatUser === user.id ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-500'}`}
                                    >
                                        <img src={user.profileImage} className="w-12 h-12 rounded-full object-cover border-2 border-transparent" />
                                        <div className="text-left overflow-hidden">
                                            <p className={`font-bold text-sm truncate ${selectedChatUser === user.id ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{user.name}</p>
                                            <p className={`text-[10px] truncate uppercase font-black tracking-widest opacity-60`}>Farmer • {user.farmLocation}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                         </div>
                         <div className="flex-grow flex flex-col relative bg-gray-50/30 dark:bg-black/20">
                            {selectedChatUser ? (
                                <>
                                    <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center gap-4 bg-white/50 dark:bg-white/5 backdrop-blur-md sticky top-0 z-10">
                                        <img src={getAuthor(selectedChatUser).profileImage} className="w-10 h-10 rounded-full object-cover" />
                                        <div>
                                            <h4 className="font-black text-gray-900 dark:text-white">{getAuthor(selectedChatUser).name}</h4>
                                            <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Active Now</p>
                                        </div>
                                    </div>
                                    <div className="flex-grow p-8 overflow-y-auto custom-scrollbar space-y-6">
                                        {currentChatMessages.map(msg => (
                                            <div key={msg.id} className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] p-5 rounded-[2rem] text-sm font-medium shadow-sm leading-relaxed ${msg.senderId === currentUserId ? 'bg-primary text-white rounded-br-none' : 'bg-white dark:bg-[#1e293b] text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-white/5 rounded-bl-none'}`}>
                                                    {msg.content}
                                                    <p className={`text-[9px] mt-2 font-black uppercase tracking-widest opacity-60 ${msg.senderId === currentUserId ? 'text-right' : 'text-left'}`}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-8 bg-white/50 dark:bg-[#0b1120] border-t border-gray-100 dark:border-white/5">
                                        <div className="flex gap-4 p-2 bg-gray-100 dark:bg-white/5 rounded-3xl border border-transparent focus-within:border-primary transition-all">
                                            <input 
                                                type="text" 
                                                placeholder="Write your message..." 
                                                className="flex-grow bg-transparent border-none outline-none px-4 py-2 text-sm font-medium"
                                                onKeyDown={(e) => {
                                                    if(e.key === 'Enter') {
                                                        handleSendMessage((e.target as HTMLInputElement).value);
                                                        (e.target as HTMLInputElement).value = '';
                                                    }
                                                }}
                                            />
                                            <button className="p-3 bg-primary text-white rounded-2xl shadow-lg hover:scale-105 transition-all"><SendIcon className="w-5 h-5"/></button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-grow flex flex-col items-center justify-center text-gray-400">
                                    <MessageCircleIcon className="w-20 h-20 mb-6 opacity-20"/>
                                    <h3 className="text-2xl font-black tracking-tighter italic">"Your private mailbox"</h3>
                                    <p className="text-sm font-bold opacity-60 mt-2">Select a peer to start a private consultation.</p>
                                </div>
                            )}
                         </div>
                    </div>
                )}
            </div>

            <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onPostCreate={handleCreatePost} />
        </div>
    );
};

export default Community;
