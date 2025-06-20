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

import {ExpandMore} from '@mui/icons-material'
import axios from "../../utils/axiosConfig";

const CreateQuote = ({ onQuoteCreated }) => {
  const [customerOptions, setCustomerOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    customer: "",
    total: "",
    sub_total: "",
    status: "",
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
        SC: ""
      }
    ]
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


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDetailChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const details = [...formData.quoteDetails];
    details[index][name] = type === "checkbox" ? checked : value;
    setFormData({ ...formData, quoteDetails: details });
  };

  const handleAddDetailLine = () => {
    setFormData({
      ...formData,
      quoteDetails: [
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
          SC: ""
        }
      ]
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/api/quotes", formData);
      onQuoteCreated();
      setOpen(false);
    } catch (err) {
      console.log("Error creating quote from frontend", err);
    }
  };

  return (
    <Box>
      <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>
        Add New Quote
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
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
            {/* Quote Header Info */}
            <Grid item xs={6}>
              <TextField fullWidth name="date" label="Date" type="date" value={formData.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                options={customerOptions}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.quote_no === value.quote_no}
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    customer: newValue ? newValue.name : "",
                    customerId: newValue ? newValue.id : ""
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Customer" variant="outlined" />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth name="total" label="Total" type="number" value={formData.total} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth name="sub_total" label="Sub Total" type="number" value={formData.sub_total} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth name="status" label="Status" value={formData.status} onChange={handleChange} />
            </Grid>

            {/* Detail Lines */}
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
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}


            {/* Add Line Button */}
            <Grid item xs={12}>
              <Button variant="outlined" color="" onClick={handleAddDetailLine}>Add Line</Button>
            </Grid>

            {/* Submit Button */}
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
