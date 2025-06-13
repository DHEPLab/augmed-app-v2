import { request } from "./api";
import { CaseDetail, ICase } from "../types/case";

let _caseOpenTime: string | null = null;

export const getCaseList = async () => {
  return await request<{ data: ICase[] }>(`/cases`, {
    method: "GET",
  });
};

export const getCaseDetail = async (caseConfigId: string) => {
  // mark case‐open time once, on first fetch
  if (!_caseOpenTime) {
    _caseOpenTime = new Date().toISOString();
  }
  return await request<{ data: CaseDetail }>(
    `/case-reviews/${caseConfigId}`,
    { method: "GET" }
  );
};

/** expose for metrics */
export const getCaseOpenTime = (): string => {
  return _caseOpenTime!;
};
