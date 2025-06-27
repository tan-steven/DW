import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import CreateQuote from "./createQuote";
import QuoteDetails from "./quoteDetails";

const Quotes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuoteIds, setSelectedQuoteIds] = useState([]);

  const handleOpenModal = (quote_no) => {
    const found = quotes.find(q => q.quote_no === quote_no);
    setSelectedQuote(found);
    setModalOpen(true);
  };

  const handleSubmitAsOrder = async () => {
    if (!Array.isArray(selectedQuoteIds) || selectedQuoteIds.length === 0) return;

    try {
      for (const quote_no of selectedQuoteIds) {
        await axios.post(`/api/quotes/${quote_no}/submit-as-order`);
      }
      alert("Submitted to orders successfully");
      window.location.reload();
    } catch (err) {
      console.error("Failed to submit quotes as orders", err?.response?.data || err);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await axios.get("/api/quotes");

        const enhanced = response.data.map(q => {
          const big = BigInt(q.quote_no) % 10_000_000n;
          const status = Number(big / 1_000_000n);
          return { ...q, status };
        });

        // Sort: Quotes (status 0) come before Orders (status 1)
        enhanced.sort((a, b) => a.status - b.status);

        setQuotes(enhanced);
      } catch (err) {
        console.log("Error fetching quote from frontend", err);
      }
    };

    fetchQuotes();
  }, []);


  const columns = [
    {
      field: "quote_no",
      headerName: "Quote Number",
      flex: 1,
    },
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
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const status = (BigInt(params.row.quote_no) % 10_000_000n) / 1_000_000n; // extract first digit
        return (
          <Typography>
            {status === 0n
              ? "Quote"
              : status === 1n
              ? "Order"
              : status === 2n
              ? "Invoice"
              : "Unknown"}
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
          onClick={() => handleOpenModal(params.row.quote_no)}
        >
          View Details
        </Button>
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
          <CreateQuote onQuoteCreated={() => window.location.reload()} />
          <Button
            variant="contained"
            color="secondary"
            disabled={selectedQuoteIds.length === 0}
            onClick={handleSubmitAsOrder}
          >
            Submit as Order
          </Button>
        </Box>

        <DataGrid
          checkboxSelection
          rows={quotes}
          columns={columns}
          getRowId={(row) => row.quote_no.toString()}
          onRowSelectionModelChange={(selectionModel) => {
            const selectedIds = Array.from(selectionModel.ids || []);
            setSelectedQuoteIds(selectedIds);
          }}
        />

        <QuoteDetails
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          quote={selectedQuote}
        />
      </Box>
    </Box>
  );
};

export default Quotes;
