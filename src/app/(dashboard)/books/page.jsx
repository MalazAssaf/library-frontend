"use client";

import { useEffect, useState } from "react";
import DataTable from "../../../components/ui/DataTable";
import FilterBar from "../../../components/helpres/FilterBar";
import EditModal from "../../../components/ui/EditModal";
import DeleteModal from "../../../components/ui/DeleteModal";
import AppSnackbar from "../../../components/ui/MySnackBar";

import { fetchBooks, updateBook, deleteBook } from "../../../lib/BookApi";

const years = Array.from({ length: 100 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { value: year, label: year };
});

const columns = [
  { id: "id", label: "ID" },
  { id: "name", label: "Name" },

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

      const style = styles[status] || "bg-red-100 text-red-700";

      return (
        <div
          className={`py-2 rounded text-center w-24 text-sm font-semibold ${style}`}
        >
          {value}
        </div>
      );
    },
  },

  { id: "isbn", label: "ISBN" },
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

const editFields = [
  {
    name: "name",
    label: "Name",
    type: "text",
  },
  {
    name: "isbn",
    label: "ISBN",
    type: "text",
  },
  {
    name: "year",
    label: "Year",
    type: "number",
  },
  {
    name: "price",
    label: "Price",
    type: "number",
  },
  {
    name: "bookStatus",
    label: "Book Status",
    type: "select",
    options: [
      { value: "NEW", label: "🟢 New" },
      { value: "OLD", label: "⚪ Old" },
      { value: "STERILIZED", label: "🔵 Sterilized" },
      { value: "RESTORED", label: "🟡 Restored" },
    ],
  },
];

export default function BooksPage() {
  const [rows, setRows] = useState([]);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    isbn: "",
    year: "",
    price: "",
    bookStatus: "NEW",
  });

  const [editLoading, setEditLoading] = useState(false);

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
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load books", "error");
    }
  }

  useEffect(() => {
    loadBooks();
  }, [page, pageSize, appliedFilters]);

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    setAppliedFilters(filters);
    setPage(0);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setPage(0);
  };

  const handleEditOpen = (row) => {
    setEditingItem(row);

    setEditFormData({
      name: row.name || "",
      isbn: row.isbn || "",
      year: row.year || "",
      price: row.price || "",
      bookStatus: row.bookStatus || "NEW",
    });
  };

  const handleEditClose = () => {
    if (editLoading) return;
    setEditingItem(null);
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSave = async () => {
    if (!editingItem) return;

    try {
      setEditLoading(true);

      await updateBook(editingItem.id, editFormData);

      showSnackbar("Book updated successfully");
      setEditingItem(null);
      loadBooks();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to update book", "error");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteOpen = (row) => {
    setDeletingItem(row);
  };

  const handleDeleteClose = () => {
    if (deleteLoading) return;
    setDeletingItem(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;

    try {
      setDeleteLoading(true);

      await deleteBook(deletingItem.id);

      showSnackbar("Book deleted successfully");
      setDeletingItem(null);

      if (rows.length === 1 && page > 0) {
        setPage((prev) => prev - 1);
      } else {
        loadBooks();
      }
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
        onChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.id}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        title="Books Listing"
        page={page}
        rowsPerPage={pageSize}
        totalCount={totalItems}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        searchable={false}
      />

      <EditModal
        open={Boolean(editingItem)}
        title="Edit Book"
        fields={editFields}
        formData={editFormData}
        loading={editLoading}
        onClose={handleEditClose}
        onChange={handleEditFormChange}
        onSubmit={handleEditSave}
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
