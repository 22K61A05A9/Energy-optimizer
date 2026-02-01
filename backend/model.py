import numpy as np
import pickle
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

# -----------------------------
# Features:
# hours_per_day, appliance_count,
# avg_star_rating, season, past_month_usage
# -----------------------------

X = np.array([
    [6, 3, 4, 1, 180],   # summer, AC usage
    [8, 4, 3, 1, 420],
    [5, 2, 5, 0, 120],   # winter
    [7, 5, 2, 1, 650],
    [4, 2, 4, 0, 100],
    [9, 6, 3, 1, 900],
    [3, 1, 5, 0, 80],
    [6, 4, 4, 1, 300],
    [5, 3, 3, 0, 200],
    [8, 5, 2, 1, 700]
])

# Target: monthly energy consumption (kWh)
y = np.array([210, 480, 130, 750, 120, 980, 90, 360, 220, 860])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestRegressor(
    n_estimators=300,
    random_state=42
)

model.fit(X_train, y_train)

with open("energy_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Real-world energy ML model trained & saved")
