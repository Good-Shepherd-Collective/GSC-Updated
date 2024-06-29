// usage: node src/utils/data-processing/health_care_convert.js

import { fetchHealthAttackData } from '../health_care.js';
import { json2csv } from 'json-2-csv';
import XLSX from 'xlsx';
import fs from 'fs-extra';
import path from 'path';

const outputFolder = path.resolve('public/data_sheets');

// Ensure the output directory exists
fs.ensureDirSync(outputFolder);

const processHealthAttackData = async () => {
  try {
    const data = await fetchHealthAttackData();

    if (!data || data.length === 0) {
      console.error('No data fetched. Exiting...');
      return;
    }

    console.log("Fetched Data:", data);

    // The data is already filtered in the fetchHealthAttackData function,
    // so we can use it directly

    // Convert data to CSV format
    const csvData = await json2csv(data);

    // Write CSV to file
    const csvFilePath = path.join(outputFolder, 'healthcare_attacks.csv');
    fs.writeFileSync(csvFilePath, csvData);
    console.log(`CSV file saved to ${csvFilePath}`);

    // Convert data to XLSX format
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Healthcare Attacks');

    // Write XLSX to file
    const xlsxFilePath = path.join(outputFolder, 'healthcare_attacks.xlsx');
    XLSX.writeFile(workbook, xlsxFilePath);
    console.log(`XLSX file saved to ${xlsxFilePath}`);

  } catch (error) {
    console.error('Error processing health attack data:', error);
  }
};

processHealthAttackData().catch(error => console.error('Error processing health attack data:', error));