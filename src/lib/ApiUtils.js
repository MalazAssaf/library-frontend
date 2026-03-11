export function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });

  return query.toString();
}

export async function getErrorMessage(res) {
  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    const data = await res.json().catch(() => null);
    return (
      data?.message || data?.error || `Request failed with status ${res.status}`
    );
  }

  const text = await res.text().catch(() => "");
  return text || `Request failed with status ${res.status}`;
}
