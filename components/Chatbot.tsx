import React, { useState, useEffect, useRef } from 'react';
import { getChatbotResponse } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import Spinner from './Spinner';
import { BotIcon, SendIcon, UserIcon } from './icons';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Hello! I'm Agri-AI, your agricultural assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Pass the existing message history and the new user input to the service
      const botResponse = await getChatbotResponse(messages, currentInput);
      const botMessage: Message = { sender: 'bot', text: botResponse };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        sender: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] max-h-[700px] bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-primary text-white flex items-center justify-center">
                  <BotIcon className="w-5 h-5" />
                </div>
              )}
              <div
                className={`max-w-md p-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-slate-700'
                }`}
              >
                <MarkdownRenderer content={msg.text} />
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center">
                  <UserIcon className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
               <div className="w-8 h-8 flex-shrink-0 rounded-full bg-primary text-white flex items-center justify-center">
                  <BotIcon className="w-5 h-5" />
                </div>
              <div className="max-w-md p-3 rounded-lg bg-gray-100 dark:bg-slate-700">
                <Spinner />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-border-light dark:border-border-dark">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about crops, pests, schemes..."
            className="flex-1 px-4 py-2 bg-white dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || input.trim() === ''}
            className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;