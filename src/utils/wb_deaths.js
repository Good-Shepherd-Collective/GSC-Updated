// src/utils/wb_deaths.js

export async function getWestBankDeathsData() {
  try {
      const response = await fetch("https://data.techforpalestine.org/api/v2/west_bank_daily.json");
      const data = await response.json();

      // Start date for calculation
      const startDate = new Date('2023-10-07');
      const latestReportDate = new Date(data[data.length - 1].report_date);
      const totalDays = (latestReportDate - startDate) / (1000 * 60 * 60 * 24) + 1; // +1 to include both start and end dates

      // Calculate daily averages and calculate men killed and injured
      data.forEach(report => {
          report.daily_average_killed = report.killed_cum / totalDays;
          report.daily_average_killed_children = report.killed_children_cum / totalDays;
          report.daily_average_injured = report.injured_cum / totalDays;
          report.daily_average_injured_children = report.injured_children_cum / totalDays;
          report.daily_average_settler_attacks = report.settler_attacks_cum / totalDays;

          // Calculate the number of men killed and injured
          report.killed_men_cum = report.killed_cum - report.killed_children_cum;
          report.daily_average_killed_men = report.killed_men_cum / totalDays;

          report.injured_men_cum = report.injured_cum - report.injured_children_cum;
          report.daily_average_injured_men = report.injured_men_cum / totalDays;
      });

      // Format the date to mm.dd.yyyy
      const formatDateMMDDYYYY = (date) => {
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const year = date.getFullYear();
          return `${month}.${day}.${year}`;
      };

      const formattedLatestReportDate = formatDateMMDDYYYY(latestReportDate);

      return { latestReport: { ...data[data.length - 1], formattedReportDate: formattedLatestReportDate }, fullData: data };
  } catch (error) {
      console.error("Failed to fetch West Bank deaths data:", error);
      return { latestReport: null, fullData: [] };
  }
}
