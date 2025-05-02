import React, { useState } from 'react';

const Editor = () => {
  const [content, setContent] = useState<string>('');

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <div className="flex flex-col items-center w-full h-full overflow-auto py-8 px-4">
      <div className="w-[210mm] min-h-[297mm] bg-white shadow-md mb-8 flex flex-col">
        {/* Editor content */}
        <textarea
          className="w-full h-full p-16 outline-none resize-none"
          value={content}
          onChange={handleContentChange}
        />
      </div>
    </div>
  );
};

export default Editor; 