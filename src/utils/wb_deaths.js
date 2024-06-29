export async function getWestBankDeathsData() {
    try {
      const response = await fetch("https://data.techforpalestine.org/api/v2/west_bank_daily.json");
      const data = await response.json();
  
      // Start date for calculation
      const startDate = new Date('2023-10-07');
      const latestReportDate = new Date(data[data.length - 1].report_date);
      const totalDays = (latestReportDate - startDate) / (1000 * 60 * 60 * 24) + 1;
  
      // Calculate daily averages, men killed and injured, and 14-day averages
      data.forEach((report, index) => {
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
  
        // Calculate 14-day averages
        if (index >= 13) {
          const last14Days = data.slice(index - 13, index + 1);
          report.fourteen_day_average_killed = calculateAverage(last14Days, 'killed_cum');
          report.fourteen_day_average_killed_children = calculateAverage(last14Days, 'killed_children_cum');
          report.fourteen_day_average_killed_men = report.fourteen_day_average_killed - report.fourteen_day_average_killed_children;
          report.fourteen_day_average_injured = calculateAverage(last14Days, 'injured_cum');
          report.fourteen_day_average_injured_children = calculateAverage(last14Days, 'injured_children_cum');
          report.fourteen_day_average_injured_men = report.fourteen_day_average_injured - report.fourteen_day_average_injured_children;
          report.fourteen_day_average_settler_attacks = calculateAverage(last14Days, 'settler_attacks_cum');
        }
      });
  
      // Format the date to mm.dd.yyyy
      const formatDateMMDDYYYY = (date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}.${day}.${year}`;
      };
  
      const formattedLatestReportDate = formatDateMMDDYYYY(latestReportDate);
  
      console.log("Most recent report date:", formattedLatestReportDate);
      console.log("Data for the most recent report date:", data[data.length - 1]);
  
      return { latestReport: { ...data[data.length - 1], formattedReportDate: formattedLatestReportDate }, fullData: data };
    } catch (error) {
      console.error("Failed to fetch West Bank deaths data:", error);
      return { latestReport: null, fullData: [] };
    }
  }
  
  // Helper function to calculate average of daily changes
  function calculateAverage(data, key) {
    const firstValue = data[0][key];
    const lastValue = data[data.length - 1][key];
    const totalChange = lastValue - firstValue;
    return totalChange / 14;
  }