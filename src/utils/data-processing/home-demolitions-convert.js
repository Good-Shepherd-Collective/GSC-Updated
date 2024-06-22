import { processDemolitionData } from '../../utils/home_demolitions.js';
import { Parser } from 'json2csv';
import XLSX from 'xlsx';
import fs from 'fs-extra';
import path from 'path';

// Constants
const outputFolder = path.resolve('public/data_sheets');

// Ensure the output directory exists
fs.ensureDirSync(outputFolder);

const testHomeDemolitionsProcessing = async () => {
  try {
    // Process the demolition data
    const processedData = await processDemolitionData();

    if (!processedData) {
      console.error('No data processed. Exiting...');
      return;
    }

    // Log the processed data
    console.log("Processed Data:", processedData);

    // Extract chart data
    const { chartData } = processedData;

    if (!chartData || chartData.length === 0) {
      console.error('Chart data is empty. Exiting...');
      return;
    }

    // Create rows for CSV and XLSX
    const rows = chartData.map(data => ({
      date: data.date,
      incidents: data.incidents,
      displacedPeople: data.displacedPeople,
      structures: data.structures,
      menDisplaced: data.menDisplaced,
      womenDisplaced: data.womenDisplaced,
      childrenDisplaced: data.childrenDisplaced
    }));

    // Convert rows to CSV format
    const json2csvParser = new Parser({
      fields: ["date", "incidents", "displacedPeople", "structures", "menDisplaced", "womenDisplaced", "childrenDisplaced"]
    });
    const csvData = json2csvParser.parse(rows);

    // Write CSV to file
    const csvFilePath = path.join(outputFolder, 'demolition_data_report.csv');
    fs.writeFileSync(csvFilePath, csvData);
    console.log(`CSV file saved to ${csvFilePath}`);

    // Convert rows to XLSX format
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Demolition Report');

    // Write XLSX to file
    const xlsxFilePath = path.join(outputFolder, 'demolition_data_report.xlsx');
    XLSX.writeFile(workbook, xlsxFilePath);
    console.log(`XLSX file saved to ${xlsxFilePath}`);
  } catch (error) {
    console.error('Error in testing home demolitions processing:', error);
  }
};

// Execute the test
testHomeDemolitionsProcessing().catch(error => console.error('Error running the test script:', error));
