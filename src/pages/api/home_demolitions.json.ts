// src/pages/api/home_demolitions.json.ts

import { processDemolitionData } from '@/utils/home_demolitions.js';

export async function GET() {
  try {
    const demolitionData = await processDemolitionData();

    if (!demolitionData) {
      return new Response(
        JSON.stringify({ error: 'Failed to process demolition data' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify(demolitionData),
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
