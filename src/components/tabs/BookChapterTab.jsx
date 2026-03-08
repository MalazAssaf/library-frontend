"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import MySnackbar from "../ui/MySnackBar";

export function BookChaptersTab({ chapters, setChapters, savedBookId }) {
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [chapterForm, setChapterForm] = useState({
    name: "",
    order: "",
    code: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const showSnackbar = (message, severity = "error") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setChapterForm({
      name: "",
      order: "",
      code: "",
    });
    setOpen(true);
  };

  const handleEdit = (index) => {
    const chapter = chapters[index];

    setEditingIndex(index);
    setChapterForm({
      name: chapter.name || "",
      order: chapter.order || "",
      code: chapter.code || "",
    });

    setOpen(true);
  };

  const handleDelete = (index) => {
    const updated = [...chapters];
    updated.splice(index, 1);
    setChapters(updated);

    showSnackbar("Chapter deleted", "success");
  };

  const handleSave = () => {
    if (!chapterForm.name.trim()) {
      showSnackbar("Chapter name is required");
      return;
    }

    if (!chapterForm.order || Number(chapterForm.order) <= 0) {
      showSnackbar("Chapter order must be a positive integer");
      return;
    }

    if (!chapterForm.code.trim()) {
      showSnackbar("Chapter code is required");
      return;
    }

    const normalizedName = chapterForm.name.trim().toLowerCase();
    const normalizedOrder = String(chapterForm.order).trim();

    const duplicateName = chapters.some((chapter, index) => {
      if (editingIndex !== null && index === editingIndex) return false;
      return chapter.name.trim().toLowerCase() === normalizedName;
    });

    if (duplicateName) {
      showSnackbar("Chapter name already exists");
      return;
    }

    const duplicateOrder = chapters.some((chapter, index) => {
      if (editingIndex !== null && index === editingIndex) return false;
      return String(chapter.order).trim() === normalizedOrder;
    });

    if (duplicateOrder) {
      showSnackbar("Chapter order already exists");
      return;
    }

    const payload = {
      name: chapterForm.name.trim(),
      order: String(chapterForm.order).trim(),
      code: chapterForm.code.trim(),
      createdAt:
        editingIndex !== null
          ? chapters[editingIndex]?.createdAt
          : new Date().toISOString(),
    };

    let updated = [...chapters];

    if (editingIndex !== null) {
      updated[editingIndex] = payload;
      showSnackbar("Chapter updated", "success");
    } else {
      updated.push(payload);
      showSnackbar("Chapter added", "success");
    }

    setChapters(updated);
    setOpen(false);
    setEditingIndex(null);
    setChapterForm({
      name: "",
      order: "",
      code: "",
    });
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h6">Chapters</Typography>
          {!savedBookId && (
            <Typography variant="body2" color="text.secondary">
              Chapters will be saved after the book is created.
            </Typography>
          )}
        </Box>

        <Button variant="contained" onClick={handleOpenAdd}>
          Add
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Order</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {chapters?.map((chapter, index) => (
            <TableRow key={index}>
              <TableCell>{chapter.name}</TableCell>
              <TableCell>{chapter.order}</TableCell>
              <TableCell>{chapter.code}</TableCell>
              <TableCell>
                {chapter.createdAt
                  ? new Date(chapter.createdAt).toLocaleDateString()
                  : "-"}
              </TableCell>

              <TableCell align="right">
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ mr: 1 }}
                  onClick={() => handleEdit(index)}
                >
                  Edit
                </Button>

                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {chapters?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No chapters added
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingIndex !== null ? "Edit Chapter" : "Add Chapter"}
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            sx={{ mb: 2 }}
            value={chapterForm.name}
            onChange={(e) =>
              setChapterForm((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />

          <TextField
            fullWidth
            label="Order"
            sx={{ mb: 2 }}
            value={chapterForm.order}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setChapterForm((prev) => ({
                  ...prev,
                  order: value,
                }));
              }
            }}
            helperText="Only positive integers"
          />

          <TextField
            fullWidth
            label="Code"
            value={chapterForm.code}
            onChange={(e) =>
              setChapterForm((prev) => ({
                ...prev,
                code: e.target.value,
              }))
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <MySnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
}
