from flask import Blueprint, jsonify, request, g
import os
from google import genai
from google.genai import types
from server.auth.utils import token_required

ai_bp = Blueprint('ai_bp', __name__, url_prefix='/api/ai')

gemini_api_key = os.getenv('GEMINI_API_KEY')
if gemini_api_key:
    client = genai.Client(api_key=gemini_api_key)
else:
    client = None
    print("Warning: GEMINI_API_KEY not set in environment variables")

@ai_bp.route('/generate', methods=['POST'])
@token_required
def generate_response():
    data = request.json
    prompt = data.get('prompt')
    
    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400
    
    if not client:
        return jsonify({'error': 'Gemini API is not configured'}), 500
    
    try:
        model = "gemini-2.0-flash"
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=prompt),
                ],
            ),
        ]
        response = client.models.generate_content(
            model=model,
            contents=contents,
        )
        
        return jsonify({
            'response': response.text,
            'user_id': g.current_user_id
        }), 200
        
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return jsonify({'error': str(e)}), 500


