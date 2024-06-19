// src/pages/api/prisoner_data.json.js

import { getCombinedPrisonerData } from '@/utils/prisoner_data.js';

export async function GET() {
  try {
    const data = await getCombinedPrisonerData();
    return new Response(
      JSON.stringify(data),
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
