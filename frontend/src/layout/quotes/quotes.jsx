import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/header";
import { useEffect, useState } from "react";
import axios from "axios";

import CreateQuote from "./createQuote";

const Quotes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [quotes, setQuotes] = useState([]);

  useEffect(() =>{
    const fetchQuotes = async () =>{
      try{
        const response = await axios.get("http://localhost:4005/api/quotes");
        setQuotes(response.data);
      } catch (err) {
        console.log("Error fetching quote from frontend", err);
      }
    };
    fetchQuotes();
  }, []);

  const columns = [
    { field: "id", headerName: "quote_no" },
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

  ];

  return (
    <Box m="20px">
      <Header title="Quotes" subtitle="List of Quotes" />
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
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <CreateQuote onQuoteCreated={() => window.location.reload()} />
        </Box>
        <DataGrid checkboxSelection rows={quotes} columns={columns} />
      </Box>
    </Box>
  );
};

export default Quotes;
