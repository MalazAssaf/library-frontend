"use client";
import { BookItemInfoTab } from "../../../../components/tabs/BookItemInfoTab";
import { useState } from "react";
import { Box, Tabs, Tab, Paper, Button, Typography } from "@mui/material";

export default function AddBookPage() {
  const [tab, setTab] = useState(0);

  const [bookData, setBookData] = useState({
    title: "",
    mediaType: "",
    isbn: "",
    isbn13: "",
    status: "",
    type: "",
    otherType: "",
    volume: "",
    pageDuration: "",
    subject: "",
    abstract: "",
    description: "",
    url: "",
    urlVisibility: "",
    active: true,
    published: true,
    categories: [],
    authors: [],
    chapters: [],
  });

  function handleSubmit() {
    console.log("Submitting all book data:", bookData);
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <Paper elevation={2} sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Add New Book
        </Typography>
        <Box
          sx={{
            backgroundColor: "var(--color-accent)",
            px: 1,
            pt: 1,
            borderRadius: 1,
          }}
        >
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              minHeight: 40,
              "& .MuiTabs-flexContainer": {
                gap: 1,
              },
            }}
          >
            <Tab
              label="ITEM INFO"
              sx={{
                minHeight: 40,
                fontSize: "12px",
                fontWeight: 600,
                backgroundColor: tab === 0 ? "white" : "transparent",
                color: tab === 0 ? "#333" : "white",
                borderRadius: "4px 4px 0 0",
              }}
            />
            <Tab
              label="DETAIL"
              sx={{
                minHeight: 40,
                fontSize: "12px",
                fontWeight: 600,
                backgroundColor: tab === 1 ? "white" : "transparent",
                color: tab === 1 ? "#333" : "white",
                borderRadius: "4px 4px 0 0",
              }}
            />
            <Tab
              label="AUTHORS"
              sx={{
                minHeight: 40,
                fontSize: "12px",
                fontWeight: 600,
                backgroundColor: tab === 2 ? "white" : "transparent",
                color: tab === 2 ? "#333" : "white",
                borderRadius: "4px 4px 0 0",
              }}
            />
            <Tab
              label="CHAPTER"
              sx={{
                minHeight: 40,
                fontSize: "12px",
                fontWeight: 600,
                backgroundColor: tab === 3 ? "white" : "transparent",
                color: tab === 3 ? "#333" : "white",
                borderRadius: "4px 4px 0 0",
              }}
            />
          </Tabs>
        </Box>

        <Box sx={{ py: 4 }}>
          {tab === 0 && (
            <BookItemInfoTab
              bookData={bookData}
              setBookData={setBookData}
              categories={bookData.categories}
            />
          )}{" "}
          {tab === 1 && <Box>Detail Component Here</Box>}
          {tab === 2 && <Box>Authors Component Here</Box>}
          {tab === 3 && <Box>Chapter Component Here</Box>}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={handleSubmit}>
            Save Book
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
