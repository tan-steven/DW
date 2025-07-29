import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Chip,
  Paper,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import { tokens } from "../../theme";
import axios from "../../utils/axiosConfig";

const CustomerPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [customerQuotes, setCustomerQuotes] = useState({});
  const [expandedCustomers, setExpandedCustomers] = useState({});
  const [formData, setFormData] = useState({
    id: "",
    company: "",
    name: "",
    phone: "",
    address: "",
    email: "",
  });

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/api/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    }
  };

  const fetchCustomerQuotes = async (customerId) => {
    try {
      const res = await axios.get("/api/quotes");
      
      // Filter quotes for this customer based on quote number pattern
      // Using the same logic as in quoteDetails.jsx
      const customerQuotesData = res.data.filter(quote => {
        const quoteStr = quote.quote_no.toString();
        let extractedCustomerId;
        
        // Extract customer ID based on quote number pattern
        if (quoteStr.length >= 7) {
          // For quote numbers like 10000100 or 120000100
          const customerPart = quoteStr.substring(0, quoteStr.length - 7);
          extractedCustomerId = parseInt(customerPart);
        }
        
        console.log(`Quote ${quote.quote_no}: extracted customer ID ${extractedCustomerId}, comparing with ${customerId}`);
        return extractedCustomerId == customerId; // Use == instead of === to handle type differences
      });

      // Add status to quotes using the same logic as quotes.jsx
      const enhancedQuotes = customerQuotesData.map(q => {
        const big = BigInt(q.quote_no) % 10_000_000n;
        const status = Number(big / 1_000_000n);
        return { ...q, status };
      });

      console.log(`Found ${enhancedQuotes.length} quotes for customer ${customerId}:`, enhancedQuotes);

      setCustomerQuotes(prev => ({
        ...prev,
        [customerId]: enhancedQuotes
      }));
    } catch (err) {
      console.error("Failed to fetch customer quotes", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/api/customers", formData);
      setFormData({ name: "", phone: "", address: "", email: "", company: "" });
      fetchCustomers();
    } catch (err) {
      console.error("Failed to add customer", err);
    }
  };

  const handleExpandCustomer = async (customerId) => {
    const isExpanded = expandedCustomers[customerId];
    
    setExpandedCustomers(prev => ({
      ...prev,
      [customerId]: !isExpanded
    }));

    // Fetch quotes if expanding and not already fetched
    if (!isExpanded && !customerQuotes[customerId]) {
      await fetchCustomerQuotes(customerId);
    }
  };

  const handleCreateQuote = (customer) => {
    navigate("/quotes/create", {
      state: {
        initialData: {
          customer: customer.name,
          customerId: customer.id,
          date: new Date().toISOString().split('T')[0],
          total: 0,
          sub_total: 0,
          quoteDetails: []
        }
      }
    });
  };

  const handleViewQuote = (quote) => {
    // Navigate to quotes page and trigger the quote details modal
    navigate('/quotes', { 
      state: { 
        openQuoteDetails: quote.quote_no 
      } 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0: return "primary";
      case 1: return "success";
      case 2: return "warning";
      default: return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0: return "Quote";
      case 1: return "Order";
      case 2: return "Invoice";
      default: return "Unknown";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box m="20px">
      <Header title="Customer Info" subtitle="Add and view customer details" />

      {/* Add Customer Form */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>Add New Customer</Typography>
        <Box
          display="grid"
          gridTemplateColumns="repeat(4, 1fr)"
          gap="20px"
          mb="20px"
        >
          <TextField
            label="Company"
            variant="outlined"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
          <TextField
            label="Name"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Phone"
            variant="outlined"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            label="Address"
            variant="outlined"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleChange}
            sx={{ gridColumn: "span 2" }}
          />
        </Box>

        <Button variant="contained" color="secondary" onClick={handleSubmit}>
          Add Customer
        </Button>
      </Paper>

      {/* Customer List with Expandable Quotes */}
      <Box mt={4}>
        <Typography variant="h6" mb={2}>Customer List</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="50px"></TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Email</TableCell>
              <TableCell width="120px">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <React.Fragment key={customer.id}>
                {/* Main Customer Row */}
                <TableRow>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleExpandCustomer(customer.id)}
                    >
                      {expandedCustomers[customer.id] ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>{customer.company}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={() => handleCreateQuote(customer)}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      New Quote
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Expandable Quotes Section */}
                <TableRow>
                  <TableCell colSpan={7} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={expandedCustomers[customer.id]} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div" sx={{ mt: 2 }}>
                          Quotes for {customer.name}
                        </Typography>
                        {customerQuotes[customer.id] && customerQuotes[customer.id].length > 0 ? (
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Quote #</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {customerQuotes[customer.id].map((quote) => (
                                <TableRow key={quote.quote_no}>
                                  <TableCell>{quote.quote_no}</TableCell>
                                  <TableCell>{formatDate(quote.date)}</TableCell>
                                  <TableCell>
                                    <Typography color={colors.greenAccent[500]}>
                                      ${parseFloat(quote.total).toFixed(2)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={getStatusText(quote.status)}
                                      color={getStatusColor(quote.status)}
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      startIcon={<VisibilityIcon />}
                                      onClick={() => handleViewQuote(quote)}
                                      sx={{ fontSize: '0.7rem' }}
                                    >
                                      View
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : customerQuotes[customer.id] ? (
                          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                            No quotes found for this customer.
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                            Loading quotes...
                          </Typography>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default CustomerPage;