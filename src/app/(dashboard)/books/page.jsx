"use client";

import { useEffect, useState } from "react";
import DataTable from "../../../components/ui/DataTable";
import FilterBar from "../../../components/helpres/FilterBar";
import DeleteModal from "../../../components/ui/DeleteModal";
import AppSnackbar from "../../../components/ui/MySnackBar";

import { fetchBooks, deleteBook } from "../../../lib/BookApi";

const years = Array.from({ length: 100 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { value: year, label: year };
});

const columns = [
  { id: "id", label: "ID" },
  {
    id: "name",
    label: "Name",
    render: (value) => (
      <p>{value.charAt(0).toUpperCase() + value.toLowerCase().slice(1)}</p>
    ),
  },

  {
    id: "bookStatus",
    label: "Status",
    render: (value) => {
      const status = String(value).toLowerCase();

      const styles = {
        new: "bg-green-100 text-green-700",
        old: "bg-gray-200 text-gray-700",
        sterilized: "bg-blue-100 text-blue-700",
        restored: "bg-yellow-100 text-yellow-700",
      };

      const style = styles[status] || "bg-red-200 text-red-700";

      return (
        <div
          className={`py-2 rounded text-center w-24 text-sm font-semibold ${style}`}
        >
          {value.charAt(0).toUpperCase() + value.toLowerCase().slice(1)}
        </div>
      );
    },
  },

  {
    id: "authors",
    label: "Author",
    render: (value) =>
      Array.isArray(value) ? (
        <div className="flex flex-wrap gap-1">
          {value.map((author, i) => (
            <span
              key={i}
              className="px-2 py-2 text-xs font-semibold rounded bg-indigo-100 text-indigo-700"
            >
              {author}
            </span>
          ))}
        </div>
      ) : (
        ""
      ),
  },

  {
    id: "categories",
    label: "Category",
    render: (value) =>
      Array.isArray(value) ? (
        <div className="flex flex-wrap gap-1">
          {value.map((cat, i) => (
            <span
              key={i}
              className="px-2 py-2 text-xs font-semibold rounded bg-primary text-canavas"
            >
              {cat}
            </span>
          ))}
        </div>
      ) : (
        ""
      ),
  },

  {
    id: "isbn",
    label: "ISBN",
    render: (_, row) => row.isbn || row.isbn13 || "-",
  },

  { id: "year", label: "Year" },
  { id: "price", label: "Price" },
];

const initialFilters = {
  name: "",
  bookStatus: "",
  isbn: "",
  yearAfter: "",
  yearBefore: "",
  price: "",
};

const filterFields = [
  {
    name: "name",
    label: "Book Name",
    type: "text",
    placeholder: "Search by name",
  },
  {
    name: "bookStatus",
    label: "Book Status",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "NEW", label: "New" },
      { value: "OLD", label: "Old" },
      { value: "STERILIZED", label: "Sterilized" },
      { value: "RESTORED", label: "Restored" },
    ],
  },
  {
    name: "isbn",
    label: "ISBN",
    type: "text",
    placeholder: "Search by ISBN",
  },
  {
    name: "yearAfter",
    label: "Year After",
    type: "select",
    options: [{ value: "", label: "Any" }, ...years],
  },
  {
    name: "yearBefore",
    label: "Year Before",
    type: "select",
    options: [{ value: "", label: "Any" }, ...years],
  },
  {
    name: "price",
    label: "Price",
    type: "number",
  },
];

export default function BooksPage() {
  const [rows, setRows] = useState([]);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const [deletingItem, setDeletingItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  async function loadBooks() {
    try {
      const data = await fetchBooks({
        page: page + 1,
        pageSize,
        name: appliedFilters.name,
        bookStatus: appliedFilters.bookStatus,
        isbn: appliedFilters.isbn,
        yearAfter: appliedFilters.yearAfter,
        yearBefore: appliedFilters.yearBefore,
        price: appliedFilters.price,
      });

      setRows(data.items || []);
      setTotalItems(data.totalItems || 0);
      console.log("Total Items are => ", data.items);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load books", "error");
    }
  }

  useEffect(() => {
    loadBooks();
  }, [page, pageSize, appliedFilters]);

  const handleDeleteOpen = (row) => setDeletingItem(row);
  const handleDeleteClose = () => setDeletingItem(null);

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;

    try {
      setDeleteLoading(true);

      await deleteBook(deletingItem.id);

      showSnackbar("Book deleted successfully");
      setDeletingItem(null);
      loadBooks();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to delete book", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <FilterBar
        filters={filters}
        fields={filterFields}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        }
        onSearch={() => {
          setAppliedFilters(filters);
          setPage(0);
        }}
        onReset={() => {
          setFilters(initialFilters);
          setAppliedFilters(initialFilters);
          setPage(0);
        }}
      />

      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.id}
        onDelete={handleDeleteOpen}
        title="Books Listing"
        page={page}
        rowsPerPage={pageSize}
        totalCount={totalItems}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setPageSize(parseInt(e.target.value, 10));
          setPage(0);
        }}
        searchable={false}
      />
      <DeleteModal
        open={Boolean(deletingItem)}
        title="Delete Book"
        itemName={deletingItem?.name || ""}
        loading={deleteLoading}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
      />

      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </>
  );
}
