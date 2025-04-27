import os
import datetime
import jwt
from functools import wraps
from flask import request, jsonify, g

# Import jwt_secret from config
from server.config import jwt_secret

def create_jwt(user_id: str) -> str:
    """Generates a JWT token for a given user ID expiring in 7 days."""
    if not jwt_secret:
        print("Error: JWT_SECRET is not configured.")
        raise ValueError("JWT secret is not set.")

    try:
        payload = {
            'user_id': user_id,
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7),
            'iat': datetime.datetime.now(datetime.timezone.utc) # Issued at time
        }
        token = jwt.encode(payload, jwt_secret, algorithm='HS256')
        print(f"JWT created for user {user_id}")
        return token
    except Exception as e:
        print(f"Error creating JWT: {e}")
        raise 

def token_required(f):
    """Decorator to protect routes that require a valid JWT from Authorization header."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not jwt_secret:
             print("JWT secret not configured, cannot verify token.")
             return jsonify({'message': 'Server configuration error'}), 500

        token = None
        auth_header = request.headers.get('Authorization')

        if auth_header:
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                token = parts[1]
            else:
                 print("Invalid Authorization header format.")
                 return jsonify({'message': 'Invalid Authorization header format'}), 401

        if not token:
            print("Authorization token is missing.")
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            print(f"Attempting to decode token: {token[:10]}...")
            payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
            # Store user_id in Flask's application context global `g`
            g.current_user_id = payload['user_id'] 
            print(f"Token decoded successfully. User ID: {g.current_user_id}")
        except jwt.ExpiredSignatureError:
            print("Token has expired.")
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError as e:
            print(f"Token is invalid: {e}")
            return jsonify({'message': 'Token is invalid!'}), 401
        except Exception as e:
            print(f"Error during token decoding: {e}")
            return jsonify({'message': 'Token processing error'}), 500

        return f(*args, **kwargs)
    return decorated_function 