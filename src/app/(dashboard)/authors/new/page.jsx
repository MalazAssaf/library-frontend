"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAuthor } from "../../../../lib/AuthorApi";
import MySnackbar from "../../../../components/ui/MySnackBar";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

function NewAuthor() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nickname: "",
    name: "",
    country: "",
    dateBorn: "",
    dateDied: "",
    lifeStatus: "live",
    email: "",
    mobile: "",
    bio: "",
    publications: "",
    awards: "",
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
      ...(name === "lifeStatus" && value === "live" ? { dateDied: "" } : {}),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^0[0-9]{9}$/;

    if (!formData.name.trim()) {
      showSnackbar("Author name is required", "error");
      return;
    }

    if (!formData.country.trim()) {
      showSnackbar("Country is required", "error");
      return;
    }

    if (!formData.dateBorn) {
      showSnackbar("Date of birth is required", "error");
      return;
    }

    if (
      formData.lifeStatus === "dead" &&
      formData.dateBorn &&
      formData.dateDied &&
      new Date(formData.dateDied) < new Date(formData.dateBorn)
    ) {
      showSnackbar(
        "Date of death cannot be before the date of birth!",
        "error",
      );
      return;
    }

    if (formData.lifeStatus === "dead" && !formData.dateDied) {
      showSnackbar(
        "Date of death is required when life status is Dead",
        "error",
      );
      return;
    }

    if (formData.email && !emailRegex.test(formData.email)) {
      showSnackbar(
        "Please enter a valid email address (example: name@email.com)",
        "error",
      );
      return;
    }

    if (formData.mobile && !mobileRegex.test(formData.mobile)) {
      showSnackbar(
        "Mobile number must start with 0 and contain 10 numbers",
        "error",
      );
      return;
    }

    try {
      setLoading(true);

      await createAuthor({
        nickname: formData.nickname.trim(),
        name: formData.name.trim(),
        country: formData.country.trim(),
        dateBorn: formData.dateBorn || null,
        dateDied: formData.lifeStatus === "dead" ? formData.dateDied : null,
        lifeStatus: formData.lifeStatus,
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        bio: formData.bio.trim(),
        publications: formData.publications.trim(),
        awards: formData.awards.trim(),
      });

      showSnackbar("Author added successfully", "success");

      setTimeout(() => {
        router.push("/authors");
      }, 1200);
    } catch (err) {
      const message = err.message || "Failed to add author";
      showSnackbar(message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-canavas px-4 py-10">
      <div className="mx-auto max-w-md md:max-w-2xl bg-surface border border-black/10 rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold text-secondary mb-6">Add Author</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              name="nickname"
              label="Nickname"
              variant="outlined"
              fullWidth
              value={formData.nickname}
              onChange={handleChange}
            />

            <TextField
              name="name"
              label="Name"
              variant="outlined"
              fullWidth
              value={formData.name}
              onChange={handleChange}
            />

            <TextField
              name="country"
              label="Country"
              variant="outlined"
              fullWidth
              value={formData.country}
              onChange={handleChange}
            />

            <TextField
              name="email"
              label="Email"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={handleChange}
            />

            <TextField
              name="mobile"
              label="Mobile"
              variant="outlined"
              fullWidth
              value={formData.mobile}
              onChange={handleChange}
            />

            <TextField
              name="dateBorn"
              label="Date Born"
              type="date"
              variant="outlined"
              fullWidth
              value={formData.dateBorn}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth>
              <InputLabel id="life-status-label">Life Status</InputLabel>
              <Select
                labelId="life-status-label"
                id="lifeStatus"
                name="lifeStatus"
                value={formData.lifeStatus}
                label="Life Status"
                onChange={handleChange}
                renderValue={(selected) =>
                  selected === "live" ? "🟢 Live" : "🔴 Dead"
                }
              >
                <MenuItem value="live">🟢 Live</MenuItem>
                <MenuItem value="dead">🔴 Dead</MenuItem>
              </Select>
            </FormControl>

            {formData.lifeStatus === "dead" && (
              <TextField
                name="dateDied"
                label="Date Died"
                type="date"
                variant="outlined"
                fullWidth
                value={formData.dateDied}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            )}
          </div>
          <div className="flex flex-col gap-4">
            <TextField
              name="bio"
              label="Bio"
              variant="outlined"
              fullWidth
              multiline
              minRows={3}
              value={formData.bio}
              onChange={handleChange}
              className="m-5"
            />

            <TextField
              name="publications"
              label="Publications"
              variant="outlined"
              fullWidth
              multiline
              minRows={2}
              value={formData.publications}
              onChange={handleChange}
            />

            <TextField
              name="awards"
              label="Awards"
              variant="outlined"
              fullWidth
              multiline
              minRows={2}
              value={formData.awards}
              onChange={handleChange}
            />
          </div>

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
              onClick={() => router.push("/authors")}
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

export default NewAuthor;
