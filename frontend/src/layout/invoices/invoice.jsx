import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import { useEffect, useState } from "react";
import axios from "axios";
import InvoiceDetails from "./invoiceDetails";

import { Button } from "@mui/material";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [invoices, setInvoices] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (id) => {
    setSelectedInvoiceId(id);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get("/api/invoices");
        setInvoices(response.data);
      } catch (err) {
        console.log("Error fetching invoice from frontend", err);
      }
    };
    fetchInvoices();
  }, []);

  const columns = [
    { field: "id", headerName: "invoice_no" },
    {
      field: "date",
      headerName: "date",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "customer",
      headerName: "customer",
      flex: 1,
    },
    {
      field: "total",
      headerName: "total",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          ${params.row.total}
        </Typography>
      ),
    },
    {
      field: "sub total",
      headerName: "sub total",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          ${params.row.sub_total}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleOpenModal(params.row.id)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Invoices" subtitle="List of Invoices" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={invoices} columns={columns} />
      </Box>
      <InvoiceDetails
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        invoiceId={selectedInvoiceId}
      />
    </Box>
  );
};

export default Invoices;
