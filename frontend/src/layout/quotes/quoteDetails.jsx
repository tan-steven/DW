import {
  Modal,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Button,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import { formatQuoteNumber } from "../../utils/quoteNum";

const quoteDetails = ({ open, onClose, quote }) => {
  const [details, setDetails] = useState([]);

  useEffect(() => {
    if (quote?.quote_no && open) {
      axios
        .get(`/api/quotes/${quote.quote_no}`)
        .then((res) => setDetails(res.data))
        .catch((err) =>
          console.error("Error fetching quote details", err)
        );
    }
  }, [quote, open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" mb={2}>
          Quote Details - {quote?.quote_no ? formatQuoteNumber(quote?.quote_no): "loading..."}
        </Typography>

        {quote && (
          <Box mb={2}>
            <Typography variant="body1">
              <strong>Date:</strong> {quote.date}
            </Typography>
            <Typography variant="body1">
              <strong>Customer:</strong> {quote.customer}
            </Typography>
            <Typography variant="body1">
              <strong>Total:</strong> ${quote.total}
            </Typography>
            <Typography variant="body1">
              <strong>Sub Total:</strong> ${quote.sub_total}
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => {
                window.open(`/print-quote/quote/${quote.quote_no}`, "_blank");
              }}
            >
              Print Quote
            </Button>
          </Box>
        )}

        {details.length === 0 ? (
          <Typography>No details found for this quote.</Typography>
        ) : (
          details.map((item, index) => (
            <Accordion key={index} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Line #{index + 1}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {Object.entries(item).map(([key, value]) => (
                    <Grid item xs={6} key={key}>
                      <Typography variant="body2">
                        <strong>{key}:</strong> {String(value)}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>
    </Modal>
  );
};

export default quoteDetails;
