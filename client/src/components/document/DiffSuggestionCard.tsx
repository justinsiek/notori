import React from 'react';
import { Check, X } from 'lucide-react';

interface SuggestionData {
  id: string;
  original_block: string;
  suggested_block: string;
  // context_before is no longer used in rendering
  // context_after is no longer used in rendering
  description: string;
}

interface DiffSuggestionCardProps {
  suggestion_data: SuggestionData;
}

const DiffSuggestionCard: React.FC<DiffSuggestionCardProps> = ({ suggestion_data }) => {
  if (!suggestion_data) return null;

  return (
    <div className="diff-suggestion-card p-1 rounded-md">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold text-gray-800">Suggestion:</h4>
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => console.log('Accepted suggestion:', suggestion_data.id)}
            className="p-1 rounded hover:bg-green-100 text-green-600 hover:text-green-700 transition-colors"
            aria-label="Accept suggestion"
          >
            <Check size={18} />
          </button>
          <button 
            onClick={() => console.log('Rejected suggestion:', suggestion_data.id)}
            className="p-1 rounded hover:bg-red-100 text-red-500 hover:text-red-600 transition-colors"
            aria-label="Reject suggestion"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      {suggestion_data.description && (
        <p className="text-xs text-gray-600 mb-2 italic">{suggestion_data.description}</p>
      )}
      {/* context_before rendering removed */}
      {suggestion_data.original_block && (
        <div className="original-block my-1 space-y-1">
          <p className="text-xs font-semibold text-red-600">Original:</p>
          <pre className="text-xs bg-red-50 p-2 rounded border border-red-200 whitespace-pre-wrap break-words">{suggestion_data.original_block}</pre>
        </div>
      )}
      {suggestion_data.suggested_block && (
        <div className="suggested-block my-1 space-y-1">
          <p className="text-xs font-semibold text-green-600">Suggestion:</p>
          <pre className="text-xs bg-green-50 p-2 rounded border border-green-200 whitespace-pre-wrap break-words">{suggestion_data.suggested_block}</pre>
        </div>
      )}
      {/* context_after rendering removed */}
      {/* Add buttons for accept/reject if needed in the future */}
    </div>
  );
};

export default DiffSuggestionCard;
