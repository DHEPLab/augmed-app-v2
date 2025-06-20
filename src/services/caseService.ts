import { request } from "./api";
import type { AxiosResponse } from "axios";
import { CaseDetail, ICase } from "../types/case";

const caseOpenTimes = new Map<string, string>();

/**
 * Fetches the list of cases from the backend.
 *
 * @returns Promise resolving to AxiosResponse containing `{ data: ICase[] }`
 */
export const getCaseList = async (): Promise<AxiosResponse<{ data: ICase[] }>> => {
  return await request<{ data: ICase[] }>("/cases", {
    method: "GET",
  });
};

/**
 * Fetches the details for a specific case and records its open time.
 *
 * @param caseConfigId - The ID of the case configuration.
 * @returns Promise resolving to AxiosResponse containing `{ data: CaseDetail }`
 */
export const getCaseDetail = async (caseConfigId: string): Promise<AxiosResponse<{ data: CaseDetail }>> => {
  if (!caseOpenTimes.has(caseConfigId)) {
    caseOpenTimes.set(caseConfigId, new Date().toISOString());
  }
  return await request<{ data: CaseDetail }>(`/case-reviews/${caseConfigId}`, { method: "GET" });
};

/**
 * Retrieves the recorded open time for a given case.
 *
 * @param caseConfigId - The ID of the case configuration.
 * @throws Error if no open time is recorded for the given caseConfigId.
 * @returns ISO-8601 timestamp string when the case was first opened.
 */
export const getCaseOpenTime = (caseConfigId: string): string => {
  const time = caseOpenTimes.get(caseConfigId);
  if (!time) {
    throw new Error(`No open time recorded for case ${caseConfigId}`);
  }
  return time;
};

/**
 * Clears the recorded open time for a given case.
 *
 * @param caseConfigId - The ID of the case configuration.
 */
export const clearCaseOpenTime = (caseConfigId: string): void => {
  caseOpenTimes.delete(caseConfigId);
};
