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
import { useEffect, useState, useRef } from "react";
import axios from "../../utils/axiosConfig";
import { useReactToPrint } from "react-to-print";

const InvoiceDetails = ({ open, onClose, invoice }) => {
  const [details, setDetails] = useState([]);
  const printRef = useRef();

  useEffect(() => {
    if (invoice?.id && open) {
      axios
        .get(`/api/invoiceDetails/${invoice.id}`)
        .then((res) => setDetails(res.data))
        .catch((err) =>
          console.error("Error fetching invoice details", err)
        );
    }
  }, [invoice, open]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

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
        <Box ref={printRef}>
          <Typography variant="h6" mb={2}>
            Invoice Details - #{invoice?.id || "loading..."}
          </Typography>

          {invoice && (
            <Box mb={2}>
              <Typography variant="body1">
                <strong>Date:</strong> {invoice.date}
              </Typography>
              <Typography variant="body1">
                <strong>Customer:</strong> {invoice.customer}
              </Typography>
              <Typography variant="body1">
                <strong>Total:</strong> ${invoice.total}
              </Typography>
              <Typography variant="body1">
                <strong>Sub Total:</strong> ${invoice.sub_total}
              </Typography>
            </Box>
          )}

          {details.length === 0 ? (
            <Typography>No details found for this invoice.</Typography>
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

        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="outlined" onClick={handlePrint}>
            Print
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default InvoiceDetails;
