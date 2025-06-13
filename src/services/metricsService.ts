import { request } from "./api";

export interface AnalyticsPayload {
  caseConfigId:    string;
  caseOpenTime:    string;  // ISO8601
  answerOpenTime:  string;  // ISO8601
  answerSubmitTime:string;  // ISO8601
}

/**
 * App now collects the user’s interaction timings—
 *  - when they opened the case review,
 *  - when they navigated to the answer page,
 *  - and when they submitted their answers—
 * and sends these metrics to the backend analytics endpoint.
 *
 * @param payload AnalyticsPayload containing the caseConfigId and ISO-8601 timestamps
 */
export const postAnalytics = async (payload: AnalyticsPayload) => {
  return await request("/analytics", {
    method: "POST",
    data: payload,
  });
};
