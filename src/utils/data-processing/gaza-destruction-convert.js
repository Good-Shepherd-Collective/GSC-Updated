// src/utils/data-processing/gaza-destruction-convert.js

import { Parser } from 'json2csv';
import XLSX from 'xlsx';
import fs from 'fs-extra';
import path from 'path';
import { getGazaDestructionData } from '../gaza-destruction.js';

const outputFolder = path.resolve('public/data_sheets');

// Ensure the output directory exists
fs.ensureDirSync(outputFolder);

const processData = async () => {
  const { fullData } = await getGazaDestructionData();

  if (!fullData.length) {
    console.error('No data fetched. Exiting...');
    return;
  }

  console.log("Fetched Data:", fullData);

  // Extract unique keys for headers
  const uniqueKeys = [
    ...new Set(fullData.flatMap(report => Object.keys(report.civic_buildings).map(key => `civic_buildings.${key}`)
      .concat(Object.keys(report.educational_buildings).map(key => `educational_buildings.${key}`))
      .concat(Object.keys(report.places_of_worship).map(key => `places_of_worship.${key}`))
      .concat(Object.keys(report.residential).map(key => `residential.${key}`))))
  ];

  console.log("Unique Keys for CSV Headers:", uniqueKeys);

  // Create rows with reportDate and values for each key
  const rows = fullData.map(report => {
    const row = {
      reportDate: report.report_date,
    };

    uniqueKeys.forEach(key => {
      const pathParts = key.split('.');
      row[key] = pathParts.reduce((obj, part) => obj?.[part], report) || '0';  // Use '0' if value not present
    });

    return row;
  });

  console.log("Structured Rows:", rows);

  // Convert rows to CSV format
  const json2csvParser = new Parser({ fields: ["reportDate", ...uniqueKeys] });
  const csvData = json2csvParser.parse(rows);

  // Write CSV to file
  const csvFilePath = path.join(outputFolder, 'gaza_destruction_report.csv');
  fs.writeFileSync(csvFilePath, csvData);
  console.log(`CSV file saved to ${csvFilePath}`);

  // Convert rows to XLSX format
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Gaza Destruction Report');

  // Write XLSX to file
  const xlsxFilePath = path.join(outputFolder, 'gaza_destruction_report.xlsx');
  XLSX.writeFile(workbook, xlsxFilePath);
  console.log(`XLSX file saved to ${xlsxFilePath}`);
};

processData().catch(error => console.error('Error processing data:', error));
