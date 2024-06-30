// src/utils/wb_daily.js

import EleventyFetch from "@11ty/eleventy-fetch";

const fetchDailyReport = async () => {
  const endpoint = 'https://us-east-1.aws.data.mongodb-api.com/app/daily_reports-qqsah/endpoint/daily_report';

  try {
    // Fetch and cache the data using EleventyFetch
    const result = await EleventyFetch(endpoint, {
      duration: "1d", // cache the response for 1 day
      type: "json", // parse JSON response
    });

    // Parse the JSON string in the `body` field
    const data = JSON.parse(result.body);
    return data;
  } catch (error) {
    console.error('Failed to fetch daily report:', error);
    return null;
  }
};

// Example date format function, replace with your actual implementation
export const formatDateToString = (dateStr) => {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
};

// Example timestamp format function, replace with your actual implementation
export const formatTimestamp = (timestampStr) => {
  const date = new Date(timestampStr);
  return date.toISOString().replace('T', ' ').split('.')[0];
};

export default fetchDailyReport;
