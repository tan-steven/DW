import {
  Modal,
  Box,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import { formatQuoteNumber } from "../../utils/quoteNum";

// Frame color mappings
const FRAME_COLORS = {
  White: '#FFFFFF',
  Black: '#000000',
  Bronze: '#CD7F32',
  Silver: '#C0C0C0',
  Beige: '#F5F5DC',
  Brown: '#A52A2A',
  'Custom Color': '#DDDDDD',
};

// Glass color mappings
const GLASS_COLORS = {
  Clear: 'rgba(173,216,230,0.3)',
  'Low-E': 'rgba(173,216,230,0.5)',
  Tempered: 'rgba(173,216,230,0.6)',
  Laminated: 'rgba(173,216,230,0.4)',
  'Tinted Bronze': 'rgba(165,42,42,0.5)',
  'Tinted Gray': 'rgba(128,128,128,0.5)',
  Frosted: 'rgba(255,255,255,0.7)',
  'Double Pane': 'rgba(173,216,230,0.2)',
  'Triple Pane': 'rgba(173,216,230,0.15)',
};

// Window rendering component
const WindowImage = ({ detail }) => {
  const frameColor = FRAME_COLORS[detail.CL] || FRAME_COLORS['Custom Color'];
  const glassColor = GLASS_COLORS[detail.GL] || GLASS_COLORS['Clear'];
  
  return (
    <Box sx={{ width: 60, height: 60, flexShrink: 0 }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <rect x="0" y="0" width="100" height="100" fill="none" stroke={frameColor} strokeWidth="6" />
        <rect x="8" y="8" width="84" height="84" fill={glassColor} />
        {detail.product_type === 'Double Hung' && (
          <line x1="0" y1="50" x2="100" y2="50" stroke={frameColor} strokeWidth="3" />
        )}
        {detail.product_type === 'Sliding' && (
          <line x1="50" y1="0" x2="50" y2="100" stroke={frameColor} strokeWidth="3" />
        )}
        {detail.GRD && (
          <>
            <line x1="33" y1="8" x2="33" y2="92" stroke={frameColor} strokeWidth="1" />
            <line x1="66" y1="8" x2="66" y2="92" stroke={frameColor} strokeWidth="1" />
            <line x1="8" y1="33" x2="92" y2="33" stroke={frameColor} strokeWidth="1" />
            <line x1="8" y1="66" x2="92" y2="66" stroke={frameColor} strokeWidth="1" />
          </>
        )}
      </svg>
    </Box>
  );
};

const QuoteDetails = ({ open, onClose, quote }) => {
  const [details, setDetails] = useState([]);
  const navigate = useNavigate();

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

  const handleDuplicate = () => {
    navigate("/quotes/create", {
      state: {
        initialData: {
          ...quote,
          customerId: quote.customer_id,
          duplicate: true,
          quoteDetails: details,
        }
      }
    });
    onClose();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            QUOTE
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            {quote?.quote_no ? formatQuoteNumber(quote?.quote_no) : "loading..."}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Quote Information */}
        {quote && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                BILL TO
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {quote.customer}
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle2" color="text.secondary">
                QUOTE DATE
              </Typography>
              <Typography variant="h6">
                {formatDate(quote.date)}
              </Typography>
            </Grid>
          </Grid>
        )}

        {/* Items Table */}
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Qty</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Unit Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {details.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No items found for this quote.
                  </TableCell>
                </TableRow>
              ) : (
                details.map((item, index) => (
                  <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <WindowImage detail={item} />
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Window #{index + 1}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.product_line}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.product_type} - {item.material}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.width}" × {item.height}" • {item.CL} Frame • {item.GL} Glass
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        {item.SC} {item.GRD && '• Grids'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="right">${parseFloat(item.price).toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      ${(item.quantity * item.price).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Totals Section */}
        {quote && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Box sx={{ width: 300 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${parseFloat(quote.sub_total).toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  ${parseFloat(quote.total).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Action Buttons */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => {
                window.open(`/print-quote/quote/${quote.quote_no}`, "_blank");
              }}
            >
              Print Quote
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleDuplicate}
            >
              Edit Quote
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default QuoteDetails;