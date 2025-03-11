import React, { useState } from "react";
import axios from "axios";
import Report from "./Report";

const appliancesList = ["Bulbs","Fan	","AC (1-star)", "AC (2-star)","AC(3-star)","AC (5-star)","TV	","Refrigerator(1-star)", "Refrigerator(2-star)","Refrigerator(3-star)","Refrigerator(4-star)","Refrigerator(5-star)","Washing Machine", "Microwave","Iron"];

const EnergyForm = () => {
  const [hoursUsed, setHoursUsed] = useState("");
  const [selectedAppliance, setSelectedAppliance] = useState("");
  const [applianceCount, setApplianceCount] = useState(1);
  const [appliances, setAppliances] = useState({});
  const [monthlyUsage, setMonthlyUsage] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Add appliance to selection
  const addAppliance = () => {
    if (selectedAppliance) {
      setAppliances({ ...appliances, [selectedAppliance]: applianceCount });
      setSelectedAppliance("");
      setApplianceCount(1);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const response = await axios.post("http://127.0.0.1:5005/predict", {
        hours_used: Number(hoursUsed),
        appliances,
        monthly_usage: Number(monthlyUsage),
      });

      setResult(response.data);
    } catch (err) {
      setError("❌ Failed to fetch results. Ensure backend is running!");
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
          placeholder="Monthly Usage (kWh)"
          value={monthlyUsage}
          onChange={(e) => setMonthlyUsage(e.target.value)}
          required
        />

        <div className="appliance-selection">
          <select value={selectedAppliance} onChange={(e) => setSelectedAppliance(e.target.value)}>
            <option value="">Select Appliance</option>
            {appliancesList.map((appliance) => (
              <option key={appliance} value={appliance}>
                {appliance}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Count"
            value={applianceCount}
            onChange={(e) => setApplianceCount(Number(e.target.value))}
            min="1"
          />
          <button type="button" onClick={addAppliance}>
            ➕ Add
          </button>
        </div>

        <button type="submit">🔍 Analyze Usage</button>
      </form>

      {/* Display selected appliances */}
      <div className="selected-appliances">
        {Object.keys(appliances).length > 0 && (
          <div>
            <h4>Selected Appliances:</h4>
            <ul>
              {Object.entries(appliances).map(([name, count]) => (
                <li key={name}>
                  {name} x {count}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {error && <p className="error">{error}</p>}
      {result && <Report result={result} />}
    </div>
  );
};

export default EnergyForm;
