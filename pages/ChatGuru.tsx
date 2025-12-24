import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Globe, BrainCircuit, Loader2 } from 'lucide-react';
import { getChatGuruResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatGuru: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello! I'm ChatGuru, your academic advisor. How can I help you today? I can provide deep academic advice or research the latest career trends.",
      timestamp: Date.now()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'advice' | 'research'>('advice');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const response = await getChatGuruResponse(history, userMsg.text, mode);
      
      const botMsg: ChatMessage = {
        role: 'model',
        text: response.text,
        timestamp: Date.now(),
        sources: response.sources
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      // Error handled in service, but safety net here
      setMessages(prev => [...prev, { role: 'model', text: "Something went wrong.", timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col p-4">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-brand-50">
          <div className="flex items-center space-x-2">
            <Bot className="text-brand-900" />
            <div>
              <h2 className="font-bold text-brand-900">ChatGuru</h2>
              <p className="text-xs text-brand-600">AI Academic Advisor</p>
            </div>
          </div>
          
          <div className="flex bg-white rounded-md p-1 border border-brand-100">
            <button
              onClick={() => setMode('advice')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 ${
                mode === 'advice' ? 'bg-brand-100 text-brand-900' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <BrainCircuit size={12} />
              Deep Advice
            </button>
            <button
              onClick={() => setMode('research')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 ${
                mode === 'research' ? 'bg-brand-100 text-brand-900' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Globe size={12} />
              Web Research
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user' 
                  ? 'bg-brand-900 text-white rounded-br-none' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
              }`}>
                {/* Markdown-like rendering would go here, raw text for now */}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</div>
                
                {/* Sources for Search Mode */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-500 mb-1">Sources:</p>
                    <ul className="space-y-1">
                      {msg.sources.map((source, i) => (
                        <li key={i}>
                          <a 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-brand-600 hover:underline flex items-center truncate"
                          >
                            <Globe size={10} className="mr-1 flex-shrink-0" />
                            {source.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-lg p-3 rounded-bl-none shadow-sm flex items-center space-x-2">
                <Loader2 size={16} className="animate-spin text-brand-500" />
                <span className="text-xs text-slate-500">
                  {mode === 'advice' ? 'Thinking deeply...' : 'Searching the web...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={mode === 'advice' ? "Ask for academic guidance..." : "Search for latest career news..."}
              className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-brand-900 text-white p-2 rounded-lg hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatGuru;
