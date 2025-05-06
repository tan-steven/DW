import {
  Modal,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";

const quoteDetails = ({ open, onClose, quoteId }) => {
  const [details, setDetails] = useState([]);

  useEffect(() => {
    if (quoteId && open) {
      axios.get(`/api/quoteDetails/${quoteId}`)
        .then(res => setDetails(res.data))
        .catch(err => console.error("Error fetching quote details", err));
    }
  }, [quoteId, open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
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
      }}>
        <Typography variant="h6" mb={2}>
          Quote Details (ID: {quoteId})
        </Typography>

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
                      <Typography variant="body2"><strong>{key}:</strong> {String(value)}</Typography>
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
