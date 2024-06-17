// test-fetchGSCblog.js
import { fetchGSCblog } from './src/utils/fetchGSCblog.js';

async function testFetchGSCblog() {
  try {
    const posts = await fetchGSCblog();
    console.log(JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error("Error testing fetchGSCblog:", error);
  }
}

testFetchGSCblog();
