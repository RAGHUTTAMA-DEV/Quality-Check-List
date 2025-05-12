import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torch
from torchvision import models, transforms
import torch.nn as nn

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Image transformations
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# Class labels
class_names = ['crazing', 'inclusion', 'patches', 'pitted_surface', 'rolled-in_scale', 'scratches']

# Load model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = models.resnet18(weights=None)  # Updated deprecated parameter
model.fc = nn.Sequential(
    nn.Dropout(0.4),
    nn.Linear(model.fc.in_features, len(class_names))
)
model_path = os.path.join(os.path.dirname(__file__), 'defect_classifier.pth')
model.load_state_dict(torch.load(model_path, map_location=device))
model.to(device)
model.eval()

@app.route('/')
def home():
    return jsonify({'message': 'Defect detection API is running'})

@app.route('/image/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file found in request'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(image_path)

        image = Image.open(image_path).convert('RGB')
        input_tensor = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(input_tensor)
            _, predicted = torch.max(output, 1)
            prediction = class_names[predicted.item()]

        return jsonify({
            'prediction': prediction,
            'filename': file.filename
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)