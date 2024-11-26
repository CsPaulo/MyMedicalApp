from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
import os
import tensorflow as tf
from werkzeug.utils import secure_filename
import pickle

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Chave secreta do JWT
CORS(app)
jwt = JWTManager(app)

# Dados simulados
users = {
    "admin": {"password": "admin123", "role": "admin"},
    "client": {"password": "client123", "role": "client"}
}

# Carregar o modelo de detecção de câncer
model_path = 'C:/Users/cspau/Desktop/coisas do pc/Projeto Cancer de Colon/svm_modelEfficientNet.pkl'
if not os.path.exists(model_path):
    raise FileNotFoundError(f"No file or directory found at {model_path}")

with open(model_path, 'rb') as file:
    model = pickle.load(file)

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

@app.route('/predict', methods=['POST'])
@jwt_required()
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    filename = secure_filename(file.filename)
    file_path = os.path.join('uploads', filename)
    file.save(file_path)
    
    # Preprocessar a imagem e fazer a previsão
    image = tf.keras.preprocessing.image.load_img(file_path, target_size=(224, 224))
    image = tf.keras.preprocessing.image.img_to_array(image)
    image = image / 255.0
    image = tf.expand_dims(image, 0)
    
    prediction = model.predict(image)
    result = 'Cancer' if prediction[0][0] > 0.5 else 'No Cancer'
    
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)