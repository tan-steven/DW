import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import OrderDetails from "./orderDetails";

const Orders = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  const handleOpenModal = (id) => {
    const found = orders.find(o => o.id === id);
    setSelectedOrder(found);
    setModalOpen(true);
  };

  const handleSubmitAsInvoice = async () => {
    if (!Array.isArray(selectedOrderIds) || selectedOrderIds.length === 0) return;

    try {
      for (const id of selectedOrderIds) {
        await axios.post(`/api/orders/${id}/submit-as-invoice`);
      }
      alert("Submitted to invoices successfully");
      window.location.reload();
    } catch (err) {
      console.error("Failed to submit orders as invoices", err?.response?.data || err);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/orders");
        setOrders(response.data);
      } catch (err) {
        console.log("Error fetching orders", err);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/orders");

        const enhanced = response.data.map(q => {
          const big = BigInt(q.quote_no) % 10_000_000n;
          const status = Number(big / 1_000_000n);
          return { ...q, status };
        });

        // Sort: Quotes (status 0) come before Orders (status 1)
        enhanced.sort((a, b) => a.status - b.status);

        setOrders(enhanced);
      } catch (err) {
        console.log("Error fetching quote from frontend", err);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    { field: "quote_no", headerName: "Order Number", flex: 1 },
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
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const status = (BigInt(params.row.quote_no) % 10_000_000n) / 1_000_000n; // extract first digit
        return (
          <Typography>
            {status === 1n? "Order" : "Invoice"}
          </Typography>
        );
      }
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
          onClick={() => handleOpenModal(params.row.id)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Orders" subtitle="List of Orders" />
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
            disabled={selectedOrderIds.length === 0}
            onClick={handleSubmitAsInvoice}
          >
            Submit as Invoice
          </Button>
        </Box>

        <DataGrid
          checkboxSelection
          rows={orders}
          columns={columns}
          getRowId={(row) => row.id.toString()}
          onRowSelectionModelChange={(selectionModel) => {
            const selectedIds = Array.from(selectionModel.ids || []);
            setSelectedOrderIds(selectedIds);
          }}
        />

        <OrderDetails
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          order={selectedOrder}
        />
      </Box>
    </Box>
  );
};

export default Orders;
