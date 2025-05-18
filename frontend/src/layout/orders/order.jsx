import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import OrderDetails from "./orderDetails";

const Orders = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  const handleOpenModal = (id) => {
    setSelectedOrderId(id);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/getOrders");
        setOrders(response.data);
      } catch (err) {
        console.log("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, []);

  const handleSubmitAsInvoice = async () => {
    console.log("Submitting orders as invoices:", selectedOrderIds);
    try {
      for (const id of selectedOrderIds) {
        await axios.post(`/api/orders/${id}/submit-as-invoice`);
      }
      alert("Orders submitted as invoices.");
      window.location.reload();
    } catch (err) {
      console.error("Failed to submit orders as invoices", err);
      alert("Something went wrong");
    }
  };

  const columns = [
    { field: "id", headerName: "order_no" },
    { field: "date", headerName: "date", flex: 1 },
    { field: "customer", headerName: "customer", flex: 1 },
    {
      field: "total",
      headerName: "total",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>${params.row.total}</Typography>
      ),
    },
    {
      field: "sub_total",
      headerName: "sub total",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>${params.row.sub_total}</Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Button variant="outlined" size="small" onClick={() => handleOpenModal(params.row.id)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Orders" subtitle="List of Orders" />
      <Box m="40px 0 0 0" height="75vh">
        <Button
          variant="contained"
          color="success"
          disabled={selectedOrderIds.length === 0}
          onClick={handleSubmitAsInvoice}
        >
          Submit as Invoice
        </Button>

        <DataGrid
          checkboxSelection
          rows={orders}
          columns={columns}
          getRowId={(row) => row.id}
          onRowSelectionModelChange={({ ids }) => {
            setSelectedOrderIds(Array.from(ids));
          }}
        />

        <OrderDetails open={modalOpen} onClose={() => setModalOpen(false)} orderId={selectedOrderId} />
      </Box>
    </Box>
  );
};

export default Orders;
