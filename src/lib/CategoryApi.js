import { API_BASE_URL } from "./BaseUrl";
import { getAuthHeaders, buildQuery } from "./ApiUtils";
import { getErrorMessage } from "./ApiUtils";

const BASE_URL = `${API_BASE_URL}/categories`;

// Get categories
export async function fetchCategories({
  page = 1,
  pageSize = 10,
  name = "",
  status = "",
  createdDate = "",
  updatedDate = "",
}) {
  const query = buildQuery({
    page,
    pageSize,
    name,
    status,
    createdDate,
    updatedDate,
  });

  const res = await fetch(`${BASE_URL}?${query}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }

  return res.json();
}

// Add category
export async function createCategory(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }

  return res.json();
}

// Get category by id
export async function getCategory(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }

  return res.json();
}

// Update category
export async function updateCategory(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }

  return res.json();
}

// Delete category
export async function deleteCategory(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }

  return true;
}
