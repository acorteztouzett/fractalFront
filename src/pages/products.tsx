// pages/products.tsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CircularProgress, Button } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';

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

  if (loading) {
    return (
      <Container>
        <CircularProgress />
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
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Button
        variant="contained"
        color="secondary"
        style={{ marginTop: '20px' }}
        onClick={() => router.push('/')}
      >
        Back to Home
      </Button>
    </main>
  );
};

export default ProductsPage;
