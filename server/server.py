from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
import os

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Chave secreta do JWT
CORS(app)
jwt = JWTManager(app)

# Dados simulados
users = {
    "admin": {"password": "admin123", "role": "admin"},
    "client": {"password": "client123", "role": "client"}
}

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username').strip() 
    password = data.get('password').strip() 
    
    user = users.get(username)
    if user and user['password'] == password:
        token = create_access_token(identity={'username': username, 'role': user['role']})
        return jsonify(token=token, role=user['role']), 200
    return jsonify({"msg": "Bad credentials"}), 401


@app.route('/upload', methods=['POST'])
@jwt_required()
def upload_image():
    if 'image' not in request.files:
        return jsonify({"msg": "No image part"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"msg": "No selected file"}), 400
    
    filepath = os.path.join('uploads', file.filename)
    file.save(filepath)
    
    # processamento da imagem
    
    return jsonify({"msg": "Image uploaded successfully"}), 200

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True)
