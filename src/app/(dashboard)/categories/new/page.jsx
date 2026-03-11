"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory } from "../../../../lib/CategoryApi";
import MySnackbar from "../../../../components/ui/MySnackBar";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

function NewCategory() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  function showSnackbar(message, severity = "success") {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }

  function handleCloseSnackbar() {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name.trim()) {
      showSnackbar("Category name is required", "error");
      return;
    }

    try {
      setLoading(true);

      await createCategory({
        name: formData.name.trim(),
        status: formData.status,
      });

      showSnackbar("Category added successfully", "success");

      setTimeout(() => {
        router.push("/categories");
      }, 1200);
    } catch (err) {
      const message = err.message || "Category name already exists";
      console.log("Erorrororo", err);
      showSnackbar(message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-canavas px-4 py-10">
      <div className="mx-auto max-w-md md:max-w-xl bg-surface border border-black/10 rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold text-secondary mb-6">Add Category</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <TextField
              id="outlined-basic"
              name="name"
              label="Name"
              variant="outlined"
              fullWidth
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleChange}
              renderValue={(selected) =>
                selected === "active" ? "🟢 Active" : "🔴 Inactive"
              }
            >
              <MenuItem value="active">🟢 Active</MenuItem>
              <MenuItem value="inactive">🔴 Inactive</MenuItem>
            </Select>
          </FormControl>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-accent text-canavas px-5 py-2 rounded-xl font-semibold hover:opacity-90 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/categories")}
              className="border border-black/15 px-5 py-2 rounded-xl hover:bg-black/5 cursor-pointer text-canavas"
              style={{ backgroundColor: "var(--color-error)" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <MySnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
}

export default NewCategory;
