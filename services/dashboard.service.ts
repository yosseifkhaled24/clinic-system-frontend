import api from "@/lib/axios";
import type { DashboardOverview } from "@/types/dashboard";

function unwrapResponse<T>(response: { data: T | { data: T } }) {
  return (response?.data && typeof response.data === "object" && "data" in response.data && response.data.data !== undefined
    ? (response.data as { data: T }).data
    : response.data) as T;
}

export const dashboardService = {
  async getOverview() {
    const response = await api.get("/dashboard");
    return unwrapResponse<DashboardOverview>(response);
  },
};
