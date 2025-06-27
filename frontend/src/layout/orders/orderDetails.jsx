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

const OrderDetails = ({ open, onClose, order }) => {
  const [details, setDetails] = useState([]);

  useEffect(() => {
    if (order?.quote_no && open) {
      axios
        .get(`/api/orders/${order.quote_no}`)
        .then((res) => setDetails(res.data))
        .catch((err) =>
          console.error("Error fetching order details", err)
        );
    }
  }, [order, open]);

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
          Order Details - #{order?.quote_no || "loading..."}
        </Typography>

        {order && (
          <Box mb={2}>
            <Typography variant="body1">
              <strong>Date:</strong> {order.date}
            </Typography>
            <Typography>
              <strong>Order Number:</strong> {order.quote_no}
            </Typography>
            <Typography variant="body1">
              <strong>Customer:</strong> {order.customer}
            </Typography>
            <Typography variant="body1">
              <strong>Total:</strong> ${order.total}
            </Typography>
            <Typography variant="body1">
              <strong>Sub Total:</strong> ${order.sub_total}
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => {
                window.open(`/print-quote/order/${order.quote_no}`, "_blank");
              }}
            >
              Print Order
            </Button>
          </Box>
        )}

        {details.length === 0 ? (
          <Typography>No details found for this order.</Typography>
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

export default OrderDetails;
