// src/utils/gaza_deaths.js

export async function getGazaDeathsData() {
  try {
    const response = await fetch("https://data.techforpalestine.org/api/v2/casualties_daily.json");
    const data = await response.json();

    // Start date for calculation
    const startDate = new Date('2023-10-07');
    const latestReportDate = new Date(data[data.length - 1].report_date);
    const totalDays = Math.round((latestReportDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    console.log("Total Days:", totalDays);

    // Calculate daily averages and cumulative men killed
    data.forEach(report => {
      // Calculate the number of men killed
      report.ext_killed_men_cum = report.ext_killed_cum - (report.ext_killed_children_cum + report.ext_killed_women_cum);

      // Calculate daily averages
      report.daily_average_killed = report.ext_killed_cum / totalDays;
      report.daily_average_injured = report.ext_injured_cum / totalDays;
      report.daily_average_killed_children = report.ext_killed_children_cum / totalDays;
      report.daily_average_killed_women = report.ext_killed_women_cum / totalDays;
      report.daily_average_killed_men = report.ext_killed_men_cum / totalDays;
      report.daily_average_civdef_killed = report.ext_civdef_killed_cum / totalDays;
      report.daily_average_med_killed = report.ext_med_killed_cum / totalDays;
      report.daily_average_press_killed = report.ext_press_killed_cum / totalDays;
    });

    // Calculate 5-day averages
    const calculate5DayAverage = (data, key, extKey) => {
      const last5Days = data.slice(-5);
      const validValues = last5Days.map(report => report[key] !== undefined ? report[key] : report[extKey] || 0);
      const sum = validValues.reduce((total, value) => total + value, 0);
      return sum / 5;
    };

    // Adding 5-day averages to the latest report
    const latestReport = data[data.length - 1];
    latestReport.five_day_average_killed = calculate5DayAverage(data, 'killed', 'ext_killed');
    latestReport.five_day_average_injured = calculate5DayAverage(data, 'injured', 'ext_injured');
    latestReport.five_day_average_killed_children = calculate5DayAverage(data, 'killed_children_cum', 'ext_killed_children_cum');
    latestReport.five_day_average_killed_women = calculate5DayAverage(data, 'killed_women_cum', 'ext_killed_women_cum');
    latestReport.five_day_average_killed_men = calculate5DayAverage(data, 'killed_men_cum', 'ext_killed_men_cum');
    latestReport.five_day_average_civdef_killed = calculate5DayAverage(data, 'civdef_killed_cum', 'ext_civdef_killed_cum');
    latestReport.five_day_average_med_killed = calculate5DayAverage(data, 'med_killed_cum', 'ext_med_killed_cum');
    latestReport.five_day_average_press_killed = calculate5DayAverage(data, 'press_killed_cum', 'ext_press_killed_cum');

    // Log the specific report date
    const specificReport = data.find(report => report.report_date === '2024-06-26');
    if (specificReport) {
      console.log("Report for 2024-06-26:", specificReport);
    } else {
      console.log("No report found for 2024-06-26.");
    }

    return { latestReport, fullData: data };
  } catch (error) {
    console.error("Failed to fetch Gaza deaths data:", error);
    return { latestReport: null, fullData: [] };
  }
}
