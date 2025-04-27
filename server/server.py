from server.config import create_app
from server.auth.routes import auth_bp
from server.user.routes import user_bp
import os # Needed for port

app = create_app()

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)

@app.route('/')
def index():
    """ A simple index route to confirm the server is running. """
    return "Flask server is running!"

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080)) # Use environment variable for port or default
    print(f"Starting Flask server on port {port}...")
    # Use debug=False for production environments
    app.run(debug=os.getenv('FLASK_DEBUG', 'True').lower() == 'true', host='0.0.0.0', port=port)