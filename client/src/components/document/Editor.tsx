import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './Sidebar';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import type { EditorState } from 'lexical';

interface EditorProps {
  sidebarOpen: boolean;
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  documentId: string;
  onEditStart?: () => void;
}

const editorTheme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
};

function onError(error: Error) {
  console.error(error);
}

const Editor = ({ sidebarOpen, initialContent, onSave, documentId, onEditStart }: EditorProps) => {
  const contentRef = useRef<string>(initialContent);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef<string>(initialContent);
  const isTypingRef = useRef<boolean>(false);
  const hasEditedRef = useRef<boolean>(false);
  
  const saveContent = useCallback(() => {
    // only save if content has changed since last save
    if (contentRef.current !== lastSavedContentRef.current) {
      onSave(contentRef.current);
      lastSavedContentRef.current = contentRef.current;
    }
    saveTimeoutRef.current = null;
  }, [onSave]);
  
  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      saveContent();
    }, 500); 
  }, [saveContent]);
  
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleLexicalChange = (editorState: EditorState) => {
    const editorStateJSON = editorState.toJSON();
    const serializedState = JSON.stringify(editorStateJSON);
    if (serializedState !== contentRef.current) {
        if (!hasEditedRef.current && onEditStart) {
            onEditStart();
            hasEditedRef.current = true;
        }
        contentRef.current = serializedState;
        isTypingRef.current = true;
        scheduleSave();
    }
  };
  
  const getInitialEditorState = (): string | undefined => {
    if (!initialContent) {
      return undefined;
    }
    try {
      const parsedState = JSON.parse(initialContent);

      if (parsedState && typeof parsedState === 'object' && parsedState.root) {
        return initialContent;
      }
      return undefined;
    } catch (e) {
      return undefined;
    }
  };

  const initialConfig = {
    namespace: 'NotoriEditor',
    theme: editorTheme,
    onError,
    editorState: getInitialEditorState(), 
  };

  return (
    <div className="flex w-full h-full overflow-hidden">
      <div className={`${sidebarOpen ? 'w-2/3' : 'w-full'} flex flex-col items-center overflow-auto py-12 px-4 
      [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent 
      [&::-webkit-scrollbar-thumb]:bg-gray-100
      hover:[&::-webkit-scrollbar-thumb]:bg-gray-200`}>
        <div className="w-[210mm] min-h-[297mm] bg-white shadow-md mb-8 flex flex-col relative">
          <LexicalComposer initialConfig={initialConfig}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable 
                  className="w-full h-full p-16 outline-none text-sm resize-none absolute top-0 left-0"
                  aria-placeholder={'Start writing...'}
                  placeholder={<div></div>}
                /> 
              }
              placeholder={null}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={handleLexicalChange} />
            <HistoryPlugin />
            <AutoFocusPlugin />
          </LexicalComposer>
        </div>
      </div>
      
      {sidebarOpen && (
        <div className="w-1/3 border-l border-gray-200 overflow-auto
        [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent 
        [&::-webkit-scrollbar-thumb]:bg-gray-200
        hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
          <Sidebar documentContent={contentRef.current} documentId={documentId} />
        </div>
      )}
    </div>
  );
};

export default Editor; 