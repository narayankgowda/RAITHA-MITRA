
import React, { useState, useRef } from 'react';
import { XIcon, ImageIcon, MapPinIcon, TagIcon, BarChart2Icon, PlusIcon } from './icons';
import { Post } from '../data/communityData';
import { fileToBase64 } from '../utils/fileUtils';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreate: (post: Omit<Post, 'id' | 'authorId' | 'createdAt' | 'comments' | 'viewCount' | 'upvotes'>) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreate }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState<Post['category']>('General');
    const [tags, setTags] = useState('');
    const [location, setLocation] = useState('');
    const [issueType, setIssueType] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [showPoll, setShowPoll] = useState(false);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const predefinedTags = ['Pest', 'Disease', 'Fertilizer', 'Water', 'Harvest', 'Market', 'Organic', 'Seeds'];

    if (!isOpen) return null;

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
             try {
                const file = e.target.files[0];
                // Note: In a real app, handle video uploads to cloud storage here.
                // For this demo, we still use base64 but keep in mind size limits.
                const { base64, mimeType } = await fileToBase64(file);
                const imageUrl = `data:${mimeType};base64,${base64}`;
                setImages([...images, imageUrl]);
            } catch (err) {
                console.error("File upload failed", err);
            }
        }
    };

    const insertFormat = (symbol: string) => {
        setContent(prev => prev + symbol);
    };
    
    const addTag = (tag: string) => {
        const currentTags = tags.split(',').map(t => t.trim()).filter(t => t !== '');
        if (!currentTags.includes(tag)) {
            const newTags = currentTags.length > 0 ? `${tags}, ${tag}` : tag;
            setTags(newTags);
        }
    };

    const handlePollOptionChange = (index: number, value: string) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const addPollOption = () => {
        setPollOptions([...pollOptions, '']);
    };

    const removePollOption = (index: number) => {
        if (pollOptions.length > 2) {
            setPollOptions(pollOptions.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newPost: any = {
            title,
            content,
            category,
            tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
            images,
            location: location || 'Unknown',
            issueType: issueType || 'General'
        };

        if (showPoll && pollQuestion.trim() && pollOptions.filter(o => o.trim()).length >= 2) {
            newPost.poll = {
                question: pollQuestion,
                options: pollOptions.filter(o => o.trim()).map(o => ({ text: o, votes: 0 })),
                totalVotes: 0
            };
        }

        onPostCreate(newPost);
        
        // Reset form
        setTitle('');
        setContent('');
        setCategory('General');
        setTags('');
        setLocation('');
        setIssueType('');
        setImages([]);
        setShowPoll(false);
        setPollQuestion('');
        setPollOptions(['', '']);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b border-border-light dark:border-border-dark">
                    <h2 className="text-xl font-semibold text-text-light dark:text-text-dark">Start a Discussion</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                        <XIcon className="w-6 h-6 text-text-light dark:text-text-dark" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-grow space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Title</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="What's on your mind?"
                            required
                            className="w-full px-3 py-2 rounded-md border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Category</label>
                            <select 
                                value={category} 
                                onChange={e => setCategory(e.target.value as any)}
                                className="w-full px-3 py-2 rounded-md border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option>General</option>
                                <option>Crops</option>
                                <option>Livestock</option>
                                <option>Machinery</option>
                                <option>Organic Farming</option>
                                <option>Market & Prices</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Issue Type</label>
                            <select 
                                value={issueType} 
                                onChange={e => setIssueType(e.target.value)}
                                className="w-full px-3 py-2 rounded-md border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Select Issue Type (Optional)</option>
                                <option>Pest</option>
                                <option>Disease</option>
                                <option>Nutrient Deficiency</option>
                                <option>Weather Damage</option>
                                <option>Market Info</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Details</label>
                        <div className="border border-border-light dark:border-border-dark rounded-md overflow-hidden">
                             <div className="flex items-center gap-2 p-2 bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
                                 <button type="button" onClick={() => insertFormat('**Bold**')} className="px-2 py-1 text-xs font-bold rounded hover:bg-gray-200 dark:hover:bg-gray-700">B</button>
                                 <button type="button" onClick={() => insertFormat('*Italic*')} className="px-2 py-1 text-xs italic rounded hover:bg-gray-200 dark:hover:bg-gray-700">I</button>
                                 <button type="button" onClick={() => insertFormat('- List Item')} className="px-2 py-1 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-700">List</button>
                             </div>
                            <textarea 
                                value={content} 
                                onChange={e => setContent(e.target.value)} 
                                placeholder="Describe your question or share your knowledge..."
                                rows={6}
                                required
                                className="w-full px-3 py-2 bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Poll Section */}
                    <div className="border-t border-b border-border-light dark:border-border-dark py-4">
                        <button 
                            type="button"
                            onClick={() => setShowPoll(!showPoll)}
                            className={`flex items-center text-sm font-semibold ${showPoll ? 'text-primary' : 'text-gray-500 hover:text-primary'} transition-colors`}
                        >
                            <BarChart2Icon className="w-5 h-5 mr-2" />
                            {showPoll ? 'Remove Poll' : 'Create a Poll'}
                        </button>

                        {showPoll && (
                            <div className="mt-4 space-y-3 bg-background-light dark:bg-background-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                                <div>
                                    <label className="block text-xs font-medium mb-1">Poll Question</label>
                                    <input 
                                        type="text" 
                                        value={pollQuestion} 
                                        onChange={e => setPollQuestion(e.target.value)} 
                                        placeholder="Ask a question..."
                                        className="w-full px-3 py-2 text-sm rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                                {pollOptions.map((option, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input 
                                            type="text" 
                                            value={option} 
                                            onChange={e => handlePollOptionChange(index, e.target.value)} 
                                            placeholder={`Option ${index + 1}`}
                                            className="flex-grow px-3 py-2 text-sm rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:ring-1 focus:ring-primary"
                                        />
                                        {pollOptions.length > 2 && (
                                            <button type="button" onClick={() => removePollOption(index)} className="text-red-500 hover:bg-red-100 p-1 rounded">
                                                <XIcon className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addPollOption} className="text-xs text-primary hover:underline flex items-center">
                                    <PlusIcon className="w-3 h-3 mr-1"/> Add Option
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Location</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={location} 
                                    onChange={e => setLocation(e.target.value)} 
                                    placeholder="e.g. Hubli"
                                    className="w-full pl-9 px-3 py-2 rounded-md border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <MapPinIcon className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400"/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Tags</label>
                             <div className="relative">
                                <input 
                                    type="text" 
                                    value={tags} 
                                    onChange={e => setTags(e.target.value)} 
                                    placeholder="e.g., Tomato, Pest (comma separated)"
                                    className="w-full pl-9 px-3 py-2 rounded-md border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <TagIcon className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400"/>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {predefinedTags.map(tag => (
                                    <button 
                                        key={tag}
                                        type="button"
                                        onClick={() => addTag(tag)}
                                        className="px-2 py-1 text-xs bg-gray-200 dark:bg-slate-700 rounded-full hover:bg-primary hover:text-white transition-colors"
                                    >
                                        + {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">Media (Photos/Videos)</label>
                        <div className="flex flex-wrap gap-2">
                             {images.map((img, idx) => (
                                 <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden border border-border-light dark:border-border-dark">
                                     {img.startsWith('data:video') ? (
                                          <div className="w-full h-full bg-black flex items-center justify-center text-white text-xs">Video</div>
                                     ) : (
                                         <img src={img} alt="Upload" className="w-full h-full object-cover" />
                                     )}
                                     <button 
                                        type="button"
                                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5"
                                     >
                                         <XIcon className="w-3 h-3" />
                                     </button>
                                 </div>
                             ))}
                             <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-20 h-20 rounded-md border-2 border-dashed border-border-light dark:border-border-dark flex flex-col items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors"
                            >
                                 <ImageIcon className="w-6 h-6 mb-1" />
                                 <span className="text-xs text-center">Add Media</span>
                             </button>
                             <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*,video/*"
                                onChange={handleImageUpload}
                             />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Upload photos or short videos to provide visual context.</p>
                    </div>
                </form>

                <div className="p-4 border-t border-border-light dark:border-border-dark flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/5 font-medium">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 rounded-md bg-primary text-white font-bold shadow-md hover:bg-primary-dark transition-all">Post Discussion</button>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;
