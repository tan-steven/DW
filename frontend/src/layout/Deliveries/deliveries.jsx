import { Box, Typography, useTheme, Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";

const Deliveries = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const res = await axios.get("/api/deliveries");
        setDeliveries(res.data);
      } catch (err) {
        console.error("Error fetching deliveries", err);
      }
    };
    fetchDeliveries();
  }, []);

  const handleDateChange = (id, date) => {
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, delivery_date: date } : d
      )
    );
  };

  const handleSaveDate = async (id, date) => {
    try {
      await axios.put(`/api/deliveries/${id}`, { delivery_date: date });
      alert("Delivery date updated");
    } catch (err) {
      console.error("Failed to update delivery date", err);
      alert("Failed to update delivery date");
    }
  };

  const columns = [
    {
      field: "invoice_no",
      headerName: "Invoice No",
      flex: 1,
    },
    {
      field: 'customer',
      headerName: 'Customer',
      flex: 1,  
    },
    {
      field: "total",
      headerName: "Total",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          ${params.row.total}
        </Typography>
      ),
    },
    {
      field: "sub_total",
      headerName: "Sub Total",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          ${params.row.sub_total}
        </Typography>
      ),
    },
    {
      field: "delivery_date",
      headerName: "Delivery Date",
      flex: 1,
      renderCell: (params) => {
        let localDateStr = "";
        if (params.row.delivery_date) {
          const dateObj = new Date(params.row.delivery_date);

          // Use UTC getters to avoid local timezone shift
          const year = dateObj.getUTCFullYear();
          const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getUTCDate()).padStart(2, '0');

          localDateStr = `${year}-${month}-${day}`;
        }

        return (
          <TextField
            type="date"
            value={localDateStr}
            onChange={(e) => handleDateChange(params.row.id, e.target.value)}
            size="small"
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleSaveDate(params.row.id, params.row.delivery_date)}
        >
          Save Date
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Deliveries" subtitle="List of Deliveries" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
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
        <DataGrid
          rows={deliveries}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
};

export default Deliveries;
