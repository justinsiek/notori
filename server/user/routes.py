from flask import Blueprint, jsonify, g

# Import supabase client and token decorator
from server.config import supabase
from server.auth.utils import token_required

user_bp = Blueprint('user_bp', __name__, url_prefix='/api')

@user_bp.route('/get_user_data', methods=['GET'])
@token_required
def get_user_data():
    """Protected route to get authenticated user data."""
    if not supabase:
        return jsonify({'message': 'Database connection not initialized'}), 500

    try:
        # g.current_user_id is set by the token_required decorator
        user_id = g.current_user_id 
        print(f"Fetching data for user ID: {user_id}")
        
        # Use maybe_single() as ID should be unique
        response = supabase.table('users').select("id, email, created_at").eq('id', user_id).maybe_single().execute()

        if response.data:
            print(f"User data found for {user_id}: {response.data}")
            return jsonify(response.data)
        else:
            # This case might indicate an issue if the token was valid but user not found
            print(f"User not found in DB for ID: {user_id}, despite valid token.")
            return jsonify({'message': 'User not found'}), 404
            
    except AttributeError:
        # Handle case where g.current_user_id might not be set (shouldn't happen with token_required)
        print("Error: current_user_id not found on g. Decorator might have failed.")
        return jsonify({'message': 'Authentication context error'}), 500
    except Exception as e:
        print(f"Error fetching profile for user {user_id}: {e}")
        return jsonify({'message': 'Error fetching profile data'}), 500 