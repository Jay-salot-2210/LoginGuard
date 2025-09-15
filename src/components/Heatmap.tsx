import React from "react";
import { AnomalyData } from "../types/index";

interface HeatmapProps {
  anomalyData: AnomalyData;
}

const Heatmap: React.FC<HeatmapProps> = ({ anomalyData }) => {
  const regions = Object.keys(anomalyData);

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl shadow">
      {regions.map((region) => {
        // ❌ Skip Bermuda, ocean, or unknown regions
        if (
          region.toLowerCase().includes("bermuda") ||
          region.toLowerCase().includes("ocean") ||
          region.toLowerCase().includes("unknown")
        ) {
          return null;
        }

        const { red, yellow, green } = anomalyData[region];
        const total = red + yellow + green;

        return (
          <div
            key={region}
            className={`p-4 text-center rounded-xl text-white font-semibold bg-gradient-to-r ${
              red > 0
                ? "from-red-500"
                : yellow > 0
                ? "from-yellow-400"
                : "from-green-300"
            } to-gray-800`}
          >
            <div className="text-lg">{region}</div>
            <div className="text-sm font-normal">
              Total: {total} anomalies
            </div>
            <div className="mt-2 text-xs font-medium space-y-1">
              {red > 0 && <div>🔴 {red} red</div>}
              {yellow > 0 && <div>🟡 {yellow} yellow</div>}
              {green > 0 && <div>🟢 {green} green</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Heatmap;
