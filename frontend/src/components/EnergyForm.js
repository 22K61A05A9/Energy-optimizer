import React, { useState } from "react";
import axios from "axios";
import Report from "./Report";

const appliancesList = [
  "Bulb",
  "Fan",
  "TV",
  "Iron",
  "Washing Machine",
  "Microwave",
  "Refrigerator",
  "AC"
];

const EnergyForm = () => {
  const [hoursUsed, setHoursUsed] = useState("");
  const [monthlyUsage, setMonthlyUsage] = useState("");
  const [season, setSeason] = useState("summer");

  const [selectedAppliance, setSelectedAppliance] = useState("");
  const [applianceCount, setApplianceCount] = useState(1);
  const [applianceStar, setApplianceStar] = useState(3);

  const [appliances, setAppliances] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Add appliance with star rating
  const addAppliance = () => {
    if (selectedAppliance) {
      setAppliances({
        ...appliances,
        [selectedAppliance]: {
          count: applianceCount,
          star: applianceStar
        }
      });

      setSelectedAppliance("");
      setApplianceCount(1);
      setApplianceStar(3);
    }
  };

  // Submit to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5005/predict",
        {
          hours_used: Number(hoursUsed),
          season: season,
          monthly_usage: Number(monthlyUsage),
          appliances: appliances
        }
      );

      setResult(response.data);
    } catch (err) {
      setError("❌ Failed to fetch results. Ensure backend is running!");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>⚡ Energy Usage Optimization</h2>

      <form onSubmit={handleSubmit} className="energy-form">

        <input
          type="number"
          placeholder="Hours Used per Day"
          value={hoursUsed}
          onChange={(e) => setHoursUsed(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Last Month Usage (kWh)"
          value={monthlyUsage}
          onChange={(e) => setMonthlyUsage(e.target.value)}
          required
        />

        {/* Season */}
        <select value={season} onChange={(e) => setSeason(e.target.value)}>
          <option value="summer">Summer</option>
          <option value="winter">Winter</option>
        </select>

        {/* Appliance Selection */}
        <div className="appliance-selection">
          <select
            value={selectedAppliance}
            onChange={(e) => setSelectedAppliance(e.target.value)}
          >
            <option value="">Select Appliance</option>
            {appliancesList.map((appliance) => (
              <option key={appliance} value={appliance}>
                {appliance}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            placeholder="Count"
            value={applianceCount}
            onChange={(e) => setApplianceCount(Number(e.target.value))}
          />

          <select
            value={applianceStar}
            onChange={(e) => setApplianceStar(Number(e.target.value))}
          >
            <option value={1}>1 Star</option>
            <option value={2}>2 Star</option>
            <option value={3}>3 Star</option>
            <option value={4}>4 Star</option>
            <option value={5}>5 Star</option>
          </select>

          <button type="button" onClick={addAppliance}>
            ➕ Add
          </button>
        </div>

        <button type="submit">🔍 Analyze Usage</button>
      </form>

      {/* Selected Appliances */}
      {Object.keys(appliances).length > 0 && (
        <div className="selected-appliances">
          <h4>Selected Appliances:</h4>
          <ul>
            {Object.entries(appliances).map(([name, data]) => (
              <li key={name}>
                {name} × {data.count} ({data.star}-star)
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="error">{error}</p>}
      {result && <Report result={result} />}
    </div>
  );
};

export default EnergyForm;
