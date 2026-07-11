export function unwrapResponse<T>(response: { data: T | { data: T } }) {
  return (response?.data &&
    typeof response.data === "object" &&
    "data" in response.data &&
    response.data.data !== undefined
    ? (response.data as { data: T }).data
    : response.data) as T;
}

export function unwrapCollection<T>(response: { data: unknown }) {
  const payload = response.data;

  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    const nestedPayload = (payload as { data: unknown }).data;
    return Array.isArray(nestedPayload) ? (nestedPayload as T[]) : [];
  }

  return [];
}
