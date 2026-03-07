import { API_BASE_URL } from "./BaseUrl";
import { getAuthHeaders, buildQuery } from "./ApiUtils";

const BASE_URL = `${API_BASE_URL}/books`;

export async function fetchBooks(params = {}) {
  const query = buildQuery(params);
  const url = query ? `${BASE_URL}?${query}` : BASE_URL;

  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const data = await res.json();

  return {
    items: data.content || [],
    totalItems: data.totalElements || 0,
    totalPages: data.totalPages || 0,
    currentPage: data.number || 0,
    pageSize: data.size || 10,
  };
}

export async function fetchBookById(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function createBook(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function updateBook(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function deleteBook(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return true;
}
