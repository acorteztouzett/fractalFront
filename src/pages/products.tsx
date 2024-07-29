import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Modal, Fade, TextField, Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { v4 as uuidv4 } from 'uuid';

interface Product {
  id: string;
  name: string;
  unitPrice: number;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_BACK_URL;

const ProductsPage: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<number>(0);
  const [openAddModal, setOpenAddModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setProductName(selectedProduct.name);
      setProductPrice(selectedProduct.unitPrice);
    }
  }, [selectedProduct]);

  const clearForm = () => {
    setSelectedProduct(null);
    setSelectedProductId('');
    setProductName('');
    setProductPrice(0);
  }

  const handleOpenModal = (id: string) => {
    const product = products.find(product => product.id === id) || null;
    setSelectedProduct(product);
    setSelectedProductId(id);
    setOpenModal(true);
  };
  const handleAddModal= async ()=> {
    
    try {
      await fetch(`${apiBaseUrl}/api/products/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          id: uuidv4(),
          name: productName,
          unitPrice: productPrice
        })
      });

      setProducts([...products, { id: Math.random().toString(), name: productName, unitPrice: productPrice }]);

      setOpenAddModal(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  }

  const handleEditProduct = async () => {
    try {
      await fetch(`${apiBaseUrl}/api/products/change/${selectedProductId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          name: productName,
          unitPrice: productPrice
        })
      });
      setOpenModal(false);
      setProducts(products.map(product => {
        if (product.id === selectedProductId) {
          return {
            ...product,
            name: productName,
            unitPrice: productPrice
          }
        }

        return product;
        
      }));
    } catch (error) {
      console.error('Error editing product:', error);
    }
  }

  const handleDelete = async (productId: string) => {
    try {
      await fetch(`${apiBaseUrl}/api/products/delete/${productId}`, {
        method: 'DELETE',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });

      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="xs"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <Box>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <main>
      <Head>
        <title>Products</title>
      </Head>

      <Container>
        <Typography variant="h2" component="h1" gutterBottom>
          Products
        </Typography>
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {product.name}
                  </Typography>
                  <Typography variant="h6" component="p">
                    ${product.unitPrice}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal(product.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
      >
        <Fade in={openModal}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', margin: '50px auto', maxWidth: '500px' }}>
            <h2>Edit Product</h2>
            <form>
              <TextField
                label="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Unit Price"
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(parseFloat(e.target.value))}
                fullWidth
                margin="normal"
              />
            </form>
            <Button variant="contained" color="primary" onClick={handleEditProduct}>
              Save
            </Button>
          </div>
        </Fade>
      </Modal>

      {/* Add Product Modal */}
      <Modal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        closeAfterTransition
      >
        <Fade in={openAddModal}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', margin: '50px auto', maxWidth: '500px' }}>
            <h2>Add Product</h2>
            <form>
              <TextField
                label="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Unit Price"
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(parseFloat(e.target.value))}
                fullWidth
                margin="normal"
              />
            </form>
            <Button variant="contained" color="primary" onClick={handleAddModal}>
              Save
            </Button>
          </div>
        </Fade>
      </Modal>
      
      <Button
        variant="contained"
        color="secondary"
        style={{ marginTop: '20px' }}
        onClick={() => router.push('/')}
      >
        Back to Home
      </Button>
      
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '20px' }}
        onClick={ ()=> { setOpenAddModal(true); clearForm(); }}
      >
        Add Product
      </Button>

    </main>
  );
};

export default ProductsPage;
