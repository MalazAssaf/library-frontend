import { API_BASE_URL } from "./BaseUrl";

const BASE_URL = `${API_BASE_URL}/categories`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// GET categories
export async function fetchCategories({
  page = 1,
  pageSize = 10,
  name = "",
  status = "",
  createdDate = "",
  updatedDate = "",
}) {
  const params = new URLSearchParams();

  params.append("page", String(page));
  params.append("pageSize", String(pageSize));

  if (name) {
    params.append("name", name);
  }

  if (status) {
    params.append("status", status);
  }

  if (createdDate) {
    params.append("createdDate", createdDate);
  }

  if (updatedDate) {
    params.append("updatedDate", updatedDate);
  }

  const res = await fetch(`${BASE_URL}?${params.toString()}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(await res.text());
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
    throw new Error(await res.text());
  }

  return res.json();
}

// GET category by id
export async function getCategory(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

// UPDATE category
export async function updateCategory(id, data) {
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

// DELETE category
export async function deleteCategory(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return true;
}
