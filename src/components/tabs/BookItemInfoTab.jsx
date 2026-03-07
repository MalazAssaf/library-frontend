"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import { fetchCategories } from "../../lib/CategoryApi";
import { createPublisher, fetchPublishers } from "../../lib/PublisherApi";
import AppSnackbar from "../ui/MySnackBar";

const mediaTypes = [
  { value: "BOOK", label: "Book" },
  { value: "E-BOOK", label: "e-book" },
  { value: "CD", label: "CD" },
];

const isbnTypes = [
  { value: "ISBN", label: "ISBN" },
  { value: "ISBN13", label: "ISBN 13" },
];

const bookStatuses = [
  { value: "NEW", label: "New" },
  { value: "OLD", label: "Old" },
  { value: "STERILIZED", label: "Sterilized" },
  { value: "RESTORED", label: "Restored" },
];

const bookTypes = [
  { value: "GOVERNMENT", label: "Government" },
  { value: "PRIVATE", label: "Private" },
  { value: "OTHER", label: "Other" },
];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
  },
};

export function BookItemInfoTab({ bookData, setBookData }) {
  const [activeCategories, setActiveCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [openPublisherModal, setOpenPublisherModal] = useState(false);
  const [publisherName, setPublisherName] = useState("");
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
    setSnackbar((prev) => ({ ...prev, open: false }));
  }

  useEffect(() => {
    async function loadData() {
      try {
        const [categoriesData, publishersData] = await Promise.all([
          fetchCategories({ page: 1, pageSize: 100 }),
          fetchPublishers(),
        ]);
        const filteredCategories = categoriesData.items.filter(
          (category) => String(category.status).toLowerCase() === "active",
        );
        setActiveCategories(filteredCategories);
        setPublishers(publishersData);
      } catch (error) {
        console.error("Failed to load data:", error);
        showSnackbar("Failed to load categories or publishers", "error");
      }
    }

    loadData();
  }, [activeCategories, publishers]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setBookData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePositiveIntegerChange = (e) => {
    const { name, value } = e.target;

    if (/^\d*$/.test(value)) {
      setBookData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCategoriesChange = (e) => {
    const value = e.target.value;

    setBookData((prev) => ({
      ...prev,
      categories: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleOpenPublisherModal = () => {
    setOpenPublisherModal(true);
  };

  const handleClosePublisherModal = () => {
    setOpenPublisherModal(false);
    setPublisherName("");
  };

  const handleSavePublisher = async () => {
    try {
      await createPublisher({ name: publisherName });

      handleClosePublisherModal();
    } catch (error) {
      console.error("Failed to create publisher:", error);
      showSnackbar("Failed to create publisher", "error");
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Book Name */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Book Name"
            name="name"
            value={bookData.name || ""}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        {/* Media Type */}
        <Grid item xs={12} md={2} sx={{ minWidth: 130 }}>
          <FormControl fullWidth sx={fieldSx}>
            <InputLabel>Media Type</InputLabel>
            <Select
              name="mediaType"
              value={bookData.mediaType || ""}
              onChange={handleChange}
              input={<OutlinedInput label="Media Type" />}
            >
              {mediaTypes.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* ISBN Type */}
        <Grid item xs={12} md={3} sx={{ minWidth: 130 }}>
          <FormControl fullWidth sx={fieldSx}>
            <InputLabel>ISBN Type</InputLabel>
            <Select
              name="isbnType"
              value={bookData.isbnType || ""}
              onChange={handleChange}
              input={<OutlinedInput label="ISBN Type" />}
            >
              {isbnTypes.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* ISBN */}
        {bookData.isbnType === "ISBN" && (
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="ISBN"
              name="isbn"
              value={bookData.isbn || ""}
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>
        )}

        {/* ISBN 13 */}
        {bookData.isbnType === "ISBN13" && (
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="ISBN 13"
              name="isbn13"
              value={bookData.isbn13 || ""}
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>
        )}

        {/* Year */}
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Year"
            name="year"
            value={bookData.year || ""}
            onChange={handlePositiveIntegerChange}
            sx={fieldSx}
            helperText="Only positive integers"
          />
        </Grid>

        {/* Price */}
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Price"
            name="price"
            value={bookData.price || ""}
            onChange={handlePositiveIntegerChange}
            sx={fieldSx}
            helperText="Only positive integers"
          />
        </Grid>

        {/* Status */}
        <Grid item xs={12} md={3} sx={{ minWidth: 130 }}>
          <FormControl fullWidth sx={fieldSx}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={bookData.status || ""}
              onChange={handleChange}
              input={<OutlinedInput label="Status" />}
            >
              {bookStatuses.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Type */}
        <Grid item xs={12} md={3} sx={{ minWidth: 130 }}>
          <FormControl fullWidth sx={fieldSx}>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={bookData.type || ""}
              onChange={handleChange}
              input={<OutlinedInput label="Type" />}
            >
              {bookTypes.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Other Type */}
        {bookData.type === "OTHER" && (
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Other Type"
              name="otherType"
              value={bookData.otherType || ""}
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>
        )}

        {/* Categories */}
        <Grid item xs={12} sx={{ minWidth: 130 }}>
          <FormControl fullWidth sx={fieldSx}>
            <InputLabel>Categories</InputLabel>
            <Select
              multiple
              name="categories"
              value={bookData.categories || []}
              onChange={handleCategoriesChange}
              input={<OutlinedInput label="Categories" />}
              renderValue={(selected) =>
                activeCategories
                  .filter((category) => selected.includes(category.id))
                  .map((category) => category.name)
                  .join(", ")
              }
            >
              {activeCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Checkbox
                    checked={(bookData.categories || []).includes(category.id)}
                  />
                  <ListItemText primary={category.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Edition */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Edition"
            name="edition"
            value={bookData.edition || ""}
            onChange={handleChange}
            sx={fieldSx}
            placeholder="E.g. 1st Edition"
          />
        </Grid>

        {/* Series Name */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Series Name"
            name="seriesName"
            value={bookData.seriesName || ""}
            onChange={handleChange}
            sx={fieldSx}
            placeholder="E.g. Harry Potter"
          />
        </Grid>

        {/* Accession No */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Accession No"
            name="accessionNo"
            value={bookData.accessionNo || ""}
            onChange={handlePositiveIntegerChange}
            sx={fieldSx}
            helperText="A numeric digit to identify catalog copy. Auto generated by system, please enter your own accession number if you have any."
          />
        </Grid>

        {/* Call No */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Call No"
            name="callNo"
            value={bookData.callNo || ""}
            onChange={handleChange}
            sx={fieldSx}
            helperText="A combination of characters assigned to a library book to indicate its place on a shelf."
          />
        </Grid>

        {/* Publisher */}
        {/* Publisher */}
        <Grid item xs={12}>
          <FormControl fullWidth sx={fieldSx}>
            <InputLabel>Publisher</InputLabel>

            <Select
              name="publisherId"
              value={bookData.publisherId || ""}
              onChange={handleChange}
              input={<OutlinedInput label="Publisher" />}
            >
              {publishers.map((publisher) => (
                <MenuItem key={publisher.id} value={publisher.id}>
                  {publisher.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 1, fontSize: "14px", color: "#666" }}>
            Publisher not listed?{" "}
            <Box
              component="span"
              onClick={handleOpenPublisherModal}
              sx={{
                color: "#1976d2",
                cursor: "pointer",
                textDecoration: "underline",
                fontWeight: 500,
                "&:hover": {
                  color: "#125ea8",
                },
              }}
            >
              add publisher here
            </Box>{" "}
            first.
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={openPublisherModal}
        onClose={handleClosePublisherModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Publisher</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            label="Publisher Name"
            value={publisherName}
            onChange={(e) => setPublisherName(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClosePublisherModal}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSavePublisher}
            disabled={!publisherName.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
}
