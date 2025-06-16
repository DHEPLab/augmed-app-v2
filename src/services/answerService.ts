import { request } from "./api";
import { AnswerPageConfigResponse } from "../types/answer";
import { AnswerFormData } from "../state";
import { getCaseOpenTime } from "./caseService";
import { postAnalytics, AnalyticsPayload } from "./metricsService";

let _answerOpenTime: string | null = null;

export const getAnswerPageConfig = async (caseConfigId: string) => {
  if (!_answerOpenTime) {
    _answerOpenTime = new Date().toISOString();
  }
  return await request<{ data: AnswerPageConfigResponse }>(
    "/config/answer",
    { method: "GET", params: { caseConfigId } }
  );
};

export const saveAnswer = async (
  caseConfigId: string,
  answerFormData: AnswerFormData,
  answerConfigId: string
) => {
  // record submit time
  const submitTime = new Date().toISOString();

  // first save the answer
  const res = await request(`/answer/${caseConfigId}`, {
    method: "POST",
    data: {
      answer: answerFormData,
      answerConfigId,
    },
  });

  // then ship the analytics payload
  const payload: AnalyticsPayload = {
    caseConfigId,
    caseOpenTime:    getCaseOpenTime(),
    answerOpenTime:  _answerOpenTime!,
    answerSubmitTime:submitTime,
  };
  await postAnalytics(payload);

  return res;
};
