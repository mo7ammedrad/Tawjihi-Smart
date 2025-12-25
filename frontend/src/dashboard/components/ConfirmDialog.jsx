import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import MDButton from "../components/MDButton";

const ConfirmDialog = ({
  open,
  title = "Confirm action",
  content = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
      </DialogContent>
      <DialogActions>
        <MDButton color="secondary" variant="text" onClick={onClose} disabled={loading}>
          {cancelText}
        </MDButton>
        <MDButton color="error" onClick={onConfirm} disabled={loading}>
          {loading ? "Working..." : confirmText}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
