import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Backdrop, Fade } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Head from 'next/head';
import { v4 as uuidv4 } from 'uuid';

interface Order {
  id: string;
  date: string;
  products_number: number;
  final_price: number;
  status: string;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_BACK_URL;

const MyOrders: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/orders`); 
        setOrders(response.data); 
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleEditOrder = (orderId: string) => {
    router.push(`/add-order/${orderId}`);
  };

  const handleDeleteOrder = (orderId: string) => { 
    setSelectedOrderId(orderId);
    setOpenModal(true);
  };

  const confirmDeleteOrder = async () => {
    if (selectedOrderId) {
      try {
        await axios.delete(`${apiBaseUrl}/api/orders/${selectedOrderId}`); 
        setOrders(orders.filter(order => order.id !== selectedOrderId)); 
        setOpenModal(false);
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const formatDate = (isoDateString: string): string => {
    const date = new Date(isoDateString);
    
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <Head>
        <title>My Orders</title>
      </Head>
      <h1>My Orders</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Date</TableCell>
              <TableCell># Products</TableCell>
              <TableCell>Final Price</TableCell>
              <TableCell>Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{formatDate(order.date)}</TableCell>
                <TableCell>{order.products_number}</TableCell>
                <TableCell>${order.final_price}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditOrder(order.id)}
                  >
                    Edit Order
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Delete Order
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '20px' }}
        onClick={() => router.push(`add-order/${uuidv4()}`)}
      >
        Add New Order
      </Button>

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
          <div style={{
            backgroundColor: '#fff',
            width: 400,
            margin: 'auto',
            padding: 20,
            textAlign: 'center',
          }}>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this order?</p>
            <Button variant="contained" color="primary" onClick={confirmDeleteOrder}>Delete</Button>
            <Button variant="contained" onClick={() => setOpenModal(false)}>Cancel</Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default MyOrders;
