import { API_BASE_URL } from "./BaseUrl";
import { getAuthHeaders, buildQuery } from "./ApiUtils";

const BASE_URL = `${API_BASE_URL}/publishers`;

// Get publishers
export async function fetchPublishers({
  page = 1,
  pageSize = 10,
  name = "",
  status = "",
  createdDate = "",
  updatedDate = "",
} = {}) {
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

// Add publisher
export async function createPublisher(data) {
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
