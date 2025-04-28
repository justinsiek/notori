import React, { useState } from 'react';

const Editor = () => {
  const [content, setContent] = useState<string>('');

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <div className="flex flex-col h-full w-full items-center overflow-auto pt-8 px-4">
      <div className="w-full max-w-3xl flex flex-col h-full bg-white shadow-sm rounded-sm">
        <textarea
          className="w-full flex-grow p-18 outline-none resize-none"
          value={content}
          onChange={handleContentChange}
        />
      </div>
    </div>
  );
};

export default Editor; 