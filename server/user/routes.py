from flask import Blueprint, jsonify, g

# Import supabase client and token decorator
from server.config import supabase
from server.auth.utils import token_required

user_bp = Blueprint('user_bp', __name__, url_prefix='/api/user')

@user_bp.route('/me', methods=['GET'])
@token_required
def get_current_user():
    """Gets the details for the currently authenticated user."""
    if not supabase:
        return jsonify({'message': 'Database connection not initialized'}), 500

    # g.current_user_id is set by the @token_required decorator
    user_id = getattr(g, 'current_user_id', None)

    if not user_id:
        # This case should ideally not be reached if @token_required works correctly
        return jsonify({'message': 'Authentication required'}), 401

    try:
        print(f"Fetching user data for user ID: {user_id}")
        # Fetch user data, excluding the password hash
        response = supabase.table('users').select("id, email, created_at").eq('id', user_id).maybe_single().execute()

        if hasattr(response, 'error') and response.error:
             print(f"Supabase error fetching user {user_id}: {response.error}")
             return jsonify({'message': 'Error fetching user data'}), 500

        if not response.data:
            print(f"User with ID {user_id} not found in database, despite valid token.")
            return jsonify({'message': 'User not found'}), 404

        print(f"Successfully fetched data for user {user_id}")
        return jsonify(response.data), 200

    except Exception as e:
        print(f"Exception fetching user data for user {user_id}: {e}")
        return jsonify({'message': 'An internal error occurred'}), 500 