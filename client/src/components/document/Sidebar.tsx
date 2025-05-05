import React, { useState, useRef, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

interface Message {
  content: string;
  isUser: boolean;
}

const Sidebar = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    
    const maxHeight = 150;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [input]);

  const sendMessageToAPI = async (userInput: string) => {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userInput }),
      });
      
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { content: input, isUser: true }]);
    setInput('');
    setIsLoading(true);
    
    const result = await sendMessageToAPI(input);
    
    setMessages(prev => [...prev, { 
      content: result.success ? result.data.response : `Error: ${result.error || 'Failed to reach server'}`, 
      isUser: false 
    }]);
    
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 bg-white
        [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent 
        [&::-webkit-scrollbar-thumb]:bg-gray-100
        hover:[&::-webkit-scrollbar-thumb]:bg-gray-200">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-2 p-2 rounded-md text-xs w-full break-words whitespace-pre-wrap overflow-wrap-anywhere ${
              message.isUser ? 'bg-white border border-gray-200' : ''
            }`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-500 text-xs">Typing...</div>
        )}
      </div>
      
      <div className="px-4 pb-4 bg-white">
        <div className="flex items-center">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="What do you need help with?" 
            className="flex-1 px-2 py-2 text-xs rounded-md outline-none border border-gray-300 bg-white resize-none min-h-[28px] max-h-[150px]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="ml-2 h-6 w-6 rounded-md bg-black text-white flex items-center 
              justify-center disabled:bg-gray-300 transition-colors cursor-pointer"
            aria-label="Send message"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar