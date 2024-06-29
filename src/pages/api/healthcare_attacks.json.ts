// src/pages/api/healthcare_attacks.json.ts

import { fetchHealthAttackData } from '@/utils/health_care.js';

export async function GET() {
  try {
    const healthcareAttackData = await fetchHealthAttackData();

    if (!healthcareAttackData || healthcareAttackData.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch healthcare attack data' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify(healthcareAttackData),
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