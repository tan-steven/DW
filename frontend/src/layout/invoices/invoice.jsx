import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import InvoiceDetails from "./invoiceDetails";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState([]);

  const handleOpenModal = (quote_no) => {
    const found = invoices.find(i => i.quote_no === quote_no);
    setSelectedInvoice(found);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get("/api/invoices");
        setInvoices(response.data);
      } catch (err) {
        console.log("Error fetching invoices", err);
      }
    };
    fetchInvoices();
  }, []);

  const columns = [
    { field: "quote_no", headerName: "Invoice Number", flex: 1 },
    {
      field: "date",
      headerName: "date",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "customer", headerName: "customer", flex: 1 },
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
          color="secondary"
          size="small"
          onClick={() => handleOpenModal(params.row.quote_no)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const handleSubmitToDeliveries = async () => {
    if (!Array.isArray(selectedInvoiceIds) || selectedInvoiceIds.length === 0) return;

    const selectedInvoices = invoices.filter(i =>
      selectedInvoiceIds.includes(i.quote_no.toString())
    );

    if (selectedInvoices.length === 0) {
      alert("Please select at least one invoice.");
      return;
    }
    try {
      for (const invoice of selectedInvoices) {
        await axios.post("/api/deliveries", {
          invoice_no: invoice.quote_no,
          customer: invoice.customer,
          total: invoice.total,
          sub_total: invoice.sub_total,
          date: invoice.date,
        });
      }
      alert("Selected invoices submitted to deliveries");
      window.location.reload();
    } catch (err) {
      console.error("Failed to submit invoices to deliveries", err);
      alert("Failed to submit invoices to deliveries");
    }
  };

  return (
    <Box m="20px">
      <Header title="Invoices" subtitle="List of Invoices" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
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
        <Box display="flex" justifyContent="space-between" mb={2} gap={2}>
          <Button
            variant="contained"
            color="secondary"
            disabled={selectedInvoiceIds.length === 0}
            onClick={handleSubmitToDeliveries}
          >
            Submit Selected Invoices to Delivery Schedule
          </Button>
        </Box>

        <DataGrid
          checkboxSelection
          rows={invoices}
          columns={columns}
          getRowId={(row) => row.quote_no.toString()}
          onRowSelectionModelChange={(selectionModel) => {
            const selectedIds = Array.from(selectionModel.ids || []);
            setSelectedInvoiceIds(selectedIds.map(id => id.toString()));
          }}
        />

        <InvoiceDetails
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          invoice={selectedInvoice}
        />
      </Box>
    </Box>
  );
};

export default Invoices;
