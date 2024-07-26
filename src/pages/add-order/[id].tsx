import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Head from 'next/head';
import {
  Button,
  TextField,
  Modal,
  Backdrop,
  Fade,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from '@mui/material';

interface Product {
  id: string;
  name: string;
  unitPrice: number;
  qty: number;
  totalPrice: number;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_BACK_URL;

const AddEditOrderPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [isNewOrder, setIsNewOrder] = useState(true);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [products, setProducts] = useState<Product[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [productQty, setProductQty] = useState(1);
  const [status, setStatus] = useState('Pending');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/products`);
        
        setAvailableProducts(response.data);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchOrder = async () => {
        try {
          const response = await axios.get(`${apiBaseUrl}/api/orders/${id}`);
          const order = response.data;
          setIsNewOrder(false);
          setStatus(order.status);
          setOrderNumber(order.id);
          setOrderDate(new Date(order.createdAt).toISOString().split('T')[0]);
          setProducts(order.products.map((product: any) => ({
            id: product.id,
            name: product.name,
            unitPrice: parseFloat(product.unitPrice),
            qty: product.qty,
            totalPrice: parseFloat(product.totalPrice),
          })));

        } catch (error) {
          console.error('Error fetching order', error);
        }
      };

      fetchOrder();
    }
  }, [id]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setProductId(null)
    setOpenModal(true);
  };

  const handleEditProduct = async (productId: string) => {
    try {
      
      setProductId(productId);
      setProductQty(1);
      setOpenModal(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleSaveProduct = () => {
    if (productId !== null) {
      const selectedProductData = availableProducts.find(p => p.id === productId);
      if (selectedProductData) {
        const newProduct = {
          ...selectedProductData,
          qty: productQty,
          totalPrice: selectedProductData.unitPrice * productQty
        };
        if (selectedProduct) {
          setProducts(products.map(p => p.id === selectedProduct.id ? newProduct : p));
        } else {
          setProducts([...products, newProduct]);
        }
        setOpenModal(false);
        setSelectedProduct(null);
      }
    } else {
      console.error('Product ID is null');
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    try {
      await axios.delete(`${apiBaseUrl}/api/products/${productId}`);
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  const handleSaveOrder = async () => {
    try {
      // Prepare the order data
      const orderData = {
        id,
        order_number: orderNumber,
        products_number: totalProducts,
        final_price: finalPrice,
        status: status,
        products:products.map(product => ({
          id: product.id,
          name: product.name,
          unitPrice: product.unitPrice,
          qty: product.qty,
          totalPrice: product.totalPrice,
          orderId: id
        }))
      };

      if(!isNewOrder) {
        await axios.put(`${apiBaseUrl}/api/orders/${id}`, orderData);
      }else{
        await axios.post(`${apiBaseUrl}/api/orders`, orderData);
      }

      router.push('/my-orders');
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const totalProducts = products.reduce((total, product) => total + product.qty, 0);
  const finalPrice = products.reduce((total, product) => total + product.totalPrice, 0);

  return (
    <div>
      <Head>
        <title>{isNewOrder ? 'Add Order' : 'Edit Order'}</title>
      </Head>

      <h1>{isNewOrder ? 'Add Order' : 'Edit Order'}</h1>
      <form>
        <TextField
          label="Order #"
          value={id}
          disabled
          onChange={(e) => setOrderNumber(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Date"
          value={orderDate}
          disabled
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            value={status}
            onChange={(e) => setStatus(e.target.value as string)}
            label="Status"
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="# Products"
          value={totalProducts}
          disabled
          fullWidth
          margin="normal"
        />
        <TextField
          label="Final Price"
          value={`$${finalPrice.toFixed(2)}`}
          disabled
          fullWidth
          margin="normal"
        />
      </form>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '20px' }}
        onClick={handleAddProduct}
      >
        Add Product
      </Button>

      <div>
        <h2>Products in Order</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map(product => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.unitPrice}</TableCell>
                  <TableCell>{product.qty}</TableCell>
                  <TableCell>${product.totalPrice}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleRemoveProduct(product.id)}>Remove</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', margin: '50px auto', maxWidth: '500px' }}>
            <h2>{selectedProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form>
              <FormControl fullWidth margin="normal">
                <InputLabel>Product</InputLabel>
                <Select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value as string)}
                  disabled={!!selectedProduct}
                >
                  {availableProducts.map((product) => (
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
                onChange={(e) => setProductQty(parseInt(e.target.value))}
                fullWidth
                margin="normal"
              />
            </form>
            <Button variant="contained" color="primary" onClick={handleSaveProduct}>
              Save
            </Button>
          </div>
        </Fade>
      </Modal>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '20px' }}
        onClick={handleSaveOrder}
      >
        Save Order
      </Button>
    </div>
  );
};

export default AddEditOrderPage;
