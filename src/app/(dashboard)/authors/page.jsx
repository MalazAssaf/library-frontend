"use client";

import { useEffect, useState } from "react";
import DataTable from "../../../components/ui/DataTable";
import FilterBar from "../../../components/helpres/FilterBar";
import DateFormater from "../../../components/helpres/DateFormater";
import EditModal from "../../../components/ui/EditModal";
import DeleteModal from "../../../components/ui/DeleteModal";
import AppSnackbar from "../../../components/ui/MySnackBar";
import {
  fetchAuthors,
  updateAuthor,
  deleteAuthor,
} from "../../../lib/AuthorApi";
import { countries } from "../../../components/helpres/Countries";

const columns = [
  { id: "id", label: "ID" },
  { id: "name", label: "Name" },
  { id: "country", label: "Country" },
  {
    id: "dateBorn",
    label: "Date Born",
    render: (value) => (value ? DateFormater(value) : "-"),
  },
  {
    id: "dateDied",
    label: "Date Died",
    render: (value) => (value ? DateFormater(value) : "-"),
  },
  {
    id: "lifeStatus",
    label: "Life Status",
    render: (value) => {
      const isLive = String(value).toLowerCase() === "live";

      return (
        <div
          className={`py-2 rounded text-center w-20 text-sm font-semibold ${
            isLive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </div>
      );
    },
  },
];

const initialFilters = {
  name: "",
  lifeStatus: "",
  dateBorn: "",
};

const filterFields = [
  {
    name: "name",
    label: "Author Name",
    type: "text",
    placeholder: "Search by name",
  },
  {
    name: "lifeStatus",
    label: "Life Status",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "live", label: "Live" },
      { value: "died", label: "Died" },
    ],
  },
  {
    name: "dateBorn",
    label: "Date Born",
    type: "date",
  },
];

const editFields = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter author name",
  },
  {
    name: "country",
    label: "Country",
    type: "select",
    options: countries,
  },
  {
    name: "dateBorn",
    label: "Date Born",
    type: "date",
  },
  {
    name: "lifeStatus",
    label: "Life Status",
    type: "select",
    options: [
      { value: "live", label: "🟢 Live" },
      { value: "died", label: "🔴 Died" },
    ],
  },
  {
    name: "dateDied",
    label: "Date Died",
    type: "date",
  },
  {
    name: "bio",
    label: "Bio",
    type: "text",
    placeholder: "Enter bio",
  },
  {
    name: "publications",
    label: "Publications",
    type: "text",
    placeholder: "Enter publications",
  },
  {
    name: "awards",
    label: "Awards",
    type: "text",
    placeholder: "Enter awards",
  },
];

export default function AuthorsPage() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
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

  async function loadAuthors() {
    try {
      const data = await fetchAuthors({
        page: page + 1,
        pageSize,
        name: appliedFilters.name,
        lifeStatus: appliedFilters.lifeStatus,
        dateBorn: appliedFilters.dateBorn,
      });

      setRows(data.items || []);
      setTotalItems(data.totalItems || 0);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load authors", "error");
    }
  }

  useEffect(() => {
    loadAuthors();
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
      nickname: row.nickname || "",
      name: row.name || "",
      country: row.country || "",
      dateBorn: row.dateBorn || "",
      dateDied: row.dateDied || "",
      lifeStatus: row.lifeStatus || "live",
      email: row.email || "",
      mobile: row.mobile || "",
      bio: row.bio || "",
      publications: row.publications || "",
      awards: row.awards || "",
    });
  };

  const handleEditClose = () => {
    if (editLoading) return;
    setEditingItem(null);
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;

    setEditFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "lifeStatus" && value === "live") {
        updated.dateDied = "";
      }

      return updated;
    });
  };

  const handleEditSave = async () => {
    if (!editingItem) return;

    try {
      setEditLoading(true);

      await updateAuthor(editingItem.id, {
        nickname: editFormData.nickname.trim(),
        name: editFormData.name.trim(),
        country: editFormData.country.trim(),
        dateBorn: editFormData.dateBorn || null,
        dateDied:
          editFormData.lifeStatus === "live"
            ? null
            : editFormData.dateDied || null,
        lifeStatus: editFormData.lifeStatus,
        email: editFormData.email.trim(),
        mobile: editFormData.mobile.trim(),
        bio: editFormData.bio.trim(),
        publications: editFormData.publications.trim(),
        awards: editFormData.awards.trim(),
      });

      showSnackbar("Author updated successfully", "success");
      setEditingItem(null);
      loadAuthors();
    } catch (err) {
      console.error(err);
      showSnackbar(err.message || "Failed to update author", "error");
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

      await deleteAuthor(deletingItem.id);

      showSnackbar("Author deleted successfully", "success");
      setDeletingItem(null);

      if (rows.length === 1 && page > 0) {
        setPage((prev) => prev - 1);
      } else {
        loadAuthors();
      }
    } catch (err) {
      console.error(err);
      showSnackbar(err.message || "Failed to delete author", "error");
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
        title="Authors Listing"
        page={page}
        rowsPerPage={pageSize}
        totalCount={totalItems}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        searchable={false}
      />

      <EditModal
        open={Boolean(editingItem)}
        title="Edit Author"
        fields={
          editFormData.lifeStatus === "live"
            ? editFields.filter((field) => field.name !== "dateDied")
            : editFields
        }
        formData={editFormData}
        loading={editLoading}
        onClose={handleEditClose}
        onChange={handleEditFormChange}
        onSubmit={handleEditSave}
      />

      <DeleteModal
        open={Boolean(deletingItem)}
        title="Delete Author"
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
