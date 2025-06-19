import { request } from "./api";
import type { AxiosResponse } from "axios";

/**
 * Payload containing analytics timestamps for a case.
 */
export interface AnalyticsPayload {
  caseConfigId:    string;
  caseOpenTime:    string;
  answerOpenTime:  string;
  answerSubmitTime:string;
}

/**
 * Sends analytics payload to the backend.
 *
 * @param payload - AnalyticsPayload containing the caseConfigId and ISO-8601 timestamps.
 * @returns Promise resolving to AxiosResponse for the analytics request.
 */
export const postAnalytics = async (
  payload: AnalyticsPayload
): Promise<AxiosResponse<any>> => {
  return await request("/analytics", {
    method: "POST",
    data: payload,
  });
};
