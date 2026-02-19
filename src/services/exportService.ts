import { instance } from "./api";
import type { ExportType, ExportResponse } from "../types/export";

interface ExportParams {
  since?: string;
  limit?: number;
  offset?: number;
}

function buildQueryString(params?: ExportParams): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  if (params.since) searchParams.set("since", params.since);
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.offset !== undefined) searchParams.set("offset", String(params.offset));
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export const getExportPreview = async (
  type: ExportType,
  params?: ExportParams,
): Promise<ExportResponse> => {
  const qs = buildQueryString({ ...params, limit: 10, offset: 0 });
  const response = await instance.get<ExportResponse>(`/v1/export/${type}${qs}`);
  return response.data;
};

export const getExportCount = async (
  type: ExportType,
  params?: ExportParams,
): Promise<number> => {
  const qs = buildQueryString({ ...params, limit: 1, offset: 0 });
  const response = await instance.get<ExportResponse>(`/v1/export/${type}${qs}`);
  return response.data.pagination.total;
};

export const downloadExportCsv = async (
  type: ExportType,
  params?: ExportParams,
): Promise<void> => {
  const qs = buildQueryString({ ...params, limit: 10000, offset: 0 });
  const response = await instance.get(`/v1/export/${type}${qs}`, {
    headers: { Accept: "text/csv" },
    responseType: "blob",
    timeout: 30000,
  });

  const blob = new Blob([response.data], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const date = new Date().toISOString().split("T")[0];
  link.download = `augmed-${type}-${date}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
