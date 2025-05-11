import React, { useState, useRef, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import MessageList from './MessageList'

interface Message {
  content: string;
  isUser: boolean;
  type?: 'text' | 'diff_suggestion';
  suggestion_data?: any;
}

interface SidebarProps {
  documentContent: string;
  documentId: string;
}

const Sidebar = ({ documentContent, documentId }: SidebarProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([{content: 'Hello, how can I help you today?', isUser: false}]);
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
        body: JSON.stringify({ 
          prompt: userInput,
          documentContent: documentContent,
          documentId: documentId,
          conversationHistory: messages
        }),
      });
      
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newUserMessage: Message = { content: input, isUser: true, type: 'text' };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    const result = await sendMessageToAPI(input);

    if (result.success && result.data.response && Array.isArray(result.data.response.segments)) {
      const newAssistantMessages: Message[] = result.data.response.segments.map((segment: any) => ({
        content: segment.type === 'text' ? segment.content : '',
        isUser: false,
        type: segment.type,
        suggestion_data: segment.type === 'diff_suggestion' ? segment.suggestion_data : undefined,
      }));
      setMessages(prev => [...prev, ...newAssistantMessages]);
    } else {
      setMessages(prev => [...prev, {
        content: `Error: ${result.error || 'Failed to process response or malformed data.'}`,
        isUser: false,
        type: 'text'
      }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} isLoading={isLoading} />
      
      <div className="p-4 bg-white border-t border-gray-300">
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