// src/pages/api/wb_data.json.ts
import fetchDailyReport, { formatDateToString, formatTimestamp } from '../../utils/wb_daily.js';

export async function GET() {
  const reports = await fetchDailyReport();

  if (!reports || !reports.length) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch or process reports." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const formattedReports = reports.map(report => ({
    ...report,
    metadata: {
      ...report.metadata,
      Date: formatDateToString(report.metadata.Date), // Convert ISODate to YYYY-MM-DD
      Timestamp: formatTimestamp(report.metadata.Timestamp),
    }
  }));

  return new Response(
    JSON.stringify({ reports: formattedReports }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
