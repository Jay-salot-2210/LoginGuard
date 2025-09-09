import React, { useState } from "react";
import { motion } from "framer-motion";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { AnalysisResults } from "../types";

// Props interface
interface RegionalHeatMapProps {
  results: AnalysisResults;
}

// GeoJSON URL
const geoUrl =
  "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

const RegionalHeatMap: React.FC<RegionalHeatMapProps> = ({ results }) => {
  const [tooltipContent, setTooltipContent] = useState("");

  // Dynamic mapping: lowercase country -> anomaly data
  const regionRiskMap = results.regionalData.reduce((acc, region) => {
    const countryName = region.region.trim();
    acc[countryName.toLowerCase()] = {
      severity: region.severity,
      count: region.count,
    };
    return acc;
  }, {} as Record<string, { severity: string; count: number }>);

  const maxCount = Math.max(...results.regionalData.map((r) => r.count), 1);

  // Dynamic color based on severity and intensity
  const getRegionColor = (name: string) => {
    const region = regionRiskMap[name.toLowerCase()];
    if (!region) return "#d1d5db"; // gray for no data
    const intensity = Math.min(region.count / maxCount, 1);
    switch (region.severity) {
      case "High":
        return `rgba(220,38,38,${0.4 + 0.6 * intensity})`; // red shades
      case "Medium":
        return `rgba(245,158,11,${0.4 + 0.6 * intensity})`; // orange shades
      case "Low":
        return `rgba(5,150,105,${0.4 + 0.6 * intensity})`; // green shades
      default:
        return "#d1d5db";
    }
  };

  const handleMouseEnter = (geo: any) => {
    const region = regionRiskMap[geo.properties.name.toLowerCase()];
    if (region) {
      setTooltipContent(
        `${geo.properties.name}: ${region.count} events (${region.severity} risk)`
      );
    } else {
      setTooltipContent(`${geo.properties.name}: No data`);
    }
  };

  const handleMouseLeave = () => setTooltipContent("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Regional Anomalies Heat Map
      </h3>

      <div className="relative w-full">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 140, center: [0, 20] }}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => handleMouseEnter(geo)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    default: {
                      fill: getRegionColor(geo.properties.name),
                      outline: "none",
                      stroke: "#fff",
                      strokeWidth: 0.5,
                    },
                    hover: {
                      fill: getRegionColor(geo.properties.name),
                      outline: "none",
                      stroke: "#111827",
                      strokeWidth: 1,
                      filter: "brightness(1.3)",
                    },
                    pressed: {
                      fill: getRegionColor(geo.properties.name),
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>

        {tooltipContent && (
          <div className="absolute top-4 left-4 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm z-10">
            {tooltipContent}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RegionalHeatMap;
