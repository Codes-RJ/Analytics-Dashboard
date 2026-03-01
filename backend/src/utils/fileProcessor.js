import xlsx from 'xlsx';
import fs from 'fs';
import csv from 'csv-parser';

export const processUpload = async (filePath) => {
  try {
    let rowCount = 0;
    let columns = [];

    if (filePath.endsWith('.csv')) {
      // Process CSV
      const results = [];
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => {
            results.push(data);
            if (results.length === 1) {
              columns = Object.keys(data);
            }
          })
          .on('end', () => {
            rowCount = results.length;
            resolve();
          })
          .on('error', reject);
      });
    } else if (filePath.endsWith('.xlsx') || filePath.endsWith('.xls')) {
      // Process Excel
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
      rowCount = data.length;
      if (data.length > 0) {
        columns = Object.keys(data[0]);
      }
    }

    return {
      rowCount,
      columns: columns.map(col => ({
        name: col,
        type: 'string' // You can add type detection here
      }))
    };
  } catch (error) {
    throw new Error(`Failed to process file: ${error.message}`);
  }
};