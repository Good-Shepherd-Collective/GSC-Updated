// Usage: node src/utils/data-processing/gaza-deaths-convert.js

import { getGazaDeathsData } from '../gaza_deaths.js';
import { json2csv } from 'json-2-csv';
import XLSX from 'xlsx';
import fs from 'fs-extra';
import path from 'path';

const outputFolder = path.resolve('public/data_sheets');

// Ensure the output directory exists
fs.ensureDirSync(outputFolder);

const processGazaDeathsData = async () => {
  try {
    const { latestReport, fullData } = await getGazaDeathsData();

    if (!fullData.length) {
      console.error('No data fetched. Exiting...');
      return;
    }

    console.log("Fetched Data:", fullData);

    // Create rows with relevant data
    const rows = fullData.map(report => ({
      reportDate: report.report_date,
      totalKilled: report.ext_killed_cum,
      totalInjured: report.ext_injured_cum,
      childrenKilled: report.ext_killed_children_cum,
      womenKilled: report.ext_killed_women_cum,
      menKilled: report.ext_killed_men_cum,
      civilDefenseKilled: report.ext_civdef_killed_cum,
      medicalPersonnelKilled: report.ext_med_killed_cum,
      pressKilled: report.ext_press_killed_cum,
      dailyAverageKilled: report.daily_average_killed,
      dailyAverageInjured: report.daily_average_injured,
      dailyAverageKilledChildren: report.daily_average_killed_children,
      dailyAverageKilledWomen: report.daily_average_killed_women,
      dailyAverageKilledMen: report.daily_average_killed_men,
      dailyAverageCivdefKilled: report.daily_average_civdef_killed,
      dailyAverageMedKilled: report.daily_average_med_killed,
      dailyAveragePressKilled: report.daily_average_press_killed,
      fiveDayAverageKilled: report.five_day_average_killed,
      fiveDayAverageInjured: report.five_day_average_injured,
      fiveDayAverageKilledChildren: report.five_day_average_killed_children,
      fiveDayAverageKilledWomen: report.five_day_average_killed_women,
      fiveDayAverageKilledMen: report.five_day_average_killed_men,
      fiveDayAverageCivdefKilled: report.five_day_average_civdef_killed,
      fiveDayAverageMedKilled: report.five_day_average_med_killed,
      fiveDayAveragePressKilled: report.five_day_average_press_killed,
      fiveDayTotalKilled: report.five_day_total_killed,
      fiveDayTotalInjured: report.five_day_total_injured,
      fiveDayTotalKilledChildren: report.five_day_total_killed_children,
      fiveDayTotalKilledWomen: report.five_day_total_killed_women,
      fiveDayTotalKilledMen: report.five_day_total_killed_men,
      fiveDayTotalCivdefKilled: report.five_day_total_civdef_killed,
      fiveDayTotalMedKilled: report.five_day_total_med_killed,
      fiveDayTotalPressKilled: report.five_day_total_press_killed
    }));

    console.log("Structured Rows:", rows);

    // Convert rows to CSV format
    const csvData = await json2csv(rows);

    // Write CSV to file
    const csvFilePath = path.join(outputFolder, 'gaza_deaths_and_injuries.csv');
    fs.writeFileSync(csvFilePath, csvData);
    console.log(`CSV file saved to ${csvFilePath}`);

    // Convert rows to XLSX format
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Gaza Deaths and Injuries');

    // Write XLSX to file
    const xlsxFilePath = path.join(outputFolder, 'gaza_deaths_and_injuries.xlsx');
    XLSX.writeFile(workbook, xlsxFilePath);
    console.log(`XLSX file saved to ${xlsxFilePath}`);
  } catch (error) {
    console.error('Error processing data:', error);
  }
};

processGazaDeathsData().catch(error => console.error('Error processing data:', error));