import { useState, useEffect } from 'react';
import { Modal, Backdrop, Fade, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

interface Product {
    id: number;
    name: string;
    unitPrice: number;
    qty: number;
}

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSaveProduct: (product: Product) => void;
  selectedProduct: Product | null;
  availableProducts: Product[];
}

const AddProductModal: React.FC<AddProductModalProps> = ({ open, onClose, onSaveProduct, selectedProduct, availableProducts }) => {
  const [productId, setProductId] = useState<number | null>(null);
  const [productQty, setProductQty] = useState(1);

  useEffect(() => {
    if (selectedProduct) {
      setProductId(selectedProduct.id);
      setProductQty(selectedProduct.qty);
    }
  }, [selectedProduct]);

  const handleSave = () => {
    const selectedProductData = availableProducts.find(p => p.id === productId);
    if (selectedProductData) {
      const product = { ...selectedProductData, qty: productQty, totalPrice: selectedProductData.unitPrice * productQty };
      onSaveProduct(product);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', margin: '50px auto', maxWidth: '500px' }}>
          <h2>{selectedProduct ? 'Edit Product' : 'Add Product'}</h2>
          <FormControl fullWidth margin="normal">
            <InputLabel>Product</InputLabel>
            <Select
              value={productId ?? ''}
              onChange={(e) => setProductId(Number(e.target.value))}
            >
              {availableProducts.map(product => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name} - ${product.unitPrice}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Quantity"
            type="number"
            value={productQty}
            onChange={(e) => setProductQty(Number(e.target.value))}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Fade>
    </Modal>
  );
};

export default AddProductModal;
