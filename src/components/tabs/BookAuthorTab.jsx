"use client";

import { useEffect, useState } from "react";
import { Box, TextField, Chip, Typography, Autocomplete } from "@mui/material";
import { fetchAuthors } from "@/lib/AuthorApi";

export function BookAuthorsTab({ bookData, setBookData, showSnackbar }) {
  console.log("Book data is ", { ...bookData });
  const [authors, setAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);

  useEffect(() => {
    async function loadAuthors() {
      try {
        const data = await fetchAuthors({ page: 1, pageSize: 200 });
        const items = data.items || [];
        setAuthors(items);

        if (bookData.authorIds?.length) {
          const preSelected = items.filter((author) =>
            bookData.authorIds.includes(author.id),
          );
          setSelectedAuthors(preSelected);
        }
      } catch (error) {
        console.error("Failed to load authors:", error);
        showSnackbar?.("Failed to load authors", "error");
      }
    }

    loadAuthors();
  }, []);

  const handleAuthorsChange = (_, newValue) => {
    setSelectedAuthors(newValue);

    setBookData((prev) => ({
      ...prev,
      authorIds: newValue.map((author) => author.id),
    }));
  };

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Select Authors
      </Typography>

      <Autocomplete
        multiple
        options={authors}
        value={selectedAuthors}
        onChange={handleAuthorsChange}
        getOptionLabel={(option) => option.name || ""}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        filterSelectedOptions
        noOptionsText="No authors found"
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              label={option.name}
              {...getTagProps({ index })}
              key={option.id}
              sx={{
                borderRadius: "8px",
                fontWeight: 500,
              }}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Authors"
            placeholder="Search and select authors"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                alignItems: "flex-start",
              },
            }}
            helperText="The same author cannot be selected twice for the same book."
          />
        )}
      />
    </Box>
  );
}
