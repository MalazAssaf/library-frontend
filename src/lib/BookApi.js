import { API_BASE_URL } from "./BaseUrl";
import { getAuthHeaders, buildQuery } from "./ApiUtils";
import { getErrorMessage } from "./ApiUtils";

export const BOOK_BASE_URL = `${API_BASE_URL}/books`;

/* =========================
   GET BOOKS (LIST + SEARCH)
========================= */

export async function fetchBooks(params = {}) {
  const query = buildQuery(params);
  const url = query ? `${BOOK_BASE_URL}?${query}` : BOOK_BASE_URL;

  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }

  const data = await res.json();

  return {
    items: data.items || data.content || [],
    totalItems: data.totalItems || data.totalElements || 0,
    totalPages: data.totalPages || 0,
    currentPage: data.page || data.number || 0,
    pageSize: data.pageSize || data.size || 10,
  };
}

/* =========================
   GET BOOK BY ID
========================= */

export async function fetchBookById(id) {
  const res = await fetch(`${BOOK_BASE_URL}/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }

  return res.json();
}

/* =========================
   CREATE BOOK
========================= */

export async function createBook(data) {
  const res = await fetch(BOOK_BASE_URL, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }

  return res.json();
}

/* =========================
   DELETE BOOK
========================= */

export async function deleteBook(id) {
  const res = await fetch(`${BOOK_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }

  return true;
}
