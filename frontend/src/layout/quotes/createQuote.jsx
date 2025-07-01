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
  const [formulas, setFormulas] = useState([]);
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

  const quoteDetailFields = [
    "material", "product_type", "CL", "unit", "width",
    "height", "at", "GL", "GRD", "SC", "quantity", "price"
  ];

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await axios.get("/api/customers");
      setCustomerOptions(response.data);
    };
    const fetchFormulas = async () => {
      const res = await axios.get("/api/formulas");
      setFormulas(res.data);
    };

    fetchCustomers();
    fetchFormulas();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        quoteDetails: initialData.quoteDetails || [],
        duplicate: true,
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

    const quantity = parseFloat(details[index].quantity) || 0;
    const price = parseFloat(details[index].price) || 0;
    details[index].item_total = quantity * price;

    setFormData({ ...formData, quoteDetails: details });
    recalculateTotals(details);
  };

  const handleFormulaSelect = (index, selectedFormula) => {
    if (selectedFormula) {
      const details = [...formData.quoteDetails];
      details[index] = {
        ...details[index],
        ...quoteDetailFields.reduce((acc, field) => {
          acc[field] = selectedFormula[field] ?? details[index][field];
          return acc;
        }, {}),
      };
      setFormData({ ...formData, quoteDetails: details });
      recalculateTotals(details);
    }
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
            width: 800,
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
                    <Grid item xs={12}>
                      <Autocomplete
                        options={formulas}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, selectedFormula) => handleFormulaSelect(index, selectedFormula)}
                        renderInput={(params) => (
                          <TextField {...params} label="Select Formula" variant="outlined" />
                        )}
                      />
                    </Grid>

                    {quoteDetailFields.map((key) => (
                      <Grid item xs={6} key={key}>
                        {typeof item[key] === "boolean" ? (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={item[key]}
                                onChange={(e) => handleDetailChange(index, e)}
                                name={key}
                              />
                            }
                            label={key}
                          />
                        ) : (
                          <TextField
                            fullWidth
                            name={key}
                            label={key}
                            type={typeof item[key] === "number" ? "number" : "text"}
                            value={item[key]}
                            onChange={(e) => handleDetailChange(index, e)}
                          />
                        )}
                      </Grid>
                    ))}

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
