"use client";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { Pencil, Trash2, SearchIcon } from "lucide-react";
import InputAdornment from "@mui/material/InputAdornment";

export default function DataTable({
  columns = [],
  rows = [],
  getRowKey,
  onEdit,
  onDelete,
  title,
  firstColWidth = 70,
  actionsColWidth = 180,
  searchable = true,
  page = 0,
  rowsPerPage = 10,
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange,
  searchValue = "",
  onSearchChange,
}) {
  const hasActions = Boolean(onEdit || onDelete);

  const headCellSx = {
    color: "var(--color-foreground)",
    backgroundColor: "var(--color-canavas)",
    fontWeight: 700,
    whiteSpace: "nowrap",
  };

  const bodyCellSx = {
    color: "var(--color-foreground)",
    whiteSpace: "nowrap",
  };

  return (
    <Paper
      sx={{
        width: "100%",
        backgroundColor: "var(--color-canavas)",
        borderRadius: "14px",
        overflow: "hidden",
      }}
    >
      <div className="flex justify-between items-center p-3 bg-canavas">
        <div className="font-bold">
          <p>{title}</p>
        </div>

        {searchable && (
          <div>
            <TextField
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search"
              size="small"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "var(--color-surface)",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0,0,0,0.15)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--color-primary)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--color-primary)",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "var(--color-text-base)",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        )}
      </div>

      <TableContainer sx={{ maxHeight: 440, overflowX: "auto" }}>
        <Table stickyHeader sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {columns.map((col, i) => (
                <TableCell
                  key={col.id ?? i}
                  sx={{
                    ...headCellSx,
                    width: i === 0 ? firstColWidth : "auto",
                    maxWidth: i === 0 ? firstColWidth : "none",
                  }}
                >
                  {col.label}
                </TableCell>
              ))}

              {hasActions && (
                <TableCell
                  sx={{
                    ...headCellSx,
                    width: actionsColWidth,
                    maxWidth: actionsColWidth,
                    textAlign: "center",
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow
                hover
                key={
                  getRowKey ? getRowKey(row, rowIndex) : (row.id ?? rowIndex)
                }
              >
                {columns.map((col, i) => (
                  <TableCell
                    key={(col.id ?? i) + "-" + rowIndex}
                    sx={{
                      ...bodyCellSx,
                      width: i === 0 ? firstColWidth : "auto",
                      maxWidth: i === 0 ? firstColWidth : "none",
                    }}
                  >
                    {col.render
                      ? col.render(row?.[col.id], row)
                      : (row?.[col.id] ?? "-")}
                  </TableCell>
                ))}

                {hasActions && (
                  <TableCell
                    sx={{
                      ...bodyCellSx,
                      width: actionsColWidth,
                      maxWidth: actionsColWidth,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        justifyContent: "center",
                      }}
                    >
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid rgba(0,0,0,0.12)",
                            background: "var(--color-accent)",
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                      )}

                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid rgba(0,0,0,0.12)",
                            background: "var(--color-error)",
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}

            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  sx={{ ...bodyCellSx, padding: 3, opacity: 0.7 }}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={Number(totalCount) || 0}
        rowsPerPage={Number(rowsPerPage) || 10}
        page={Number(page) || 0}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        sx={{
          color: "var(--color-foreground)",
          backgroundColor: "var(--color-canavas)",

          "& .MuiTablePagination-selectLabel": {
            color: "var(--color-foreground)",
          },
          "& .MuiTablePagination-displayedRows": {
            color: "var(--color-foreground)",
          },
          "& .MuiSelect-select": {
            color: "var(--color-foreground)",
          },
          "& .MuiSvgIcon-root": {
            color: "var(--color-foreground)",
          },
          "& .MuiIconButton-root": {
            color: "var(--color-foreground)",
          },

          "& .MuiIconButton-root.Mui-disabled": {
            color: "rgba(0, 0, 0, 0.3)",
            pointerEvents: "none",
            cursor: "not-allowed",
            opacity: 0.2,
          },
        }}
      />
    </Paper>
  );
}
