import React from "react";
import {AnomalyData} from "../types/index";

interface HeatmapProps {
  anomalyData: AnomalyData;
}

const Heatmap: React.FC<HeatmapProps> = ({ anomalyData }) => {
  const regions = Object.keys(anomalyData);

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl shadow">
      {regions.map((region) => {
        const count = anomalyData[region];
        let color = "bg-green-300";
        if (count > 5 && count <= 10) color = "bg-yellow-400";
        if (count > 10) color = "bg-red-500";

        return (
          <div
            key={region}
            className={`p-6 text-center rounded-xl text-white font-semibold ${color}`}
          >
            {region} <br />
            <span className="text-sm">{count} anomalies</span>
          </div>
        );
      })}
    </div>
  );
};

export default Heatmap;
