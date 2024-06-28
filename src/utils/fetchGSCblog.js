// src/utils/fetchGSCblog.js
const API_URL = "https://login.goodshepherdcollective.org/wp-json/wp/v2/posts?_embed";

function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const textWithoutHtml = text.replace(/<[^>]*>/g, "");
  const wordCount = textWithoutHtml.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

function decodeHtml(html) {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8230;/g, "…")
    .replace(/&#038;/g, "&");
}

async function fetchAllPosts(page = 1, allPosts = []) {
  try {
    const response = await fetch(`${API_URL}&page=${page}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const posts = await response.json();
    if (posts.length > 0) {
      allPosts = allPosts.concat(posts);
      return fetchAllPosts(page + 1, allPosts);
    } else {
      return allPosts;
    }
  } catch (error) {
    console.error("Fetch error from posts:", error);
    return allPosts;
  }
}

export async function fetchGSCblog() {
  try {
    const posts = await fetchAllPosts();
    return posts.map((post) => {
      const readingTime = calculateReadingTime(post.content.rendered || "");
      const postDate = new Date(post.date);
      const formattedDate = postDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      // Use the featured image from ACF if available
      const featuredImage = post.acf?.gsc_featured_image || post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';

      return {
        id: post.id,
        link: `/posts/${post.slug}`, // Relative link using slug
        title: decodeHtml(post.title.rendered),
        content: post.content.rendered,
        formattedDate,
        readingTime,
        featuredImage,
        slug: post.slug,
        author: post.acf?.gsc_author || '',
        excerpt: post.acf?.gsc_excerpt || '',
        category: post.acf?.gsc_category?.label || '',
        tags: [post.acf?.gsc_type_tag, post.acf?.gsc_location_tag].filter(Boolean).join(', ')
      };
    });
  } catch (error) {
    console.error("Fetch error from posts:", error);
    return [];
  }
}
