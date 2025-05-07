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

const InvoiceDetails = ({ open, onClose, invoiceId }) => {
  const [invoiceDetails, setInvoiceDetails] = useState([]);

  useEffect(() => {
    if (invoiceId) {
      const fetchDetails = async () => {
        try {
          const response = await axios.get(`/api/invoiceDetails/${invoiceId}`);
          setInvoiceDetails(response.data);
        } catch (error) {
          console.error("Failed to fetch invoice details:", error);
        }
      };
      fetchDetails();
    }
  }, [invoiceId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Invoice Details</DialogTitle>
      <DialogContent dividers>
        {invoiceDetails.length === 0 ? (
          <Typography>No details found for this invoice.</Typography>
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
              {invoiceDetails.map((item, index) => (
                <TableRow key={index}>
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

export default InvoiceDetails;
