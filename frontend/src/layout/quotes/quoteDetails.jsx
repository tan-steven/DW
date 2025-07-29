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
  
  // Get dimensions and calculate aspect ratio
  const width = parseFloat(detail.width) || 36;
  const height = parseFloat(detail.height) || 48;
  const maxDimension = Math.max(width, height);
  const scale = 50 / maxDimension; // Scale to fit within 50px max for the table view
  
  const displayWidth = width * scale;
  const displayHeight = height * scale;
  
  // Center the window in a 60x60 container
  const offsetX = (60 - displayWidth) / 2;
  const offsetY = (60 - displayHeight) / 2;
  
  return (
    <Box sx={{ width: 60, height: 60, flexShrink: 0, position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 60 60">
        {/* Window frame and glass */}
        <rect x={offsetX} y={offsetY} width={displayWidth} height={displayHeight} fill="none" stroke={frameColor} strokeWidth="2" />
        <rect x={offsetX + 2} y={offsetY + 2} width={displayWidth - 4} height={displayHeight - 4} fill={glassColor} />
        
        {/* Window type specific elements */}
        {detail.product_type === 'Double Hung' && (
          <line x1={offsetX} y1={offsetY + displayHeight/2} x2={offsetX + displayWidth} y2={offsetY + displayHeight/2} stroke={frameColor} strokeWidth="1.5" />
        )}
        {detail.product_type === 'Sliding' && (
          <line x1={offsetX + displayWidth/2} y1={offsetY} x2={offsetX + displayWidth/2} y2={offsetY + displayHeight} stroke={frameColor} strokeWidth="1.5" />
        )}
        
        {/* Grids */}
        {detail.GRD && (
          <>
            <line x1={offsetX + displayWidth/3} y1={offsetY + 2} x2={offsetX + displayWidth/3} y2={offsetY + displayHeight - 2} stroke={frameColor} strokeWidth="0.5" opacity="0.7" />
            <line x1={offsetX + 2*displayWidth/3} y1={offsetY + 2} x2={offsetX + 2*displayWidth/3} y2={offsetY + displayHeight - 2} stroke={frameColor} strokeWidth="0.5" opacity="0.7" />
            <line x1={offsetX + 2} y1={offsetY + displayHeight/3} x2={offsetX + displayWidth - 2} y2={offsetY + displayHeight/3} stroke={frameColor} strokeWidth="0.5" opacity="0.7" />
            <line x1={offsetX + 2} y1={offsetY + 2*displayHeight/3} x2={offsetX + displayWidth - 2} y2={offsetY + 2*displayHeight/3} stroke={frameColor} strokeWidth="0.5" opacity="0.7" />
          </>
        )}
        
        {/* Dimension labels - smaller for table view */}
        <text x="30" y="8" textAnchor="middle" fontSize="7" fill="#666">{width}"</text>
        <text x="8" y="30" textAnchor="middle" fontSize="7" fill="#666" transform="rotate(-90 8 30)">{height}"</text>
      </svg>
    </Box>
  );
};

const QuoteDetails = ({ open, onClose, quote }) => {
  const [details, setDetails] = useState([]);
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (quote?.quote_no && open) {
      // Get quote details
      axios
        .get(`/api/quotes/${quote.quote_no}`)
        .then((res) => setDetails(res.data))
        .catch((err) =>
          console.error("Error fetching quote details", err)
        );
      
      // Extract customer ID from quote number and fetch customer details
      const quoteStr = quote.quote_no.toString();
      let customerId;
      
      // Extract customer ID based on quote number pattern
      if (quoteStr.length >= 7) {
        // For quote numbers like 10000100 or 120000100
        const customerPart = quoteStr.substring(0, quoteStr.length - 7);
        customerId = parseInt(customerPart);
      }
      
      if (customerId) {
        axios
          .get(`/api/customers`)
          .then((res) => {
            const customerData = res.data.find(c => c.id == customerId);
            setCustomer(customerData);
          })
          .catch((err) => console.error("Error fetching customer", err));
      }
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
            #{quote?.quote_no || "loading..."}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Quote Information */}
        {quote && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                BILL TO
              </Typography>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {customer?.name || quote.customer}
                </Typography>
                {customer && (
                  <>
                    {customer.company && (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {customer.company}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {customer.address}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {customer.phone}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {customer.email}
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                QUOTE DATE
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
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
                          {item.product_line}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {item.fit}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.product_type} - {item.material}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.width}" × {item.height}" • {item.CL} Frame • {item.GL} Glass
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        {item.SC} • {item.GRD} Grid
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