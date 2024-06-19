// src/utils/prisoner_data.js

// Helper function to parse JSON response
async function parseResponse(response) {
  const responseData = await response.json();
  return JSON.parse(responseData.body);
}

// Fetch general prisoner data
export async function fetchPrisonerData() {
  try {
    const response = await fetch(
      "https://us-east-1.aws.data.mongodb-api.com/app/palestinian-prisoner-society-jifee/endpoint/prisoner_data"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const bodyObject = await parseResponse(response);
    return bodyObject.data;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

// Fetch child prisoner data
export async function fetchChildPrisonerData() {
  try {
    const response = await fetch(
      "https://us-east-1.aws.data.mongodb-api.com/app/child-prisoners-ghztu/endpoint/child_prisoners"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await parseResponse(response);
  } catch (error) {
    console.error("Fetch error from ChildPrisoners:", error);
    return [];
  }
}

// Prepare and combine data from both sources
export async function getCombinedPrisonerData() {
  const prisonerDataArray = await fetchPrisonerData();
  const childPrisonerData = await fetchChildPrisonerData();

  // Map general prisoner data to the desired structure
  const data = prisonerDataArray.map((item, index) => ({
    label: item.Description,
    count: parseInt(item.Count.replace(/[()]/g, ""), 10),
    index: index
  }));

  // Append child prisoner data if available
  if (childPrisonerData && childPrisonerData.length > 0) {
    const count = childPrisonerData[0]?.summary[0]?.Summary_title_data ?? 0;
    data.push({
      label: "Child Political Prisoners",
      count: count,
      index: data.length
    });
  }

  return data;
}

// Function to format date and time
export function formatDateWithTime(description) {
  const [datePart, timePart] = description.split(' ');
  const date = new Date(datePart);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}.${day}.${year} ${timePart}`;
}
