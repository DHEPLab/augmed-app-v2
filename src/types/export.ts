export type ExportType = "answers" | "display-configs" | "analytics" | "participants";

export interface ExportPagination {
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface ExportResponse {
  data: Record<string, unknown>[];
  pagination: ExportPagination;
}
