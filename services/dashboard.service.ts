import api from "@/lib/axios";
import type { DashboardOverview } from "@/types/dashboard";
import { unwrapResponse } from "./response";

export const dashboardService = {
  async getOverview() {
    const response = await api.get("/dashboard");
    return unwrapResponse<DashboardOverview>(response);
  },
};
