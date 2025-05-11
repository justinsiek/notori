from flask import Blueprint, jsonify, request, g
import os
from google import genai
from google.genai import types
from server.auth.utils import token_required
from server.ai.utils import get_system_prompt
import json

ai_bp = Blueprint('ai_bp', __name__, url_prefix='/api/ai')

gemini_api_key = os.getenv('GEMINI_API_KEY')
if gemini_api_key:
    client = genai.Client(api_key=gemini_api_key)
else:
    client = None
    print("Warning: GEMINI_API_KEY not set in environment variables")

# Define your desired output schema
# This matches the structure you want for segments
segments_schema = {
    "type": "OBJECT",
    "properties": {
        "segments": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "type": {
                        "type": "STRING",
                        "enum": ["text", "diff_suggestion"]
                    },
                    "content": {"type": "STRING"}, # For type: "text"
                    "suggestion_data": {          # For type: "diff_suggestion"
                        "type": "OBJECT",
                        "properties": {
                            "id": {"type": "STRING"},
                            "original_block": {"type": "STRING"},
                            "suggested_block": {"type": "STRING"},
                            "context_before": {"type": "STRING"},
                            "context_after": {"type": "STRING"},
                            "description": {"type": "STRING"}
                        },
                        # Define required fields for suggestion_data if needed
                        "required": ["id", "original_block", "suggested_block", "description"]
                    }
                },
                # Define required fields for each segment object if needed
                "required": ["type"] 
                # 'content' is required if type is 'text'
                # 'suggestion_data' is required if type is 'diff_suggestion'
                # Handling conditional requirements like this in pure OpenAPI schema can be tricky.
                # Often, you make them optional in schema and validate/handle logic in your app
                # or rely on the model to correctly populate based on the 'type'.
                # For simplicity, we can list all possible top-level keys in a segment here.
            }
        }
    },
    "required": ["segments"]
}

@ai_bp.route('/generate', methods=['POST'])
@token_required
def generate_response():
    data = request.json
    prompt = data.get('prompt')
    document_content = data.get('documentContent', '')
    document_id = data.get('documentId', '')
    conversation_history = data.get('conversationHistory', [])

    print("hello")
    
    if document_content:
        print(f"Recieved document content")
    else:
        print("no document content")
    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400
    
    if not client:
        return jsonify({'error': 'Gemini API is not configured'}), 500
    
    try:
        model = "gemini-2.5-flash-preview-04-17"
        system_prompt = get_system_prompt()
        
        # Build conversation history string
        history_str = ""
        for msg in conversation_history:
            role = "User" if msg.get('isUser') else "Assistant"
            history_str += f"{role}: {msg.get('content')}\n"
        
        # Combine everything into the prompt
        full_prompt = f"CONVERSATION HISTORY:\n{history_str}\n\nDOCUMENT CONTENT:\n\n{document_content}\n\nUSER REQUEST:\n{prompt}"
        
        content = types.Content(
            parts=[{"text": full_prompt}],
            role="user"
        )
        
        generation_config = types.GenerateContentConfig(
            temperature=0.7,
            response_mime_type="application/json", # Crucial for JSON output
            response_schema=segments_schema        # Your defined schema
        )
        
        if system_prompt:
            generation_config.system_instruction = system_prompt
        
        response = client.models.generate_content(
            model=model,
            contents=content,
            config=generation_config
        )
        
        # With schema enforcement, response.text should be clean, valid JSON string
        # matching your schema. No backticks!
        print(f"Gemini API response.text (with schema): {response.text}")

        # You can now directly parse it (though if using Pydantic in SDK, response.parsed might exist)
        # For the generic client, you parse response.text
        try:
            parsed_json_response = json.loads(response.text)
            return jsonify({
                'response': parsed_json_response, # Send the parsed Python dict
                'user_id': g.current_user_id
            }), 200
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON from Gemini (even with schema): {e}")
            # Fallback: send the raw text if it couldn't be parsed,
            # though with schema enforcement, this should be rare.
            return jsonify({
                'response': response.text, 
                'user_id': g.current_user_id
            }), 200
        
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return jsonify({'error': str(e)}), 500


