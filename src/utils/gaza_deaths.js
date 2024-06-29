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

      // Calculate daily averages using extrapolated data
      report.daily_average_killed = report.ext_killed_cum / totalDays;
      report.daily_average_injured = report.ext_injured_cum / totalDays;
      report.daily_average_killed_children = report.ext_killed_children_cum / totalDays;
      report.daily_average_killed_women = report.ext_killed_women_cum / totalDays;
      report.daily_average_killed_men = report.ext_killed_men_cum / totalDays;
      report.daily_average_civdef_killed = report.ext_civdef_killed_cum / totalDays;
      report.daily_average_med_killed = report.ext_med_killed_cum / totalDays;
      report.daily_average_press_killed = report.ext_press_killed_cum / totalDays;
    });

    // Calculate 5-day averages and totals
    const calculate5DayStats = (data, key) => {
      const last5Days = data.slice(-5);
      const dailyChanges = last5Days.map((report, index) => {
        if (index === 0) {
          return report[key] - (data[data.length - 6] ? data[data.length - 6][key] : report[key]);
        } else {
          return report[key] - last5Days[index - 1][key];
        }
      });
      const total = dailyChanges.reduce((sum, value) => sum + value, 0);
      return {
        average: total / 5,
        total: total
      };
    };

    // Adding 5-day averages and totals to the latest report
    const latestReport = data[data.length - 1];
    const fiveDayStats = {
      killed: calculate5DayStats(data, 'ext_killed_cum'),
      injured: calculate5DayStats(data, 'ext_injured_cum'),
      killed_children: calculate5DayStats(data, 'ext_killed_children_cum'),
      killed_women: calculate5DayStats(data, 'ext_killed_women_cum'),
      killed_men: calculate5DayStats(data, 'ext_killed_men_cum'),
      civdef_killed: calculate5DayStats(data, 'ext_civdef_killed_cum'),
      med_killed: calculate5DayStats(data, 'ext_med_killed_cum'),
      press_killed: calculate5DayStats(data, 'ext_press_killed_cum')
    };

    Object.keys(fiveDayStats).forEach(key => {
      latestReport[`five_day_average_${key}`] = fiveDayStats[key].average;
      latestReport[`five_day_total_${key}`] = fiveDayStats[key].total;
    });

    // Log out only the 7 most recent report dates with all the data
    const recentReports = data.slice(-7);
    // console.log("Recent Reports:", recentReports);

    return { latestReport, fullData: data, recentReports };
  } catch (error) {
    console.error("Failed to fetch Gaza deaths data:", error);
    return { latestReport: null, fullData: [], recentReports: [] };
  }
}