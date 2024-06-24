import { getCombinedPrisonerData } from '@/utils/prisoner_data.js';

export async function GET() {
  try {
    const data = await getCombinedPrisonerData();

    // Filter out specific unwanted data
    const filteredData = data.filter(item =>
      item.label !== 'Sick Prisoners' &&
      item.label !== 'Child Political Prisoners' &&
      !item.label.match(/^\d{4}-\d{2}-\d{2}/) // regex to exclude date labels
    );

    return new Response(
      JSON.stringify(filteredData),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error in API handler:", error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
