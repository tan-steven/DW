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
} from "@mui/material";
import Header from "../../components/header";
import { tokens } from "../../theme";
import axios from "axios";

const CustomerPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    company: "",
    name: "",
    phone: "",
    address: "",
    email: "",
  });

  const fetchCustomers = async () => {
    const res = await axios.get("/api/customers");
    setCustomers(res.data);
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
      setFormData({name: "", phone: "", address: "", email: "" });
      fetchCustomers();
    } catch (err) {
      console.error("Failed to add customer", err);
    }
  };

  return (
    <Box m="20px">
      <Header title="Customer Info" subtitle="Add and view customer details" />

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
        />
      </Box>

      <Button variant="contained" color="secondary" onClick={handleSubmit}>
        Submit
      </Button>

      <Box mt={4}>
        <Typography variant="h6" mb={2}>Customer List</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow key={index}>
                <TableCell>{customer.company}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{customer.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default CustomerPage;
