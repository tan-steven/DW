import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Grid, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "../../utils/axiosConfig";

const initialFormula = {
  name: "",
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
};

const Formulas = () => {
  const [formulas, setFormulas] = useState([]);
  const [newFormula, setNewFormula] = useState(initialFormula);
  const [editingId, setEditingId] = useState(null);

  const fetchFormulas = async () => {
    const res = await axios.get("/api/formulas");
    setFormulas(res.data);
  };

  useEffect(() => {
    fetchFormulas();
  }, []);

  const handleCreateOrUpdate = async () => {
    if (editingId) {
      await axios.put(`/api/formulas/${editingId}`, newFormula);
    } else {
      await axios.post("/api/formulas", newFormula);
    }
    setNewFormula(initialFormula);
    setEditingId(null);
    fetchFormulas();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/formulas/${id}`);
    fetchFormulas();
  };

  const handleEdit = (formula) => {
    setNewFormula(formula);
    setEditingId(formula.id);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewFormula({
      ...newFormula,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <Box m="20px">
      <Typography variant="h4" mb={2}>Formulas</Typography>
      <Grid container spacing={2} mb={4}>
        {Object.keys(initialFormula).map((key) => (
          <Grid item xs={3} key={key}>
            <TextField
              label={key}
              name={key}
              value={newFormula[key]}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        ))}

        <Grid item xs={12}>
          <Button variant="contained" onClick={handleCreateOrUpdate}>
            {editingId ? "Update Formula" : "Add Formula"}
          </Button>
        </Grid>
      </Grid>

      {formulas.map((f) => (
        <Grid container spacing={2} key={f.id} alignItems="center" mb={2}>
          {Object.keys(initialFormula).map((key) => (
            <Grid item xs={2} key={key}>
              <Typography>{f[key]?.toString()}</Typography>
            </Grid>
          ))}
          <Grid item xs={2}>
            <IconButton onClick={() => handleEdit(f)}><EditIcon /></IconButton>
            <IconButton onClick={() => handleDelete(f.id)}><DeleteIcon /></IconButton>
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

export default Formulas;
