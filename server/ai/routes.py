from flask import Blueprint, jsonify, request, g
import os
from google import genai
from google.genai import types
from server.auth.utils import token_required
from server.ai.utils import get_system_prompt

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
        system_prompt = get_system_prompt()
        
        content = types.Content(
            parts=[{"text": prompt}],
            role="user"
        )
        
        generation_config = types.GenerateContentConfig(
            max_output_tokens=1024,
            temperature=0.7,
        )
        
        if system_prompt:
            generation_config.system_instruction = system_prompt
        
        response = client.models.generate_content(
            model=model,
            contents=content,
            config=generation_config
        )
        
        return jsonify({
            'response': response.text,
            'user_id': g.current_user_id
        }), 200
        
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return jsonify({'error': str(e)}), 500


