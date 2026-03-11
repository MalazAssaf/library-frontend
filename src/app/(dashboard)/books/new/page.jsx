"use client";

import { useState } from "react";
import { Box, Tabs, Tab, Paper, Button, Typography } from "@mui/material";
import { BookItemInfoTab } from "../../../../components/tabs/BookItemInfoTab";
import { BookDetailTab } from "../../../../components/tabs/BookDetailTab";
import { BookAuthorsTab } from "../../../../components/tabs/BookAuthorTab";
import { BookChaptersTab } from "../../../../components/tabs/BookChapterTab";
import { createBook } from "../../../../lib/BookApi";
import { createChapter } from "../../../../lib/ChapterApi";
import { useRouter } from "next/navigation";
import MySnackbar from "../../../../components/ui/MySnackBar";

export default function AddBookPage() {
  const [tab, setTab] = useState(0);
  const [savedBookId, setSavedBookId] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [bookData, setBookData] = useState({
    name: "",
    mediaType: "",
    isbnType: "",
    isbn: "",
    isbn13: "",
    year: 0,
    price: 0,
    bookStatus: "",
    type: "",
    typeOther: "",
    accessionNo: "",
    callNo: "",
    edition: "",
    seriesName: "",
    volume: "",
    pagesNumber: 0,
    subject: "",
    abstractText: "",
    description: "",
    url: "",
    urlVisibility: "",
    active: true,
    published: true,
    publisherId: 0,
    categoryIds: [],
    authorIds: [],
  });

  const [chapters, setChapters] = useState([]);
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

  async function handleSubmit(e) {
    e.preventDefault();

    if (!bookData.name.trim()) {
      showSnackbar("Name of the book is required", "error");
      return;
    }

    if (!bookData.mediaType) {
      showSnackbar("Media type is required", "error");
      return;
    }

    if (!bookData.isbnType) {
      showSnackbar("ISBN type is required", "error");
      return;
    }

    if (bookData.isbnType === "ISBN" && !/^\d{10}$/.test(bookData.isbn)) {
      showSnackbar("ISBN must contain exactly 10 digits", "error");
      return;
    }

    if (bookData.isbnType === "ISBN13" && !/^\d{13}$/.test(bookData.isbn13)) {
      showSnackbar("ISBN13 must contain exactly 13 digits", "error");
      return;
    }

    if (!bookData.year || bookData.year <= 0) {
      showSnackbar("Year is required", "error");
      return;
    }

    if (!bookData.price || bookData.price <= 0) {
      showSnackbar("Price is required", "error");
      return;
    }

    if (!bookData.bookStatus) {
      showSnackbar("Book status is required", "error");
      return;
    }

    if (!bookData.publisherId) {
      showSnackbar("Publisher is required", "error");
      return;
    }

    if (!bookData.categoryIds || bookData.categoryIds.length === 0) {
      showSnackbar("At least one category is required", "error");
      return;
    }

    if (!bookData.authorIds || bookData.authorIds.length === 0) {
      showSnackbar("At least one author is required", "error");
      return;
    }

    try {
      setLoading(true);

      console.log("Book Info", bookData);

      const createdBook = await createBook(bookData);
      const bookId = createdBook.id;

      setSavedBookId(bookId);

      for (const chapter of chapters) {
        const payload = {
          name: chapter.name,
          order: Number(chapter.order),
          code: chapter.code,
        };

        await createChapter(bookId, payload);
      }

      showSnackbar("Book saved successfully", "success");

      router.push("/books");
    } catch (error) {
      console.log("Error", error);
      showSnackbar(error.message, "error");
    } finally {
      setLoading(false);
    }
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
              label="DETAILS"
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
            <BookItemInfoTab bookData={bookData} setBookData={setBookData} />
          )}

          {tab === 1 && (
            <BookDetailTab bookData={bookData} setBookData={setBookData} />
          )}

          {tab === 2 && (
            <BookAuthorsTab bookData={bookData} setBookData={setBookData} />
          )}

          {tab === 3 && (
            <BookChaptersTab
              chapters={chapters}
              setChapters={setChapters}
              savedBookId={savedBookId}
            />
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Book"}
          </Button>
        </Box>
      </Paper>
      <MySnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
}
