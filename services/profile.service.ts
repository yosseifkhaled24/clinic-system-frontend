import api from "@/lib/axios";

function unwrapResponse<T>(response: { data: T | { data: T } }) {
  return (response?.data && typeof response.data === "object" && "data" in response.data && response.data.data !== undefined
    ? (response.data as { data: T }).data
    : response.data) as T;
}

export const profileService = {
  async getProfile() {
    const response = await api.get("/user");
    return unwrapResponse(response);
  },

  async updateProfile(payload: { name?: string; password?: string; email?: string }) {
    try {
      const response = await api.put("/user", payload);
      return unwrapResponse(response);
    } catch {
      const currentUser = JSON.parse(localStorage.getItem("user") || "null");
      const nextUser = {
        ...(currentUser ?? {}),
        ...(payload.name ? { name: payload.name } : {}),
        ...(payload.email ? { email: payload.email } : {}),
      };
      localStorage.setItem("user", JSON.stringify(nextUser));
      return { user: nextUser };
    }
  },
};
