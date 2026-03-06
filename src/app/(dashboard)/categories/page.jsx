"use client";

import { useEffect, useState } from "react";
import DataTable from "../../../components/ui/DataTable";
import FilterBar from "../../../components/helpres/FilterBar";
import DateFormater from "../../../components/helpres/DateFormater";
import EditModal from "../../../components/ui/EditModal";
import DeleteModal from "../../../components/ui/DeleteModal";
import AppSnackbar from "../../../components/ui/MySnackBar";
import {
  fetchCategories,
  updateCategory,
  deleteCategory,
} from "../../../lib/CategoryApi";

const columns = [
  { id: "id", label: "ID" },
  { id: "name", label: "Name" },
  {
    id: "status",
    label: "Status",
    render: (value) => {
      const isActive = String(value).toLowerCase() === "active";

      return (
        <div
          className={`py-2 rounded text-center w-20 text-sm font-semibold ${
            isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {value}
        </div>
      );
    },
  },
  {
    id: "createdAt",
    label: "Created At",
    render: (value) => DateFormater(value),
  },
  {
    id: "updatedAt",
    label: "Updated At",
    render: (value) => DateFormater(value),
  },
];

const initialFilters = {
  name: "",
  status: "",
  createdDate: "",
  updatedDate: "",
};

const filterFields = [
  {
    name: "name",
    label: "Category Name",
    type: "text",
    placeholder: "Search by name",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
  },
  {
    name: "createdDate",
    label: "Created Date",
    type: "date",
  },
  {
    name: "updatedDate",
    label: "Updated Date",
    type: "date",
  },
];

const editFields = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter category name",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "🟢 Active" },
      { value: "inactive", label: "🔴 Inactive" },
    ],
  },
];

export default function CategoriesPage() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    status: "active",
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
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  }

  async function loadCategories() {
    try {
      const data = await fetchCategories({
        page: page + 1,
        pageSize,
        name: appliedFilters.name,
        status: appliedFilters.status,
        createdDate: appliedFilters.createdDate,
        updatedDate: appliedFilters.updatedDate,
      });

      setRows(data.items || []);
      setTotalItems(data.totalItems || 0);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load categories", "error");
    }
  }

  useEffect(() => {
    loadCategories();
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
      status: row.status || "active",
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

      await updateCategory(editingItem.id, {
        name: editFormData.name.trim(),
        status: editFormData.status,
      });

      showSnackbar("Category updated successfully", "success");
      setEditingItem(null);
      loadCategories();
    } catch (err) {
      console.error(err);
      showSnackbar(err.message || "Failed to update category", "error");
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

      await deleteCategory(deletingItem.id);

      showSnackbar("Category deleted successfully", "success");
      setDeletingItem(null);

      if (rows.length === 1 && page > 0) {
        setPage((prev) => prev - 1);
      } else {
        loadCategories();
      }
    } catch (err) {
      console.error(err);
      showSnackbar(err.message || "Failed to delete category", "error");
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
        title="Categories Listing"
        page={page}
        rowsPerPage={pageSize}
        totalCount={totalItems}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        searchable={false}
      />

      <EditModal
        open={Boolean(editingItem)}
        title="Edit Category"
        fields={editFields}
        formData={editFormData}
        loading={editLoading}
        onClose={handleEditClose}
        onChange={handleEditFormChange}
        onSubmit={handleEditSave}
      />

      <DeleteModal
        open={Boolean(deletingItem)}
        title="Delete Category"
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
