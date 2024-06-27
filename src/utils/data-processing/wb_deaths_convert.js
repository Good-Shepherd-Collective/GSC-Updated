// Usage: node src/utils/data-processing/wb_deaths_convert.js

import { getWestBankDeathsData } from '../wb_deaths.js';
import { json2csv } from 'json-2-csv';
import XLSX from 'xlsx';
import fs from 'fs-extra';
import path from 'path';

const outputFolder = path.resolve('public/data_sheets');

// Ensure the output directory exists
fs.ensureDirSync(outputFolder);

const processWBDeathsData = async () => {
  try {
    const { latestReport, fullData } = await getWestBankDeathsData();

    if (!fullData.length) {
      console.error('No data fetched. Exiting...');
      return;
    }

    console.log("Fetched Data:", fullData);

    // Create rows with relevant data
    const rows = fullData.map(report => ({
      reportDate: report.report_date,
      dailyAverageKilled: report.daily_average_killed,
      dailyAverageKilledChildren: report.daily_average_killed_children,
      dailyAverageInjured: report.daily_average_injured,
      dailyAverageInjuredChildren: report.daily_average_injured_children,
      dailyAverageSettlerAttacks: report.daily_average_settler_attacks,
      killedMenCumulative: report.killed_men_cum,
      dailyAverageKilledMen: report.daily_average_killed_men,
      injuredMenCumulative: report.injured_men_cum,
      dailyAverageInjuredMen: report.daily_average_injured_men
    }));

    console.log("Structured Rows:", rows);

    // Convert rows to CSV format
    const csvData = await json2csv(rows);

    // Write CSV to file
    const csvFilePath = path.join(outputFolder, 'wb_deaths_and_injuries.csv');
    fs.writeFileSync(csvFilePath, csvData);
    console.log(`CSV file saved to ${csvFilePath}`);

    // Convert rows to XLSX format
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'WB Deaths and Injuries');

    // Write XLSX to file
    const xlsxFilePath = path.join(outputFolder, 'wb_deaths_and_injuries.xlsx');
    XLSX.writeFile(workbook, xlsxFilePath);
    console.log(`XLSX file saved to ${xlsxFilePath}`);
  } catch (error) {
    console.error('Error processing data:', error);
  }
};

processWBDeathsData().catch(error => console.error('Error processing data:', error));
