"use client";

import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

export default function FilterBar({
  filters = {},
  fields = [],
  onChange,
  onSearch,
  onReset,
}) {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: "14px",
        backgroundColor: "var(--color-canavas)",
      }}
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,320px))] justify-center gap-4">
        {fields.map((field) => {
          const commonProps = {
            name: field.name,
            label: field.label,
            value: filters[field.name] ?? "",
            onChange,
            size: "small",
            fullWidth: true,
            sx: {
              "& .MuiOutlinedInput-root": {
                backgroundColor: "var(--color-surface)",
                borderRadius: "12px",
              },
            },
          };

          if (field.type === "select") {
            return (
              <TextField key={field.name} select {...commonProps}>
                {(field.options || []).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            );
          } else if (field.type === "date") {
            return (
              <TextField
                key={field.name}
                {...commonProps}
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            );
          } else if (field.type === "number") {
            return (
              <TextField
                key={field.name}
                {...commonProps}
                type="number"
                inputProps={{
                  min: field.min,
                  max: field.max,
                  step: field.step ?? "any",
                }}
              />
            );
          }

          return (
            <TextField
              key={field.name}
              {...commonProps}
              placeholder={field.placeholder || ""}
              type={field.type || "text"}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <Button
          variant="contained"
          onClick={onSearch}
          sx={{
            backgroundColor: "var(--color-accent)",
            borderRadius: "10px",
            textTransform: "none",
            px: 3,
            "&:hover": {
              backgroundColor: "var(--color-hover)",
            },
          }}
        >
          Search
        </Button>

        <Button
          variant="outlined"
          onClick={onReset}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            px: 3,
            borderColor: "rgba(0,0,0,0.2)",
            color: "var(--color-foreground)",
          }}
        >
          Reset
        </Button>
      </div>
    </Paper>
  );
}
