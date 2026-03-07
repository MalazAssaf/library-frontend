import { getAuthHeaders } from "./ApiUtils";
import { API_BASE_URL } from "./BaseUrl";

const USERS_URL = `${API_BASE_URL}/users/count`;
const BOOKS_URL = `${API_BASE_URL}/books`;
const AUTHORS_URL = `${API_BASE_URL}/authors`;
const CATEGORIES_URL = `${API_BASE_URL}/categories`;

async function fetchCount(url) {
  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function fetchDashboardCounts() {
  const [users, bookData, authorsData, categoriesData] = await Promise.all([
    fetchCount(USERS_URL),
    fetchCount(BOOKS_URL),
    fetchCount(AUTHORS_URL),
    fetchCount(CATEGORIES_URL),
  ]);

  return {
    users,
    books: bookData?.numberOfElements ?? 0,
    authors: authorsData?.totalElements ?? 0,
    categories: categoriesData?.totalItems ?? 0,
  };
}
