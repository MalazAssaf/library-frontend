"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export default function DeleteModal({
  open,
  title = "Delete Item",
  itemName = "",
  loading = false,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onClose,
  onConfirm,
}) {
  const finalMessage =
    message || `Are you sure you want to delete "${itemName}"?`;

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <p className="text-sm text-gray-700">{finalMessage}</p>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          color="inherit"
          sx={{ textTransform: "none" }}
        >
          {cancelText}
        </Button>

        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          sx={{
            backgroundColor: "var(--color-error)",
            textTransform: "none",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#dc2626",
            },
          }}
        >
          {loading ? "Deleting..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
