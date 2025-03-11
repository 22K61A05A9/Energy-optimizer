import numpy as np
import pickle
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

# Real-world energy usage dataset
X = np.array([
    [3, 1, 100],  # TV runs 3 hours
    [8, 1, 1500], # AC runs 8 hours
    [5, 1, 300],  # Fridge runs 5 hours
    [6, 1, 200],  # Washing machine runs 6 hours
])
y = np.array([100, 50, 300, 150, 200, 250, 80, 120, 350, 180])

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train RandomForest model
model = RandomForestRegressor(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# Save trained model
with open("energy_model.pkl", "wb") as file:
    pickle.dump(model, file)

print("✅ Model trained and saved successfully!")
