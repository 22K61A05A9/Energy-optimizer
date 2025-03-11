import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Report = ({ result }) => {
  if (!result) return null;

  const data = [
    { name: "Total Power (W)", value: result.total_power_watts },
    { name: "Estimated Usage (kWh)", value: result.estimated_usage_kwh },
    { name: "Predicted Usage (kWh)", value: result.predicted_usage },
  ];
  

  return (
    <div className="report-container">
      <h3>📊 Energy Report</h3>
      <p><b>Total Power:</b> {result.total_power_watts} W</p>
      <p><b>Estimated Usage:</b> {result.estimated_usage_kwh} kWh</p>
      <p><b>Predicted Usage:</b> {result.predicted_usage} kWh</p>
      <p><b>⚠️ Alert:</b> <span className={result.alert.includes("⚠️") ? "alert-high" : "alert-low"}>{result.alert}</span></p>

      {/* Chart Visualization */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Report;
