import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import axios from "axios";

const OrderDetails = ({ open, onClose, orderId }) => {
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    if (orderId) {
      axios.get(`/api/orderDetails/${orderId}`)
        .then(res => setOrderDetails(res.data))
        .catch(err => console.error("Failed to fetch order details:", err));
    }
  }, [orderId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Order Details</DialogTitle>
      <DialogContent dividers>
        {orderDetails.length === 0 ? (
          <Typography>No details found.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Material</TableCell>
                <TableCell>Product Type</TableCell>
                <TableCell>CL</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Width</TableCell>
                <TableCell>Height</TableCell>
                <TableCell>AT</TableCell>
                <TableCell>GL</TableCell>
                <TableCell>GRD</TableCell>
                <TableCell>SC</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetails.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.material}</TableCell>
                  <TableCell>{item.product_type}</TableCell>
                  <TableCell>{item.CL}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.width}</TableCell>
                  <TableCell>{item.height}</TableCell>
                  <TableCell>{item.at}</TableCell>
                  <TableCell>{item.GL}</TableCell>
                  <TableCell>{item.GRD ? "Yes" : "No"}</TableCell>
                  <TableCell>{item.SC}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetails;
