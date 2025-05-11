import React from 'react';

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
    <div className="diff-suggestion-card p-3 rounded-md">
      <h4 className="text-sm font-bold mb-2 text-gray-800">Suggestion:</h4>
      {suggestion_data.description && (
        <p className="text-xs text-gray-600 mb-2 italic">{suggestion_data.description}</p>
      )}
      {/* context_before rendering removed */}
      {suggestion_data.original_block && (
        <div className="original-block my-1">
          <p className="text-xs font-semibold text-red-600">Original:</p>
          <pre className="text-xs bg-red-50 p-2 rounded border border-red-200 whitespace-pre-wrap break-words">{suggestion_data.original_block}</pre>
        </div>
      )}
      {suggestion_data.suggested_block && (
        <div className="suggested-block my-1">
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
