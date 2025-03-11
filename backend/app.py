from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Load trained ML model
with open("energy_model.pkl", "rb") as file:
    model = pickle.load(file)

# Appliance power ratings (in watts)
APPLIANCE_POWER = {
    "Bulbs": 10, "Fan": 50,
    "AC (1-star)": 2000, "AC (2-star)": 1700,
    "AC(3-star)": 1200, "AC (5-star)": 840, "TV": 150,
    "Refrigerator(1-star)": 250, "Refrigerator(2-star)": 389,
    "Refrigerator(3-star)": 500, "Refrigerator(4-star)": 600,
    "Refrigerator(5-star)": 750, "Washing Machine": 500,
    "Microwave": 1200, "Iron": 1000
}

@app.route('/')
def home():
    return jsonify({"message": "Energy Optimization API is running!"})

@app.route('/predict', methods=['POST'])
def predict_energy():
    """Predict energy usage and provide recommendations."""
    try:
        data = request.json
        hours_used = data.get("hours_used")
        appliances = data.get("appliances")
        monthly_usage = data.get("monthly_usage")

        if not all([hours_used, appliances, monthly_usage]):
            return jsonify({"error": "Missing parameters"}), 400

        # Compute total power consumption
        total_power = sum(APPLIANCE_POWER.get(app, 0) * count for app, count in appliances.items())
        estimated_usage = (total_power * hours_used * 30) / 1000  # Convert to kWh

        # ML model prediction
        input_features = np.array([[hours_used, len(appliances), monthly_usage]])
        predicted_usage = model.predict(input_features)[0]

        # Alerts & Recommendations
        if predicted_usage < 200:
            alert = "✅ Your energy usage is highly efficient!"
        elif 200 <= predicted_usage < 500:
            alert = "🔔 Your energy usage is moderate. Consider minor optimizations."
        elif 500 <= predicted_usage < 1000:
            alert = "⚠️ High energy usage detected! Try reducing consumption."
        else:
            alert = "🚨 Critical energy usage! Immediate action is needed to reduce costs."

        return jsonify({
            "total_power_watts": total_power,
            "estimated_usage_kwh": estimated_usage,
            "predicted_usage": predicted_usage,
            "alert": alert
        })

    except Exception as e:
        print("Error:", traceback.format_exc())
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5005)
