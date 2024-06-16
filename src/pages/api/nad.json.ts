// src/pages/api/nad.json.ts

import fetch from '@11ty/eleventy-fetch';

// Helper function to format numbers with commas
function formatNumber(value: number): string {
  return value.toLocaleString();
}

// Fetch daily reports from the external API
async function fetchDailyReports() {
  try {
    const response = await fetch(
      "https://us-east-1.aws.data.mongodb-api.com/app/daily_reports-qqsah/endpoint/daily_report",
      {
        duration: '1d', // Cache the data for 1 day
        type: 'json'    // Specify that we expect JSON data
      }
    );

    // Response might have body as a string, parse it
    const parsedData = JSON.parse(response.body);

    // Format and process data
    parsedData.forEach(report => {
      report.data.forEach(item => {
        if (item.Value === null) {
          item.Value = 0;
        } else {
          item.Value = formatNumber(item.Value);
        }
      });
    });

    return parsedData;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

// Function to format date
function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}.${day}.${year}`;
}

// Function to format timestamp
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${month}.${day}.${year} ${hours}:${minutes}`;
}

// API Endpoint function to handle GET requests
export async function GET() {
  const reports = await fetchDailyReports();

  if (!reports.length) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch or process reports." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Prepare data for each category
  const categories = ["Settler attacks", "Road closures", "Confiscation of property", "Injuries", "Temporary checkpoints"];
  const categoryData = categories.map(category => {
    const mostRecentReport = reports.reduce((latest, report) => {
      const latestDate = new Date(latest.metadata.Date);
      const currentDate = new Date(report.metadata.Date);
      return currentDate > latestDate ? report : latest;
    }, reports[0]);

    let categoryItem = mostRecentReport.data.find(item => item["Description English"] === category);
    if (!categoryItem) {
      categoryItem = { "Description English": category, "Value": "0" };
    }

    return {
      category,
      value: categoryItem["Value"],
      date: formatDate(mostRecentReport.metadata.Date) // Use the 'Date' directly from the metadata
    };
  });

  console.log("Category NAD Data:", categoryData);

  return new Response(
    JSON.stringify({
      reports: reports.map(report => ({
        ...report,
        metadata: {
          ...report.metadata,
          Date: formatDate(report.metadata.Date),
          Timestamp: formatTimestamp(report.metadata.Timestamp),
        }
      })),
      categories: categoryData
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
