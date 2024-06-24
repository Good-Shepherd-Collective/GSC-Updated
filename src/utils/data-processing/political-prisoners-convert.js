import { getCombinedPrisonerData } from '../prisoner_data.js'; // Adjust the path according to your folder structure
import { Parser } from 'json2csv';
import XLSX from 'xlsx';
import fs from 'fs-extra';
import path from 'path';

const outputFolder = path.resolve('public/data_sheets');

// Ensure the output directory exists
fs.ensureDirSync(outputFolder);

// Labels to exclude
const excludedLabels = [
  'Sick Prisoners',
  'Child Political Prisoners'
];

// Function to check if a label is a date
const isDateLabel = (label) => /^\d{4}-\d{2}-\d{2}/.test(label);

const processPrisonerData = async () => {
  const data = await getCombinedPrisonerData();

  if (!data) {
    console.error('No data fetched. Exiting...');
    return;
  }

  console.log("Fetched Data:", data);

  // Filter out specific unwanted data
  const filteredData = data.filter(item =>
    !excludedLabels.includes(item.label) &&
    !isDateLabel(item.label)
  );

  console.log("Filtered Data:", filteredData);

  // Create rows for CSV and XLSX
  const rows = filteredData.map(({ label, count }) => ({
    label,
    count
  }));

  console.log("Structured Rows:", rows);

  // Convert rows to CSV format
  const json2csvParser = new Parser({ fields: ["label", "count"] });
  const csvData = json2csvParser.parse(rows);

  // Write CSV to file
  const csvFilePath = path.join(outputFolder, 'prisoner_data.csv');
  fs.writeFileSync(csvFilePath, csvData);
  console.log(`CSV file saved to ${csvFilePath}`);

  // Convert rows to XLSX format
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Prisoner Data');

  // Write XLSX to file
  const xlsxFilePath = path.join(outputFolder, 'prisoner_data.xlsx');
  XLSX.writeFile(workbook, xlsxFilePath);
  console.log(`XLSX file saved to ${xlsxFilePath}`);
};

processPrisonerData().catch(error => console.error('Error processing data:', error));
