"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function FormModal({
  open,
  title = "Form",
  fields = [],
  formData = {},
  loading = false,
  submitText = "Save",
  cancelText = "Cancel",
  maxWidth = "sm",
  onClose,
  onChange,
  onSubmit,
}) {
  const fieldSx = {
    mb: 2.5,
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "var(--color-surface)",
    },
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth={maxWidth}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 1 }}>
        <Box sx={{ pt: 1 }}>
          {fields.map((field) => {
            const value = formData[field.name] ?? "";

            if (field.type === "select") {
              return (
                <FormControl fullWidth key={field.name} sx={fieldSx}>
                  <InputLabel id={`${field.name}-label`}>
                    {field.label}
                  </InputLabel>

                  <Select
                    labelId={`${field.name}-label`}
                    name={field.name}
                    value={value}
                    label={field.label}
                    onChange={onChange}
                  >
                    {(field.options || []).map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            }

            if (field.type === "date") {
              return (
                <TextField
                  key={field.name}
                  fullWidth
                  name={field.name}
                  label={field.label}
                  type="date"
                  value={value}
                  onChange={onChange}
                  InputLabelProps={{ shrink: true }}
                  sx={fieldSx}
                />
              );
            }

            if (field.type === "number") {
              return (
                <TextField
                  key={field.name}
                  fullWidth
                  name={field.name}
                  label={field.label}
                  type="number"
                  value={value}
                  onChange={onChange}
                  inputProps={{
                    min: field.min,
                    max: field.max,
                    step: field.step ?? "any",
                  }}
                  sx={fieldSx}
                />
              );
            }

            return (
              <TextField
                key={field.name}
                fullWidth
                name={field.name}
                label={field.label}
                type={field.type || "text"}
                value={value}
                onChange={onChange}
                placeholder={field.placeholder || ""}
                multiline={field.multiline || false}
                minRows={field.minRows || 1}
                sx={fieldSx}
              />
            );
          })}
        </Box>
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
          onClick={onSubmit}
          disabled={loading}
          variant="contained"
          sx={{
            backgroundColor: "var(--color-accent)",
            textTransform: "none",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "var(--color-hover)",
            },
          }}
        >
          {loading ? "Saving..." : submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
