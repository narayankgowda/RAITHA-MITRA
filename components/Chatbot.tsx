
import React, { useState, useEffect, useRef } from 'react';
import { getChatbotResponse } from '../services/geminiService';
import { WeatherData } from '../data/weatherData';
import MarkdownRenderer from './MarkdownRenderer';
import { BotIcon, SendIcon, UserIcon, WifiOffIcon, RefreshCwIcon, SparklesIcon } from './icons';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const QUICK_QUESTIONS = [
    "What is the price of Tomato in Hubli?",
    "How to control Aphids on Cotton?",
    "Suggest crops for red soil.",
    "Is it going to rain tomorrow?",
    "Explain PM-KISAN scheme."
];

const Chatbot: React.FC = () => {
  const isOnline = useNetworkStatus();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  
  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading || !isOnline) return;

    const userMessage: Message = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const context = weather ? { weather } : undefined;
      const botResponse = await getChatbotResponse(messages, textToSend, context);
      const botMessage: Message = { sender: 'bot', text: botResponse };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'I encountered a connection error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
      setMessages([]);
  };

  const TypingIndicator = () => (
      <div className="flex space-x-1 p-3 bg-gray-100 dark:bg-slate-700 rounded-2xl rounded-tl-none w-fit items-center h-10 shadow-sm border border-gray-200 dark:border-gray-600">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
      </div>
  );

  return (
    <div className="flex flex-col h-[75vh] max-h-[800px] bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark shadow-xl overflow-hidden relative">
      
      {/* Header */}
      <div className="p-4 border-b border-border-light dark:border-border-dark bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex justify-between items-center z-10 sticky top-0">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-400 to-primary flex items-center justify-center shadow-md border-2 border-white dark:border-slate-800">
                  <BotIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                  <h3 className="font-bold text-text-light dark:text-text-dark text-lg">Raitha Mitra AI</h3>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center font-medium">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span> Online
                  </p>
              </div>
          </div>
          {messages.length > 0 && (
              <button onClick={handleClearChat} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors" title="Clear Chat">
                  <RefreshCwIcon className="w-5 h-5" />
              </button>
          )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50 dark:bg-[#0b1120]/50 scroll-smooth">
        {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-0 animate-fadeIn" style={{animationFillMode: 'forwards'}}>
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse-glow">
                    <SparklesIcon className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">How can I help your farm today?</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">Ask about weather conditions, pest control, live market prices, or government schemes.</p>
                
                <div className="flex flex-wrap justify-center gap-3 max-w-lg">
                    {QUICK_QUESTIONS.map((q, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleSendMessage(q)}
                            disabled={!isOnline}
                            className="px-4 py-2 bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-full text-sm hover:border-primary hover:text-primary transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </div>
        ) : (
            <div className="space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}>
                        <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 shadow-sm border border-black/5 ${msg.sender === 'user' ? 'bg-gray-200 dark:bg-slate-700' : 'bg-gradient-to-br from-green-400 to-primary'}`}>
                                {msg.sender === 'user' ? <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <BotIcon className="w-5 h-5 text-white" />}
                            </div>
                            
                            <div className={`p-4 rounded-2xl text-sm shadow-sm leading-relaxed ${
                                msg.sender === 'user' 
                                    ? 'bg-primary text-white rounded-tr-none' 
                                    : 'bg-white dark:bg-slate-800 text-text-light dark:text-text-dark border border-gray-100 dark:border-gray-700 rounded-tl-none'
                            }`}>
                                <MarkdownRenderer content={msg.text} />
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start animate-slideUp">
                        <div className="flex max-w-[85%] gap-3">
                            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 bg-gradient-to-br from-green-400 to-primary shadow-sm border border-white/10">
                                <BotIcon className="w-5 h-5 text-white" />
                            </div>
                            <TypingIndicator />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-[#1e293b] border-t border-border-light dark:border-border-dark">
        {!isOnline ? (
            <div className="flex items-center justify-center p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium border border-red-100 dark:border-red-900/30">
                <WifiOffIcon className="w-4 h-4 mr-2" />
                Offline mode enabled. Chat is unavailable.
            </div>
        ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative flex items-center gap-3">
                <div className="relative flex-grow">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask Raitha Mitra..."
                        className="w-full pl-5 pr-4 py-3.5 bg-gray-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/50 text-text-light dark:text-text-dark placeholder-gray-400 outline-none transition-all shadow-inner"
                        disabled={isLoading}
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="p-3.5 bg-primary text-white rounded-xl shadow-lg hover:bg-primary-dark disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all transform active:scale-95 flex items-center justify-center aspect-square"
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </form>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
