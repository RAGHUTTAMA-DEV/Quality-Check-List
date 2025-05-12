from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Import CORS
import pandas as pd
import joblib
from http import HTTPStatus

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for all routes

# Load model and encoders
model = joblib.load('./ml/defect_regressor.pkl')
label_encoders = joblib.load('./ml/label_encoders.pkl')

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "Defect prediction API is running"
    }), HTTPStatus.OK

@app.route('/predict', methods=['POST'])
def predict():
    try:
        input_data = request.get_json()
        
        if not input_data:
            return jsonify({
                "error": "No input data provided"
            }), HTTPStatus.BAD_REQUEST

        required_fields = [
            'Product_ID', 'Product_Type', 'Production_Volume', 'Shift',
            'Operator_Experience_Level', 'Machine_Usage_Hours', 'Temperature',
            'Humidity', 'Previous_Day_Defects'
        ]

        missing_fields = [field for field in required_fields if field not in input_data]
        if missing_fields:
            return jsonify({
                "error": f"Missing required fields: {', '.join(missing_fields)}"
            }), HTTPStatus.BAD_REQUEST

        numeric_fields = ['Production_Volume', 'Machine_Usage_Hours', 'Temperature', 
                          'Humidity', 'Previous_Day_Defects']
        
        try:
            for field in numeric_fields:
                input_data[field] = float(input_data[field])
        except (ValueError, TypeError):
            return jsonify({
                "error": f"Invalid numeric value in field: {field}"
            }), HTTPStatus.BAD_REQUEST

        df = pd.DataFrame([input_data])

        try:
            for col, le in label_encoders.items():
                df[col] = le.transform(df[col])
        except ValueError as e:
            return jsonify({
                "error": f"Invalid categorical value: {str(e)}"
            }), HTTPStatus.BAD_REQUEST

        prediction = model.predict(df)
        predicted_defects = int(prediction[0])

        return jsonify({
            "status": "success",
            "predicted_defects": predicted_defects
        }), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "error": f"Prediction failed: {str(e)}"
        }), HTTPStatus.INTERNAL_SERVER_ERROR

if __name__ == '__main__':
    app.run(debug=True)