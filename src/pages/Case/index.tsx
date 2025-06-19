import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import homeStyles from "../Home/index.module.scss";
import { Button, Collapse, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import classnames from "classnames";
import { useRequest } from "ahooks";
import { getCaseDetail } from "../../services/caseService";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Loading from "../../components/Loading";
import { ErrorTwoTone } from "@mui/icons-material";
import path from "../../routes/path";
import CaseTitle from "../../components/CaseTitle";
import { useAtom } from "jotai/index";
import { caseAtom } from "../../state";
import { TreeNode } from "../../types/case";

function isAllString(values: (string | TreeNode)[]) {
  return values.every((item) => typeof item === "string");
}

// Light-mode theme variables (CSS custom properties) for sections
const lightTheme = {
  green: {
    "--title-background": "#91C4A3",
    "--sub-title-color": "#30543F",     // darker for contrast
    "--card-background": "#EDF8F1",
  },
  blue: {
    "--title-background": "#98D3CF",
    "--sub-title-color": "#2D5E5B",
    "--card-background": "#E6F6F6",
  },
  default: {
    "--title-background": "#B1C7D1",
    "--sub-title-color": "#33494F",
    "--card-background": "#EFF6F6",
  },
  important: {
    "--title-background": "#F3D18E",
    "--sub-title-color": "#8C6D4A",
    "--card-background": "#FDF3DE",
  },
};

// Dark-mode theme variables (CSS custom properties) for sections
const darkTheme = {
  green: {
    "--title-background": "#315f47",
    "--sub-title-color": "#E0E0E0",
    "--card-background": "#223730",
  },
  blue: {
    "--title-background": "#2d5654",
    "--sub-title-color": "#E0E0E0",
    "--card-background": "#1f3232",
  },
  default: {
    "--title-background": "#2f4046",
    "--sub-title-color": "#E0E0E0",
    "--card-background": "#1e2a2f",
  },
  important: {
    "--title-background": "#5a3e1b",
    "--sub-title-color": "#E0E0E0",
    "--card-background": "#3b2a1f",
  },
};

function getColorStyle(index: number, mode: "light" | "dark") {
  const themeSet = mode === "dark" ? darkTheme : lightTheme;
  if (index % 3 === 1) {
    return themeSet.green;
  }
  if (index % 3 === 2) {
    return themeSet.blue;
  }
  return themeSet.default;
}

function getImportantStyle(mode: "light" | "dark") {
  return (mode === "dark" ? darkTheme : lightTheme).important;
}

const NestedContent = ({
                         data,
                         level,
                         important = false,
                       }: {
  data: TreeNode;
  level: number;
  important?: boolean;
}) => {
  if (!data.values) {
    return <span>{level === 2 && "none"}</span>;
  }

  // Handle array-of-strings case, including classification for AI score
  if (Array.isArray(data.values) && isAllString(data.values)) {
    return (
      <ul className={styles.list}>
        {(data.values as string[]).map((value, index) => {
          if (value.startsWith("AI-Predicted CRC Risk Score:")) {
            const parts = value.split(":")[1].trim().split(" ");
            const rawNum = parseFloat(parts[0]);
            let label = "";
            if (!isNaN(rawNum)) {
              if (rawNum < 6) {
                label = "Low";
              } else if (rawNum < 14) {
                label = "Medium";
              } else {
                label = "High";
              }
            }
            return (
              <li key={index} className={styles.listItem}>
                {value} {label && `(${label})`}
              </li>
            );
          }
          return (
            <li key={index} className={styles.listItem}>
              {value}
            </li>
          );
        })}
      </ul>
    );
  }

  if (typeof data.values === "string") {
    return <span>{level === 2 ? data.values : ` : ${data.values}`}</span>;
  }

  return (
    <>
      {(data.values as TreeNode[]).map((item, index) => {
        return (
          <NestedSection
            data={item}
            key={index}
            level={level + 1}
            important={important}
          />
        );
      })}
    </>
  );
};

const NestedSection = ({
                         data,
                         level,
                         important,
                       }: {
  data: TreeNode;
  level: number;
  important: boolean;
}) => {
  const [open, setOpen] = useState(true);
  const highlight = !important && (data.style?.highlight || false);
  const inlineStyle = (
    typeof data.values === "string" ? { display: "inline-block" } : undefined
  ) as React.CSSProperties;
  return (
    <div
      className={classnames(
        styles.nestedWrapper,
        { [styles.highlightContent]: highlight }
      )}
      data-testid={data.key}
    >
      <span className={styles.contentTitle}>{data.key}</span>
      {!important && data.style?.collapse && (
        <IconButton
          onClick={() => setOpen(!open)}
          aria-label={open ? "collapse" : "expand"}
          size="small"
          className={styles.toggleButton}
        >
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      )}
      {!important ? (
        <Collapse in={open} timeout="auto" unmountOnExit style={inlineStyle}>
          <NestedContent data={data} level={level} important={important} />
        </Collapse>
      ) : (
        <div style={inlineStyle}>
          <NestedContent data={data} level={level} important={important} />
        </div>
      )}
    </div>
  );
};

const Card = ({ data, index }: { data: TreeNode; index: number }) => {
  const [open, setOpen] = useState(true);
  const highlight = data.style?.highlight || false;
  return (
    <div
      data-testid={data.key}
      className={classnames(
        styles.card,
        { [styles.highlightContent]: highlight },
        { [styles.firstCard]: index === 0 }
      )}
    >
      <div
        className={classnames(styles.subTitle, {
          [styles.subTitleHighlight]: highlight,
        })}
      >
        <span className={styles.subTitleText}>{data.key}</span>
        {data.style?.collapse && (
          <IconButton
            onClick={() => setOpen(!open)}
            aria-label={open ? "collapse" : "expand"}
            size="small"
            className={styles.toggleButton}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        )}
      </div>
      <div className={styles.content}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <NestedContent data={data} level={2} />
        </Collapse>
      </div>
    </div>
  );
};

const Section = ({ data, index }: { data: TreeNode; index: number }) => {
  const themeMui = useTheme();
  const mode = themeMui.palette.mode as "light" | "dark";
  const styleVars = getColorStyle(index, mode) as React.CSSProperties;

  return (
    <div style={styleVars} className={styles.container} data-testid={data.key}>
      <div className={styles.title}>{data.key}</div>
      {(data.values as TreeNode[])
        .filter((item) => item.key !== "CRC risk assessments")
        .map((item, idx) => (
          <Card data={item} key={idx} index={idx} />
        ))}
    </div>
  );
};

const CRC_SECTION_KEY = "AI CRC Risk Score (<6: Low; 6-11: Medium; >11: High)";

const ImportantCard = ({ data }: { data: TreeNode[] }) => {
  const themeMui = useTheme();
  const mode = themeMui.palette.mode as "light" | "dark";
  const styleVars = getImportantStyle(mode) as React.CSSProperties;

  return (
    <div
      style={styleVars}
      className={styles.container}
      data-testid="important-info"
    >
      <div className={styles.title}>AI PREDICTION</div>
      <div className={classnames(styles.card, styles.firstCard)}>
        <div className={styles.content}>
          {data.map((item, index) => {
            // 1) completely skip the section title
            if (item.key === CRC_SECTION_KEY) {
              // assume there's exactly one string value
              const raw = (item.values as string[])[0];
              // e.g. "Colorectal Cancer Score: 2"
              const [, numStr] = raw.split(":");
              const num = parseFloat(numStr.trim());
              // compute label
              let label = "";
              if (!isNaN(num)) {
                if (num < 6) label = "low";
                else if (num <= 11) label = "med";
                else label = "high";
              }
              // rename - just in case backend sends something different
              const display = raw.replace(
                "Colorectal Cancer Score",
                "Colorectal Cancer Score"
              );

              return (
                <div key={index} className={styles.crcContainer}>
                  <div className={styles.crcScoreLine}>
                    {display} {label && `(${label})`}
                  </div>
                  <div className={styles.crcThresholdLine}>
                    <em>0-6: Low; 6-14: Med; 14-18: High</em>
                  </div>
                </div>
              );
            }

            // 2) preserve your existing logic for everything else
            if (item.key === "ignore") {
              return (
                <NestedContent
                  data={item}
                  level={2}
                  key={index}
                  important={true}
                />
              );
            }
            return (
              <NestedSection
                data={item}
                level={3}
                important={true}
                key={index}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CasePage = () => {
  const nav = useNavigate();
  const { caseConfigId } = useParams() as { caseConfigId: string };
  const { loading, data, error } = useRequest(() => getCaseDetail(caseConfigId));
  const response = data?.data;
  const [caseState, setCaseState] = useAtom(caseAtom);

  useEffect(() => {
    setCaseState({
      caseNumber: response?.data.caseNumber,
      personName: response?.data.personName,
    });
  }, [response, setCaseState]);

  return (
    <Loading loading={loading}>
      <div className={styles.app}>
        <div className={styles.headerContainer}>
          <span className={styles.header}>Case Review</span>
        </div>
        {response?.data ? (
          <>
            <CaseTitle
              name={caseState.personName}
              case={"Case " + caseState.caseNumber}
            />
            {response.data.importantInfos &&
              response.data.importantInfos.length > 0 && (
                <ImportantCard data={response.data.importantInfos} />
              )}
            {(response.data.details as TreeNode[]).map((item, idx) => (
              <Section data={item} key={idx} index={idx} />
            ))}
            <div className={styles.submitDiv}>
              <Button
                className={styles.submit}
                variant="contained"
                onClick={() =>
                  nav(generatePath(path.answer, { caseConfigId }))
                }
              >
                Go to Answer Page
              </Button>
            </div>
          </>
        ): error ? (
          <div className={homeStyles.empty}>
            <ErrorTwoTone className={homeStyles.icon} />
            <span className={homeStyles.emptyText}>
              {((error as any).response?.data?.message || error.message).replace(/\./g, "")}, or case not found. Please contact{" "}
                          <a href="mailto:dhep.lab@gmail.com">dhep.lab@gmail.com</a> to resolve this issue.
            </span>
          </div>
        ) : (
          <div className={homeStyles.empty}>
            <ErrorTwoTone className={homeStyles.icon} />
            <span className={homeStyles.emptyText}>
              There is an unexpected error. Please check your internet and try
              again, or contact{" "}
              <a href="mailto:dhep.lab@gmail.com">dhep.lab@gmail.com</a> to
              resolve this issue.
            </span>
          </div>
        )}
      </div>
    </Loading>
  );
};

export default CasePage;
