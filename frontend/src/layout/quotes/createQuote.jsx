import { useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import axios from "axios";

const CreateQuote = ({ onQuoteCreated }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    customer: "",
    total: "",
    sub_total: "",
    material: "",
    product_type: "",
    CL: "",
    unit: "",
    width: "",
    height: "",
    at: "",
    GL: "",
    GRD: false,
    SC: "",
    status: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:4005/api/createQuotes", formData);
      onQuoteCreated();
      setOpen(false);
    } catch (err) {
      console.log("Error creating quote", err);
    }
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add New Quote
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={3}>Create a New Quote</Typography>

          <Grid container spacing={2}>
            {/* First Column */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="date"
                label="Date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="customer"
                label="Customer"
                value={formData.customer}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="total"
                label="Total"
                type="number"
                value={formData.total}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="sub_total"
                label="Sub Total"
                type="number"
                value={formData.sub_total}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="material"
                label="Material"
                value={formData.material}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="product_type"
                label="Product Type"
                value={formData.product_type}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="CL"
                label="CL"
                value={formData.CL}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="unit"
                label="Unit"
                type="number"
                value={formData.unit}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="width"
                label="Width"
                type="number"
                value={formData.width}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="height"
                label="Height"
                type="number"
                value={formData.height}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="at"
                label="AT"
                type="number"
                value={formData.at}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="GL"
                label="GL"
                value={formData.GL}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.GRD}
                    onChange={handleChange}
                    name="GRD"
                  />
                }
                label="GRD"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="SC"
                label="SC"
                value={formData.SC}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="status"
                label="Status"
                value={formData.status}
                onChange={handleChange}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default CreateQuote;
