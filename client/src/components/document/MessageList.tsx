import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  content: string;
  isUser: boolean;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 bg-gray-50
      [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent 
      [&::-webkit-scrollbar-thumb]:bg-gray-100
      hover:[&::-webkit-scrollbar-thumb]:bg-gray-200">
      {messages.map((message, index) => (
        <div 
          key={index} 
          className={`mb-2 p-2 rounded-md w-full ${
            message.isUser ? 'bg-white border border-gray-200 whitespace-pre-wrap break-words text-sm' : ''
          }`}
        >
          {message.isUser ? (
            message.content
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]} 
              components={{
                // Headings
                h1: ({children}) => <h1 className="text-xl font-bold my-3">{children}</h1>,
                h2: ({children}) => <h2 className="text-lg font-bold my-2">{children}</h2>,
                h3: ({children}) => <h3 className="text-base font-bold my-2">{children}</h3>,
                h4: ({children}) => <h4 className="text-sm font-bold my-2">{children}</h4>,
                h5: ({children}) => <h5 className="text-sm font-bold my-1">{children}</h5>,
                h6: ({children}) => <h6 className="text-sm font-bold my-1">{children}</h6>,
                
                // Paragraphs and text formatting
                p: ({children}) => <p className="text-sm my-2 text-gray-800">{children}</p>,
                strong: ({children}) => <strong className="font-bold text-gray-900">{children}</strong>,
                em: ({children}) => <em className="italic text-gray-800">{children}</em>,
                
                // Links
                a: ({href, children}) => (
                  <a 
                    href={href} 
                    className="text-blue-600 font-medium hover:underline" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                
                // Code blocks
                code: ({className, children, ...props}) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match;
                  
                  return isInline ? (
                    <code className="bg-gray-100 px-1 rounded text-sm text-gray-800" {...props}>{children}</code>
                  ) : (
                    <div className="my-3 rounded bg-gray-800 p-2 overflow-x-auto">
                      <pre className="text-sm">
                        <code className={className || ''} {...props} style={{color: '#e2e8f0'}}>{children}</code>
                      </pre>
                    </div>
                  );
                },
                
                // Lists
                ul: ({children}) => <ul className="list-disc pl-6 my-2 text-sm">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal pl-6 my-2 text-sm">{children}</ol>,
                li: ({children}) => <li className="my-1 text-gray-800">{children}</li>,
                
                // Blockquotes
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-blue-300 pl-3 my-3 italic bg-blue-50 py-2 text-sm text-gray-700">{children}</blockquote>
                ),
                
                // Tables
                table: ({children}) => (
                  <div className="my-3 overflow-x-auto">
                    <table className="min-w-full text-sm border-collapse">{children}</table>
                  </div>
                ),
                thead: ({children}) => <thead className="bg-gray-100">{children}</thead>,
                tbody: ({children}) => <tbody>{children}</tbody>,
                tr: ({children}) => <tr>{children}</tr>,
                th: ({children}) => <th className="border border-gray-300 px-3 py-2 font-bold bg-gray-50">{children}</th>,
                td: ({children}) => <td className="border border-gray-300 px-3 py-2">{children}</td>,
                
                // Horizontal rule
                hr: () => <hr className="my-4 border-t-2 border-gray-300" />
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      ))}
      {isLoading && (
        <div className="text-gray-500 text-sm">Typing...</div>
      )}
    </div>
  )
}

export default MessageList 