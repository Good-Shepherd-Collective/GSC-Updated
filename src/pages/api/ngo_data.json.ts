// src/pages/api/ngo_data.json.ts

import { getNGOTreemapData } from '@/utils/ngo_data.js';

export async function GET() {
  try {
    const ngoData = await getNGOTreemapData();

    if (!ngoData) {
      return new Response(
        JSON.stringify({ error: 'Failed to process NGO data' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify(ngoData),
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
