
import React, { useState } from 'react';
import { communityPosts, Post } from '../data/communityData';
import { FlagIcon, CheckCircleIcon, XCircleIcon, TrashIcon, UserCircleIcon, MessageSquareIcon } from './icons';
import { useNotifications } from '../hooks/useNotifications';

const CommunityModeration: React.FC = () => {
    const { dispatch: notificationDispatch } = useNotifications();
    // Simulating reported posts by taking a slice of existing posts for demo
    // In a real app, this would come from an API endpoint filtering for `isReported`
    const [reportedPosts, setReportedPosts] = useState<Post[]>(communityPosts.slice(0, 2));

    const handleApprove = (id: string) => {
        setReportedPosts(prev => prev.filter(p => p.id !== id));
        notificationDispatch({
            type: 'ADD_NOTIFICATION',
            payload: { message: 'Post approved and flags cleared.', type: 'success' }
        });
    };

    const handleDelete = (id: string) => {
        if(window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
            setReportedPosts(prev => prev.filter(p => p.id !== id));
            notificationDispatch({
                type: 'ADD_NOTIFICATION',
                payload: { message: 'Post content deleted permanently.', type: 'info' }
            });
        }
    };

    const handleBanUser = (authorId: string) => {
        if(window.confirm("Ban this user from the platform?")) {
             notificationDispatch({
                type: 'ADD_NOTIFICATION',
                payload: { message: `User ${authorId} has been banned from the community.`, type: 'error' }
            });
        }
    };

    return (
        <div className="animate-fadeIn space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Content Moderation</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Review flagged community posts and manage safety.</p>
                </div>
                <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-2 rounded-xl font-bold border border-red-200 dark:border-red-900/50">
                    <FlagIcon className="w-5 h-5"/>
                    <span>{reportedPosts.length} Pending Reports</span>
                </div>
            </div>

            {reportedPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                        <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">All Clear!</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">No content currently flagged for review.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {reportedPosts.map(post => (
                        <div key={post.id} className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-l-4 border-l-red-500 border-gray-200 dark:border-gray-800 overflow-hidden">
                            {/* Header */}
                            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-red-50/50 dark:bg-red-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                                        <FlagIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Reported Content</p>
                                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">Reason: Potential Misinformation / Spam</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-gray-500 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                                    ID: {post.id}
                                </span>
                            </div>

                            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Post Content */}
                                <div className="lg:col-span-2 space-y-4">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{post.title}</h3>
                                    <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {post.content}
                                    </div>
                                    {post.images && post.images.length > 0 && (
                                        <div className="flex gap-2 overflow-x-auto py-2">
                                            {post.images.map((img, i) => (
                                                <img key={i} src={img} alt="Evidence" className="h-32 rounded-lg border border-gray-200 dark:border-gray-700 object-cover" />
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center"><MessageSquareIcon className="w-3 h-3 mr-1"/> {post.comments.length} Comments</span>
                                        <span>Posted: {new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Author & Actions */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 dark:bg-slate-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <h4 className="text-xs font-bold uppercase text-gray-500 mb-3">Posted By</h4>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                                <UserCircleIcon className="w-6 h-6 text-gray-500"/>
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-900 dark:text-white">User {post.authorId}</p>
                                                <p className="text-xs text-gray-500">Member since 2023</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleBanUser(post.authorId)}
                                            className="w-full py-2 border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            Ban User
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button 
                                            onClick={() => handleApprove(post.id)}
                                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center"
                                        >
                                            <CheckCircleIcon className="w-5 h-5 mr-2"/> Keep Post (Dismiss)
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(post.id)}
                                            className="w-full py-3 bg-white dark:bg-slate-800 text-red-600 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-bold transition-all flex items-center justify-center"
                                        >
                                            <TrashIcon className="w-5 h-5 mr-2"/> Delete Content
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommunityModeration;
