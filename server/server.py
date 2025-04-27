import os
import datetime
import jwt
import bcrypt
from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv
from functools import wraps

load_dotenv()

app = Flask(__name__)
CORS(app)

supabase_url: str = os.getenv('SUPABASE_URL')
supabase_key: str = os.getenv('SUPABASE_KEY')
jwt_secret: str = os.getenv('JWT_SECRET')

if not all([supabase_url, supabase_key, jwt_secret]):
  raise ValueError("Supabase URL/Key or JWT Secret not found. Check .env file location and content.")

supabase: Client = create_client(supabase_url, supabase_key)

print("Server initialized successfully!")

def create_jwt(user_id: str) -> str:
    """Generates a JWT token for a given user ID expiring in 7 days."""
    try:
        payload = {
            'user_id': user_id,
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7),
            'iat': datetime.datetime.now(datetime.timezone.utc) #issued at time
        }
        token = jwt.encode(payload, jwt_secret, algorithm='HS256')
        print(f"JWT created for user {user_id}")
        return token
    except Exception as e:
        print(f"Error creating JWT: {e}")
        raise 

@app.route('/api/register', methods=['POST'])
def register():
    """Registers a new user."""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
    
    try:
        # Hash the password securely
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        print(f"Registering user: {email}") # Temporary print

        # Insert user into Supabase 'users' table
        response = supabase.table('users').insert({
            'email': email,
            'password_hash': hashed_password.decode('utf-8') # Store hash as string
        }).execute()

        # Check Supabase response
        if hasattr(response, 'error') and response.error:
            print(f"Supabase registration error: {response.error}")
            # Basic check for duplicate email (Supabase might return a specific error code)
            if 'duplicate key value violates unique constraint' in str(response.error):
                 return jsonify({'message': 'Email already exists'}), 409
            return jsonify({'message': 'Registration failed due to database error'}), 500

        if response.data:
            print(f"User {email} registered successfully. DB response: {response.data}")
            return jsonify({'message': 'User registered successfully'}), 201
        else:
            # This case might indicate other issues
            print(f"Registration attempt for {email} resulted in no data and no error.")
            return jsonify({'message': 'Registration failed.'}), 400

    except Exception as e:
        print(f"Exception during registration for {email}: {e}")
        return jsonify({'message': 'An internal error occurred during registration'}), 500

if __name__ == '__main__':
    print("Starting server...")
    app.run(debug=True, port=8080)