from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

# -----------------------------
# Load ML model
# -----------------------------
with open("energy_model.pkl", "rb") as f:
    model = pickle.load(f)

# -----------------------------
# Appliance base power (Watts)
# -----------------------------
APPLIANCE_POWER = {
    "Fan": 75,
    "Bulb": 10,
    "TV": 150,
    "Iron": 1000,
    "Washing Machine": 500,
    "Microwave": 1200,
    "Refrigerator": 180,
    "AC": 1500
}

# Star rating efficiency
STAR_EFFICIENCY = {
    1: 1.30,
    2: 1.15,
    3: 1.00,
    4: 0.90,
    5: 0.80
}

@app.route("/")
def home():
    return jsonify({"message": "Energy Optimization API running"})

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    hours = data["hours_used"]
    season = data["season"]          # "summer" or "winter"
    appliances = data["appliances"]  # dict
    past_usage = data["monthly_usage"]

    season_factor = 1 if season == "summer" else 0

    total_power = 0
    star_sum = 0
    count = 0

    for app_name, details in appliances.items():
        qty = details["count"]
        star = details["star"]

        base_power = APPLIANCE_POWER.get(app_name, 0)
        adjusted_power = base_power * STAR_EFFICIENCY[star]

        total_power += adjusted_power * qty
        star_sum += star * qty
        count += qty

    avg_star = star_sum / count if count else 3

    # Estimated usage (rule-based)
    estimated_kwh = (total_power * hours * 30) / 1000

    # ML Prediction
    features = np.array([[hours, count, avg_star, season_factor, past_usage]])
    predicted_kwh = model.predict(features)[0]

    # Alert system
    if predicted_kwh < 200:
        alert = "✅ Excellent efficiency"
    elif predicted_kwh < 500:
        alert = "🔔 Moderate usage – small optimizations recommended"
    elif predicted_kwh < 800:
        alert = "⚠️ High usage – reduce AC & heavy appliances"
    else:
        alert = "🚨 Very high usage – immediate action required"

    return jsonify({
        "total_power_watts": round(total_power, 2),
        "estimated_usage_kwh": round(estimated_kwh, 2),
        "predicted_usage_kwh": round(predicted_kwh, 2),
        "alert": alert
    })

if __name__ == "__main__":
    app.run(port=5005, debug=True)
