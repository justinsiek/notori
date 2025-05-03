import os
from flask import Flask
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv
import boto3

load_dotenv()

supabase_url: str | None = os.getenv('SUPABASE_URL')
supabase_key: str | None = os.getenv('SUPABASE_KEY')
jwt_secret: str | None = os.getenv('JWT_SECRET')

try:
    if not supabase_url or not supabase_key:
        raise ValueError("Supabase URL/Key not found. Check .env file.")
    supabase: Client = create_client(supabase_url, supabase_key)
    print("Supabase client initialized successfully.")
except ValueError as e:
    print(f"Error initializing Supabase: {e}")
    supabase = None
except Exception as e:
    print(f"An unexpected error occurred during Supabase initialization: {e}")
    supabase = None

if not jwt_secret:
    print("Warning: JWT_SECRET is not set in .env file. Authentication will fail.")
    raise ValueError("JWT Secret not found. Check .env file.")

# S3 configuration
print(f"Checking S3 config: {os.getenv('S3_BUCKET_NAME')}, region: {os.getenv('AWS_REGION')}")

s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)

S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME')

def create_app():
    """Flask application factory."""
    app = Flask(__name__)

    # Configure CORS properly
    CORS(
        app,
        origins=os.getenv('CORS_ORIGINS', "http://localhost:3000").split(','), # Allow multiple origins from env var
        supports_credentials=True
    )

    print("Flask app created and CORS configured.")
    return app 