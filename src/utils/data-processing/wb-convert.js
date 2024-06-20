// src/utils/data-processing/wb-convert.js

import fetchDailyReport from '../wb_daily.js';
import { Parser } from 'json2csv';
import XLSX from 'xlsx';
import fs from 'fs-extra';
import path from 'path';

const outputFolder = path.resolve('public/data_sheets');

// Ensure the output directory exists
fs.ensureDirSync(outputFolder);

// Categories to exclude
const excludedCategories = [
  "My body abuse",
  "Deaths",
  "Home demolitions",
  "Land",
  "Settlement activities",
  "Expatibility of property",
  "Unknown",
  "Building the separation wall"
];

const processData = async () => {
  const data = await fetchDailyReport();

  if (!data) {
    console.error('No data fetched. Exiting...');
    return;
  }

  console.log("Fetched Data:", data);

  // Extract unique descriptions for headers, excluding specified categories
  const uniqueDescriptions = [
    ...new Set(data.flatMap(report => report.data.map(item => item["Description English"])))
  ].filter(description => !excludedCategories.includes(description));
  
  console.log("Filtered Unique Descriptions:", uniqueDescriptions);

  // Create rows with reportId and values for each description
  const rows = data.map(report => {
    const row = {
      reportId: report._id,
      reportTitleArabic: report.metadata["Report Title Arabic"],
      reportTitleEnglish: report.metadata["Report Title English"],
      reportDate: report.metadata.Date,
      reportTimestamp: report.metadata.Timestamp,
    };

    uniqueDescriptions.forEach(description => {
      const item = report.data.find(d => d["Description English"] === description);
      row[description] = item ? item.Value : '0';  // Use '0' if value not present
    });

    return row;
  });

  console.log("Structured Rows:", rows);

  // Convert rows to CSV format
  const json2csvParser = new Parser({ fields: ["reportId", "reportTitleArabic", "reportTitleEnglish", "reportDate", "reportTimestamp", ...uniqueDescriptions] });
  const csvData = json2csvParser.parse(rows);

  // Write CSV to file
  const csvFilePath = path.join(outputFolder, 'wb_daily_report.csv');
  fs.writeFileSync(csvFilePath, csvData);
  console.log(`CSV file saved to ${csvFilePath}`);

  // Convert rows to XLSX format
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Daily Report');

  // Write XLSX to file
  const xlsxFilePath = path.join(outputFolder, 'wb_daily_report.xlsx');
  XLSX.writeFile(workbook, xlsxFilePath);
  console.log(`XLSX file saved to ${xlsxFilePath}`);
};

processData().catch(error => console.error('Error processing data:', error));
