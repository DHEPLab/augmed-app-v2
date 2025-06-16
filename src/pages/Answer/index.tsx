import React, { useEffect, useState } from "react";
import { useNavigate, useParams, generatePath } from "react-router-dom";
import { Button, Tooltip } from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import { useRequest } from "ahooks";
import { useAtom } from "jotai";
import { useSnackbar } from "notistack";

import Answer from "../../components/Answer";
import CaseTitle from "../../components/CaseTitle";
import { getAnswerPageConfig, saveAnswer } from "../../services/answerService";
import path from "../../routes/path";
import testId from "../../utils/testId";

import styles from "./index.module.scss";
import Loading from "../../components/Loading";
import { UpcomingTwoTone } from "@mui/icons-material";
import { answerFormAtom, caseAtom } from "../../state";

const AnswerPage = () => {
  const { caseConfigId } = useParams() as { caseConfigId: string };
  const nav = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { loading: submitLoading, runAsync } = useRequest(saveAnswer, {
    manual: true,
  });
  const { data, loading } = useRequest(
    () => getAnswerPageConfig(caseConfigId),
    { refreshDeps: [caseConfigId] }
  );
  const configList = data?.data.data.config ?? [];
  const answerConfigId = data?.data.data.id ?? "";

  const [caseState] = useAtom(caseAtom);
  const [answerFormData, setAnswerFormData] = useAtom(answerFormAtom);
  const [, setCaseState] = useAtom(caseAtom);

  const [disable, setDisable] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (title: string, value: string | string[]) => {
    setAnswerFormData((prev) => ({
      ...prev,
      [title]: value,
    }));
  };

  useEffect(() => {
    const hasUnansweredRequiredFields = configList.some((config) => {
      if (config.required) {
        const value = answerFormData[config.title];
        return !value || value.length === 0;
      }
      return false;
    });

    setDisable(hasUnansweredRequiredFields);
  }, [answerFormData, configList]);

  useEffect(() => {
    if (!caseState.caseNumber) {
      nav(generatePath(path.case, { caseConfigId }));
    }
  }, [caseState.caseNumber, nav, caseConfigId]);

  const onSubmit = () => {
    runAsync(caseConfigId, answerFormData, answerConfigId)
      .then(() => {
        enqueueSnackbar("Case is submitted.", {
          anchorOrigin: {
            horizontal: "center",
            vertical: "bottom",
          },
          variant: "success",
          autoHideDuration: 2000,
        });
        setAnswerFormData({});
        nav(path.root);
      })
      .catch((e: Error) => {
        setErrorMsg(e.message);
      });
  };
  return (
    <>
      <div className={styles.header}>Answer</div>
      <CaseTitle
        name={caseState.personName}
        case={`Case ${caseState.caseNumber}`}
        suffix={
          <Tooltip title="Go back to case review">
            <span>
              <Button variant="contained" color="secondary" onClick={() => nav(-1)}>
                CASE REVIEW
              </Button>
            </span>
          </Tooltip>
        }
      />
      <Loading loading={loading}>
        {errorMsg && (
          <div className={styles.errorContainer}>
            <span>{errorMsg}</span>
          </div>
        )}
        {!configList || configList.length === 0 ? (
          <div className={styles.empty}>
            <UpcomingTwoTone className={styles.icon} />
            <span className={styles.emptyText}>
              Failed to show Answer page. Please contact{" "}
              <a href="mailto:dhep.lab@gmail.com">dhep.lab@gmail.com</a> to
              configure the answer page.
            </span>
          </div>
        ) : (
          <div className={styles.container}>
            <Answer
              configList={configList}
              onInputChange={handleInputChange}
              answerFormData={answerFormData}
            />
            <Tooltip
              title={
                disable
                  ? "Please fill all required fields"
                  : "Click to submit your answers"
              }
            >
              <span>
                <Button
                  {...testId("answer-submit-btn")}
                  className={styles.submit}
                  disabled={disable || submitLoading}
                  variant="contained"
                  onClick={onSubmit}
                  endIcon={submitLoading && <SyncIcon className={styles.spin} />}
                >
                  Submit
                </Button>
              </span>
            </Tooltip>
          </div>
        )}
      </Loading>
    </>
  );
};

export default AnswerPage;
