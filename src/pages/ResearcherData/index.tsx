import React, { useState } from "react";
import { Typography, Box, IconButton, Button } from "@mui/material";
import { Assessment, Refresh, Lock, QuestionAnswer, Tune, Timeline, People } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Dayjs } from "dayjs";

import { useCurrentUser } from "../../hooks/useCurrentUser";
import ExportCard from "./ExportCard";
import styles from "./index.module.scss";

const ResearcherDataPage = () => {
  const user = useCurrentUser();
  const [sinceDate, setSinceDate] = useState<Dayjs | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const sinceStr = sinceDate ? sinceDate.format("YYYY-MM-DD") : undefined;

  if (user && !user.isAdmin) {
    return (
      <div className={styles.container}>
        <div className={styles.accessDenied}>
          <Lock sx={{ fontSize: 48 }} />
          <Typography variant="h6">Access restricted to administrators</Typography>
          <Typography variant="body2">
            Contact your study administrator to request access.
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Assessment sx={{ fontSize: 28, color: "#A8E3BD" }} />
          <Typography variant="h5" fontWeight={600}>
            Data Export
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Since"
              value={sinceDate}
              onChange={(val) => setSinceDate(val)}
              slotProps={{ textField: { size: "small", sx: { width: 160 } } }}
            />
          </LocalizationProvider>
          {sinceDate && (
            <Button size="small" onClick={() => setSinceDate(null)}>
              Clear
            </Button>
          )}
          <IconButton onClick={() => setRefreshKey((k) => k + 1)} title="Refresh">
            <Refresh />
          </IconButton>
        </Box>
      </div>

      <div className={styles.grid} key={refreshKey}>
        <ExportCard
          title="Answers"
          description="Answer data with OMOP demographics, AI scores, and timing"
          exportType="answers"
          icon={<QuestionAnswer color="action" />}
          supportsDateFilter
          since={sinceStr}
        />
        <ExportCard
          title="Display Configs"
          description="Current case assignments and display configurations"
          exportType="display-configs"
          icon={<Tune color="action" />}
          supportsDateFilter={false}
        />
        <ExportCard
          title="Analytics"
          description="Timing analytics and interaction metrics"
          exportType="analytics"
          icon={<Timeline color="action" />}
          supportsDateFilter
          since={sinceStr}
        />
        <ExportCard
          title="Participants"
          description="Anonymized participant metadata with completion stats"
          exportType="participants"
          icon={<People color="action" />}
          supportsDateFilter={false}
        />
      </div>
    </div>
  );
};

export default ResearcherDataPage;
