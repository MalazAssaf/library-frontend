"use client";

import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";

const urlVisibilityOptions = [
  { value: "PUBLIC", label: "Public" },
  { value: "PRIVATE", label: "Private" },
];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
  },
};

export function BookDetailTab({ bookData, setBookData }) {
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

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;

    setBookData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const isUrlValid = (url) => {
    if (!url) return true;
    return url.startsWith("www.") && url.endsWith(".com") && url.length > 7;
  };

  const urlError = bookData.url && !isUrlValid(bookData.url);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Volume"
            name="volume"
            value={bookData.volume || ""}
            onChange={handlePositiveIntegerChange}
            sx={fieldSx}
            helperText="Only positive integers"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Page / Duration"
            name="pagesNumber"
            value={bookData.pagesNumber || ""}
            onChange={handlePositiveIntegerChange}
            sx={fieldSx}
            helperText="Only positive integers"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Subject"
            name="subject"
            value={bookData.subject || ""}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="URL"
            name="url"
            value={bookData.url || ""}
            onChange={handleChange}
            sx={fieldSx}
            error={Boolean(urlError)}
            helperText={urlError ? "Please enter a valid URL" : ""}
          />
        </Grid>

        <Grid item sx={{ minWidth: 350 }}>
          <TextField
            fullWidth
            multiline
            minRows={5}
            label="Abstract"
            name="abstractText"
            value={bookData.abstractText || ""}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sx={{ minWidth: 350 }}>
          <TextField
            fullWidth
            multiline
            minRows={5}
            label="Description"
            name="description"
            value={bookData.description || ""}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth sx={fieldSx}>
            <InputLabel>URL Visibility</InputLabel>
            <Select
              name="urlVisibility"
              value={bookData.urlVisibility || ""}
              onChange={handleChange}
              input={<OutlinedInput label="URL Visibility" />}
            >
              {urlVisibilityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography
            variant="caption"
            sx={{ display: "block", mt: 1, color: "text.secondary" }}
          >
            Set fine grained OPAC URL visibility for a title.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              mt: 1,
            }}
          >
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(bookData.active)}
                    onChange={handleSwitchChange}
                    name="active"
                  />
                }
                label="Active"
              />
              <Typography
                variant="caption"
                sx={{ display: "block", color: "text.secondary", ml: 1 }}
              >
                Make this item active, only active items are available for
                checking out.
              </Typography>
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(bookData.published)}
                    onChange={handleSwitchChange}
                    name="published"
                  />
                }
                label="Published"
              />
              <Typography
                variant="caption"
                sx={{ display: "block", color: "text.secondary", ml: 1 }}
              >
                Enable OPAC listing, uncheck if you don&apos;t want to put this
                item on OPAC.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
