import React, { useState } from "react";
import { useRequest } from "ahooks";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Collapse,
} from "@mui/material";
import { Download, Visibility, VisibilityOff } from "@mui/icons-material";
import { useSnackbar } from "notistack";

import type { ExportType } from "../../types/export";
import { getExportCount, getExportPreview, downloadExportCsv } from "../../services/exportService";

interface ExportCardProps {
  title: string;
  description: string;
  exportType: ExportType;
  icon: React.ReactNode;
  supportsDateFilter: boolean;
  since?: string;
}

const ExportCard: React.FC<ExportCardProps> = ({
  title,
  description,
  exportType,
  icon,
  supportsDateFilter,
  since,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [showPreview, setShowPreview] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const sinceParam = supportsDateFilter && since ? { since } : undefined;

  const { data: totalRows, loading: countLoading } = useRequest(
    () => getExportCount(exportType, sinceParam),
    { refreshDeps: [since] },
  );

  const {
    data: previewData,
    loading: previewLoading,
    run: fetchPreview,
  } = useRequest(() => getExportPreview(exportType, sinceParam), { manual: true });

  const handlePreviewToggle = () => {
    if (!showPreview && !previewData) {
      fetchPreview();
    }
    setShowPreview((prev) => !prev);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadExportCsv(exportType, sinceParam);
      enqueueSnackbar(`Downloaded ${exportType} CSV`, { variant: "success" });
    } catch (err) {
      enqueueSnackbar(`Failed to download: ${(err as Error).message}`, { variant: "error" });
    } finally {
      setDownloading(false);
    }
  };

  const previewRows = previewData?.data ?? [];
  const columns = previewRows.length > 0 ? Object.keys(previewRows[0]) : [];

  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          {icon}
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {countLoading ? (
            <CircularProgress size={14} sx={{ mr: 1 }} />
          ) : (
            <strong>{totalRows?.toLocaleString() ?? "—"}</strong>
          )}{" "}
          rows{supportsDateFilter && since ? " (filtered)" : ""}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={showPreview ? <VisibilityOff /> : <Visibility />}
            onClick={handlePreviewToggle}
          >
            {showPreview ? "Hide" : "Preview"}
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={downloading ? <CircularProgress size={16} color="inherit" /> : <Download />}
            disabled={downloading}
            onClick={handleDownload}
            sx={{
              backgroundColor: "#A8E3BD",
              color: "#303230",
              "&:hover": { backgroundColor: "#8CD4A5" },
            }}
          >
            Download CSV
          </Button>
        </Box>
        <Collapse in={showPreview}>
          <Box sx={{ mt: 2 }}>
            {previewLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : previewRows.length > 0 ? (
              <>
                <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        {columns.map((col) => (
                          <TableCell key={col}>
                            <strong>{col}</strong>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {previewRows.map((row, i) => (
                        <TableRow key={i}>
                          {columns.map((col) => (
                            <TableCell key={col} sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {String(row[col] ?? "")}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                  Showing {previewRows.length} of {totalRows?.toLocaleString() ?? "?"} rows
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No data available.
              </Typography>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default ExportCard;
