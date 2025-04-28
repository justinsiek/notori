from server.config import create_app
from server.auth.routes import auth_bp
from server.user.routes import user_bp
from server.documents.routes import documents_bp
import os

app = create_app()


app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(documents_bp)

@app.route('/')
def index():
    """ A simple index route to confirm the server is running. """
    return "Flask server is running!"

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    print(f"Starting Flask server on port {port}...")
    app.run(debug=os.getenv('FLASK_DEBUG', 'True').lower() == 'true', host='0.0.0.0', port=port)