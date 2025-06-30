import { Autocomplete } from "@mui/material";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import { ExpandMore } from '@mui/icons-material';
import axios from "../../utils/axiosConfig";

const CreateQuote = ({ onQuoteCreated, initialData, open: propOpen, onClose }) => {
  const [customerOptions, setCustomerOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    customer: "",
    total: "",
    sub_total: "",
    quoteDetails: [
      {
        material: "",
        product_type: "",
        CL: "",
        unit: 0,
        width: 0,
        height: 0,
        at: 0,
        GL: "",
        GRD: false,
        SC: "",
        quantity: 1,
        price: 0,
      },
    ],
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("/api/customers");
        setCustomerOptions(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        quoteDetails: initialData.quoteDetails || [],
        duplicate: true, // ensure duplicate flag is set for backend
      });
      setOpen(true);
    }
  }, [initialData]);

  useEffect(() => {
    if (propOpen !== undefined) {
      setOpen(propOpen);
    }
  }, [propOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDetailChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const details = [...formData.quoteDetails];
    details[index][name] = type === "checkbox" ? checked : value;

    // Calculate item total
    const quantity = parseFloat(details[index].quantity) || 0;
    const price = parseFloat(details[index].price) || 0;
    details[index].item_total = quantity * price;

    setFormData({ ...formData, quoteDetails: details });

    // Recalculate overall totals
    recalculateTotals(details);
  };

  const handleAddDetailLine = () => {
    const newDetails = [
      ...formData.quoteDetails,
      {
        material: "",
        product_type: "",
        CL: "",
        unit: 0,
        width: 0,
        height: 0,
        at: 0,
        GL: "",
        GRD: false,
        SC: "",
        quantity: 1,
        price: 0,
      },
    ];
    setFormData({ ...formData, quoteDetails: newDetails });
    recalculateTotals(newDetails);
  };

  const recalculateTotals = (details) => {
    const subTotal = details.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      return sum + quantity * price;
    }, 0);

    setFormData((prev) => ({
      ...prev,
      sub_total: Number(subTotal.toFixed(2)),
      total: Number(subTotal.toFixed(2)),
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/api/quotes", formData);
      onQuoteCreated();
      setOpen(false);
      if (onClose) onClose();
    } catch (err) {
      console.log("Error creating quote from frontend", err);
    }
  };

  return (
    <Box>
      <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>
        Add New Quote
      </Button>

      <Modal open={open} onClose={() => { setOpen(false); if (onClose) onClose(); }}>
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
          <Typography variant="h6" mb={3}>Create a New Quote</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth name="date" label="Date" type="date" value={formData.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                options={customerOptions}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={customerOptions.find(c => c.name === formData.customer) || null}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setFormData({
                      ...formData,
                      customer: newValue.name,
                      customerId: newValue.id
                    });
                  } else {
                    setFormData({ ...formData, customer: "", customerId: "" });
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Customer" variant="outlined" />
                )}
              />
            </Grid>

            {formData.quoteDetails.map((item, index) => (
              <Accordion key={index} sx={{ width: '100%', mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>
                    Line #{index + 1} — {item.material || "New Detail"}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={6}><TextField fullWidth name="material" label="Material" value={item.material} onChange={(e) => handleDetailChange(index, e)} /></Grid>
                    <Grid item xs={6}><TextField fullWidth name="product_type" label="Product Type" value={item.product_type} onChange={(e) => handleDetailChange(index, e)} /></Grid>
                    <Grid item xs={6}><TextField fullWidth name="CL" label="CL" value={item.CL} onChange={(e) => handleDetailChange(index, e)} /></Grid>
                    <Grid item xs={6}><TextField fullWidth name="unit" label="Unit" type="number" value={item.unit} onChange={(e) => handleDetailChange(index, e)} /></Grid>
                    <Grid item xs={6}><TextField fullWidth name="width" label="Width" type="number" value={item.width} onChange={(e) => handleDetailChange(index, e)} /></Grid>
                    <Grid item xs={6}><TextField fullWidth name="height" label="Height" type="number" value={item.height} onChange={(e) => handleDetailChange(index, e)} /></Grid>
                    <Grid item xs={6}><TextField fullWidth name="at" label="AT" type="number" value={item.at} onChange={(e) => handleDetailChange(index, e)} /></Grid>
                    <Grid item xs={6}><TextField fullWidth name="GL" label="GL" value={item.GL} onChange={(e) => handleDetailChange(index, e)} /></Grid>
                    <Grid item xs={6}><FormControlLabel control={<Checkbox checked={item.GRD} onChange={(e) => handleDetailChange(index, e)} name="GRD" />} label="GRD" /></Grid>
                    <Grid item xs={6}><TextField fullWidth name="SC" label="SC" value={item.SC} onChange={(e) => handleDetailChange(index, e)} /></Grid>
                    <Grid item xs={6}><TextField fullWidth name="quantity" label="Quantity" type="number" value={item.quantity} onChange={(e) => handleDetailChange(index, e)} /></Grid>
                    <Grid item xs={6}><TextField fullWidth name="price" label="Unit Price" type="number" value={item.price} onChange={(e) => handleDetailChange(index, e)} /></Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Line Total:</strong> ${(item.quantity * item.price).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}

            <Grid item xs={6}>
              <TextField fullWidth name="sub_total" label="Sub Total" type="number" value={formData.sub_total} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth name="total" label="Total" type="number" value={formData.total} onChange={handleChange} />
            </Grid>

            <Grid item xs={12}>
              <Button variant="outlined" onClick={handleAddDetailLine}>Add Line</Button>
            </Grid>

            <Grid item xs={12}>
              <Button fullWidth variant="contained" color="secondary" onClick={handleSubmit}>Submit</Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default CreateQuote;
