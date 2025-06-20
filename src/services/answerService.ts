import { request } from "./api";
import type { AxiosResponse } from "axios";
import { getCaseOpenTime, clearCaseOpenTime } from "./caseService";
import { AnswerPageConfigResponse } from "../types/answer";
import { AnswerFormData } from "../state";
import { postAnalytics, AnalyticsPayload } from "./metricsService";

const answerOpenTimes = new Map<string, string>();

/**
 * Fetches the configuration for the answer page and records its open time.
 *
 * @param caseConfigId - The ID of the case configuration.
 * @returns Promise resolving to AxiosResponse containing `{ data: AnswerPageConfigResponse }`
 */
export const getAnswerPageConfig = async (
  caseConfigId: string,
): Promise<AxiosResponse<{ data: AnswerPageConfigResponse }>> => {
  if (!answerOpenTimes.has(caseConfigId)) {
    answerOpenTimes.set(caseConfigId, new Date().toISOString());
  }
  return await request<{ data: AnswerPageConfigResponse }>("/config/answer", {
    method: "GET",
    params: { caseConfigId },
  });
};

/**
 * Saves the user's answer, posts analytics, and clears timing records.
 *
 * @param caseConfigId - The ID of the case configuration.
 * @param answerFormData - The data entered by the user.
 * @param answerConfigId - The ID of the answer configuration.
 * @param aiScoreShown - Flag indicating if the AI score is shown.
 * @returns Promise resolving to AxiosResponse for the save-answer request.
 */
export const saveAnswer = async (
  caseConfigId: string,
  answerFormData: AnswerFormData,
  answerConfigId: string,
  aiScoreShown: boolean,
): Promise<AxiosResponse<any>> => {
  const submitTime = new Date().toISOString();

  // First, save the answer
  const saveRes = await request<any>(`/answer/${caseConfigId}`, {
    method: "POST",
    data: { answer: answerFormData, answerConfigId, aiScoreShown },
  });

  // Then, ship the analytics payload
  const payload: AnalyticsPayload = {
    caseConfigId,
    caseOpenTime: getCaseOpenTime(caseConfigId),
    answerOpenTime: answerOpenTimes.get(caseConfigId)!,
    answerSubmitTime: submitTime,
  };
  await postAnalytics(payload);

  // Clean up stored times
  answerOpenTimes.delete(caseConfigId);
  clearCaseOpenTime(caseConfigId);

  return saveRes;
};
