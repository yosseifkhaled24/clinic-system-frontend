import api from "@/lib/axios";

async function downloadXlsx(
  url: string,
  filename: string
) {
  const response = await api.get(url, {
    responseType: "blob",
  });

  const objectUrl = window.URL.createObjectURL(
    new Blob([response.data])
  );

  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = filename;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(objectUrl);
}

export async function exportAppointments() {
  await downloadXlsx(
    "/appointments/export",
    "appointments.xlsx"
  );
}

/**
 * E: daily revenue export — completed + paid appointments only, with
 * server-computed totals and a per-payment-method breakdown. The date
 * defaults to the Africa/Cairo clinic day on the backend.
 */
export async function exportRevenue(date?: string) {
  const query = date ? `?date=${date}` : "";

  await downloadXlsx(
    `/appointments/revenue/export${query}`,
    `revenue-${date ?? "today"}.xlsx`
  );
}
