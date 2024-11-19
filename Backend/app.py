from flask import Flask, request, jsonify
from flask_cors import CORS  # Importar Flask-CORS
import cv2
import numpy as np
import base64

app = Flask(__name__)
CORS(app)  # Permitir CORS para todas las rutas

# Cargar el modelo Haar Cascade
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

@app.route('/detect', methods=['POST'])
def detect_faces():
    try:
        # Obtener datos de la solicitud
        data = request.json
        image_data = data['image'].split(",")[1]  # Remover el encabezado de Base64
        image = np.frombuffer(base64.b64decode(image_data), np.uint8)
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)

        # Convertir a escala de grises
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)

        # Crear respuesta con coordenadas de los rostros
        faces_list = [{"x": int(x), "y": int(y), "w": int(w), "h": int(h)} for (x, y, w, h) in faces]
        return jsonify({"faces": faces_list})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
    
