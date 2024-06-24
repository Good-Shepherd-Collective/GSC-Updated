// src/utils/gaza_deaths.js

export async function getGazaDeathsData() {
    try {
      const response = await fetch("https://data.techforpalestine.org/api/v2/casualties_daily.json");
      const data = await response.json();
  
      // Start date for calculation
      const startDate = new Date('2023-10-07');
      const latestReportDate = new Date(data[data.length - 1].report_date);
      const totalDays = (latestReportDate - startDate) / (1000 * 60 * 60 * 24) + 1; // +1 to include both start and end dates
  
      // Calculate daily averages and estimated costs
      data.forEach(report => {
        report.daily_average_killed = report.killed_cum / totalDays;
        report.daily_average_injured = report.injured_cum / totalDays;
        report.daily_average_killed_children = report.ext_killed_children_cum / totalDays;
        report.daily_average_killed_women = report.ext_killed_women_cum / totalDays;
        report.daily_average_civdef_killed = report.ext_civdef_killed_cum / totalDays;
        report.daily_average_med_killed = report.ext_med_killed_cum / totalDays;
        report.daily_average_press_killed = report.ext_press_killed_cum / totalDays;
  
        // Calculate the number of men killed
        report.ext_killed_men_cum = report.ext_killed_cum - (report.ext_killed_children_cum + report.ext_killed_women_cum);
        report.daily_average_killed_men = report.ext_killed_men_cum / totalDays;
      });
  
      // console.log("Processed Data:", data);
  
      return { latestReport: data[data.length - 1], fullData: data };
    } catch (error) {
      console.error("Failed to fetch Gaza deaths data:", error);
      return { latestReport: null, fullData: [] };
    }
  }
  