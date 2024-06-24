// src/utils/gaza-destruction.js

export async function getGazaDestructionData() {
    try {
      const response = await fetch("https://data.techforpalestine.org/api/v3/infrastructure-damaged.json");
      const data = await response.json();
  
      // Define cost estimates per unit
      const costEstimates = {
        "civic_buildings.ext_destroyed": 7655000, // Hospitals
        "educational_buildings.ext_destroyed": 341000000 / 56, // Rebuild cost
        "educational_buildings.ext_damaged": 341000000 / 219, // Repair cost
        "places_of_worship.ext_mosques_destroyed": 3000000, // Mosques (Rebuild)
        "places_of_worship.ext_mosques_damaged": 500000, // Mosques (Repair)
        "places_of_worship.ext_churches_destroyed": 3000000, // Churches (Rebuild)
        "residential.ext_destroyed": 100000 // Residential Units
      };
  
      // Start date for calculation
      const startDate = new Date('2023-10-07');
      const latestReportDate = new Date(data[data.length - 1].report_date);
      const totalDays = (latestReportDate - startDate) / (1000 * 60 * 60 * 24) + 1; // +1 to include both start and end dates
  
      // Calculate daily averages and estimated costs
      data.forEach(report => {
        Object.entries(costEstimates).forEach(([key, unitCost]) => {
          const pathParts = key.split('.');
          const currentValue = pathParts.reduce((obj, part) => obj?.[part], report) || 0;
  
          // Calculate daily average over the total period
          const dailyAverage = currentValue / totalDays;
  
          // Append the daily average and estimated cost
          if (pathParts.length === 2) {
            if (!report[pathParts[0]]) report[pathParts[0]] = {};
            report[pathParts[0]][`daily_average_${pathParts[1]}`] = dailyAverage;
            report[pathParts[0]][`estimated_cost_${pathParts[1]}`] = currentValue * unitCost;
          }
        });
      });
  
      console.log("Processed Data:", data);
  
      return { latestReport: data[data.length - 1], fullData: data };
    } catch (error) {
      console.error("Failed to fetch Gaza destruction data:", error);
      return { latestReport: null, fullData: [] };
    }
  }
  