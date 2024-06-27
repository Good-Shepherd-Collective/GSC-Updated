// Usage: node src/utils/data-processing/ngo-data-convert.js

import { json2csv } from 'json-2-csv';
import XLSX from 'xlsx';
import fs from 'fs-extra';
import path from 'path';
import { getNGOTreemapData } from '../ngo_data.js'; // Adjusted the import path

const outputFolder = path.resolve('public/data_sheets');

// Ensure the output directory exists
fs.ensureDirSync(outputFolder);

const processNGOData = async () => {
  try {
    const { value: totalCombinedRevenue, data: rawData } = await getNGOTreemapData();

    if (!rawData) {
      console.error('No data fetched. Exiting...');
      return;
    }

    console.log("Fetched Data:", rawData);

    // Create rows with relevant data, ensuring each year is its own entry
    const rows = rawData.flatMap(org => 
      org.filings.map(filing => ({
        name: org.name,
        ein: org.ein,
        state: org.state,
        year: filing.year,
        revenue: filing.revenue,
        expenses: filing.expenses,
        assetsEnd: filing.assetsEnd,
        liabilitiesEnd: filing.liabilitiesEnd,
      }))
    );

    console.log("Structured Rows:", rows);

    // Convert rows to CSV format
    const csvData = await json2csv(rows);

    // Write CSV to file
    const csvFilePath = path.join(outputFolder, 'ngo_data_report.csv');
    fs.writeFileSync(csvFilePath, csvData);
    console.log(`CSV file saved to ${csvFilePath}`);

    // Convert rows to XLSX format
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'NGO Data Report');

    // Write XLSX to file
    const xlsxFilePath = path.join(outputFolder, 'ngo_data_report.xlsx');
    XLSX.writeFile(workbook, xlsxFilePath);
    console.log(`XLSX file saved to ${xlsxFilePath}`);
  } catch (error) {
    console.error('Error processing data:', error);
  }
};

processNGOData().catch(error => console.error('Error processing data:', error));
