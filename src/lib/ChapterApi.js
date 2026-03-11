import { getAuthHeaders } from "./ApiUtils";
import { BOOK_BASE_URL } from "./BookApi";

export async function createChapter(bookId, data) {
  const res = await fetch(`${BOOK_BASE_URL}/${bookId}/chapters`, {
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
