import { Autocomplete, MenuItem, Select, FormControl, InputLabel, Switch, FormControlLabel, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Card,
  Paper,
  Divider,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import axios from "../../utils/axiosConfig";
import Header from "../../components/header";

const MATERIAL_OPTIONS = ["Vinyl", "Aluminum", "Wood", "Fiberglass", "Composite", "Steel"];
const PRODUCT_TYPE_OPTIONS = ["Single Hung", "Double Hung", "Casement", "Sliding", "Awning", "Picture/Fixed", "Bay Window", "Bow Window"];
const CL_OPTIONS = ["White", "Black", "Bronze", "Silver", "Beige", "Brown", "Custom Color"];
const GL_OPTIONS = ["Clear", "Low-E", "Tempered", "Laminated", "Tinted Bronze", "Tinted Gray", "Frosted", "Double Pane", "Triple Pane"];
const SC_OPTIONS = ["Half Screen", "Full Screen", "No Screen", "Retractable Screen"];
const PRODUCT_LINE_OPTIONS = ["1000 Series", "4000 Series", "5000 Series", "6000 Series", "7000 Series", "8000 Series", "9000 Series"];
const GRID_OPTIONS = ["Traditional", "9-Lite", "12-Lite", "14-Lite", "Top Row", "Cross", "false"];

const FRAME_COLORS = {
  White: '#FFFFFF', Black: '#000000', Bronze: '#CD7F32', Silver: '#C0C0C0',
  Beige: '#F5F5DC', Brown: '#A52A2A', 'Custom Color': '#DDDDDD',
};
const GLASS_COLORS = {
  Clear: 'rgba(173,216,230,0.3)', 'Low-E': 'rgba(173,216,230,0.5)', Tempered: 'rgba(173,216,230,0.6)',
  Laminated: 'rgba(173,216,230,0.4)', 'Tinted Bronze': 'rgba(165,42,42,0.5)',
  'Tinted Gray': 'rgba(128,128,128,0.5)', Frosted: 'rgba(255,255,255,0.7)',
  'Double Pane': 'rgba(173,216,230,0.2)', 'Triple Pane': 'rgba(173,216,230,0.15)',
};

const WindowImage = ({ detail }) => {
  const frameColor = FRAME_COLORS[detail.CL] || FRAME_COLORS['Custom Color'];
  const glassColor = GLASS_COLORS[detail.GL] || GLASS_COLORS['Clear'];
  
  // Get dimensions and calculate aspect ratio
  const width = parseFloat(detail.width) || 36;
  const height = parseFloat(detail.height) || 48;
  const maxDimension = Math.max(width, height);
  const scale = 80 / maxDimension; // Scale to fit within 80px max
  
  const displayWidth = width * scale;
  const displayHeight = height * scale;
  
  // Center the window in a 100x100 container
  const offsetX = (100 - displayWidth) / 2;
  const offsetY = (100 - displayHeight) / 2;
  
  return (
    <Box sx={{ width: 100, height: 100, flexShrink: 0, position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        {/* Window frame and glass */}
        <rect x={offsetX} y={offsetY} width={displayWidth} height={displayHeight} fill="none" stroke={frameColor} strokeWidth="3" />
        <rect x={offsetX + 3} y={offsetY + 3} width={displayWidth - 6} height={displayHeight - 6} fill={glassColor} />
        
        {/* Window type specific elements */}
        {detail.product_type === 'Double Hung' && (
          <line x1={offsetX} y1={offsetY + displayHeight/2} x2={offsetX + displayWidth} y2={offsetY + displayHeight/2} stroke={frameColor} strokeWidth="2" />
        )}
        {detail.product_type === 'Sliding' && (
          <line x1={offsetX + displayWidth/2} y1={offsetY} x2={offsetX + displayWidth/2} y2={offsetY + displayHeight} stroke={frameColor} strokeWidth="2" />
        )}
        
        {/* Grids */}
        {detail.GRD && (
          <>
            <line x1={offsetX + displayWidth/3} y1={offsetY + 3} x2={offsetX + displayWidth/3} y2={offsetY + displayHeight - 3} stroke={frameColor} strokeWidth="1" opacity="0.7" />
            <line x1={offsetX + 2*displayWidth/3} y1={offsetY + 3} x2={offsetX + 2*displayWidth/3} y2={offsetY + displayHeight - 3} stroke={frameColor} strokeWidth="1" opacity="0.7" />
            <line x1={offsetX + 3} y1={offsetY + displayHeight/3} x2={offsetX + displayWidth - 3} y2={offsetY + displayHeight/3} stroke={frameColor} strokeWidth="1" opacity="0.7" />
            <line x1={offsetX + 3} y1={offsetY + 2*displayHeight/3} x2={offsetX + displayWidth - 3} y2={offsetY + 2*displayHeight/3} stroke={frameColor} strokeWidth="1" opacity="0.7" />
          </>
        )}
        
        {/* Dimension labels */}
        <text x="50" y="10" textAnchor="middle" fontSize="10" fill="#666">{width}"</text>
        <text x="10" y="50" textAnchor="middle" fontSize="10" fill="#666" transform="rotate(-90 10 50)">{height}"</text>
      </svg>
    </Box>
  );
};

const CreateQuotePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state?.initialData;

  const [customerOptions, setCustomerOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], customer: "", total: 0, sub_total: 0, quoteDetails: [] });
  const [windowEntry, setWindowEntry] = useState({ material: "", product_line: "", product_type: "", CL: "", unit: '', width: '', height: '', at: '', GL: "", GRD: false, SC: "", quantity: '', price: '' });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => { 
    axios.get("/api/customers").then(res => setCustomerOptions(res.data)).catch(console.error); 
  }, []);

  useEffect(() => { 
    if (initialData && customerOptions.length) { 
      // Convert date format if needed
      const formattedDate = initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      
      setFormData({ 
        ...initialData, 
        date: formattedDate,
        quoteDetails: initialData.quoteDetails || [] 
      }); 
      
      const c = customerOptions.find(c => c.name === initialData.customer); 
      if (c) setSelectedCustomer(c); 
    } 
  }, [initialData, customerOptions]);

  const handleCustomerSelect = (_, nv) => { 
    setSelectedCustomer(nv); 
    setFormData(prev => ({ ...prev, customer: nv?.name || '', customerId: nv?.id || '' })); 
  };

  const handleWindowEntryChange = (f, v) => setWindowEntry(prev => ({ ...prev, [f]: v }));
  
  const focusNext = id => setTimeout(() => { 
    const el = document.getElementById(id); 
    if (el) el.focus(); 
  }, 100);

  const handleAddWindow = () => {
    let updated;
    if (editingIndex !== null) {
      // Update existing window
      updated = [...formData.quoteDetails];
      updated[editingIndex] = { ...windowEntry };
      setEditingIndex(null);
    } else {
      // Add new window
      updated = [...formData.quoteDetails, { ...windowEntry }];
    }
    
    const sum = updated.reduce((acc, d) => acc + (parseFloat(d.quantity) || 0) * (parseFloat(d.price) || 0), 0);
    setFormData(prev => ({ ...prev, quoteDetails: updated, sub_total: +sum.toFixed(2), total: +sum.toFixed(2) }));
    setWindowEntry({ material: "", product_line: "", product_type: "", CL: "", unit: '', width: '', height: '', at: '', GL: "", GRD: false, SC: "", quantity: '', price: '' });
    focusNext("material");
  };

  const handleEditWindow = (index) => {
    const windowToEdit = formData.quoteDetails[index];
    setWindowEntry({
      material: windowToEdit.material || "",
      product_line: windowToEdit.product_line || "",
      product_type: windowToEdit.product_type || "",
      CL: windowToEdit.CL || "",
      unit: windowToEdit.unit || '',
      width: windowToEdit.width || '',
      height: windowToEdit.height || '',
      at: windowToEdit.at || '',
      GL: windowToEdit.GL || "",
      GRD: windowToEdit.GRD || false,
      SC: windowToEdit.SC || "",
      quantity: windowToEdit.quantity || '',
      price: windowToEdit.price || ''
    });
    setEditingIndex(index);
    focusNext("material");
  };

  const handleDeleteWindow = (index) => {
    const updated = formData.quoteDetails.filter((_, i) => i !== index);
    const sum = updated.reduce((acc, d) => acc + (parseFloat(d.quantity) || 0) * (parseFloat(d.price) || 0), 0);
    setFormData(prev => ({ ...prev, quoteDetails: updated, sub_total: +sum.toFixed(2), total: +sum.toFixed(2) }));
    
    // Clear edit mode if we're deleting the item being edited
    if (editingIndex === index) {
      setEditingIndex(null);
      setWindowEntry({ material: "", product_line: "", product_type: "", CL: "", unit: '', width: '', height: '', at: '', GL: "", GRD: false, SC: "", quantity: '', price: '' });
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setWindowEntry({ material: "", product_line: "", product_type: "", CL: "", unit: '', width: '', height: '', at: '', GL: "", GRD: false, SC: "", quantity: '', price: '' });
  };

  const handleSubmit = () => axios.post("/api/quotes", formData).then(() => navigate('/quotes')).catch(() => alert('Failed'));
  const handleCancel = () => navigate('/quotes');

  return (
    <Box m={2}>
      <Header 
        title={(initialData?.duplicate ? 'Edit Quote' : 'Create New Quote') + (initialData?.quote_no ? ` - #${initialData.quote_no}` : '')} 
        subtitle={initialData?.duplicate ? 'Creating a new version of an existing quote' : 'Enter quote details and window specifications'} 
      />
      
      {/* Customer & Date */}
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Autocomplete 
              options={customerOptions} 
              getOptionLabel={o => o.name} 
              value={selectedCustomer} 
              onChange={handleCustomerSelect} 
              renderInput={params => <TextField {...params} label="Select Customer" size="small" fullWidth required />} 
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField 
              fullWidth 
              size="small" 
              type="date" 
              label="Quote Date" 
              InputLabelProps={{ shrink: true }} 
              value={formData.date} 
              onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))} 
            />
          </Grid>
          {selectedCustomer && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Customer Information</Typography>
                <Typography variant="body2"><strong>Name:</strong> {selectedCustomer.name}</Typography>
                {selectedCustomer.company && <Typography variant="body2"><strong>Company:</strong> {selectedCustomer.company}</Typography>}
                <Typography variant="body2"><strong>Email:</strong> {selectedCustomer.email}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">&nbsp;</Typography>
                <Typography variant="body2"><strong>Phone:</strong> {selectedCustomer.phone}</Typography>
                <Typography variant="body2"><strong>Address:</strong> {selectedCustomer.address}</Typography>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      <Grid container spacing={2}>
        {/* Entry Form - Left Column */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper elevation={2} sx={{ p: 2, height: 'calc(100vh - 260px)', overflowY: 'auto' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">{editingIndex !== null ? 'Edit Window' : 'Add New Window'}</Typography>
              {editingIndex !== null && (
                <Button size="small" onClick={handleCancelEdit}>Cancel</Button>
              )}
            </Box>
            
            <Box display="flex" flexDirection="column" gap={1.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Material</InputLabel>
                <Select id="material" value={windowEntry.material} onChange={e => { handleWindowEntryChange('material', e.target.value); focusNext('productLine'); }} label="Material">
                  {MATERIAL_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Product Line</InputLabel>
                <Select id="productLine" value={windowEntry.product_line} onChange={e => { handleWindowEntryChange('product_line', e.target.value); focusNext('productType'); }} label="Product Line">
                  {PRODUCT_LINE_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Product Type</InputLabel>
                <Select id="productType" value={windowEntry.product_type} onChange={e => { handleWindowEntryChange('product_type', e.target.value); focusNext('color'); }} label="Product Type">
                  {PRODUCT_TYPE_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Color (CL)</InputLabel>
                <Select id="color" value={windowEntry.CL} onChange={e => { handleWindowEntryChange('CL', e.target.value); focusNext('width'); }} label="Color (CL)">
                  {CL_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>

              <Box display="flex" gap={1}>
                <TextField fullWidth size="small" label="Width (in)" type="number" id="width" value={windowEntry.width} onChange={e => { handleWindowEntryChange('width', e.target.value);}} onKeyDown={k => {if(k.key==='Enter'){focusNext('height');}}}/>
                <TextField fullWidth size="small" label="Height (in)" type="number" id="height" value={windowEntry.height} onChange={e => { handleWindowEntryChange('height', e.target.value);}} onKeyDown={k => {if(k.key==='Enter'){focusNext('glass');}}}/>
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel>Glass (GL)</InputLabel>
                <Select id="glass" value={windowEntry.GL} onChange={e => { handleWindowEntryChange('GL', e.target.value); focusNext('screen'); }} label="Glass (GL)">
                  {GL_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Screen (SC)</InputLabel>
                <Select id="screen" value={windowEntry.SC} onChange={e => { handleWindowEntryChange('SC', e.target.value); focusNext('grid'); }} label="Screen (SC)">
                  {SC_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Grid</InputLabel>
                <Select id="grid" value={windowEntry.SC} onChange={e => { handleWindowEntryChange('grid', e.target.value); focusNext('quantity'); }} label="Grid">
                  {GRID_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>

              <Box display="flex" gap={1}>
                <TextField fullWidth size="small" label="Quantity" type="number" id="quantity" value={windowEntry.quantity} onChange={e => { handleWindowEntryChange('quantity', e.target.value); }} onKeyDown={k => {if(k.key==='Enter'){focusNext('price');}}}/>
                <TextField fullWidth size="small" label="Unit Price" type="number" id="price" value={windowEntry.price} onChange={e => { handleWindowEntryChange('price', e.target.value); }} />
              </Box>

              <TextField fullWidth size="small" label="Line Total" id="lineTotal" value={`$${((windowEntry.quantity||0)*(windowEntry.price||0)).toFixed(2)}`} InputProps={{ readOnly: true }} />

              <Button fullWidth variant="contained" id="createWindow" onClick={handleAddWindow}>
                {editingIndex !== null ? 'Update Window' : 'Create Window'}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Summary - Right Column */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper elevation={2} sx={{ p: 2, height: 'calc(100vh - 260px)', overflowY: 'auto' }}>
            <Typography variant="h6" mb={2}>Windows Added</Typography>
            {formData.quoteDetails.map((detail, idx) => (
              <Card key={idx} sx={{ mb: 1, p: 1, backgroundColor: editingIndex === idx ? 'action.selected' : 'inherit' }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <WindowImage detail={detail} />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle2" fontWeight="bold">Window #{idx+1}</Typography>
                    <Grid container spacing={0.5}>
                      <Grid item xs={6}><Typography variant="body2"><strong>Product Line:</strong> {detail.product_line}</Typography></Grid>
                      <Grid item xs={6}><Typography variant="body2"><strong>Type:</strong> {detail.product_type}</Typography></Grid>
                      <Grid item xs={6}><Typography variant="body2"><strong>Material:</strong> {detail.material}</Typography></Grid>
                      <Grid item xs={6}><Typography variant="body2"><strong>Color:</strong> {detail.CL}</Typography></Grid>
                      <Grid item xs={6}><Typography variant="body2"><strong>Glass:</strong> {detail.GL}</Typography></Grid>
                      <Grid item xs={6}><Typography variant="body2"><strong>Size:</strong> {detail.width}"×{detail.height}"</Typography></Grid>
                      <Grid item xs={6}><Typography variant="body2"><strong>Screen:</strong> {detail.SC}</Typography></Grid>
                      <Grid item xs={6}><Typography variant="body2"><strong>Qty:</strong> {detail.quantity}</Typography></Grid>
                      <Grid item xs={6}><Typography variant="body2"><strong>Unit Price:</strong> ${detail.price}</Typography></Grid>
                      {detail.GRD && <Grid item xs={12}><Typography variant="body2"><strong>Grids:</strong> Yes</Typography></Grid>}
                    </Grid>
                    <Divider sx={{ my: 0.5 }} />
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography><strong>Subtotal: ${(detail.quantity * detail.price).toFixed(2)}</strong></Typography>
                      <Box>
                        <IconButton size="small" onClick={() => handleEditWindow(idx)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteWindow(idx)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            ))}
            <Card sx={{ mt: 2, p: 1, backgroundColor: 'primary.dark' }}>
              <Typography variant="h6" color="white">Quote Totals</Typography>
              <Typography variant="h4" color="white">${formData.total.toFixed(2)}</Typography>
            </Card>
            <Box display="flex" gap={1} mt={2}>
              <Button fullWidth size="small" variant="contained" color="primary" onClick={handleSubmit}>
                {initialData?.duplicate ? 'Update Quote' : 'Create Quote'}
              </Button>
              <Button fullWidth size="small" variant="outlined" onClick={handleCancel}>Cancel</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateQuotePage;