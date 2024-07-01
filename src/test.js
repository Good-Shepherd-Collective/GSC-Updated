// src/testFetchGSCblog.js
import { fetchGSCblog } from "./utils/fetchGSCblog.js";

async function testFetch() {
  try {
    const posts = await fetchGSCblog();
    console.log("Fetched Posts:", posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

testFetch();
