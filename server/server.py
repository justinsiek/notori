from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/api/login', methods=['GET'])
def login():
    email = request.args.get('email', default='0', type=str)
    password = request.args.get('password', default='0', type=str)

    print(email, password)

    return jsonify({'result': 'success'})

if __name__ == '__main__':
    app.run(debug=True, port=8080)