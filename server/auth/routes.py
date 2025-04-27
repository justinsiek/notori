from flask import Blueprint, request, jsonify, make_response
import bcrypt

# Import Supabase client and JWT creation function
from server.config import supabase
from server.auth.utils import create_jwt

# Define the blueprint
auth_bp = Blueprint('auth_bp', __name__, url_prefix='/api')

@auth_bp.route('/register', methods=['POST'])
def register():
    """Registers a new user."""
    if not supabase:
        return jsonify({'message': 'Database connection not initialized'}), 500
        
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
    try:
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        print(f"Attempting registration for user: {email}")

        response = supabase.table('users').insert({
            'email': email,
            'password_hash': hashed_password.decode('utf-8') # Store hash as string
        }).execute()

        # Check for Supabase errors specifically
        if hasattr(response, 'error') and response.error:
            error_message = str(response.error)
            print(f"Supabase registration error: {error_message}")
            # Check for uniqueness constraint violation (email already exists)
            if '23505' in error_message or 'duplicate key value violates unique constraint' in error_message:
                 return jsonify({'message': 'Email already exists'}), 409 # Conflict
            return jsonify({'message': 'Registration failed due to database error'}), 500

        # Check if data was returned (successful insert)
        if response.data:
            print(f"User {email} registered successfully. DB response: {response.data}")
            return jsonify({'message': 'User registered successfully'}), 201 # Created
        else:
            # This case might indicate an issue not caught by the error attribute
            print(f"Registration attempt for {email} resulted in no data and no explicit error.")
            return jsonify({'message': 'Registration failed unexpectedly.'}), 500

    except Exception as e:
        print(f"Exception during registration for {email}: {e}")
        return jsonify({'message': 'An internal error occurred during registration'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Logs in a user and returns a JWT via HttpOnly cookie."""
    if not supabase:
        return jsonify({'message': 'Database connection not initialized'}), 500
        
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password required'}), 400

    try:
        print(f"Login attempt for: {email}")
        # Select user by email
        response = supabase.table('users').select("id, password_hash").eq('email', email).maybe_single().execute()

        # Check if user exists and data is retrieved
        if not response.data:
            print(f"Login failed: User {email} not found.")
            return jsonify({'message': 'Invalid credentials'}), 401 # Unauthorized

        user_data = response.data
        stored_hash = user_data['password_hash'].encode('utf-8')

        # Verify password
        if bcrypt.checkpw(password.encode('utf-8'), stored_hash):
            user_id = user_data['id']
            token = create_jwt(user_id) # Use the utility function
            print(f"Login successful for {email}. Setting HttpOnly cookie.")
    
            resp = make_response(jsonify({'message': 'Login successful'}))
            
            # Set cookie options
            cookie_options = {
                'httponly': True,
                'samesite': 'Lax',
                'secure': request.is_secure, # Set Secure flag based on request context
                'path': '/'
            }
            resp.set_cookie('jwtToken', token, **cookie_options)

            print(f"DEBUG: Response headers being set for {email}: {resp.headers}")
            return resp, 200 # OK
        else:
            print(f"Login failed: Incorrect password for {email}.")
            return jsonify({'message': 'Invalid credentials'}), 401 # Unauthorized

    except Exception as e:
        print(f"Exception during login for {email}: {e}")
        return jsonify({'message': 'An error occurred during login'}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Clears the JWT token cookie to log the user out."""
    print("Logout request received.")
    resp = make_response(jsonify({'message': 'Logout successful'}))
    
    # Clear the cookie by setting it to empty and expiring it immediately
    cookie_options = {
        'httponly': True,
        'samesite': 'Lax',
        'secure': request.is_secure,
        'path': '/',
        'expires': 0 # Expire immediately
    }
    resp.set_cookie('jwtToken', '', **cookie_options)
    print("Logout successful, cookie cleared.")
    return resp, 200 # OK 